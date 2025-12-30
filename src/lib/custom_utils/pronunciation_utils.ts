/**
 * Pronunciation dictionary substitution utilities.
 *
 * Mirrors the Python implementation policy:
 * - Apply rules in input order
 * - partial_match=false: word-boundary exact matches only
 * - partial_match=true: substring matches (no boundaries)
 * - No re-substitution: replaced segments are shielded via opaque tokens
 *
 * Validation:
 * - pronunciation_dictionary omitted/undefined/null -> return original text
 * - pronunciation_dictionary must be an array of objects
 * - each object must have: text (string, non-empty), pronunciation (string, non-empty), partial_match (boolean)
 */

export class PronunciationDictionaryValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PronunciationDictionaryValidationError";
  }
}

export type PronunciationDictionaryEntry = {
  text: string;
  pronunciation: string;
  partial_match: boolean;
};

export function applyPronunciationDictionary(
  text: string,
  pronunciation_dictionary?: unknown
): string {
  // Match Python behavior: return early for null, undefined, or empty array
  if (
    pronunciation_dictionary == null ||
    (Array.isArray(pronunciation_dictionary) &&
      pronunciation_dictionary.length === 0)
  ) {
    return text;
  }

  if (typeof text !== "string") {
    throw new PronunciationDictionaryValidationError(
      `\`text\` must be string, got ${typeof text}`
    );
  }

  if (!Array.isArray(pronunciation_dictionary)) {
    throw new PronunciationDictionaryValidationError(
      "`pronunciation_dictionary` must be an array of objects"
    );
  }

  // Prevent re-substitution:
  // replace matches with unique opaque tokens first,
  // then expand tokens to pronunciations at the end.
  const tokenToPronunciation = new Map<string, string>();
  let working = text;

  for (let idx = 0; idx < pronunciation_dictionary.length; idx++) {
    const entry = validateEntry(pronunciation_dictionary[idx], idx);
    const src = entry.text;
    const dst = entry.pronunciation;
    const partial = entry.partial_match;

    const token = makeUniqueToken(idx, working, tokenToPronunciation);

    if (partial) {
      const re = new RegExp(escapeRegExp(src), "g");
      const newWorking = working.replace(re, token);
      if (newWorking === working) continue; // No match found
      tokenToPronunciation.set(token, dst);
      working = newWorking;
      continue;
    }

    // Exact match with word-boundary semantics (Unicode-aware-ish).
    // Python uses Unicode \w; in JS, \w is ASCII-only. To mirror behavior better across scripts,
    // we define "word char" as: letter or number or underscore.
    //
    // We avoid lookbehind for broader runtime compatibility by capturing the left boundary.
    //
    // Pattern: (^|[^WORD_CHARS]) (SRC) (?=[^WORD_CHARS]|$)
    // (IMPORTANT) WORD_CHARS must not include surrounding [] because we embed it into other [].
    const WORD_CHARS = "\\p{L}\\p{N}_";
    const srcEsc = escapeRegExp(src);
    const pattern = `(^|[^${WORD_CHARS}])(${srcEsc})(?=[^${WORD_CHARS}]|$)`;
    const re = new RegExp(pattern, "gu");

    // Replace keeping the left boundary (group 1)
    const newWorking = working.replace(re, `$1${token}`);
    if (newWorking === working) continue; // No match found
    tokenToPronunciation.set(token, dst);
    working = newWorking;
  }

  // Expand tokens into pronunciations.
  for (const [token, pron] of tokenToPronunciation.entries()) {
    working = working.split(token).join(pron);
  }

  return working;
}

function validateEntry(raw: unknown, idx: number): PronunciationDictionaryEntry {
  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new PronunciationDictionaryValidationError(
      `pronunciation_dictionary[${idx}] must be an object, got ${
        raw === null ? "null" : Array.isArray(raw) ? "array" : typeof raw
      }`
    );
  }

  const obj = raw as Record<string, unknown>;
  const missing: string[] = [];
  if (!("text" in obj)) missing.push("text");
  if (!("pronunciation" in obj)) missing.push("pronunciation");
  if (!("partial_match" in obj)) missing.push("partial_match");
  if (missing.length) {
    throw new PronunciationDictionaryValidationError(
      `pronunciation_dictionary[${idx}] missing required field(s): ${missing.join(", ")}`
    );
  }

  const src = obj["text"];
  const dst = obj["pronunciation"];
  const partial = obj["partial_match"];

  if (typeof src !== "string") {
    throw new PronunciationDictionaryValidationError(
      `pronunciation_dictionary[${idx}].text must be string, got ${typeof src}`
    );
  }
  if (typeof dst !== "string") {
    throw new PronunciationDictionaryValidationError(
      `pronunciation_dictionary[${idx}].pronunciation must be string, got ${typeof dst}`
    );
  }
  if (typeof partial !== "boolean") {
    throw new PronunciationDictionaryValidationError(
      `pronunciation_dictionary[${idx}].partial_match must be boolean, got ${typeof partial}`
    );
  }

  if (src === "") {
    throw new PronunciationDictionaryValidationError(
      `pronunciation_dictionary[${idx}].text must not be empty`
    );
  }
  if (dst === "") {
    throw new PronunciationDictionaryValidationError(
      `pronunciation_dictionary[${idx}].pronunciation must not be empty`
    );
  }

  return { text: src, pronunciation: dst, partial_match: partial };
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function makeUniqueToken(
  idx: number,
  working: string,
  existing: Map<string, string>
): string {
  // Private Use Area markers to minimize collision with typical text.
  const base = `\uE000PD${idx}\uE001`;
  if (!working.includes(base) && !existing.has(base)) return base;

  while (true) {
    const suffix = safeRandomHex();
    const token = `\uE000PD${idx}_${suffix}\uE001`;
    if (!working.includes(token) && !existing.has(token)) return token;
  }
}

function safeRandomHex(): string {
  // Prefer crypto.randomUUID when available (browser / modern runtimes)
  const c = (globalThis as any).crypto;
  if (c && typeof c.randomUUID === "function") {
    return String(c.randomUUID()).replace(/-/g, "");
  }
  // Fallback: not cryptographically strong, but fine for uniqueness tokenization.
  return (
    Math.random().toString(16).slice(2) +
    Math.random().toString(16).slice(2) +
    Date.now().toString(16)
  );
}


