#!/usr/bin/env node
/**
 * Smoke test for multilingual sentence punctuation splitting in chunkText().
 *
 * Run:
 *   npx ts-node custom_test/test_text_utils_chunk_text_punctuation.ts
 *   # or after build:
 *   node dist/custom_test/test_text_utils_chunk_text_punctuation.js
 */

import { chunkText } from "../src/lib/custom_utils/text_utils.js";

function assertSplits(
	text: string,
	expectedChunks: string[],
	maxLength: number
): void {
	const got = chunkText(text, maxLength);
	const passed = JSON.stringify(got) === JSON.stringify(expectedChunks);

	if (!passed) {
		throw new Error(
			`\ntext=${JSON.stringify(text)}\nexpected=${JSON.stringify(expectedChunks)}\ngot=${JSON.stringify(got)}`
		);
	}
}

function main(): void {
	// English / many EU languages
	assertSplits("Hello. World!", ["Hello. ", "World!"], 8);

	// Korean (mostly ASCII punctuation in practice, plus ellipsis)
	assertSplits("안...반가… 네.", ["안...", "반가… ", "네."], 4);

	// Japanese
	assertSplits(
		"こんにちは。元気ですか？はい！",
		["こんにちは。", "元気ですか？", "はい！"],
		6
	);

	// Arabic (short samples to avoid max_length merge issues)
	assertSplits("مر؟ نعم۔", ["مر؟ ", "نعم۔"], 5);

	// Hindi
	assertSplits("हाँ। नहीं॥", ["हाँ। ", "नहीं॥"], 6);

	// Greek question mark (U+037E)
	assertSplits("Γεια;Καλά.", ["Γεια;", "Καλά."], 5);

	console.log("OK: chunkText punctuation smoke test passed");
}

main();

