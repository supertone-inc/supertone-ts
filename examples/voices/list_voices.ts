#!/usr/bin/env node
/**
 * Example: List Available Voices
 *
 * This example demonstrates how to list all available voices.
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

		console.log("🎵 Fetching voice list...");

		// List voices (first page, 10 items)
		const response = await client.voices.listVoices({ pageSize: 10 });

		// Display results
		console.log("\n✅ Voice List Retrieved:");
		console.log(`   Total voices: ${response.total}`);
		console.log(`   Showing: ${response.items?.length || 0} voices`);

		if (response.items && response.items.length > 0) {
			console.log("\n🎤 Available Voices:");
			for (const voice of response.items) {
				console.log(`\n   ${voice.name}`);
				console.log(`      ID: ${voice.voiceId}`);
				console.log(`      Language: ${voice.language}`);
				console.log(`      Gender: ${voice.gender}`);
				if (voice.description) {
					console.log(
						`      Description: ${voice.description.substring(0, 60)}...`
					);
				}
			}

			// Save first voice ID for potential use in other examples
			const firstVoiceId = response.items[0]?.voiceId;
			if (firstVoiceId) {
				console.log(`\n💡 Tip: Use voice ID "${firstVoiceId}" in TTS examples`);
			}
		}
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();

