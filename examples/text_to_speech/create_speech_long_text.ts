#!/usr/bin/env node
/**
 * Example: TTS with Long Text (Auto-Chunking)
 *
 * This example demonstrates how the SDK automatically handles long text (300+ chars)
 * by chunking and merging audio seamlessly.
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

		// Long text (400+ characters)
		const longText = `
    Real-time streaming text-to-speech technology plays a crucial role in modern AI applications.
    It is an indispensable technology especially in conversational services, live broadcasting, and real-time translation services.
    Through the auto-chunking feature, long texts are naturally divided into multiple small segments for processing.
    Each segment is intelligently segmented considering sentence and word boundaries, enabling natural speech generation.
    Now users don't need to worry about text length, as the SDK automatically handles everything seamlessly.
    `.trim();

		console.log("🎤 Creating speech with auto-chunking...");
		console.log(`   Text length: ${longText.length} characters (exceeds 300)`);
		console.log(`   Voice ID: ${VOICE_ID}`);
		console.log("   ✨ SDK will automatically chunk and merge");
		console.log("   ⚠️  This will consume credits!");

		// Create speech - SDK handles chunking automatically
		const response = await client.textToSpeech.createSpeech({
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

		// Save the audio file
		if (response.result) {
			const outputFile = "output_long_text_speech.wav";

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

			console.log(`\n✅ Long text speech created successfully!`);
			console.log(`   💾 Saved to: ${outputFile}`);
			console.log(`   📊 File size: ${fs.statSync(outputFile).size} bytes`);
			console.log(`   🎯 Text was automatically chunked and audio merged!`);
		}
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();

