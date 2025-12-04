#!/usr/bin/env node
/**
 * Example: Basic Text-to-Speech Conversion
 *
 * This example demonstrates how to convert text to speech and save it as an audio file.
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

		const text = "Hello! This is a test of the Supertone text-to-speech API.";
		console.log("🎤 Creating speech...");
		console.log(`   Text: "${text}"`);
		console.log(`   Voice ID: ${VOICE_ID}`);
		console.log(`   Format: WAV`);
		console.log("   ⚠️ This will consume credits!");

		// Create speech
		const response = await client.textToSpeech.createSpeech({
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

		// Save the audio file
		if (response.result) {
			const outputFile = "output_speech.wav";

			// Handle different response types
			if (response.result instanceof Uint8Array) {
				fs.writeFileSync(outputFile, response.result);
			} else if (
				typeof response.result === "object" &&
				"getReader" in response.result
			) {
				// ReadableStream
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

			console.log(`\n✅ Speech created successfully!`);
			console.log(`   💾 Saved to: ${outputFile}`);
			console.log(`   📊 File size: ${fs.statSync(outputFile).size} bytes`);
		}
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();
