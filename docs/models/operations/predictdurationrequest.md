# PredictDurationRequest

## Example Usage

```typescript
import { PredictDurationRequest } from "@supertone/supertone/models/operations";

let value: PredictDurationRequest = {
  voiceId: "<id>",
  predictTTSDurationUsingCharacterRequest: {
    text: "<value>",
    language: "nl",
  },
};
```

## Fields

| Field                                                                                                     | Type                                                                                                      | Required                                                                                                  | Description                                                                                               |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `voiceId`                                                                                                 | *string*                                                                                                  | :heavy_check_mark:                                                                                        | N/A                                                                                                       |
| `predictTTSDurationUsingCharacterRequest`                                                                 | [models.PredictTTSDurationUsingCharacterRequest](../../models/predictttsdurationusingcharacterrequest.md) | :heavy_check_mark:                                                                                        | N/A                                                                                                       |