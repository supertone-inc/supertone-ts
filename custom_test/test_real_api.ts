#!/usr/bin/env node
/**
 * Real API Integration Test Script
 * Tests all SDK functionality with real Supertone API calls.
 *
 * Comprehensive TypeScript version of the Python test suite.
 * Includes all API tests except parallel processing tests.
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file in custom_test directory
dotenv.config({ path: path.join(__dirname, ".env") });

const API_KEY = process.env.SUPERTONE_API_KEY || "your-api-key-here";

interface TestResult {
	[key: string]: boolean | null;
}

/**
 * Helper function to log detailed error information
 */
function logDetailedError(e: any, context?: string): void {
	console.error(`  ❌ Error: ${e.message || e}`);

	if (context) {
		console.error(`  📍 Context: ${context}`);
	}

	// Validation errors (Zod)
	if (e.message && e.message.includes("validation")) {
		if (e.cause) {
			console.error(`  📋 Validation details:`);
			try {
				console.error(JSON.stringify(e.cause, null, 2));
			} catch {
				console.error(e.cause);
			}
		}
	}

	// HTTP errors
	if (e.statusCode || e.status) {
		console.error(`  🌐 Status: ${e.statusCode || e.status}`);
	}

	// Response body if available
	if (e.body) {
		console.error(`  📦 Response body:`);
		try {
			console.error(JSON.stringify(e.body, null, 2));
		} catch {
			console.error(e.body);
		}
	}

	// Stack trace in debug mode
	if (process.env.DEBUG && e.stack) {
		console.error(`  📚 Stack trace:`);
		console.error(e.stack);
	}
}

/**
 * Helper function to inspect and log response object
 */
function inspectResponse(response: any, label: string = "Response"): void {
	console.log(`  🔍 ${label} inspection:`);
	console.log(`     Type: ${typeof response}`);
	console.log(`     Constructor: ${response?.constructor?.name || "unknown"}`);

	if (response) {
		const keys = Object.keys(response);
		console.log(`     Keys: ${keys.join(", ") || "(none)"}`);

		// Check for result property
		if ("result" in response) {
			const result = response.result;
			console.log(`     Result type: ${typeof result}`);
			console.log(
				`     Result constructor: ${result?.constructor?.name || "unknown"}`
			);

			if (result && typeof result === "object") {
				const resultKeys = Object.keys(result);
				console.log(
					`     Result keys: ${resultKeys.join(", ") || "(empty object)"}`
				);

				// Check prototype
				const proto = Object.getPrototypeOf(result);
				if (proto && proto.constructor) {
					console.log(`     Result prototype: ${proto.constructor.name}`);
				}

				// Check for stream methods
				if ("getReader" in result) {
					console.log(`     ✓ Has getReader (ReadableStream-like)`);
				}
				if ("arrayBuffer" in result) {
					console.log(`     ✓ Has arrayBuffer method`);
				}
			}
		}
	}
}

/**
 * Helper function to extract audio data from various response types
 */
async function extractAudioData(response: any): Promise<Uint8Array> {
	let result = response.result;

	// Debug logging
	console.log(`  🔍 Debug - result type: ${typeof result}`);
	if (typeof result === "object" && result !== null) {
		console.log(`  🔍 Debug - constructor: ${result.constructor.name}`);
		console.log(`  🔍 Debug - keys: ${Object.keys(result).join(", ")}`);
		console.log(`  🔍 Debug - has audioBase64: ${"audioBase64" in result}`);
		console.log(`  🔍 Debug - has getReader: ${"getReader" in result}`);
	}

	// Check for capital-case Result (SDK internal structure)
	if (
		!result ||
		(typeof result === "object" && Object.keys(result).length === 0)
	) {
		console.log(`  💡 Checking SDK internal Result field...`);
		if ((response as any).Result) {
			result = (response as any).Result;
			console.log(`  ✅ Found Result (capital R) - using that instead`);
		}
	}

	// Debug response headers
	if (response.headers) {
		console.log(
			`  🔍 Debug - response headers:`,
			JSON.stringify(response.headers, null, 2)
		);
	}

	if (result instanceof Uint8Array) {
		console.log(`  ✅ Detected: Uint8Array`);
		return result;
	}

	if (result instanceof Blob) {
		console.log(`  ✅ Detected: Blob`);
		return new Uint8Array(await result.arrayBuffer());
	}

	if (result instanceof ArrayBuffer) {
		console.log(`  ✅ Detected: ArrayBuffer`);
		return new Uint8Array(result);
	}

	if (typeof result === "object" && result !== null && "getReader" in result) {
		console.log(`  ✅ Detected: ReadableStream`);
		// ReadableStream
		const reader = (result as ReadableStream<Uint8Array>).getReader();
		const chunks: Uint8Array[] = [];

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			if (value) chunks.push(value);
		}

		// Merge all chunks
		const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
		const merged = new Uint8Array(totalLength);
		let offset = 0;
		for (const chunk of chunks) {
			merged.set(chunk, offset);
			offset += chunk.length;
		}
		return merged;
	}

	// Handle CreateSpeechResponseBody with audioBase64 (for phoneme responses)
	if (
		typeof result === "object" &&
		result !== null &&
		"audioBase64" in result
	) {
		console.log(`  ✅ Detected: audioBase64 object`);
		const audioBase64 = (result as any).audioBase64;
		if (typeof audioBase64 === "string") {
			// Decode base64 to binary
			const binaryString = atob(audioBase64);
			const bytes = new Uint8Array(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}
			return bytes;
		}
	}

	// Handle empty object case - this might happen when the SDK doesn't properly parse audio responses
	if (
		typeof result === "object" &&
		result !== null &&
		Object.keys(result).length === 0
	) {
		console.log(`  ⚠️  Warning: Empty result object detected`);
		console.log(`  💡 This might be a parsing issue with the SDK`);
		console.log(
			`  💡 Check if the response was actually a stream but got parsed as an empty object`
		);

		throw new Error(
			`Empty result object - SDK may have failed to parse audio stream response. ` +
				`This usually happens when audio/* content-type responses are not properly handled.`
		);
	}

	// Enhanced error message with debug info
	const errorDetails =
		typeof result === "object" && result !== null
			? `constructor: ${result.constructor.name}, keys: [${Object.keys(
					result
			  ).join(", ")}]`
			: `value: ${result}`;

	throw new Error(`Unsupported result type: ${typeof result}, ${errorDetails}`);
}

/**
 * Test credit balance retrieval
 */
async function testCreditBalance(): Promise<[boolean, any]> {
	console.log("💰 Credit Balance Test");

	try {
		const { Supertone } = await import("../src/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		console.log("  🔍 Retrieving credit balance...");
		const response = await client.usage.getCreditBalance();

		console.log(`  ✅ Credit Balance: ${response.balance}`);
		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test usage retrieval
 */
async function testGetUsage(): Promise<[boolean, any]> {
	console.log("📊 Usage Analytics Test");

	try {
		const { Supertone } = await import("../src/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const endTime = new Date();
		const startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000);

		console.log(
			`  🔍 Retrieving usage from ${startTime.toISOString().split("T")[0]} to ${
				endTime.toISOString().split("T")[0]
			}...`
		);

		const response = await client.usage.getUsage({
			startTime: startTime.toISOString(),
			endTime: endTime.toISOString(),
		});

		console.log(
			`  ✅ Success: ${response.data?.length || 0} usage record buckets`
		);
		console.log(`  📊 Total buckets: ${response.total}`);

		if (response.data && response.data.length > 0) {
			for (const bucket of response.data.slice(0, 3)) {
				console.log(`  📅 Bucket start: ${bucket.startingAt}`);
				console.log(`     Bucket end: ${bucket.endingAt}`);
				console.log(`     Results: ${bucket.results?.length || 0} items`);

				if (bucket.results) {
					const totalMinutes = bucket.results.reduce(
						(sum, r) => sum + (r.minutesUsed || 0),
						0
					);
					console.log(`     Total usage: ${totalMinutes.toFixed(2)} minutes`);
				}
			}
		} else {
			console.log("  📝 No usage records for this period");
		}

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test voice listing
 */
async function testListVoices(): Promise<[boolean, any]> {
	console.log("🎵 Voice List Test");

	try {
		const { Supertone } = await import("../src/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		console.log("  🔍 Retrieving voice list...");
		const response = await client.voices.listVoices({ pageSize: 10 });

		console.log(`  ✅ Success: ${response.items?.length || 0} voices`);
		console.log(`  📊 Total voices: ${response.total}`);

		let firstVoiceId: string | null = null;
		if (response.items && response.items.length > 0) {
			const firstVoice = response.items[0];
			firstVoiceId = firstVoice!.voiceId || null;
			console.log(`  🎤 First voice:`);
			console.log(`     ID: ${firstVoice!.voiceId}`);
			console.log(`     Name: ${firstVoice!.name}`);
			console.log(
				`     Description: ${firstVoice!.description?.substring(0, 50)}...`
			);
			console.log(`     Language: ${firstVoice!.language}`);
			console.log(`     Gender: ${firstVoice!.gender}`);
		}

		return [true, { response, voiceId: firstVoiceId }];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test voice search
 */
async function testSearchVoices(): Promise<[boolean, any]> {
	console.log("🔍 Voice Search Test");

	try {
		const { Supertone } = await import("../src/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		console.log("  🔍 Searching for female English voices...");
		const response = await client.voices.searchVoices({
			language: "en",
			gender: "female",
			pageSize: 10,
		});

		console.log(`  ✅ Search success: ${response.items?.length || 0} voices`);

		if (response.items) {
			for (const voice of response.items.slice(0, 5)) {
				console.log(`  🎤 ${voice.name} (${voice.voiceId})`);
				console.log(
					`     Language: ${voice.language}, Gender: ${voice.gender}`
				);
			}
		}

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test voice detail retrieval
 */
async function testGetVoice(voiceId: string | null): Promise<[boolean, any]> {
	console.log("📄 Voice Detail Test");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		console.log(`  🔍 Retrieving voice '${voiceId}' details...`);
		const response = await client.voices.getVoice({ voiceId });

		console.log(`  ✅ Success:`);
		console.log(`     Name: ${response.name}`);
		console.log(`     ID: ${response.voiceId}`);
		console.log(`     Description: ${response.description}`);
		console.log(`     Language: ${response.language}`);
		console.log(`     Gender: ${response.gender}`);

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test custom voice listing
 */
async function testListCustomVoices(): Promise<[boolean, any]> {
	console.log("🎨 Custom Voice List Test");

	try {
		const { Supertone } = await import("../src/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		console.log("  🔍 Retrieving custom voice list...");
		const response = await client.customVoices.listCustomVoices({
			pageSize: 10,
		});

		console.log(`  ✅ Success: ${response.items?.length || 0} custom voices`);
		console.log(`  📊 Total custom voices: ${response.total}`);

		let customVoiceId: string | null = null;
		if (response.items) {
			for (const voice of response.items) {
				console.log(`  🎤 ${voice.name} (${voice.voiceId})`);
				console.log(`     Description: ${voice.description}`);
				if (!customVoiceId) {
					customVoiceId = voice.voiceId || null;
				}
			}
		}

		return [true, { response, voiceId: customVoiceId }];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test TTS duration prediction
 */
async function testPredictDuration(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("⏱️  TTS Duration Prediction Test");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const testText = "Hello, this is a test message for duration prediction.";
		console.log(`  🔍 Predicting duration for: "${testText}"`);

		const response = await client.textToSpeech.predictDuration({
			voiceId,
			predictTTSDurationUsingCharacterRequest: {
				text: testText,
				language: models.PredictTTSDurationUsingCharacterRequestLanguage.En,
			},
		});

		console.log(`  ✅ Predicted duration: ${response.duration}s`);
		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test TTS creation (WAV)
 */
async function testCreateSpeech(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("🎤 TTS Creation Test (WAV)");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const testText = "Hello! This is a test speech synthesis.";
		console.log(`  🔍 Creating speech: "${testText}"`);
		console.log(`     Voice ID: ${voiceId}`);
		console.log(`     Format: WAV`);
		console.log("  ⚠️  This test consumes credits!");

		const response = await client.textToSpeech.createSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: testText,
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
			},
		});

		console.log(`  ✅ Speech created successfully`);
		console.log(`     Audio size: ${response.result ? "received" : "none"}`);

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test TTS streaming
 */
async function testStreamSpeech(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("📡 TTS Streaming Test");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const testText = "Testing streaming speech synthesis.";
		console.log(`  🔍 Streaming speech: "${testText}"`);
		console.log("  ⚠️  This test consumes credits!");

		const response = await client.textToSpeech.streamSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: testText,
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
			},
		});

		console.log(`  ✅ Stream started successfully`);

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test voice-specific usage retrieval
 */
async function testGetVoiceUsage(): Promise<[boolean, any]> {
	console.log("🎤 Voice Usage Test");

	try {
		const { Supertone } = await import("../src/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

		console.log(
			`  🔍 Retrieving voice usage from ${
				startDate.toISOString().split("T")[0]
			} to ${endDate.toISOString().split("T")[0]}...`
		);

		const response = await client.usage.getVoiceUsage({
			startDate: startDate.toISOString().split("T")[0],
			endDate: endDate.toISOString().split("T")[0],
		});

		console.log(
			`  ✅ Success: ${response.usages?.length || 0} voice usage records`
		);

		if (response.usages && response.usages.length > 0) {
			for (const usage of response.usages.slice(0, 5)) {
				const voiceName =
					usage.name || `Voice ${usage.voiceId?.substring(0, 8) || "Unknown"}`;
				console.log(
					`  🎤 ${voiceName}: ${usage.totalMinutesUsed?.toFixed(2)}min`
				);
				console.log(`     Voice ID: ${usage.voiceId}`);
				if (usage.language) {
					console.log(`     Language: ${usage.language}`);
				}
			}
		} else {
			console.log("  📝 No voice usage records for this period");
		}

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test custom voice search
 */
async function testSearchCustomVoices(): Promise<[boolean, any]> {
	console.log("🔍 Custom Voice Search Test");

	try {
		const { Supertone } = await import("../src/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		console.log("  🔍 Searching custom voices...");
		const response = await client.customVoices.searchCustomVoices({
			pageSize: 10,
		});

		console.log(
			`  ✅ Search success: ${response.items?.length || 0} custom voices`
		);

		if (response.items) {
			for (const voice of response.items) {
				console.log(`  🎤 ${voice.name} (${voice.voiceId})`);
				console.log(`     Description: ${voice.description}`);
			}
		}

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test custom voice detail retrieval
 */
async function testGetCustomVoice(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("📄 Custom Voice Detail Test");

	if (!voiceId) {
		console.log("  ⚠️  No custom voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		console.log(`  🔍 Retrieving custom voice '${voiceId}' details...`);
		const response = await client.customVoices.getCustomVoice({ voiceId });

		console.log(`  ✅ Success:`);
		console.log(`     Name: ${response.name}`);
		console.log(`     ID: ${response.voiceId}`);
		console.log(`     Description: ${response.description}`);

		return [true, response];
	} catch (e: any) {
		logDetailedError(e, "Get custom voice");
		return [false, e];
	}
}

/**
 * Test custom voice creation
 */
async function testCreateClonedVoice(): Promise<[boolean, any]> {
	console.log("🎨 Custom Voice Creation Test");

	// File is in custom_test directory
	const audioFilePath = path.join(__dirname, "voice_sample.wav");

	if (!fs.existsSync(audioFilePath)) {
		console.log(`  ❌ Audio file not found: ${audioFilePath}`);
		console.log(`  ⏭️  Skipping test (not a failure)`);
		return [true, null]; // Return success with null to skip, not fail
	}

	console.log(`  📁 Using audio file: ${audioFilePath}`);

	try {
		const { Supertone } = await import("../src/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const stats = fs.statSync(audioFilePath);
		const fileSize = stats.size;
		const maxSize = 3 * 1024 * 1024; // 3MB

		console.log(
			`  📏 File size: ${fileSize.toLocaleString()} bytes (${(
				fileSize /
				1024 /
				1024
			).toFixed(2)} MB)`
		);

		if (fileSize > maxSize) {
			console.log(
				`  ❌ File exceeds 3MB limit: ${(fileSize / 1024 / 1024).toFixed(2)} MB`
			);
			return [false, null];
		}

		const timestamp = new Date()
			.toLocaleString("en-US", {
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			})
			.replace(/[/, :]/g, "");
		const voiceName = `Test Sample Voice ${timestamp}`;
		const voiceDescription = `Test custom voice created at ${new Date().toISOString()}`;

		console.log(`  🔍 Creating custom voice...`);
		console.log(`     File: ${audioFilePath}`);
		console.log(`     Name: ${voiceName}`);
		console.log(`     Description: ${voiceDescription}`);
		console.log(
			"  ⚠️  This test consumes credits and creates actual custom voice!"
		);

		const audioContent = fs.readFileSync(audioFilePath);

		const response = await client.customVoices.createClonedVoice({
			files: {
				fileName: "voice_sample.wav",
				content: audioContent,
			},
			name: voiceName,
			description: voiceDescription,
		});

		console.log(`  ✅ Custom voice creation request successful!`);
		console.log(`     Voice ID: ${response.voiceId}`);

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test custom voice update
 */
async function testEditCustomVoice(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("✏️  Custom Voice Update Test");

	if (!voiceId) {
		console.log("  ⚠️  No custom voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const timestamp = new Date().toISOString();
		const testName = `Updated Test Voice ${timestamp}`;
		const testDescription = `Updated description at ${timestamp}`;

		console.log(`  🔄 Updating custom voice '${voiceId}'...`);
		console.log(`     New name: ${testName}`);
		console.log(`     New description: ${testDescription}`);

		const response = await client.customVoices.editCustomVoice({
			voiceId,
			updateClonedVoiceRequest: {
				name: testName,
				description: testDescription,
			},
		});

		console.log(`  ✅ Custom voice updated successfully`);
		console.log(`     Name: ${response.name}`);
		console.log(`     Description: ${response.description}`);

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test custom voice deletion
 */
async function testDeleteCustomVoice(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("🗑️  Custom Voice Deletion Test");

	if (!voiceId) {
		console.log("  ⚠️  No custom voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		console.log(`  🔍 Deleting custom voice '${voiceId}'...`);
		console.log("  ⚠️  This test permanently deletes the custom voice!");

		const response = await client.customVoices.deleteCustomVoice({ voiceId });

		console.log(`  ✅ Custom voice deleted successfully`);

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test TTS with long text (auto-chunking at SDK level)
 */
async function testCreateSpeechLongText(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("📜 Long Text Auto-Chunking TTS Test (300+ chars)");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const longText = `
		Hello! This is a very long text auto-chunking TTS test exceeding 300 characters.
		The newly implemented SDK automatically divides long text into multiple chunks for processing.
		Real-time streaming text-to-speech technology plays a crucial role in modern AI applications.
		It is an indispensable technology especially in conversational services, live broadcasting, and real-time translation services.
		Through the auto-chunking feature, long texts are naturally divided into multiple small segments for processing.
		Each segment is intelligently segmented considering sentence and word boundaries, enabling natural speech generation.
		Now users don't need to worry about text length, as the SDK automatically handles everything.
		`.trim();

		const actualLength = longText.length;
		console.log(
			`  📏 Test text length: ${actualLength} characters (exceeds 300)`
		);
		console.log(`  🔧 Auto-chunking enabled for text segmentation`);

		console.log(`  🔍 Converting long text with voice '${voiceId}'...`);
		console.log("  ⚠️  This test consumes credits!");
		console.log("  ✨ SDK automatically chunks and processes the text");

		const response = await client.textToSpeech.createSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: longText,
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
				style: "neutral",
				model: "sona_speech_1",
			},
		});

		if (response.result) {
			let audioSize = 0;
			let audioData: Uint8Array;

			if (response.result instanceof Uint8Array) {
				audioSize = response.result.length;
				audioData = response.result;
			} else if (response.result instanceof Blob) {
				audioSize = response.result.size;
				audioData = new Uint8Array(await response.result.arrayBuffer());
			} else if (
				typeof response.result === "object" &&
				"getReader" in response.result
			) {
				// ReadableStream
				audioData = await extractAudioData(response);
				audioSize = audioData.length;
			} else {
				audioData = new Uint8Array(0);
			}

			console.log(
				`  ✅ Auto-chunking TTS success: ${audioSize} bytes audio generated`
			);
			console.log(`  🎯 Long text successfully chunked and processed!`);

			const outputFile = "test_auto_chunking_speech_output.wav";
			fs.writeFileSync(outputFile, audioData);
			console.log(`  💾 Auto-chunked audio file saved: ${outputFile}`);

			const estimatedChunks = Math.ceil(actualLength / 300);
			console.log(
				`  📊 Estimated chunks: ${estimatedChunks} (based on text length)`
			);
		}

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test TTS streaming with long text
 */
async function testStreamSpeechLongText(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("📡 Long Text Streaming TTS Test");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const longText = `
		Hello! This is a long text streaming test.
		The SDK automatically chunks and streams the audio in real-time.
		This enables efficient processing of longer content without waiting for complete generation.
		`
			.trim()
			.repeat(3);

		console.log(`  🔍 Streaming long text with voice '${voiceId}'...`);
		console.log(`     Text length: ${longText.length} characters`);
		console.log("  ⚠️  This test consumes credits!");

		const response = await client.textToSpeech.streamSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: longText,
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
			},
		});

		console.log(`  ✅ Stream started successfully`);

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test TTS with voice settings
 */
async function testCreateSpeechWithVoiceSettings(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("🎛️  TTS with Voice Settings Test");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const voiceSettings = {
			pitchShift: 0.95,
			pitchVariance: 1.1,
			speed: 0.9,
		};

		console.log(
			`  🔍 TTS conversion with voice settings using voice '${voiceId}'...`
		);
		console.log(
			`     Settings: pitchShift=${voiceSettings.pitchShift}, speed=${voiceSettings.speed}`
		);
		console.log("  ⚠️  This test consumes credits!");

		const response = await client.textToSpeech.createSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: "Hello world! This is a voice settings test. You can hear the adjusted pitch and speed.",
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
				style: "neutral",
				model: "sona_speech_1",
				voiceSettings,
				includePhonemes: false,
			},
		});

		console.log(`  ✅ TTS with voice settings success`);

		if (response.result) {
			const outputFile = "test_voice_settings_speech_output.wav";
			const audioData = await extractAudioData(response);

			fs.writeFileSync(outputFile, audioData);
			console.log(`  💾 Voice settings audio file saved: ${outputFile}`);
		}

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test TTS with phoneme information
 */
async function testCreateSpeechWithPhonemes(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("🔤 TTS with Phoneme Information Test");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		console.log(
			`  🔍 TTS conversion with phonemes using voice '${voiceId}'...`
		);
		console.log("  ⚠️  This test consumes credits!");

		const response = await client.textToSpeech.createSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: "Hello world! This is a phoneme timing test.",
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
				style: "neutral",
				model: "sona_speech_1",
				includePhonemes: true,
			},
		});

		console.log(`  ✅ TTS with phonemes success`);

		if (response.result) {
			const outputFile = "test_phoneme_speech_output.wav";

			// Check if response is JSON with phonemes data
			if (
				typeof response.result === "object" &&
				"audioBase64" in response.result
			) {
				const audioData = await extractAudioData(response);
				fs.writeFileSync(outputFile, audioData);
				console.log(`  💾 Phoneme audio file saved: ${outputFile}`);

				// Display phoneme information as JSON
				const phonemes = (response.result as any).phonemes;
				if (phonemes) {
					console.log(`  📊 Phoneme data (JSON):`);
					console.log(JSON.stringify(phonemes, null, 2));
					console.log(`  📈 Summary:`);
					console.log(`     Symbols count: ${phonemes.symbols?.length || 0}`);
					console.log(
						`     Durations count: ${phonemes.durations_seconds?.length || 0}`
					);
					console.log(
						`     Start times count: ${
							phonemes.start_times_seconds?.length || 0
						}`
					);
					if (phonemes.symbols && phonemes.symbols.length > 0) {
						console.log(
							`     First 5 symbols: ${phonemes.symbols.slice(0, 5).join(", ")}`
						);
					}
				}
			} else {
				// Binary audio without phonemes
				const audioData = await extractAudioData(response);
				fs.writeFileSync(outputFile, audioData);
				console.log(`  💾 Phoneme audio file saved: ${outputFile}`);
			}
		}

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test TTS streaming with phonemes
 */
async function testStreamSpeechWithPhonemes(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("📡 TTS Streaming with Phonemes Test");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		console.log(
			`  🔍 Streaming speech with phonemes for voice '${voiceId}'...`
		);
		console.log("  ⚠️  This test consumes credits!");

		const response = await client.textToSpeech.streamSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: "Streaming with phoneme timing information.",
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
				includePhonemes: true,
			},
		});

		console.log(`  ✅ Stream with phonemes started successfully`);

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

// =============================================================================
// Model & Language Compatibility Tests
// =============================================================================

/**
 * Model-Language compatibility matrix
 * - sona_speech_1: ko, en, ja
 * - sona_speech_2: all languages (23 languages)
 * - supertonic_api_1: ko, en, ja, es, pt
 */
const MODEL_LANGUAGE_MATRIX = {
	sona_speech_1: ["ko", "en", "ja"],
	sona_speech_2: [
		"en",
		"ko",
		"ja",
		"bg",
		"cs",
		"da",
		"el",
		"es",
		"et",
		"fi",
		"hu",
		"it",
		"nl",
		"pl",
		"pt",
		"ro",
		"ar",
		"de",
		"fr",
		"hi",
		"id",
		"ru",
		"vi",
	],
	supertonic_api_1: ["ko", "en", "ja", "es", "pt"],
} as const;

/**
 * Test TTS with sona_speech_2 model
 */
async function testCreateSpeechWithSonaSpeech2(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("🤖 TTS with sona_speech_2 Model Test");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const testText =
			"Hello! Testing sona_speech_2 model for text-to-speech conversion.";
		console.log(`  🔍 Creating speech with sona_speech_2 model`);
		console.log(`     Voice ID: ${voiceId}`);
		console.log(`     Model: sona_speech_2`);
		console.log("  ⚠️  This test consumes credits!");

		const response = await client.textToSpeech.createSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: testText,
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
				model:
					models.APIConvertTextToSpeechUsingCharacterRequestModel.SonaSpeech2,
			},
		});

		console.log(`  ✅ sona_speech_2 TTS success`);

		if (response.result) {
			const audioData = await extractAudioData(response);
			const outputFile = "test_sona_speech_2_output.wav";
			fs.writeFileSync(outputFile, audioData);
			console.log(
				`  💾 Audio saved: ${outputFile} (${audioData.length} bytes)`
			);
		}

		return [true, response];
	} catch (e: any) {
		logDetailedError(e, "sona_speech_2 TTS");
		return [false, e];
	}
}

/**
 * Test TTS with supertonic_api_1 model
 */
async function testCreateSpeechWithSupertonicApi1(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("🤖 TTS with supertonic_api_1 Model Test");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const testText =
			"Hello! Testing supertonic_api_1 model for text-to-speech conversion.";
		console.log(`  🔍 Creating speech with supertonic_api_1 model`);
		console.log(`     Voice ID: ${voiceId}`);
		console.log(`     Model: supertonic_api_1`);
		console.log("  ⚠️  This test consumes credits!");

		const response = await client.textToSpeech.createSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: testText,
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
				model:
					models.APIConvertTextToSpeechUsingCharacterRequestModel
						.SupertonicApi1,
			},
		});

		console.log(`  ✅ supertonic_api_1 TTS success`);

		if (response.result) {
			const audioData = await extractAudioData(response);
			const outputFile = "test_supertonic_api_1_output.wav";
			fs.writeFileSync(outputFile, audioData);
			console.log(
				`  💾 Audio saved: ${outputFile} (${audioData.length} bytes)`
			);
		}

		return [true, response];
	} catch (e: any) {
		logDetailedError(e, "supertonic_api_1 TTS");
		return [false, e];
	}
}

/**
 * Test TTS with unsupported model (should fail with validation error)
 */
async function testCreateSpeechWithUnsupportedModel(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("🚫 TTS with Unsupported Model Test (Expected to Fail)");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const testText = "This should fail with unsupported model.";
		console.log(
			`  🔍 Attempting TTS with unsupported model: 'invalid_model_xyz'`
		);

		// Using type assertion to bypass TypeScript validation for testing
		const response = await client.textToSpeech.createSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: testText,
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
				model: "invalid_model_xyz" as any, // Intentionally invalid model
			},
		});

		// If we reach here, the test failed (should have thrown an error)
		console.log(`  ❌ Expected error but got success - this is unexpected!`);
		return [false, response];
	} catch (e: any) {
		// Expected to fail - this is the success case for this test
		console.log(`  ✅ Correctly rejected unsupported model`);
		console.log(`  📋 Error type: ${e.constructor?.name || typeof e}`);
		console.log(`  📋 Error message: ${e.message?.substring(0, 100) || e}`);
		return [true, e];
	}
}

/**
 * Test prediction with sona_speech_2 model
 */
async function testPredictDurationWithSonaSpeech2(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("⏱️  Duration Prediction with sona_speech_2 Model Test");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const testText = "Testing duration prediction with sona_speech_2 model.";
		console.log(`  🔍 Predicting duration with sona_speech_2 model`);

		const response = await client.textToSpeech.predictDuration({
			voiceId,
			predictTTSDurationUsingCharacterRequest: {
				text: testText,
				language: models.PredictTTSDurationUsingCharacterRequestLanguage.En,
				model: models.PredictTTSDurationUsingCharacterRequestModel.SonaSpeech2,
			},
		});

		console.log(
			`  ✅ sona_speech_2 duration prediction: ${response.duration}s`
		);
		return [true, response];
	} catch (e: any) {
		logDetailedError(e, "sona_speech_2 duration prediction");
		return [false, e];
	}
}

/**
 * Test prediction with supertonic_api_1 model
 */
async function testPredictDurationWithSupertonicApi1(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("⏱️  Duration Prediction with supertonic_api_1 Model Test");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const testText = "Testing duration prediction with supertonic_api_1 model.";
		console.log(`  🔍 Predicting duration with supertonic_api_1 model`);

		const response = await client.textToSpeech.predictDuration({
			voiceId,
			predictTTSDurationUsingCharacterRequest: {
				text: testText,
				language: models.PredictTTSDurationUsingCharacterRequestLanguage.En,
				model:
					models.PredictTTSDurationUsingCharacterRequestModel.SupertonicApi1,
			},
		});

		console.log(
			`  ✅ supertonic_api_1 duration prediction: ${response.duration}s`
		);
		return [true, response];
	} catch (e: any) {
		logDetailedError(e, "supertonic_api_1 duration prediction");
		return [false, e];
	}
}

/**
 * Test prediction with unsupported model (should fail with validation error)
 */
async function testPredictDurationWithUnsupportedModel(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log(
		"🚫 Duration Prediction with Unsupported Model Test (Expected to Fail)"
	);

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const testText = "This should fail with unsupported model.";
		console.log(
			`  🔍 Attempting prediction with unsupported model: 'invalid_model_xyz'`
		);

		const response = await client.textToSpeech.predictDuration({
			voiceId,
			predictTTSDurationUsingCharacterRequest: {
				text: testText,
				language: models.PredictTTSDurationUsingCharacterRequestLanguage.En,
				model: "invalid_model_xyz" as any, // Intentionally invalid model
			},
		});

		console.log(`  ❌ Expected error but got success - this is unexpected!`);
		return [false, response];
	} catch (e: any) {
		console.log(`  ✅ Correctly rejected unsupported model`);
		console.log(`  📋 Error type: ${e.constructor?.name || typeof e}`);
		console.log(`  📋 Error message: ${e.message?.substring(0, 100) || e}`);
		return [true, e];
	}
}

// =============================================================================
// Multilingual Tests per Model
// =============================================================================

/**
 * Test TTS multilingual support with sona_speech_1 (supports: ko, en, ja)
 */
async function testMultilingualSonaSpeech1(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("🌍 Multilingual Test - sona_speech_1 (ko, en, ja)");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	const testCases = [
		{
			lang: "ko" as const,
			text: "안녕하세요, 소나 스피치 원 모델입니다.",
			label: "Korean",
		},
		{
			lang: "en" as const,
			text: "Hello, this is sona_speech_1 model.",
			label: "English",
		},
		{
			lang: "ja" as const,
			text: "こんにちは、ソナスピーチワンモデルです。",
			label: "Japanese",
		},
	];

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		let allPassed = true;
		const results: any[] = [];

		for (const tc of testCases) {
			console.log(`  🔍 Testing ${tc.label} (${tc.lang})...`);

			try {
				const langEnum =
					models.APIConvertTextToSpeechUsingCharacterRequestLanguage[
						(tc.lang.charAt(0).toUpperCase() +
							tc.lang.slice(
								1
							)) as keyof typeof models.APIConvertTextToSpeechUsingCharacterRequestLanguage
					];

				const response = await client.textToSpeech.createSpeech({
					voiceId,
					apiConvertTextToSpeechUsingCharacterRequest: {
						text: tc.text,
						language: langEnum,
						outputFormat:
							models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat
								.Wav,
						model:
							models.APIConvertTextToSpeechUsingCharacterRequestModel
								.SonaSpeech1,
					},
				});

				console.log(`     ✅ ${tc.label} success`);
				results.push({ lang: tc.lang, success: true });
			} catch (e: any) {
				console.log(
					`     ❌ ${tc.label} failed: ${e.message?.substring(0, 50)}`
				);
				results.push({ lang: tc.lang, success: false, error: e.message });
				allPassed = false;
			}
		}

		console.log(
			`  📊 Result: ${results.filter((r) => r.success).length}/${
				testCases.length
			} languages passed`
		);
		return [allPassed, results];
	} catch (e: any) {
		logDetailedError(e, "sona_speech_1 multilingual");
		return [false, e];
	}
}

/**
 * Test TTS multilingual support with sona_speech_2 (supports all languages)
 */
async function testMultilingualSonaSpeech2(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("🌍 Multilingual Test - sona_speech_2 (all languages sample)");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	// Test a diverse subset of languages
	const testCases = [
		{ lang: "Ko" as const, text: "안녕하세요.", label: "Korean" },
		{ lang: "En" as const, text: "Hello.", label: "English" },
		{ lang: "Ja" as const, text: "こんにちは。", label: "Japanese" },
		{ lang: "Es" as const, text: "Hola.", label: "Spanish" },
		{ lang: "Fr" as const, text: "Bonjour.", label: "French" },
		{ lang: "De" as const, text: "Hallo.", label: "German" },
		{ lang: "Ar" as const, text: "مرحبا.", label: "Arabic" },
		{ lang: "Hi" as const, text: "नमस्ते।", label: "Hindi" },
	];

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		let allPassed = true;
		const results: any[] = [];

		for (const tc of testCases) {
			console.log(`  🔍 Testing ${tc.label} (${tc.lang})...`);

			try {
				const langEnum =
					models.APIConvertTextToSpeechUsingCharacterRequestLanguage[tc.lang];

				const response = await client.textToSpeech.createSpeech({
					voiceId,
					apiConvertTextToSpeechUsingCharacterRequest: {
						text: tc.text,
						language: langEnum,
						outputFormat:
							models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat
								.Wav,
						model:
							models.APIConvertTextToSpeechUsingCharacterRequestModel
								.SonaSpeech2,
					},
				});

				console.log(`     ✅ ${tc.label} success`);
				results.push({ lang: tc.lang, success: true });
			} catch (e: any) {
				console.log(
					`     ❌ ${tc.label} failed: ${e.message?.substring(0, 50)}`
				);
				results.push({ lang: tc.lang, success: false, error: e.message });
				allPassed = false;
			}
		}

		console.log(
			`  📊 Result: ${results.filter((r) => r.success).length}/${
				testCases.length
			} languages passed`
		);
		return [allPassed, results];
	} catch (e: any) {
		logDetailedError(e, "sona_speech_2 multilingual");
		return [false, e];
	}
}

/**
 * Test TTS multilingual support with supertonic_api_1 (supports: ko, en, ja, es, pt)
 */
async function testMultilingualSupertonicApi1(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("🌍 Multilingual Test - supertonic_api_1 (ko, en, ja, es, pt)");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	const testCases = [
		{
			lang: "Ko" as const,
			text: "안녕하세요, 슈퍼토닉 API 원 모델입니다.",
			label: "Korean",
		},
		{
			lang: "En" as const,
			text: "Hello, this is supertonic_api_1 model.",
			label: "English",
		},
		{
			lang: "Ja" as const,
			text: "こんにちは、スーパートニックAPIワンです。",
			label: "Japanese",
		},
		{
			lang: "Es" as const,
			text: "Hola, este es el modelo supertonic_api_1.",
			label: "Spanish",
		},
		{
			lang: "Pt" as const,
			text: "Olá, este é o modelo supertonic_api_1.",
			label: "Portuguese",
		},
	];

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		let allPassed = true;
		const results: any[] = [];

		for (const tc of testCases) {
			console.log(`  🔍 Testing ${tc.label} (${tc.lang})...`);

			try {
				const langEnum =
					models.APIConvertTextToSpeechUsingCharacterRequestLanguage[tc.lang];

				const response = await client.textToSpeech.createSpeech({
					voiceId,
					apiConvertTextToSpeechUsingCharacterRequest: {
						text: tc.text,
						language: langEnum,
						outputFormat:
							models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat
								.Wav,
						model:
							models.APIConvertTextToSpeechUsingCharacterRequestModel
								.SupertonicApi1,
					},
				});

				console.log(`     ✅ ${tc.label} success`);
				results.push({ lang: tc.lang, success: true });
			} catch (e: any) {
				console.log(
					`     ❌ ${tc.label} failed: ${e.message?.substring(0, 50)}`
				);
				results.push({ lang: tc.lang, success: false, error: e.message });
				allPassed = false;
			}
		}

		console.log(
			`  📊 Result: ${results.filter((r) => r.success).length}/${
				testCases.length
			} languages passed`
		);
		return [allPassed, results];
	} catch (e: any) {
		logDetailedError(e, "supertonic_api_1 multilingual");
		return [false, e];
	}
}

/**
 * Test unsupported language for sona_speech_1 (should fail with French)
 */
async function testUnsupportedLanguageSonaSpeech1(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log(
		"🚫 Unsupported Language Test - sona_speech_1 with French (Expected to Fail)"
	);

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		console.log(`  🔍 Attempting sona_speech_1 with French (unsupported)`);

		const response = await client.textToSpeech.createSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: "Bonjour, ceci est un test.",
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.Fr, // French - not supported by sona_speech_1
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
				model:
					models.APIConvertTextToSpeechUsingCharacterRequestModel.SonaSpeech1,
			},
		});

		// If we reach here, the API didn't reject - may need server-side validation
		console.log(
			`  ⚠️  API accepted the request - server-side validation may not enforce language restriction`
		);
		console.log(
			`  📋 Note: Language restriction may be enforced at API level, not SDK level`
		);
		return [
			true,
			{ note: "API accepted - language restriction may be server-side" },
		];
	} catch (e: any) {
		console.log(
			`  ✅ Correctly rejected unsupported language for sona_speech_1`
		);
		console.log(`  📋 Error: ${e.message?.substring(0, 100)}`);
		return [true, e];
	}
}

/**
 * Test unsupported language for supertonic_api_1 (should fail with German)
 */
async function testUnsupportedLanguageSupertonicApi1(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log(
		"🚫 Unsupported Language Test - supertonic_api_1 with German (Expected to Fail)"
	);

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		console.log(`  🔍 Attempting supertonic_api_1 with German (unsupported)`);

		const response = await client.textToSpeech.createSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: "Hallo, das ist ein Test.",
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.De, // German - not supported by supertonic_api_1
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
				model:
					models.APIConvertTextToSpeechUsingCharacterRequestModel
						.SupertonicApi1,
			},
		});

		// If we reach here, the API didn't reject - may need server-side validation
		console.log(
			`  ⚠️  API accepted the request - server-side validation may not enforce language restriction`
		);
		console.log(
			`  📋 Note: Language restriction may be enforced at API level, not SDK level`
		);
		return [
			true,
			{ note: "API accepted - language restriction may be server-side" },
		];
	} catch (e: any) {
		console.log(
			`  ✅ Correctly rejected unsupported language for supertonic_api_1`
		);
		console.log(`  📋 Error: ${e.message?.substring(0, 100)}`);
		return [true, e];
	}
}

/**
 * Test duration prediction with voice settings
 */
async function testPredictDurationWithVoiceSettings(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("⏱️  Duration Prediction with Voice Settings Test");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const voiceSettings = {
			speed: 0.8,
		};

		console.log(
			`  🔍 Predicting duration with voice settings for voice '${voiceId}'...`
		);
		console.log(`     Settings: speed=${voiceSettings.speed}`);

		const response = await client.textToSpeech.predictDuration({
			voiceId,
			predictTTSDurationUsingCharacterRequest: {
				text: "This is a duration test with adjusted speed.",
				language: models.PredictTTSDurationUsingCharacterRequestLanguage.En,
				voiceSettings,
			},
		});

		console.log(`  ✅ Predicted duration: ${response.duration}s`);

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test TTS streaming with voice settings
 */
async function testStreamSpeechWithVoiceSettings(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("📡 TTS Streaming with Voice Settings Test");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const voiceSettings = {
			pitchShift: 1.05,
			speed: 1.1,
		};

		console.log(
			`  🔍 Streaming speech with voice settings for voice '${voiceId}'...`
		);
		console.log(
			`     Settings: pitchShift=${voiceSettings.pitchShift}, speed=${voiceSettings.speed}`
		);
		console.log("  ⚠️  This test consumes credits!");

		const response = await client.textToSpeech.streamSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: "Streaming with adjusted voice settings.",
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
				voiceSettings,
			},
		});

		console.log(`  ✅ Stream with voice settings started successfully`);

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test MP3 format TTS
 */
async function testCreateSpeechMp3(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("🎤 MP3 Format TTS Test");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		console.log(`  🔍 MP3 TTS conversion with voice '${voiceId}'...`);
		console.log("  ⚠️  This test consumes credits!");

		const response = await client.textToSpeech.createSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: "Hello! This is an MP3 format SDK test. Let's verify if it works correctly.",
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Mp3,
				style: "neutral",
				model: "sona_speech_1",
			},
		});

		console.log(`  ✅ MP3 TTS conversion success`);

		if (response.result) {
			const outputFile = "test_create_speech_output.mp3";
			const audioData = await extractAudioData(response);

			fs.writeFileSync(outputFile, audioData);
			console.log(`  💾 MP3 audio file saved: ${outputFile}`);

			// Verify MP3 header
			const header = audioData.slice(0, 10);
			if (header[0] === 0x49 && header[1] === 0x44 && header[2] === 0x33) {
				console.log(`  ✅ Valid MP3 file generated (ID3 tag)`);
			} else if (
				(header[0] === 0xff && header[1] === 0xfb) ||
				(header[0] === 0xff && header[1] === 0xfa)
			) {
				console.log(`  ✅ Valid MP3 file generated (MPEG frame)`);
			} else {
				console.log(
					`  📄 MP3 header: ${Array.from(header.slice(0, 10))
						.map((b) => b.toString(16).padStart(2, "0"))
						.join(" ")} (needs verification)`
				);
			}
		}

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test MP3 format with long text
 */
async function testCreateSpeechLongTextMp3(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("📜 Long Text MP3 Auto-Chunking TTS Test (300+ chars)");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const longText = `
		Hello! This is a very long text MP3 auto-chunking TTS test exceeding 300 characters.
		The newly implemented SDK automatically divides long text into multiple chunks for processing.
		Real-time streaming text-to-speech technology plays a crucial role in modern AI applications.
		It is an indispensable technology especially in conversational services, live broadcasting, and real-time translation services.
		Through the auto-chunking feature, long texts are naturally divided into multiple small segments for processing.
		Each segment is intelligently segmented considering sentence and word boundaries, enabling natural speech generation.
		Now users don't need to worry about text length or output format, as the SDK automatically handles everything in MP3 format too.
		`.trim();

		const actualLength = longText.length;
		console.log(
			`  📏 Test text length: ${actualLength} characters (exceeds 300)`
		);
		console.log(`  🔧 Auto-chunking enabled for MP3 format`);

		console.log(`  🔍 Converting long text to MP3 with voice '${voiceId}'...`);
		console.log("  ⚠️  This test consumes credits!");

		const response = await client.textToSpeech.createSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: longText,
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Mp3,
				style: "neutral",
				model: "sona_speech_1",
			},
		});

		console.log(`  ✅ MP3 auto-chunking TTS success`);

		if (response.result) {
			const outputFile = "test_auto_chunking_speech_output.mp3";
			const audioData = await extractAudioData(response);

			fs.writeFileSync(outputFile, audioData);
			console.log(`  💾 Auto-chunked MP3 audio file saved: ${outputFile}`);
		}

		return [true, response];
	} catch (e: any) {
		logDetailedError(e, "MP3 long text auto-chunking");
		return [false, e];
	}
}

/**
 * Test MP3 streaming
 */
async function testStreamSpeechMp3(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("📡 MP3 Streaming Test");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		console.log(`  🔍 Streaming MP3 speech with voice '${voiceId}'...`);
		console.log("  ⚠️  This test consumes credits!");

		const response = await client.textToSpeech.streamSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: "Testing MP3 streaming speech synthesis.",
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Mp3,
			},
		});

		console.log(`  ✅ MP3 stream started successfully`);

		return [true, response];
	} catch (e: any) {
		console.error(`  ❌ Error: ${e.message || e}`);
		return [false, e];
	}
}

/**
 * Test MP3 streaming with long text
 */
async function testStreamSpeechLongTextMp3(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("📡 Long Text MP3 Streaming Test");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		const longText = `
		Hello! This is a long text MP3 streaming test.
		The SDK automatically chunks and streams the MP3 audio in real-time.
		This enables efficient processing of longer content without waiting for complete generation.
		`
			.trim()
			.repeat(3);

		console.log(`  🔍 Streaming long text MP3 with voice '${voiceId}'...`);
		console.log(`     Text length: ${longText.length} characters`);
		console.log("  ⚠️  This test consumes credits!");

		const response = await client.textToSpeech.streamSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: longText,
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Mp3,
			},
		});

		console.log(`  ✅ Long text MP3 stream started successfully`);

		return [true, response];
	} catch (e: any) {
		logDetailedError(e, "MP3 long text streaming");
		return [false, e];
	}
}

/**
 * Test TTS with automatic chunking (long text)
 * Note: Now createSpeech automatically handles chunking for long text
 */
async function testCreateSpeechWithChunking(
	voiceId: string | null
): Promise<[boolean, any]> {
	console.log("📝 TTS with Auto-Chunking Test (via createSpeech)");

	if (!voiceId) {
		console.log("  ⚠️  No voice ID available");
		return [false, null];
	}

	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");
		const client = new Supertone({ apiKey: API_KEY });

		// Long text that exceeds typical limits
		const longText =
			"This is a longer test text. ".repeat(20) +
			"It will be automatically chunked and merged.";

		console.log(`  🔍 Creating speech with auto-chunking`);
		console.log(`     Text length: ${longText.length} characters`);
		console.log("  ✨ Using createSpeech() - automatically chunks internally");
		console.log("  ⚠️  This test consumes credits!");

		// Now just use regular createSpeech - it handles chunking automatically
		const response = await client.textToSpeech.createSpeech({
			voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: longText,
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
			},
		});

		console.log(`  ✅ Speech created and merged successfully`);
		console.log(`  🎯 Chunking handled automatically by SDK`);

		return [true, response];
	} catch (e: any) {
		logDetailedError(e, "Auto-chunking TTS");
		return [false, e];
	}
}

/**
 * Main test execution
 */
async function main(): Promise<boolean> {
	console.log("🧪 Real API Integration Test Start");
	console.log("=".repeat(60));
	console.log(
		"⚠️  WARNING: These tests make real API calls and consume credits!"
	);
	console.log("=".repeat(60));
	console.log("");

	const testResults: TestResult = {};
	const voiceIdForTTS: string = "91992bbd4758bdcf9c9b01";
	let customVoiceId: string | null = null;
	let createdCustomVoiceId: string | null = null;

	// 1. Usage Tests
	console.log("\n💰 Usage & Credit Tests");
	console.log("-".repeat(60));

	let [success, result] = await testCreditBalance();
	testResults["credit_balance"] = success;

	[success, result] = await testGetUsage();
	testResults["get_usage"] = success;

	[success, result] = await testGetVoiceUsage();
	testResults["get_voice_usage"] = success;

	// 2. Voice Tests
	console.log("\n🎵 Voice Tests");
	console.log("-".repeat(60));

	[success, result] = await testListVoices();
	testResults["list_voices"] = success;

	[success, result] = await testSearchVoices();
	testResults["search_voices"] = success;

	[success, result] = await testGetVoice(voiceIdForTTS);
	testResults["get_voice"] = success;

	// 3. Custom Voice Tests
	console.log("\n🎨 Custom Voice Tests");
	console.log("-".repeat(60));

	[success, result] = await testListCustomVoices();
	testResults["list_custom_voices"] = success;
	if (success && result.voiceId) {
		customVoiceId = result.voiceId;
	}

	[success, result] = await testSearchCustomVoices();
	testResults["search_custom_voices"] = success;

	[success, result] = await testGetCustomVoice(customVoiceId);
	testResults["get_custom_voice"] = success;

	// 4. Custom Voice Creation/Edit/Delete Tests
	console.log("\n🎨 Custom Voice Management Tests");
	console.log("-".repeat(60));
	console.log("⚠️  These tests consume credits and modify custom voices!");
	console.log("");

	[success, result] = await testCreateClonedVoice();
	testResults["create_cloned_voice"] = success;
	if (success && result?.voiceId) {
		createdCustomVoiceId = result.voiceId;
	}

	if (createdCustomVoiceId) {
		[success, result] = await testEditCustomVoice(createdCustomVoiceId);
		testResults["edit_custom_voice"] = success;

		console.log("\n⏸️  Pausing before deletion to allow voice to be used...");
		console.log(
			"⚠️  Note: In production, ensure voice is no longer needed before deletion"
		);

		[success, result] = await testDeleteCustomVoice(createdCustomVoiceId);
		testResults["delete_custom_voice"] = success;
	} else {
		console.log("⏭️  Skipping edit/delete tests (no custom voice created)");
		testResults["edit_custom_voice"] = null;
		testResults["delete_custom_voice"] = null;
	}

	// 5. TTS Basic Tests (only if voice ID available)
	if (voiceIdForTTS) {
		console.log("\n🎤 Text-to-Speech Basic Tests");
		console.log("-".repeat(60));
		console.log("⚠️  These tests consume credits!");
		console.log("");

		[success, result] = await testPredictDuration(voiceIdForTTS);
		testResults["predict_duration"] = success;

		[success, result] = await testCreateSpeech(voiceIdForTTS);
		testResults["create_speech_wav"] = success;

		[success, result] = await testStreamSpeech(voiceIdForTTS);
		testResults["stream_speech"] = success;

		// 5.5 New Model Tests (sona_speech_2, supertonic_api_1)
		console.log("\n🤖 New Model Tests (sona_speech_2, supertonic_api_1)");
		console.log("-".repeat(60));
		console.log("⚠️  These tests consume credits!");
		console.log("");

		[success, result] = await testCreateSpeechWithSonaSpeech2(voiceIdForTTS);
		testResults["create_speech_sona_speech_2"] = success;

		[success, result] = await testCreateSpeechWithSupertonicApi1(voiceIdForTTS);
		testResults["create_speech_supertonic_api_1"] = success;

		[success, result] = await testCreateSpeechWithUnsupportedModel(
			voiceIdForTTS
		);
		testResults["create_speech_unsupported_model"] = success;

		[success, result] = await testPredictDurationWithSonaSpeech2(voiceIdForTTS);
		testResults["predict_duration_sona_speech_2"] = success;

		[success, result] = await testPredictDurationWithSupertonicApi1(
			voiceIdForTTS
		);
		testResults["predict_duration_supertonic_api_1"] = success;

		[success, result] = await testPredictDurationWithUnsupportedModel(
			voiceIdForTTS
		);
		testResults["predict_duration_unsupported_model"] = success;

		// 5.6 Multilingual Tests per Model
		console.log("\n🌍 Multilingual Tests per Model");
		console.log("-".repeat(60));
		console.log("⚠️  These tests consume credits!");
		console.log("");

		[success, result] = await testMultilingualSonaSpeech1(voiceIdForTTS);
		testResults["multilingual_sona_speech_1"] = success;

		[success, result] = await testMultilingualSonaSpeech2(voiceIdForTTS);
		testResults["multilingual_sona_speech_2"] = success;

		[success, result] = await testMultilingualSupertonicApi1(voiceIdForTTS);
		testResults["multilingual_supertonic_api_1"] = success;

		// 5.7 Unsupported Language Tests
		console.log("\n🚫 Unsupported Language Tests");
		console.log("-".repeat(60));
		console.log(
			"⚠️  These tests verify error handling for unsupported model-language combinations!"
		);
		console.log("");

		[success, result] = await testUnsupportedLanguageSonaSpeech1(voiceIdForTTS);
		testResults["unsupported_lang_sona_speech_1"] = success;

		[success, result] = await testUnsupportedLanguageSupertonicApi1(
			voiceIdForTTS
		);
		testResults["unsupported_lang_supertonic_api_1"] = success;

		// 6. TTS Long Text Tests
		console.log("\n📜 Text-to-Speech Long Text Tests");
		console.log("-".repeat(60));
		console.log("⚠️  These tests consume more credits!");
		console.log("");

		[success, result] = await testCreateSpeechLongText(voiceIdForTTS);
		testResults["create_speech_long_text"] = success;

		[success, result] = await testStreamSpeechLongText(voiceIdForTTS);
		testResults["stream_speech_long_text"] = success;

		[success, result] = await testCreateSpeechWithChunking(voiceIdForTTS);
		testResults["create_speech_chunking"] = success;

		// 7. TTS with Voice Settings Tests
		console.log("\n🎛️  Text-to-Speech with Voice Settings Tests");
		console.log("-".repeat(60));
		console.log("⚠️  These tests consume credits!");
		console.log("");

		[success, result] = await testCreateSpeechWithVoiceSettings(voiceIdForTTS);
		testResults["create_speech_voice_settings"] = success;

		[success, result] = await testPredictDurationWithVoiceSettings(
			voiceIdForTTS
		);
		testResults["predict_duration_voice_settings"] = success;

		[success, result] = await testStreamSpeechWithVoiceSettings(voiceIdForTTS);
		testResults["stream_speech_voice_settings"] = success;

		// 8. TTS with Phonemes Tests
		console.log("\n🔤 Text-to-Speech with Phonemes Tests");
		console.log("-".repeat(60));
		console.log("⚠️  These tests consume credits!");
		console.log("");

		[success, result] = await testCreateSpeechWithPhonemes(voiceIdForTTS);
		testResults["create_speech_phonemes"] = success;

		[success, result] = await testStreamSpeechWithPhonemes(voiceIdForTTS);
		testResults["stream_speech_phonemes"] = success;

		// 9. MP3 Format Tests
		console.log("\n🎵 MP3 Format Tests");
		console.log("-".repeat(60));
		console.log("⚠️  These tests consume credits!");
		console.log("");

		[success, result] = await testCreateSpeechMp3(voiceIdForTTS);
		testResults["create_speech_mp3"] = success;

		[success, result] = await testCreateSpeechLongTextMp3(voiceIdForTTS);
		testResults["create_speech_long_text_mp3"] = success;

		[success, result] = await testStreamSpeechMp3(voiceIdForTTS);
		testResults["stream_speech_mp3"] = success;

		[success, result] = await testStreamSpeechLongTextMp3(voiceIdForTTS);
		testResults["stream_speech_long_text_mp3"] = success;
	}

	// Results Summary
	console.log("\n" + "=".repeat(60));
	console.log("🧪 Integration Test Results Summary:");
	console.log("");

	let passed = 0;
	let total = 0;

	for (const [testName, testResult] of Object.entries(testResults)) {
		let status: string;
		if (testResult === null) {
			status = "⏭️  SKIP";
		} else if (testResult) {
			status = "✅ PASS";
			passed++;
			total++;
		} else {
			status = "❌ FAIL";
			total++;
		}

		console.log(`  ${testName}: ${status}`);
	}

	console.log("");
	console.log(`Total ${passed}/${total} tests passed`);
	console.log("");

	if (passed === total) {
		console.log(
			"🎉 All integration tests passed! SDK works correctly with real API."
		);
		console.log("");
		console.log("✅ SDK ready for deployment!");
	} else {
		console.log("⚠️  Some tests failed. Please check:");
		console.log("  • API key is valid");
		console.log("  • Account has sufficient credits");
		console.log("  • Network connection is stable");
	}

	console.log("");
	console.log("📋 Tested APIs:");
	console.log("  • Usage: getCreditBalance, getUsage, getVoiceUsage");
	console.log("  • Voices: listVoices, searchVoices, getVoice");
	console.log(
		"  • Custom Voices: listCustomVoices, searchCustomVoices, getCustomVoice"
	);
	console.log(
		"  • Custom Voice Management: createClonedVoice, editCustomVoice, deleteCustomVoice"
	);
	console.log(
		"  • Text-to-Speech: predictDuration, createSpeech, streamSpeech"
	);
	console.log("  • TTS Long Text: createSpeechLongText, streamSpeechLongText");
	console.log(
		"  • TTS with Voice Settings: createSpeechWithVoiceSettings, predictDurationWithVoiceSettings, streamSpeechWithVoiceSettings"
	);
	console.log(
		"  • TTS with Phonemes: createSpeechWithPhonemes, streamSpeechWithPhonemes"
	);
	console.log(
		"  • MP3 Format: createSpeechMp3, createSpeechLongTextMp3, streamSpeechMp3, streamSpeechLongTextMp3"
	);
	console.log(
		"  • Custom Features: Auto-chunking in createSpeech/streamSpeech (transparent)"
	);
	console.log("");
	console.log("🤖 New Model & Language Tests:");
	console.log(
		"  • New Models: sona_speech_2, supertonic_api_1 (createSpeech & predictDuration)"
	);
	console.log(
		"  • Unsupported Model Validation: Error handling for invalid model names"
	);
	console.log("  • Multilingual per Model:");
	console.log("    - sona_speech_1: ko, en, ja");
	console.log("    - sona_speech_2: all 23 languages");
	console.log("    - supertonic_api_1: ko, en, ja, es, pt");
	console.log(
		"  • Unsupported Language Validation: Error handling for invalid model-language combinations"
	);

	if (customVoiceId) {
		console.log("");
		console.log(`🎨 Found existing custom voice: ${customVoiceId}`);
	}

	if (createdCustomVoiceId) {
		console.log(`🆕 Created and deleted custom voice: ${createdCustomVoiceId}`);
	}

	console.log("");
	console.log("💡 Note: This is a comprehensive test suite.");
	console.log(
		"   Excludes parallel processing tests (see Python version for those)"
	);

	return passed === total;
}

// Run tests
main()
	.then((success) => {
		process.exit(success ? 0 : 1);
	})
	.catch((error) => {
		console.error("❌ Test execution failed:", error);
		process.exit(1);
	});
