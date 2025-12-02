#!/usr/bin/env node
/**
 * Example: TTS with Phoneme Information
 *
 * This example demonstrates how to get phoneme timing data along with audio.
 * Useful for lip-sync animation, subtitles, and speech analysis.
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

		const text = "Hello world! This is a phoneme timing test.";
		console.log("🔤 Creating speech with phoneme data...");
		console.log(`   Text: "${text}"`);
		console.log(`   Voice ID: ${VOICE_ID}`);
		console.log("   ⚠️  This will consume credits!");

		// Create speech with phonemes
		const response = await client.textToSpeech.createSpeech({
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

		// Handle response with phonemes
		if (response.result) {
			if (
				typeof response.result === "object" &&
				"audioBase64" in response.result
			) {
				// Response includes both audio and phonemes
				const result = response.result as any;

				// Decode and save audio
				const audioBase64 = result.audioBase64;
				const binaryString = atob(audioBase64);
				const bytes = new Uint8Array(binaryString.length);
				for (let i = 0; i < binaryString.length; i++) {
					bytes[i] = binaryString.charCodeAt(i);
				}

				const audioFile = "output_with_phonemes.wav";
				fs.writeFileSync(audioFile, bytes);
				console.log(`\n✅ Speech with phonemes created!`);
				console.log(`   💾 Audio saved to: ${audioFile}`);

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

					// Save phoneme data to JSON
					const phonemeFile = "phoneme_data.json";
					fs.writeFileSync(phonemeFile, JSON.stringify(phonemes, null, 2));
					console.log(`\n   💾 Phoneme data saved to: ${phonemeFile}`);
				}
			}
		}
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();

