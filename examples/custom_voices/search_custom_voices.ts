#!/usr/bin/env node
/**
 * Example: Search Custom Voices
 *
 * This example demonstrates how to search for custom voices by name.
 */

import { Supertone } from "@supertone/supertone";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const API_KEY = process.env.SUPERTONE_API_KEY;

// Search query (can be partial name)
const SEARCH_QUERY = process.env.SEARCH_QUERY || "Custom";

async function main() {
	if (!API_KEY) {
		console.error("❌ SUPERTONE_API_KEY not found in .env file");
		process.exit(1);
	}

	try {
		// Initialize the client
		const client = new Supertone({ apiKey: API_KEY });

		console.log(`🔍 Searching for custom voices...`);
		console.log(`   Query: "${SEARCH_QUERY}"`);

		// Search custom voices
		const response = await client.customVoices.searchCustomVoices({
			name: SEARCH_QUERY,
			pageSize: 10,
		});

		// Display results
		console.log("\n✅ Search Results:");
		console.log(`   Found: ${response.items?.length || 0} matching voices`);

		if (response.items && response.items.length > 0) {
			console.log("\n🎤 Matching Custom Voices:");
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
				console.log(`\n💡 Use this voice:`);
				console.log(
					`   CUSTOM_VOICE_ID=${firstVoiceId} npx tsx examples/custom_voices/get_custom_voice.ts`
				);
			}
		} else {
			console.log("\n📝 No custom voices found matching the query");
			console.log(`   💡 Try different search terms or create a new voice`);
		}

		console.log(`\n💡 Tip: Change search query with:`);
		console.log(
			`   SEARCH_QUERY="your-query" npx tsx examples/custom_voices/search_custom_voices.ts`
		);
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();

