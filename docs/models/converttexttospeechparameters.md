# ConvertTextToSpeechParameters

## Example Usage

```typescript
import { ConvertTextToSpeechParameters } from "supertone/models";

let value: ConvertTextToSpeechParameters = {};
```

## Fields

| Field                                          | Type                                           | Required                                       | Description                                    |
| ---------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| `pitchShift`                                   | *number*                                       | :heavy_minus_sign:                             | N/A                                            |
| `pitchVariance`                                | *number*                                       | :heavy_minus_sign:                             | N/A                                            |
| `speed`                                        | *number*                                       | :heavy_minus_sign:                             | N/A                                            |
| `duration`                                     | *number*                                       | :heavy_minus_sign:                             | Duration parameter for TTS generation          |
| `similarity`                                   | *number*                                       | :heavy_minus_sign:                             | Similarity parameter for voice matching        |
| `textGuidance`                                 | *number*                                       | :heavy_minus_sign:                             | Text guidance parameter for generation control |
| `subharmonicAmplitudeControl`                  | *number*                                       | :heavy_minus_sign:                             | Subharmonic amplitude control parameter        |