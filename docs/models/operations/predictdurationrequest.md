# PredictDurationRequest

## Example Usage

```typescript
import { PredictDurationRequest } from "@supertone/supertone/models/operations";

let value: PredictDurationRequest = {
  voiceId: "<id>",
  predictTTSDurationRequest: {
    text: "<value>",
    language: "nl",
  },
};
```

## Fields

| Field                                                                         | Type                                                                          | Required                                                                      | Description                                                                   |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `voiceId`                                                                     | *string*                                                                      | :heavy_check_mark:                                                            | N/A                                                                           |
| `predictTTSDurationRequest`                                                   | [models.PredictTTSDurationRequest](../../models/predictttsdurationrequest.md) | :heavy_check_mark:                                                            | N/A                                                                           |