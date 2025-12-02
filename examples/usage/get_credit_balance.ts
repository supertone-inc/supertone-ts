#!/usr/bin/env node
/**
 * Example: Get Credit Balance
 *
 * This example demonstrates how to check your remaining credit balance.
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

		// Get credit balance
		console.log("💰 Fetching credit balance...");
		const response = await client.usage.getCreditBalance();

		// Display results
		console.log("\n✅ Credit Balance Retrieved:");
		console.log(`   Balance: ${response.balance} credits`);

		if (response.balance < 100) {
			console.log("\n⚠️  Low credit balance! Consider topping up.");
		}
	} catch (error: any) {
		console.error("❌ Error:", error.message);
		process.exit(1);
	}
}

main();

