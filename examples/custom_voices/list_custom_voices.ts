#!/usr/bin/env node
/**
 * Example: List Custom Voices
 *
 * This example demonstrates how to list your custom cloned voices.
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

async function main() {
	if (!API_KEY) {
		console.error("❌ SUPERTONE_API_KEY not found in .env file");
		process.exit(1);
	}

	try {
		// Initialize the client
		const client = new Supertone({ apiKey: API_KEY });

		console.log("🎨 Fetching custom voice list...");

		// List custom voices
		const response = await client.customVoices.listCustomVoices({
			pageSize: 10,
		});

		// Display results
		console.log("\n✅ Custom Voice List Retrieved:");
		console.log(`   Total custom voices: ${response.total}`);
		console.log(`   Showing: ${response.items?.length || 0} voices`);

		if (response.items && response.items.length > 0) {
			console.log("\n🎤 Your Custom Voices:");
			for (const voice of response.items) {
				console.log(`\n   ${voice.name}`);
				console.log(`      ID: ${voice.voiceId}`);
				console.log(
					`      Description: ${voice.description || "No description"}`
				);
			}

			// Save first voice ID for use in other examples
			const firstVoiceId = response.items[0]?.voiceId;
			if (firstVoiceId) {
				console.log(
					`\n💡 Tip: Use custom voice ID "${firstVoiceId}" in TTS examples`
				);
			}
		} else {
			console.log("\n📝 No custom voices found");
			console.log("   💡 Create a custom voice using create_cloned_voice.ts");
		}
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();

