# GetUsageResponseV1Data

## Example Usage

```typescript
import { GetUsageResponseV1Data } from "supertone/models";

let value: GetUsageResponseV1Data = {
  date: "2024-12-14",
  voiceId: "<id>",
  totalMinutesUsed: 7322.85,
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `date`                                                                         | *string*                                                                       | :heavy_check_mark:                                                             | The date of the API usage in YYYY-MM-DD format.                                |
| `voiceId`                                                                      | *string*                                                                       | :heavy_check_mark:                                                             | The unique identifier for the voice used in the API call.                      |
| `name`                                                                         | *string*                                                                       | :heavy_minus_sign:                                                             | The name of the voice used in the API call.                                    |
| `style`                                                                        | *string*                                                                       | :heavy_minus_sign:                                                             | The style of the voice used in the API call.                                   |
| `language`                                                                     | *string*                                                                       | :heavy_minus_sign:                                                             | The language of the voice used in the API call.                                |
| `totalMinutesUsed`                                                             | *number*                                                                       | :heavy_check_mark:                                                             | The total duration (in minutes) of API usage for the specified voice and date. |
| `model`                                                                        | *string*                                                                       | :heavy_minus_sign:                                                             | The model name used for text-to-speech.                                        |
| `thumbnailUrl`                                                                 | *string*                                                                       | :heavy_minus_sign:                                                             | The URL to the thumbnail image for the voice.                                  |