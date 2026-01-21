# GetCustomVoiceListResponse

## Example Usage

```typescript
import { GetCustomVoiceListResponse } from "@supertone/supertone/models";

let value: GetCustomVoiceListResponse = {
  items: [
    {
      voiceId: "voice_123456789",
      name: "My Custom Voice",
      description: "A warm and friendly voice for customer service",
    },
  ],
  total: 25,
  nextPageToken: "10",
};
```

## Fields

| Field                                                                                                                       | Type                                                                                                                        | Required                                                                                                                    | Description                                                                                                                 | Example                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `items`                                                                                                                     | [models.GetCustomVoiceResponse](../models/getcustomvoiceresponse.md)[]                                                      | :heavy_check_mark:                                                                                                          | List of custom voice items                                                                                                  |                                                                                                                             |
| `total`                                                                                                                     | *number*                                                                                                                    | :heavy_check_mark:                                                                                                          | Total number of available custom voices                                                                                     | 25                                                                                                                          |
| `nextPageToken`                                                                                                             | *string*                                                                                                                    | :heavy_minus_sign:                                                                                                          | Token for fetching the next page of results. A valid non-negative integer string (e.g., "10", "20"). Null if no more pages. | 10                                                                                                                          |