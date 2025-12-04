#!/usr/bin/env node
/**
 * Example: Get Custom Voice Details
 *
 * This example demonstrates how to retrieve detailed information about a custom voice.
 */

import { Supertone } from "@supertone/supertone";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const API_KEY = process.env.SUPERTONE_API_KEY;
const CUSTOM_VOICE_ID =
	process.env.CUSTOM_VOICE_ID || "your-custom-voice-id-here";

async function main() {
	if (!API_KEY) {
		console.error("❌ SUPERTONE_API_KEY not found in .env file");
		process.exit(1);
	}

	if (CUSTOM_VOICE_ID === "your-custom-voice-id-here") {
		console.error("❌ Please set CUSTOM_VOICE_ID in .env");
		console.error("   Run list_custom_voices.ts to get voice IDs");
		process.exit(1);
	}

	try {
		// Initialize the client
		const client = new Supertone({ apiKey: API_KEY });

		console.log(`🔍 Fetching custom voice details...`);
		console.log(`   Voice ID: ${CUSTOM_VOICE_ID}`);

		// Get custom voice details
		const response = await client.customVoices.getCustomVoice({
			voiceId: CUSTOM_VOICE_ID,
		});

		// Display results
		console.log("\n✅ Custom Voice Details:");
		console.log(`   Name: ${response.name}`);
		console.log(`   ID: ${response.voiceId}`);
		console.log(`   Description: ${response.description || "No description"}`);

		console.log("\n💡 Use this voice in TTS examples:");
		console.log(
			`   VOICE_ID=${response.voiceId} npx tsx examples/text_to_speech/create_speech.ts`
		);
	} catch (error: any) {
		console.error("❌ Error:", error.message);

		if (error.message.includes("404") || error.message.includes("not found")) {
			console.error("\n💡 Voice ID not found. Try:");
			console.error("   npx tsx examples/custom_voices/list_custom_voices.ts");
		}

		process.exit(1);
	}
}

main();
