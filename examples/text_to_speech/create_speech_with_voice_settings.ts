#!/usr/bin/env node
/**
 * Example: TTS with Custom Voice Settings
 *
 * This example demonstrates how to adjust pitch, speed, and variance.
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
			"Hello world! This is a voice settings test. You can hear the adjusted pitch and speed.";

		// Custom voice settings
		const voiceSettings = {
			pitchShift: 0.95, // Lower pitch (0.5 to 1.5)
			pitchVariance: 1.1, // More variation (0.5 to 1.5)
			speed: 0.9, // Slower speed (0.5 to 2.0)
		};

		console.log("🎛️  Creating speech with custom voice settings...");
		console.log(`   Text: "${text}"`);
		console.log(`   Voice ID: ${VOICE_ID}`);
		console.log(`   Settings:`);
		console.log(`      Pitch shift: ${voiceSettings.pitchShift}`);
		console.log(`      Pitch variance: ${voiceSettings.pitchVariance}`);
		console.log(`      Speed: ${voiceSettings.speed}`);
		console.log("   ⚠️  This will consume credits!");

		// Create speech with voice settings
		const response = await client.textToSpeech.createSpeech({
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

		// Save the audio file
		if (response.result) {
			const outputFile = "output_with_voice_settings.wav";

			// Handle ReadableStream response
			if (
				typeof response.result === "object" &&
				"getReader" in response.result
			) {
				const reader = (
					response.result as ReadableStream<Uint8Array>
				).getReader();
				const chunks: Uint8Array[] = [];

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					if (value) chunks.push(value);
				}

				const audioData = Buffer.concat(chunks);
				fs.writeFileSync(outputFile, audioData);
			}

			console.log(`\n✅ Speech with voice settings created!`);
			console.log(`   💾 Saved to: ${outputFile}`);
			console.log(`   📊 File size: ${fs.statSync(outputFile).size} bytes`);
			console.log(`   🎯 Listen to hear the customized voice!`);
		}
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();
