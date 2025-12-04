#!/usr/bin/env node
/**
 * Example: Predict TTS Duration
 *
 * This example demonstrates how to predict audio duration without generating audio.
 * Useful for resource planning and UI pre-calculations.
 */

import { Supertone } from "@supertone/supertone";
import * as models from "@supertone/supertone/models";
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
			"Hello! This is a test message for duration prediction. How long will this take?";
		console.log("⏱️  Predicting TTS duration...");
		console.log(`   Text: "${text}"`);
		console.log(`   Voice ID: ${VOICE_ID}`);

		// Predict duration
		const response = await client.textToSpeech.predictDuration({
			voiceId: VOICE_ID,
			predictTTSDurationUsingCharacterRequest: {
				text: text,
				language: models.PredictTTSDurationUsingCharacterRequestLanguage.En,
			},
		});

		// Display result
		console.log(`\n✅ Prediction complete!`);
		console.log(`   📊 Estimated duration: ${response.duration} seconds`);
		console.log(`   💡 This did NOT consume TTS credits (prediction only)`);

		// Calculate additional info
		const minutes = Math.floor(response.duration / 60);
		const seconds = (response.duration % 60).toFixed(1);
		console.log(`   📊 Formatted: ${minutes}m ${seconds}s`);
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();

