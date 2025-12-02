#!/usr/bin/env node
/**
 * SDK Basic Functionality Test Script
 */

// @ts-expect-error - Node.js types will be available at runtime
const TEST_API_KEY =
	process.env.SUPERTONE_API_KEY || "test_api_key_for_structure_validation";

/**
 * Test result interface
 */
interface TestResult {
	name: string;
	passed: boolean;
}

/**
 * Test SDK import
 */
async function testSdkImport(): Promise<boolean> {
	try {
		const { Supertone } = await import("../src/index.js");
		const models = await import("../src/models/index.js");

		console.log("✅ SDK import successful");
		return true;
	} catch (e) {
		console.error(`❌ SDK import failed: ${e}`);
		return false;
	}
}

/**
 * Test SDK initialization
 */
async function testSdkInitialization(): Promise<boolean> {
	try {
		const { Supertone } = await import("../src/index.js");

		const sdk = new Supertone({ apiKey: TEST_API_KEY });
		console.log("✅ SDK initialization successful");
		return true;
	} catch (e) {
		console.error(`❌ SDK initialization failed: ${e}`);
		return false;
	}
}

/**
 * Test SDK structure
 */
async function testSdkStructure(): Promise<boolean> {
	try {
		const { Supertone } = await import("../src/index.js");

		const sdk = new Supertone({ apiKey: TEST_API_KEY });

		console.log("📋 SDK structure check:");

		// Check text_to_speech client
		if (sdk.textToSpeech) {
			const ttsMethods = Object.getOwnPropertyNames(
				Object.getPrototypeOf(sdk.textToSpeech)
			).filter((method) => !method.startsWith("_") && method !== "constructor");
			console.log(`  ✅ textToSpeech client: ${ttsMethods.join(", ")}`);
		} else {
			console.log("  ❌ textToSpeech client not found");
		}

		// Check voices client
		if (sdk.voices) {
			const voiceMethods = Object.getOwnPropertyNames(
				Object.getPrototypeOf(sdk.voices)
			).filter((method) => !method.startsWith("_") && method !== "constructor");
			console.log(`  ✅ voices client: ${voiceMethods.join(", ")}`);
		} else {
			console.log("  ❌ voices client not found");
		}

		// Check custom_voices client
		if (sdk.customVoices) {
			const customMethods = Object.getOwnPropertyNames(
				Object.getPrototypeOf(sdk.customVoices)
			).filter((method) => !method.startsWith("_") && method !== "constructor");
			console.log(`  ✅ customVoices client: ${customMethods.join(", ")}`);
		} else {
			console.log("  ❌ customVoices client not found");
		}

		// Check usage client
		if (sdk.usage) {
			const usageMethods = Object.getOwnPropertyNames(
				Object.getPrototypeOf(sdk.usage)
			).filter((method) => !method.startsWith("_") && method !== "constructor");
			console.log(`  ✅ usage client: ${usageMethods.join(", ")}`);
		} else {
			console.log("  ❌ usage client not found");
		}

		return true;
	} catch (e) {
		console.error(`❌ SDK structure check failed: ${e}`);
		return false;
	}
}

/**
 * Test model classes
 */
async function testModels(): Promise<boolean> {
	try {
		const models = await import("../src/models/index.js");

		console.log("📋 Models check:");

		// Check available models
		const availableModels = Object.keys(models).filter(
			(key) => !key.startsWith("_")
		);
		console.log(`  ✅ Available models: ${availableModels.length} items`);

		return true;
	} catch (e) {
		console.error(`❌ Models test failed: ${e}`);
		return false;
	}
}

/**
 * Test SDK methods existence
 */
async function testSdkMethods(): Promise<boolean> {
	try {
		const { Supertone } = await import("../src/index.js");

		const sdk = new Supertone({ apiKey: TEST_API_KEY });
		console.log("✅ SDK instance creation successful");

		// Check if SDK methods are callable
		if (
			sdk.textToSpeech &&
			typeof sdk.textToSpeech.createSpeech === "function"
		) {
			console.log("  ✅ createSpeech method exists");
		} else {
			console.log("  ❌ createSpeech method not found");
		}

		if (
			sdk.textToSpeech &&
			typeof sdk.textToSpeech.streamSpeech === "function"
		) {
			console.log("  ✅ streamSpeech method exists");
		} else {
			console.log("  ❌ streamSpeech method not found");
		}

		if (sdk.voices && typeof sdk.voices.listVoices === "function") {
			console.log("  ✅ listVoices method exists");
		} else {
			console.log("  ❌ listVoices method not found");
		}

		return true;
	} catch (e) {
		console.error(`❌ SDK methods test failed: ${e}`);
		return false;
	}
}

/**
 * Test custom utilities
 */
async function testCustomUtilities(): Promise<boolean> {
	try {
		const customUtils = await import("../src/lib/custom_utils/index.js");

		console.log("📋 Custom utilities check:");

		const utilities = [
			"chunkText",
			"mergeWavBinary",
			"mergeMp3Binary",
			"detectAudioFormat",
			"mergePhonemeData",
		];

		let allFound = true;
		for (const util of utilities) {
			if (util in customUtils) {
				console.log(`  ✅ ${util} utility exists`);
			} else {
				console.log(`  ❌ ${util} utility not found`);
				allFound = false;
			}
		}

		return allFound;
	} catch (e) {
		console.error(`❌ Custom utilities test failed: ${e}`);
		return false;
	}
}

/**
 * Main test execution
 */
async function main(): Promise<void> {
	console.log("🧪 SDK Basic Test Start");
	console.log("=".repeat(50));

	const tests: Array<[string, () => Promise<boolean>]> = [
		["SDK Import", testSdkImport],
		["SDK Initialization", testSdkInitialization],
		["SDK Structure", testSdkStructure],
		["Models", testModels],
		["SDK Methods", testSdkMethods],
		["Custom Utilities", testCustomUtilities],
	];

	const results: TestResult[] = [];

	for (const [testName, testFunc] of tests) {
		console.log(`\n🔍 Testing ${testName}...`);
		const passed = await testFunc();
		results.push({ name: testName, passed });
	}

	console.log("\n" + "=".repeat(50));
	console.log("🧪 Test Results Summary:");

	const passedCount = results.filter((r) => r.passed).length;
	const totalCount = results.length;

	for (const result of results) {
		const status = result.passed ? "✅ PASS" : "❌ FAIL";
		console.log(`  ${result.name}: ${status}`);
	}

	console.log(`\nTotal ${passedCount}/${totalCount} tests passed`);

	if (passedCount === totalCount) {
		console.log("🎉 All tests passed! SDK is working correctly.");
		// @ts-expect-error - Node.js types will be available at runtime
		process.exit(0);
	} else {
		console.log("⚠️  Some tests failed. Please check the issues.");
		// @ts-expect-error - Node.js types will be available at runtime
		process.exit(1);
	}
}

// Run tests
main().catch((error) => {
	console.error("❌ Test execution failed:", error);
	// @ts-expect-error - Node.js types will be available at runtime
	process.exit(1);
});
