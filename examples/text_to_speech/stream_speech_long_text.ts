#!/usr/bin/env node
/**
 * Example: Streaming TTS with Long Text (Auto-Chunking)
 *
 * This example demonstrates streaming TTS with long text (300+ chars).
 * The SDK automatically chunks the text and streams audio sequentially.
 * ⚠️ This consumes API credits!
 */

import { Supertone } from "../../src/index.js";
import * as models from "../../src/models/index.js";
import * as fs from "fs";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const API_KEY = process.env.SUPERTONE_API_KEY;
const VOICE_ID = process.env.VOICE_ID || "your-voice-id-here";

async function main() {
	if (!API_KEY) {
		console.error("❌ SUPERTONE_API_KEY not found in .env file");
		process.exit(1);
	}

	if (VOICE_ID === "your-voice-id-here") {
		console.error("❌ Please set VOICE_ID in .env or run list_voices.ts first");
		process.exit(1);
	}

	try {
		// Initialize the client
		const client = new Supertone({ apiKey: API_KEY });

		// Long text (450+ characters)
		const longText = `
    Real-time streaming text-to-speech technology plays a crucial role in modern AI applications.
    It is an indispensable technology especially in conversational services, live broadcasting, and real-time translation services.
    Through the auto-chunking feature, long texts are naturally divided into multiple small segments for processing.
    Each segment is intelligently segmented considering sentence and word boundaries, enabling natural speech generation.
    The SDK handles all complexity automatically, so users can focus on building great applications.
    `.trim();

		console.log("📡 Starting long text streaming TTS...");
		console.log(`   Text length: ${longText.length} characters (exceeds 300)`);
		console.log(`   Voice ID: ${VOICE_ID}`);
		console.log("   ✨ SDK automatically chunks and streams sequentially");
		console.log("   ⚠️  This will consume credits!");

		const startTime = Date.now();

		// Stream speech - SDK handles chunking automatically
		const response = await client.textToSpeech.streamSpeech({
			voiceId: VOICE_ID,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: longText,
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
				style: "neutral",
				model: "sona_speech_1",
			},
		});

		const responseTime = Date.now() - startTime;
		console.log(`\n✅ Stream started! (${responseTime}ms to first response)`);
		console.log("   📦 Receiving audio chunks progressively...\n");

		// Process streaming response
		if (
			response.result &&
			typeof response.result === "object" &&
			"getReader" in response.result
		) {
			const reader = (
				response.result as ReadableStream<Uint8Array>
			).getReader();
			const chunks: Uint8Array[] = [];
			let chunkCount = 0;
			let totalBytes = 0;
			let firstChunkTime = 0;

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				if (value) {
					if (chunkCount === 0) {
						firstChunkTime = Date.now() - startTime;
						console.log(
							`   ⚡ First audio chunk received! (${firstChunkTime}ms total latency)`
						);
					}

					chunks.push(value);
					chunkCount++;
					totalBytes += value.length;

					// Show progress
					if (chunkCount % 10 === 0) {
						console.log(
							`   📦 Received ${chunkCount} chunks, ${(
								totalBytes / 1024
							).toFixed(1)}KB`
						);
					}
				}
			}

			// Save complete audio
			const audioData = Buffer.concat(chunks);
			const outputFile = "output_long_text_streamed.wav";
			fs.writeFileSync(outputFile, audioData);

			const totalTime = Date.now() - startTime;
			console.log(`\n✅ Streaming complete!`);
			console.log(`   💾 Saved to: ${outputFile}`);
			console.log(`   📊 Statistics:`);
			console.log(`      Total chunks: ${chunkCount}`);
			console.log(`      Total size: ${(totalBytes / 1024).toFixed(1)}KB`);
			console.log(`      Total time: ${totalTime}ms`);
			console.log(`      First chunk latency: ${firstChunkTime}ms`);
			console.log(
				`\n🎯 Long text was automatically chunked and streamed seamlessly!`
			);
		}
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();

