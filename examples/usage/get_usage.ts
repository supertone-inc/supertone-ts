#!/usr/bin/env node
/**
 * Example: Get Usage Analytics
 *
 * This example demonstrates how to retrieve usage analytics for a time period.
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

		// Set time period (last 7 days)
		const endTime = new Date();
		const startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000);

		console.log("📊 Fetching usage analytics...");
		console.log(
			`   Period: ${startTime.toISOString().split("T")[0]} to ${
				endTime.toISOString().split("T")[0]
			}`
		);

		// Get usage data
		const response = await client.usage.getUsage({
			startTime: startTime.toISOString(),
			endTime: endTime.toISOString(),
		});

		// Display results
		console.log("\n✅ Usage Data Retrieved:");
		console.log(`   Total buckets: ${response.total}`);
		console.log(`   Data buckets: ${response.data?.length || 0}`);

		if (response.data && response.data.length > 0) {
			console.log("\n📅 Recent Usage:");
			for (const bucket of response.data.slice(0, 3)) {
				console.log(`   ${bucket.startingAt} - ${bucket.endingAt}`);
				if (bucket.results) {
					const totalMinutes = bucket.results.reduce(
						(sum, r) => sum + (r.minutesUsed || 0),
						0
					);
					console.log(`      Usage: ${totalMinutes.toFixed(2)} minutes`);
				}
			}
		} else {
			console.log("\n📝 No usage records for this period");
		}
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();

