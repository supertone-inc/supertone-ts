# Phonemes

Phoneme timing data with IPA symbols

## Example Usage

```typescript
import { Phonemes } from "@supertone/supertone/models/operations";

let value: Phonemes = {
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
};
```

## Fields

| Field                                       | Type                                        | Required                                    | Description                                 | Example                                     |
| ------------------------------------------- | ------------------------------------------- | ------------------------------------------- | ------------------------------------------- | ------------------------------------------- |
| `symbols`                                   | *string*[]                                  | :heavy_minus_sign:                          | List of IPA phonetic symbols                | [<br/>"",<br/>"h",<br/>"ɐ",<br/>"ɡ",<br/>"ʌ",<br/>""<br/>] |
| `startTimesSeconds`                         | *number*[]                                  | :heavy_minus_sign:                          | Start times for each phoneme in seconds     | [<br/>0,<br/>0.092,<br/>0.197,<br/>0.255,<br/>0.29,<br/>0.58<br/>] |
| `durationsSeconds`                          | *number*[]                                  | :heavy_minus_sign:                          | Duration for each phoneme in seconds        | [<br/>0.092,<br/>0.104,<br/>0.058,<br/>0.034,<br/>0.29,<br/>0.162<br/>] |