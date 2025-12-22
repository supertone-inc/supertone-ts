#!/usr/bin/env node
/**
 * Behavior tests for applyPronunciationDictionary().
 *
 * Run:
 *   npx ts-node custom_test/test_pronunciation_dictionary.ts
 *   # or after build:
 *   node dist/custom_test/test_pronunciation_dictionary.js
 */

import {
	applyPronunciationDictionary,
	PronunciationDictionaryValidationError,
	type PronunciationDictionaryEntry,
} from "../src/lib/custom_utils/pronunciation_utils.js";

function assertEqual(actual: string, expected: string, message: string): void {
	if (actual !== expected) {
		throw new Error(`${message}\nexpected=${expected}\nactual=${actual}`);
	}
}

function assertThrows(fn: () => void, message: string): void {
	let threw = false;
	try {
		fn();
	} catch (e) {
		threw = true;
		if (!(e instanceof PronunciationDictionaryValidationError)) {
			throw new Error(`${message}\nexpected PronunciationDictionaryValidationError`);
		}
	}
	if (!threw) {
		throw new Error(`${message}\nexpected to throw`);
	}
}

function runTests(): void {
	const d = (entries: PronunciationDictionaryEntry[]) => entries;

	assertEqual(applyPronunciationDictionary("hello", undefined), "hello", "none returns original");
	assertEqual(applyPronunciationDictionary("hello", []), "hello", "empty returns original");

	assertEqual(
		applyPronunciationDictionary("This is Supertone.", d([{ text: "Supertone", pronunciation: "super tone", partial_match: false }])),
		"This is super tone.",
		"basic exact match"
	);

	assertEqual(
		applyPronunciationDictionary("K-TTS is different from TTSAPI.", d([{ text: "TTS", pronunciation: "text to speech", partial_match: true }])),
		"K-text to speech is different from text to speechAPI.",
		"partial match substrings"
	);

	assertEqual(
		applyPronunciationDictionary("TTS and TTS and TTS.", d([{ text: "TTS", pronunciation: "text to speech", partial_match: true }])),
		"text to speech and text to speech and text to speech.",
		"multiple occurrences"
	);

	assertEqual(
		applyPronunciationDictionary('He said, "Supertone", (Supertone)!', d([{ text: "Supertone", pronunciation: "super tone", partial_match: false }])),
		'He said, "super tone", (super tone)!',
		"punctuation boundaries"
	);

	assertEqual(
		applyPronunciationDictionary("API_test API test_API", d([{ text: "API", pronunciation: "A P I", partial_match: false }])),
		"API_test A P I test_API",
		"word boundary underscore"
	);

	assertEqual(
		applyPronunciationDictionary("C++ is old, C++11 is newer.", d([{ text: "C++", pronunciation: "cplusplus", partial_match: false }])),
		"cplusplus is old, C++11 is newer.",
		"numbers break boundary"
	);

	assertEqual(
		applyPronunciationDictionary("a(b)c a(b)c", d([{ text: "a(b)c", pronunciation: "X", partial_match: true }])),
		"X X",
		"regex meta chars"
	);

	assertEqual(
		applyPronunciationDictionary("aaaa", d([{ text: "aa", pronunciation: "b", partial_match: true }])),
		"bb",
		"non-overlapping left-to-right"
	);

	assertEqual(
		applyPronunciationDictionary("AAAA", d([
			{ text: "AA", pronunciation: "B", partial_match: true },
			{ text: "A", pronunciation: "C", partial_match: true },
		])),
		"BB",
		"order priority AA then A"
	);

	assertEqual(
		applyPronunciationDictionary("AAAA", d([
			{ text: "A", pronunciation: "C", partial_match: true },
			{ text: "AA", pronunciation: "B", partial_match: true },
		])),
		"CCCC",
		"order priority A then AA"
	);

	assertEqual(
		applyPronunciationDictionary("NY is not New Jersey.", d([
			{ text: "NY", pronunciation: "New York", partial_match: false },
			{ text: "New", pronunciation: "Old", partial_match: false },
		])),
		"New York is not Old Jersey.",
		"no resubstitution inside pronunciation"
	);

	assertEqual(
		applyPronunciationDictionary("이번 APEC 은 한국에서 열립니다", d([
			{ text: "AP", pronunciation: "에이피", partial_match: true },
			{ text: "APEC", pronunciation: "에이팩", partial_match: true },
		])),
		"이번 에이피EC 은 한국에서 열립니다",
		"order AP then APEC"
	);

	assertEqual(
		applyPronunciationDictionary("이번 APEC 은 한국에서 열립니다", d([
			{ text: "APEC", pronunciation: "에이팩", partial_match: true },
			{ text: "AP", pronunciation: "에이피", partial_match: true },
		])),
		"이번 에이팩 은 한국에서 열립니다",
		"order APEC then AP"
	);

	assertEqual(
		applyPronunciationDictionary("Supertone tone", d([
			{ text: "Supertone", pronunciation: "super tone", partial_match: false },
			{ text: "tone", pronunciation: "TONE", partial_match: false },
		])),
		"super tone TONE",
		"no resubstitution across rules"
	);

	assertEqual(
		applyPronunciationDictionary("TTS와 TTSAPI는 다릅니다.", d([{ text: "TTS", pronunciation: "text to speech", partial_match: true }])),
		"text to speech와 text to speechAPI는 다릅니다.",
		"Korean partial match"
	);

	assertEqual(
		applyPronunciationDictionary("東京TTS東京", d([{ text: "TTS", pronunciation: "text to speech", partial_match: false }])),
		"東京TTS東京",
		"no boundary in Japanese exact"
	);

	assertEqual(
		applyPronunciationDictionary("これは「TTS」です。", d([{ text: "TTS", pronunciation: "text to speech", partial_match: false }])),
		"これは「text to speech」です。",
		"boundary by punctuation Japanese"
	);

	assertEqual(
		applyPronunciationDictionary("東京TTS東京", d([{ text: "TTS", pronunciation: "text to speech", partial_match: true }])),
		"東京text to speech東京",
		"partial match Japanese"
	);

	assertEqual(
		applyPronunciationDictionary(`X \uE000PD0\uE001 Supertone`, d([{ text: "Supertone", pronunciation: "super tone", partial_match: false }])),
		`X \uE000PD0\uE001 super tone`,
		"token collision safe"
	);

	assertEqual(
		applyPronunciationDictionary("TTS와 TTS.", d([{ text: "TTS", pronunciation: "text to speech", partial_match: false }])),
		"TTS와 text to speech.",
		"unicode boundary note"
	);

	assertThrows(
		() => applyPronunciationDictionary("hi", {} as any),
		"validation: dictionary must be array"
	);

	assertThrows(
		() => applyPronunciationDictionary("hi", ["not-an-object"] as any),
		"validation: entry must be object"
	);

	assertThrows(
		() => applyPronunciationDictionary("hi", [{ text: 1, pronunciation: "b", partial_match: true }] as any),
		"validation: text type"
	);

	assertThrows(
		() => applyPronunciationDictionary("hi", [{ text: "a", pronunciation: 1, partial_match: true }] as any),
		"validation: pronunciation type"
	);

	assertThrows(
		() => applyPronunciationDictionary("hi", [{ text: "a", pronunciation: "b" }] as any),
		"validation: missing partial_match"
	);

	assertThrows(
		() => applyPronunciationDictionary("hi", [{ text: "a", pronunciation: "b", partial_match: "true" }] as any),
		"validation: partial_match type"
	);

	assertThrows(
		() => applyPronunciationDictionary("hi", [{ text: "", pronunciation: "b", partial_match: true }] as any),
		"validation: empty text"
	);

	assertThrows(
		() => applyPronunciationDictionary("hi", [{ text: "a", pronunciation: "", partial_match: true }] as any),
		"validation: empty pronunciation"
	);

	console.log("OK: applyPronunciationDictionary tests passed");
}

runTests();


