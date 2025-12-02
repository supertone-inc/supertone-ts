#!/usr/bin/env node
/**
 * Example: Streaming Text-to-Speech
 *
 * This example demonstrates real-time streaming TTS for progressive playback.
 * Useful for real-time applications where you want audio to start immediately.
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

		const text =
			"This is a streaming test. Audio chunks arrive progressively for real-time playback.";
		console.log("📡 Starting streaming TTS...");
		console.log(`   Text: "${text}"`);
		console.log(`   Voice ID: ${VOICE_ID}`);
		console.log("   ⚠️  This will consume credits!");

		// Stream speech
		const response = await client.textToSpeech.streamSpeech({
			voiceId: VOICE_ID,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: text,
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
				style: "neutral",
				model: "sona_speech_1",
			},
		});

		console.log("\n✅ Stream started!");
		console.log("   📦 Receiving audio chunks...\n");

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

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				if (value) {
					chunks.push(value);
					chunkCount++;
					totalBytes += value.length;

					// Show progress (every 5 chunks or last chunk)
					if (chunkCount % 5 === 0 || done) {
						console.log(
							`   📦 Chunk ${chunkCount}: ${value.length} bytes (total: ${totalBytes} bytes)`
						);
					}
				}
			}

			// Save complete audio
			const audioData = Buffer.concat(chunks);
			const outputFile = "output_streamed_speech.wav";
			fs.writeFileSync(outputFile, audioData);

			console.log(`\n✅ Streaming complete!`);
			console.log(`   💾 Saved to: ${outputFile}`);
			console.log(`   📊 Total chunks: ${chunkCount}`);
			console.log(`   📊 Total size: ${totalBytes} bytes`);
			console.log(
				`\n💡 Tip: In a real application, play chunks as they arrive for real-time audio!`
			);
		}
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();

