#!/usr/bin/env node
/**
 * Example: Get Voice Usage Statistics
 *
 * This example demonstrates how to retrieve per-voice usage statistics.
 */

import { Supertone } from "@supertone/supertone";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const API_KEY = process.env.SUPERTONE_API_KEY;

async function main() {
	if (!API_KEY) {
		console.error("❌ SUPERTONE_API_KEY not found in .env file");
		process.exit(1);
	}

	try {
		// Initialize the client
		const client = new Supertone({ apiKey: API_KEY });

		// Set date range (last 7 days)
		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

		console.log("🎤 Fetching voice usage statistics...");
		console.log(
			`   Period: ${startDate.toISOString().split("T")[0]} to ${
				endDate.toISOString().split("T")[0]
			}`
		);

		// Get voice usage
		const response = await client.usage.getVoiceUsage({
			startDate: startDate.toISOString().split("T")[0],
			endDate: endDate.toISOString().split("T")[0],
		});

		// Display results
		console.log("\n✅ Voice Usage Retrieved:");
		console.log(`   Total voices used: ${response.usages?.length || 0}`);

		if (response.usages && response.usages.length > 0) {
			console.log("\n🎤 Top Voices:");
			for (const usage of response.usages.slice(0, 5)) {
				const voiceName =
					usage.name || `Voice ${usage.voiceId?.substring(0, 8)}`;
				console.log(`   ${voiceName}`);
				console.log(
					`      Usage: ${usage.totalMinutesUsed?.toFixed(2)} minutes`
				);
				console.log(`      ID: ${usage.voiceId}`);
				if (usage.language) {
					console.log(`      Language: ${usage.language}`);
				}
			}
		} else {
			console.log("\n📝 No voice usage records for this period");
		}
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();
