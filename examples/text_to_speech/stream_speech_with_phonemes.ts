#!/usr/bin/env node
/**
 * Example: Streaming TTS with Phoneme Information
 *
 * This example demonstrates streaming TTS with phoneme timing data.
 * Note: Phoneme data is returned as JSON, not in streaming format.
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
			"Hello world! This is a streaming test with phoneme timing information.";
		console.log("📡🔤 Starting streaming TTS with phonemes...");
		console.log(`   Text: "${text}"`);
		console.log(`   Voice ID: ${VOICE_ID}`);
		console.log(
			"   ℹ️  Note: Phoneme data comes as JSON, audio streams progressively"
		);
		console.log("   ⚠️  This will consume credits!");

		const startTime = Date.now();

		// Stream speech with phonemes
		const response = await client.textToSpeech.streamSpeech({
			voiceId: VOICE_ID,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: text,
				language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.En,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
				style: "neutral",
				model: "sona_speech_1",
				includePhonemes: true, // Request phoneme data
			},
		});

		const responseTime = Date.now() - startTime;
		console.log(`\n✅ Response received! (${responseTime}ms)`);

		// Process response
		if (response.result) {
			// Check if response contains phoneme data (JSON format)
			if (
				typeof response.result === "object" &&
				"audioBase64" in response.result
			) {
				console.log("   📦 Response includes both audio and phoneme data\n");

				const result = response.result as any;

				// Decode audio
				const audioBase64 = result.audioBase64;
				const binaryString = atob(audioBase64);
				const bytes = new Uint8Array(binaryString.length);
				for (let i = 0; i < binaryString.length; i++) {
					bytes[i] = binaryString.charCodeAt(i);
				}

				// Save audio
				const audioFile = "output_streamed_with_phonemes.wav";
				fs.writeFileSync(audioFile, bytes);
				console.log(`   💾 Audio saved to: ${audioFile}`);
				console.log(`   📊 Audio size: ${(bytes.length / 1024).toFixed(1)}KB`);

				// Display phoneme data
				if (result.phonemes) {
					const phonemes = result.phonemes;
					console.log(`\n📊 Phoneme Data:`);
					console.log(`   Symbols count: ${phonemes.symbols?.length || 0}`);
					console.log(
						`   Durations count: ${phonemes.durations_seconds?.length || 0}`
					);
					console.log(
						`   Start times count: ${phonemes.start_times_seconds?.length || 0}`
					);

					if (phonemes.symbols && phonemes.symbols.length > 0) {
						console.log(`\n   First 10 phonemes:`);
						for (let i = 0; i < Math.min(10, phonemes.symbols.length); i++) {
							const symbol = phonemes.symbols[i];
							const duration = phonemes.durations_seconds?.[i];
							const startTime = phonemes.start_times_seconds?.[i];
							console.log(
								`      [${i}] "${symbol}" - start: ${startTime?.toFixed(
									3
								)}s, duration: ${duration?.toFixed(3)}s`
							);
						}
					}

					// Save phoneme data
					const phonemeFile = "phoneme_data_streamed.json";
					fs.writeFileSync(phonemeFile, JSON.stringify(phonemes, null, 2));
					console.log(`\n   💾 Phoneme data saved to: ${phonemeFile}`);
				}
			} else if (
				typeof response.result === "object" &&
				"getReader" in response.result
			) {
				// Pure streaming (no phoneme data)
				console.log("   ⚠️  No phoneme data in response (pure streaming mode)");

				const reader = (
					response.result as ReadableStream<Uint8Array>
				).getReader();
				const chunks: Uint8Array[] = [];
				let chunkCount = 0;

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					if (value) {
						chunks.push(value);
						chunkCount++;
					}
				}

				const audioData = Buffer.concat(chunks);
				const audioFile = "output_streamed_no_phonemes.wav";
				fs.writeFileSync(audioFile, audioData);
				console.log(`   💾 Audio saved to: ${audioFile}`);
				console.log(`   📊 Received ${chunkCount} chunks`);
			}
		}

		const totalTime = Date.now() - startTime;
		console.log(`\n✅ Complete! (Total: ${totalTime}ms)`);
		console.log(`\n💡 Use cases for phoneme data:`);
		console.log(`   • Lip-sync animation`);
		console.log(`   • Subtitle generation`);
		console.log(`   • Speech analysis`);
		console.log(`   • Karaoke-style highlighting`);
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();

