#!/usr/bin/env node
/**
 * Example: Get Voice Details
 *
 * This example demonstrates how to get detailed information about a specific voice.
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

// Replace with an actual voice ID (get it from list_voices.ts)
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

		console.log(`🔍 Fetching voice details for ID: ${VOICE_ID}...`);

		// Get voice details
		const response = await client.voices.getVoice({ voiceId: VOICE_ID });

		// Display results
		console.log("\n✅ Voice Details:");
		console.log(`   Name: ${response.name}`);
		console.log(`   ID: ${response.voiceId}`);
		console.log(`   Language: ${response.language}`);
		console.log(`   Gender: ${response.gender}`);
		if (response.description) {
			console.log(`   Description: ${response.description}`);
		}
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();

