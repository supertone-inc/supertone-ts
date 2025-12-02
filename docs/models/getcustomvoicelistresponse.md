# GetCustomVoiceListResponse

## Example Usage

```typescript
import { GetCustomVoiceListResponse } from "supertone/models";

let value: GetCustomVoiceListResponse = {
  items: [
    {
      voiceId: "<id>",
      name: "<value>",
      description: "redress noxious given mortally wry idolized via ouch very",
    },
  ],
  total: 25,
  nextPageToken: "10",
};
```

## Fields

| Field                                                                                                                       | Type                                                                                                                        | Required                                                                                                                    | Description                                                                                                                 | Example                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `items`                                                                                                                     | [models.GetCustomVoiceResponseData](../models/getcustomvoiceresponsedata.md)[]                                              | :heavy_check_mark:                                                                                                          | List of custom voice items                                                                                                  |                                                                                                                             |
| `total`                                                                                                                     | *number*                                                                                                                    | :heavy_check_mark:                                                                                                          | Total number of available custom voices                                                                                     | 25                                                                                                                          |
| `nextPageToken`                                                                                                             | *string*                                                                                                                    | :heavy_minus_sign:                                                                                                          | Token for fetching the next page of results. A valid non-negative integer string (e.g., "10", "20"). Null if no more pages. | 10                                                                                                                          |