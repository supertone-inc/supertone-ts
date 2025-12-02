#!/usr/bin/env node
/**
 * Example: Search Voices
 *
 * This example demonstrates how to search for voices by language and gender.
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

		console.log("🔍 Searching for female English voices...");

		// Search voices
		const response = await client.voices.searchVoices({
			language: "en",
			gender: "female",
			pageSize: 10,
		});

		// Display results
		console.log("\n✅ Search Results:");
		console.log(`   Found: ${response.items?.length || 0} voices`);

		if (response.items && response.items.length > 0) {
			console.log("\n🎤 Matching Voices:");
			for (const voice of response.items) {
				console.log(`\n   ${voice.name}`);
				console.log(`      ID: ${voice.voiceId}`);
				console.log(`      Language: ${voice.language}`);
				console.log(`      Gender: ${voice.gender}`);
			}
		} else {
			console.log("\n📝 No voices found matching the criteria");
		}
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();

