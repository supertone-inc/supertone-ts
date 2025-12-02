#!/usr/bin/env node
/**
 * SDK Function Test Script (Dynamic Discovery Version)
 * Automatically detects and validates all SDK functionality without knowing function names.
 */

// @ts-expect-error - Node.js types will be available at runtime
const TEST_API_KEY = process.env.SUPERTONE_API_KEY || "your-api-key-here";
const TEST_VOICE_ID = "voice_emma_001";

/**
 * Parameter information interface
 */
interface ParameterInfo {
	name: string;
	type: string;
	required: boolean;
	hasDefault: boolean;
}

/**
 * Method signature information interface
 */
interface SignatureInfo {
	params: ParameterInfo[];
	requiredParams: string[];
	optionalParams: string[];
	paramCount: number;
	returnType: string;
	error?: string;
}

/**
 * Method information interface
 */
interface MethodInfo {
	name: string;
	client: string;
	signature: SignatureInfo;
	isAsync: boolean;
	docstringPreview?: string;
}

/**
 * Client methods discovery result interface
 */
interface ClientMethodsResult {
	successfulMethods: MethodInfo[];
	failedMethods: Array<{
		name: string;
		client: string;
		error: string;
		isAsync: boolean;
	}>;
	details: Record<string, MethodInfo>;
	totalMethods: number;
	successCount: number;
	failureCount: number;
}

/**
 * Model information interface
 */
interface ModelInfo {
	name: string;
	fields: string[];
	fieldCount: number;
}

/**
 * Enum information interface
 */
interface EnumInfo {
	name: string;
	values: string[];
	count: number;
}

/**
 * Analyze method signature
 */
function analyzeMethodSignature(obj: any, methodName: string): SignatureInfo {
	try {
		const method = obj[methodName];
		if (typeof method !== "function") {
			return {
				params: [],
				requiredParams: [],
				optionalParams: [],
				paramCount: 0,
				returnType: "Unknown",
				error: "Not a function",
			};
		}

		// Extract function signature from toString()
		const funcStr = method.toString();
		const params: ParameterInfo[] = [];
		const requiredParams: string[] = [];
		const optionalParams: string[] = [];

		// Try to parse parameters from function string
		const paramMatch = funcStr.match(/\(([^)]*)\)/);
		if (paramMatch && paramMatch[1]) {
			const paramStr = paramMatch[1];
			const paramList = paramStr.split(",").map((p) => p.trim());

			for (const param of paramList) {
				if (!param) continue;

				const paramName = param.split(":")[0]?.split("=")[0]?.trim();
				if (!paramName) continue;

				const hasDefault = param.includes("=") || param.includes("?");
				const isOptional = param.includes("?") || hasDefault;

				const paramInfo: ParameterInfo = {
					name: paramName,
					type: "any",
					required: !isOptional,
					hasDefault,
				};

				params.push(paramInfo);
				if (paramInfo.required) {
					requiredParams.push(paramName);
				} else {
					optionalParams.push(paramName);
				}
			}
		}

		// Determine return type
		const isAsync = method.constructor.name === "AsyncFunction";
		const returnType = isAsync ? "Promise<any>" : "any";

		return {
			params,
			requiredParams,
			optionalParams,
			paramCount: params.length,
			returnType,
		};
	} catch (e) {
		return {
			params: [],
			requiredParams: [],
			optionalParams: [],
			paramCount: 0,
			returnType: "Unknown",
			error: String(e),
		};
	}
}

/**
 * Discover all public methods of client object
 */
function discoverClientMethods(
	clientObj: any,
	clientName: string
): ClientMethodsResult {
	if (!clientObj) {
		return {
			successfulMethods: [],
			failedMethods: [],
			details: {},
			totalMethods: 0,
			successCount: 0,
			failureCount: 0,
		};
	}

	const excludedMethods = new Set([
		"constructor",
		"do_request",
		"do_request_async",
		"sdk_configuration",
	]);

	// Get prototype methods
	const proto = Object.getPrototypeOf(clientObj);
	const methods = Object.getOwnPropertyNames(proto).filter(
		(name) =>
			!name.startsWith("_") &&
			typeof clientObj[name] === "function" &&
			!excludedMethods.has(name)
	);

	const methodDetails: Record<string, MethodInfo> = {};
	const successfulMethods: MethodInfo[] = [];
	const failedMethods: Array<{
		name: string;
		client: string;
		error: string;
		isAsync: boolean;
	}> = [];

	for (const methodName of methods) {
		try {
			const method = clientObj[methodName];
			const isAsync =
				method.constructor.name === "AsyncFunction" ||
				methodName.includes("async");

			// Analyze signature
			const signatureInfo = analyzeMethodSignature(clientObj, methodName);

			const methodInfo: MethodInfo = {
				name: methodName,
				client: clientName,
				signature: signatureInfo,
				isAsync,
			};

			successfulMethods.push(methodInfo);
			methodDetails[methodName] = methodInfo;
		} catch (e) {
			failedMethods.push({
				name: methodName,
				client: clientName,
				error: String(e),
				isAsync: methodName.includes("async"),
			});
		}
	}

	return {
		successfulMethods,
		failedMethods,
		details: methodDetails,
		totalMethods: methods.length,
		successCount: successfulMethods.length,
		failureCount: failedMethods.length,
	};
}

/**
 * Dynamic SDK structure discovery test
 */
async function testDynamicSdkDiscovery(): Promise<
	Record<string, ClientMethodsResult>
> {
	console.log("🔍 SDK Structure Dynamic Discovery Test Start");

	try {
		const { Supertone } = await import("../src/index.js");
		const client = new Supertone({ apiKey: TEST_API_KEY });

		console.log("  📋 Detecting available clients:");

		// Client mappings
		const clientMappings: Record<string, string> = {
			textToSpeech: "TTS",
			voices: "Voices",
			customVoices: "Custom Voices",
			usage: "Usage",
		};

		const allMethods: Record<string, ClientMethodsResult> = {};
		let totalMethodsFound = 0;
		let totalSuccess = 0;
		let totalFailures = 0;

		for (const [attrName, displayName] of Object.entries(clientMappings)) {
			const clientObj = (client as any)[attrName];
			if (!clientObj) continue;

			console.log(`    🔍 Analyzing ${displayName} (${attrName}) client...`);

			const methodsInfo = discoverClientMethods(clientObj, attrName);
			allMethods[attrName] = methodsInfo;

			totalMethodsFound += methodsInfo.totalMethods;
			totalSuccess += methodsInfo.successCount;
			totalFailures += methodsInfo.failureCount;

			console.log(`      ✅ ${methodsInfo.successCount} methods successful`);
			if (methodsInfo.failureCount > 0) {
				console.log(`      ❌ ${methodsInfo.failureCount} methods failed`);
			}

			// List successful methods
			if (methodsInfo.successfulMethods.length > 0) {
				const methodNames = methodsInfo.successfulMethods.map((m) => m.name);
				console.log(`        📂 Methods: ${methodNames.join(", ")}`);
			}
		}

		console.log(`\n  📊 Overall Detection Results:`);
		console.log(`    🎯 Total methods: ${totalMethodsFound}`);
		console.log(`    ✅ Analysis successful: ${totalSuccess}`);
		console.log(`    ❌ Analysis failed: ${totalFailures}`);

		return allMethods;
	} catch (e) {
		console.error(`  ❌ Dynamic discovery failed: ${e}`);
		return {};
	}
}

/**
 * Test signatures of detected methods
 */
function testMethodSignatures(
	methodsData: Record<string, ClientMethodsResult>
) {
	console.log("📝 Method Signature Validation Test Start");

	try {
		const signatureResults = {
			totalMethods: 0,
			validSignatures: 0,
			invalidSignatures: 0,
			methodsWithRequiredParams: 0,
			asyncMethods: 0,
			clients: {} as Record<string, any>,
		};

		const clientDisplayNames: Record<string, string> = {
			textToSpeech: "TTS",
			voices: "Voices",
			customVoices: "Custom Voices",
			usage: "Usage",
		};

		for (const [clientName, clientData] of Object.entries(methodsData)) {
			const displayName = clientDisplayNames[clientName] || clientName;
			console.log(`  📋 ${displayName} Method Signature Validation:`);

			const clientStats = {
				total: 0,
				valid: 0,
				invalid: 0,
				async: 0,
				withRequiredParams: 0,
			};

			// Validate successful methods
			for (const methodInfo of clientData.successfulMethods) {
				const { name: methodName, signature, isAsync } = methodInfo;

				clientStats.total++;
				signatureResults.totalMethods++;

				if (signature.error) {
					console.log(`    ❌ ${methodName}: ${signature.error}`);
					signatureResults.invalidSignatures++;
					clientStats.invalid++;
				} else {
					console.log(`    ✅ ${methodName}:`);
					console.log(
						`      📥 Required parameters (${
							signature.requiredParams.length
						}): ${signature.requiredParams.join(", ") || "none"}`
					);
					console.log(
						`      📤 Optional parameters (${
							signature.optionalParams.length
						}): ${signature.optionalParams.join(", ") || "none"}`
					);

					signatureResults.validSignatures++;
					clientStats.valid++;

					if (signature.requiredParams.length > 0) {
						signatureResults.methodsWithRequiredParams++;
						clientStats.withRequiredParams++;
					}

					if (isAsync) {
						signatureResults.asyncMethods++;
						clientStats.async++;
					}
				}
			}

			// Count failed methods
			for (const failedMethod of clientData.failedMethods) {
				console.log(
					`    ❌ ${failedMethod.name}: Method access failed - ${failedMethod.error}`
				);
				signatureResults.invalidSignatures++;
				clientStats.invalid++;
				clientStats.total++;
				signatureResults.totalMethods++;
			}

			signatureResults.clients[clientName] = clientStats;
		}

		// Results summary
		console.log(`\n  📊 Signature Validation Final Results:`);
		console.log(`    🎯 Total methods: ${signatureResults.totalMethods}`);
		console.log(`    ✅ Valid signatures: ${signatureResults.validSignatures}`);
		console.log(
			`    ❌ Invalid signatures: ${signatureResults.invalidSignatures}`
		);
		console.log(`    ⚡ Async methods: ${signatureResults.asyncMethods}`);
		console.log(
			`    📋 Methods with required params: ${signatureResults.methodsWithRequiredParams}`
		);

		// Calculate success rate
		if (signatureResults.totalMethods > 0) {
			const successRate =
				(signatureResults.validSignatures / signatureResults.totalMethods) *
				100;
			console.log(`    📈 Overall success rate: ${successRate.toFixed(1)}%`);
		}

		return signatureResults;
	} catch (e) {
		console.error(`  ❌ Signature validation failed: ${e}`);
		return null;
	}
}

/**
 * Models dynamic discovery test
 */
async function testModelsDiscovery() {
	console.log("📦 Models Dynamic Discovery Test Start");

	try {
		const models = await import("../src/models/index.js");

		const modelClasses: ModelInfo[] = [];
		const enums: EnumInfo[] = [];
		const otherObjects: Array<{ name: string; type: string }> = [];

		for (const name of Object.keys(models)) {
			if (name.startsWith("_")) continue;

			try {
				const obj = (models as any)[name];

				// Check if it's a class/type
				if (typeof obj === "function" || typeof obj === "object") {
					// Simple classification
					const typeName = typeof obj;

					if (typeName === "object" && obj !== null) {
						// Might be an enum
						const keys = Object.keys(obj);
						if (keys.length > 0) {
							enums.push({
								name,
								values: keys,
								count: keys.length,
							});
						}
					} else {
						otherObjects.push({
							name,
							type: typeName,
						});
					}
				}
			} catch (e) {
				otherObjects.push({
					name,
					type: `Error: ${String(e)}`,
				});
			}
		}

		console.log(`  📊 Models Detection Results:`);
		console.log(`    📋 Model classes: ${modelClasses.length}`);
		console.log(`    🔢 Enum classes: ${enums.length}`);
		console.log(`    📦 Other objects: ${otherObjects.length}`);

		if (enums.length > 0) {
			console.log(`\n  🔢 Enum Classes:`);
			for (const enumInfo of enums.slice(0, 10)) {
				console.log(`    ✅ ${enumInfo.name}: ${enumInfo.count} values`);
				console.log(
					`      Values: ${enumInfo.values.slice(0, 5).join(", ")}${
						enumInfo.count > 5 ? "..." : ""
					}`
				);
			}
		}

		return {
			models: modelClasses,
			enums,
			others: otherObjects,
			totalModels: modelClasses.length,
			totalEnums: enums.length,
			totalOthers: otherObjects.length,
		};
	} catch (e) {
		console.error(`  ❌ Models discovery failed: ${e}`);
		return null;
	}
}

/**
 * Comprehensive functionality test
 */
async function testComprehensiveFunctionality(): Promise<boolean> {
	console.log("🧪 Comprehensive Functionality Test Start");

	// 1. Dynamic SDK discovery
	console.log("\n" + "=".repeat(50));
	const methodsData = await testDynamicSdkDiscovery();

	if (Object.keys(methodsData).length === 0) {
		console.log("❌ SDK discovery failed, stopping comprehensive test");
		return false;
	}

	// 2. Signature validation
	console.log("\n" + "=".repeat(50));
	const signatureResults = testMethodSignatures(methodsData);

	// 3. Models discovery
	console.log("\n" + "=".repeat(50));
	const modelsData = await testModelsDiscovery();

	// 4. Results summary
	console.log("\n" + "=".repeat(50));
	console.log("🎉 Comprehensive Test Complete!");

	// Calculate statistics
	const totalClients = Object.keys(methodsData).length;
	const totalMethods = Object.values(methodsData).reduce(
		(sum, data) => sum + data.totalMethods,
		0
	);
	const successfulMethods = Object.values(methodsData).reduce(
		(sum, data) => sum + data.successCount,
		0
	);

	console.log(`\n📊 Final Statistics:`);
	console.log(`  🏗️  Clients: ${totalClients}`);
	console.log(`  ⚙️  Total methods: ${totalMethods}`);
	console.log(`  ✅ Successfully analyzed methods: ${successfulMethods}`);

	if (modelsData) {
		console.log(`  📋 Model classes: ${modelsData.totalModels}`);
		console.log(`  🔢 Enum classes: ${modelsData.totalEnums}`);
	}

	if (signatureResults && signatureResults.totalMethods > 0) {
		const successRate =
			(signatureResults.validSignatures / signatureResults.totalMethods) * 100;
		console.log(`  📈 Overall success rate: ${successRate.toFixed(1)}%`);
		console.log(`  ⚡ Async methods: ${signatureResults.asyncMethods}`);
	}

	// Detailed statistics by client
	console.log(`\n📋 Details by Client:`);
	const clientNames: Record<string, string> = {
		textToSpeech: "TTS",
		voices: "Voices",
		customVoices: "Custom Voices",
		usage: "Usage",
	};

	for (const [clientKey, clientData] of Object.entries(methodsData)) {
		const displayName = clientNames[clientKey] || clientKey;
		console.log(`  🔸 ${displayName}: ${clientData.successCount} methods`);
	}

	return true;
}

/**
 * Main test execution
 */
async function main(): Promise<boolean> {
	console.log("🧪 SDK Dynamic Analysis Test Start");
	console.log("=".repeat(60));
	console.log(
		"💡 Excluding only specific internal methods (do_request, sdk_configuration)"
	);
	console.log("   All other SDK features are automatically detected!");
	console.log("=".repeat(60));

	try {
		const success = await testComprehensiveFunctionality();

		if (success) {
			console.log("\n🎉 All dynamic analysis tests complete!");
		} else {
			console.log("⚠️  Some tests failed. Please check the issues.");
		}

		return success;
	} catch (e) {
		console.error(`❌ Error occurred during test execution: ${e}`);
		return false;
	}
}

// Run tests
main()
	.then((success) => {
		// @ts-expect-error - Node.js types will be available at runtime
		process.exit(success ? 0 : 1);
	})
	.catch((error) => {
		console.error("❌ Test execution failed:", error);
		// @ts-expect-error - Node.js types will be available at runtime
		process.exit(1);
	});
