# EditCustomVoiceRequest

## Example Usage

```typescript
import { EditCustomVoiceRequest } from "supertone/models/operations";

let value: EditCustomVoiceRequest = {
  voiceId: "<id>",
  updateClonedVoiceRequest: {
    name: "My Updated Voice",
    description: "An updated warm and friendly voice for customer service",
  },
};
```

## Fields

| Field                                                                       | Type                                                                        | Required                                                                    | Description                                                                 |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `voiceId`                                                                   | *string*                                                                    | :heavy_check_mark:                                                          | N/A                                                                         |
| `updateClonedVoiceRequest`                                                  | [models.UpdateClonedVoiceRequest](../../models/updateclonedvoicerequest.md) | :heavy_check_mark:                                                          | N/A                                                                         |