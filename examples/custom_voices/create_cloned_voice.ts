#!/usr/bin/env node
/**
 * Example: Create Custom Cloned Voice
 *
 * This example demonstrates how to create a custom voice from an audio sample.
 * ⚠️ This consumes API credits and creates a permanent custom voice!
 */

import { Supertone } from "@supertone/supertone";
import * as fs from "fs";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// For resolving relative file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.SUPERTONE_API_KEY;

// Audio file path (adjust to your file)
const AUDIO_FILE = process.env.AUDIO_FILE || "voice_sample.wav";

async function main() {
	if (!API_KEY) {
		console.error("❌ SUPERTONE_API_KEY not found in .env file");
		process.exit(1);
	}

	// Check if audio file exists
	const audioFilePath = path.join(__dirname, AUDIO_FILE);
	if (!fs.existsSync(audioFilePath)) {
		console.error(`❌ Audio file not found: ${audioFilePath}`);
		console.error("\n💡 Tips:");
		console.error("   1. Place your audio file in examples/custom_voices/");
		console.error("   2. Or set AUDIO_FILE=path/to/file.wav in .env");
		console.error("   3. File should be WAV format, < 3MB, 10-60 seconds");
		process.exit(1);
	}

	try {
		// Initialize the client
		const client = new Supertone({ apiKey: API_KEY });

		// Check file size
		const stats = fs.statSync(audioFilePath);
		const fileSize = stats.size;
		const maxSize = 3 * 1024 * 1024; // 3MB

		console.log("🎨 Creating custom cloned voice...");
		console.log(`   Audio file: ${audioFilePath}`);
		console.log(`   File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

		if (fileSize > maxSize) {
			console.error(
				`❌ File exceeds 3MB limit: ${(fileSize / 1024 / 1024).toFixed(2)} MB`
			);
			process.exit(1);
		}

		// Prepare voice metadata
		const timestamp = new Date()
			.toISOString()
			.replace(/[:.]/g, "-")
			.slice(0, 19);
		const voiceName = `My Custom Voice ${timestamp}`;
		const voiceDescription = `Custom voice created from ${AUDIO_FILE} at ${new Date().toLocaleString()}`;

		console.log(`   Name: ${voiceName}`);
		console.log(`   Description: ${voiceDescription}`);
		console.log("   ⚠️  This will consume credits and create a custom voice!");

		// Read audio file
		const audioContent = fs.readFileSync(audioFilePath);

		// Create cloned voice
		const response = await client.customVoices.createClonedVoice({
			files: {
				fileName: path.basename(audioFilePath),
				content: audioContent,
			},
			name: voiceName,
			description: voiceDescription,
		});

		// Display result
		console.log("\n✅ Custom voice created successfully!");
		console.log(`   Voice ID: ${response.voiceId}`);
		console.log(`   Name: ${response.name}`);
		console.log(`   Description: ${response.description}`);

		console.log("\n💡 Next steps:");
		console.log(`   1. Use this voice ID in TTS: ${response.voiceId}`);
		console.log(
			`   2. Test with: npx tsx examples/text_to_speech/create_speech.ts`
		);
		console.log(`   3. Set in .env: VOICE_ID=${response.voiceId}`);
		console.log("\n⚠️  Remember: Custom voices persist until you delete them!");
	} catch (error: any) {
		console.error("❌ Error:", error.message);

		if (error.message.includes("file")) {
			console.error("\n💡 Audio file requirements:");
			console.error("   - Format: WAV (recommended)");
			console.error("   - Size: < 3MB");
			console.error("   - Duration: 10-60 seconds");
			console.error("   - Quality: Clear, single speaker");
		}

		process.exit(1);
	}
}

main();
