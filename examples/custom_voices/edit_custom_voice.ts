#!/usr/bin/env node
/**
 * Example: Edit Custom Voice
 *
 * This example demonstrates how to update a custom voice's name and description.
 */

import { Supertone } from "../../src/index.js";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

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

		// New metadata
		const timestamp = new Date().toLocaleString();
		const newName = `Updated Voice ${timestamp}`;
		const newDescription = `Voice updated at ${timestamp}`;

		console.log("✏️  Updating custom voice...");
		console.log(`   Voice ID: ${CUSTOM_VOICE_ID}`);
		console.log(`   New name: ${newName}`);
		console.log(`   New description: ${newDescription}`);

		// Edit custom voice
		const response = await client.customVoices.editCustomVoice({
			voiceId: CUSTOM_VOICE_ID,
			updateClonedVoiceRequest: {
				name: newName,
				description: newDescription,
			},
		});

		// Display results
		console.log("\n✅ Custom voice updated successfully!");
		console.log(`   Name: ${response.name}`);
		console.log(`   Description: ${response.description}`);

		console.log("\n💡 Verify changes:");
		console.log(`   npx tsx examples/custom_voices/get_custom_voice.ts`);
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();

