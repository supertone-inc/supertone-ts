#!/usr/bin/env node
/**
 * Example: Streaming TTS with Custom Voice Settings
 *
 * This example demonstrates streaming TTS with custom pitch, speed, and variance.
 * Useful for creating varied voice outputs in real-time applications.
 * ⚠️ This consumes API credits!
 */

import { Supertone } from "@supertone/supertone";
import * as models from "@supertone/supertone/models";
import * as fs from "fs";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

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
			"Hello! This is a streaming test with custom voice settings. Notice the adjusted pitch and speed.";

		// Custom voice settings
		const voiceSettings = {
			pitchShift: 1.15, // Higher pitch (0.5 to 1.5)
			pitchVariance: 0.9, // Less variation (0.5 to 1.5)
			speed: 1.2, // Faster speed (0.5 to 2.0)
		};

		console.log("📡🎛️  Starting streaming TTS with voice settings...");
		console.log(`   Text: "${text}"`);
		console.log(`   Voice ID: ${VOICE_ID}`);
		console.log(`   Settings:`);
		console.log(`      Pitch shift: ${voiceSettings.pitchShift}`);
		console.log(`      Pitch variance: ${voiceSettings.pitchVariance}`);
		console.log(`      Speed: ${voiceSettings.speed}`);
		console.log("   ⚠️  This will consume credits!");

		const startTime = Date.now();

		// Stream speech with voice settings
		const response = await client.textToSpeech.streamSpeech({
			voiceId: VOICE_ID,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: text,
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
				style: "neutral",
				model: "sona_speech_1",
				voiceSettings: voiceSettings, // Apply custom settings
			},
		});

		const responseTime = Date.now() - startTime;
		console.log(`\n✅ Stream started! (${responseTime}ms to first response)`);
		console.log("   📦 Receiving audio chunks with customized voice...\n");

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
					if (chunkCount % 5 === 0) {
						console.log(
							`   📦 Chunk ${chunkCount}: ${(totalBytes / 1024).toFixed(
								1
							)}KB received`
						);
					}
				}
			}

			// Save complete audio
			const audioData = Buffer.concat(chunks);
			const outputFile = "output_streamed_with_voice_settings.wav";
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
				`\n🎯 Listen to hear the customized voice with adjusted settings!`
			);

			console.log(`\n💡 Voice Settings Use Cases:`);
			console.log(`   • Character voices (high/low pitch)`);
			console.log(`   • Emotional expression (variance)`);
			console.log(`   • Accessibility (speed adjustment)`);
			console.log(`   • Audio book narration (pacing)`);
		}
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();

