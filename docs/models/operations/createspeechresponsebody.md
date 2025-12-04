# CreateSpeechResponseBody

JSON response with base64 audio and phoneme data (when include_phonemes=true)

## Example Usage

```typescript
import { CreateSpeechResponseBody } from "@supertone/supertone/models/operations";

let value: CreateSpeechResponseBody = {
  audioBase64:
    "UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhY...",
  phonemes: {
    symbols: [
      "",
      "h",
      "ɐ",
      "ɡ",
      "ʌ",
      "",
    ],
    startTimesSeconds: [
      0,
      0.092,
      0.197,
      0.255,
      0.29,
      0.58,
    ],
    durationsSeconds: [
      0.092,
      0.104,
      0.058,
      0.034,
      0.29,
      0.162,
    ],
  },
};
```

## Fields

| Field                                                             | Type                                                              | Required                                                          | Description                                                       | Example                                                           |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| `audioBase64`                                                     | *string*                                                          | :heavy_check_mark:                                                | Base64 encoded audio data                                         | UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhY... |
| `phonemes`                                                        | [operations.Phonemes](../../models/operations/phonemes.md)        | :heavy_minus_sign:                                                | Phoneme timing data with IPA symbols                              |                                                                   |