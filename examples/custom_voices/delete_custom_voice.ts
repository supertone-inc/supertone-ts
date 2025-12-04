#!/usr/bin/env node
/**
 * Example: Delete Custom Voice
 *
 * This example demonstrates how to permanently delete a custom voice.
 * ⚠️ This action cannot be undone!
 */

import { Supertone } from "@supertone/supertone";
import * as dotenv from "dotenv";
import * as readline from "readline";

// Load environment variables
dotenv.config();

const API_KEY = process.env.SUPERTONE_API_KEY;
const CUSTOM_VOICE_ID =
	process.env.CUSTOM_VOICE_ID || "your-custom-voice-id-here";

// Helper function to get user confirmation
function askConfirmation(question: string): Promise<boolean> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			rl.close();
			resolve(answer.toLowerCase() === "yes" || answer.toLowerCase() === "y");
		});
	});
}

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

		// Get voice details first
		console.log("🔍 Fetching voice details before deletion...");
		const voice = await client.customVoices.getCustomVoice({
			voiceId: CUSTOM_VOICE_ID,
		});

		console.log(`\n⚠️  You are about to DELETE this custom voice:`);
		console.log(`   Name: ${voice.name}`);
		console.log(`   ID: ${voice.voiceId}`);
		console.log(`   Description: ${voice.description || "No description"}`);
		console.log(`\n⚠️  This action CANNOT be undone!`);

		// Ask for confirmation
		const confirmed = await askConfirmation(
			"\n   Type 'yes' to confirm deletion: "
		);

		if (!confirmed) {
			console.log("\n❌ Deletion cancelled");
			process.exit(0);
		}

		// Delete custom voice
		console.log("\n🗑️  Deleting custom voice...");
		await client.customVoices.deleteCustomVoice({ voiceId: CUSTOM_VOICE_ID });

		console.log("\n✅ Custom voice deleted successfully!");
		console.log(`   Deleted voice ID: ${CUSTOM_VOICE_ID}`);

		console.log("\n💡 Verify deletion:");
		console.log(`   npx tsx examples/custom_voices/list_custom_voices.ts`);
	} catch (error: any) {
		console.error("❌ Error:", error.message);

		if (error.message.includes("404") || error.message.includes("not found")) {
			console.error("\n💡 Voice might already be deleted or ID is incorrect");
		}

		process.exit(1);
	}
}

main();
