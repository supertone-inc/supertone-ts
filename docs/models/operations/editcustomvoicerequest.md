# EditCustomVoiceRequest

## Example Usage

```typescript
import { EditCustomVoiceRequest } from "@supertone/supertone/models/operations";

let value: EditCustomVoiceRequest = {
  voiceId: "<id>",
  updateCustomVoiceRequest: {
    name: "My Updated Voice",
    description: "An updated warm and friendly voice for customer service",
  },
};
```

## Fields

| Field                                                                       | Type                                                                        | Required                                                                    | Description                                                                 |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `voiceId`                                                                   | *string*                                                                    | :heavy_check_mark:                                                          | N/A                                                                         |
| `updateCustomVoiceRequest`                                                  | [models.UpdateCustomVoiceRequest](../../models/updatecustomvoicerequest.md) | :heavy_check_mark:                                                          | N/A                                                                         |