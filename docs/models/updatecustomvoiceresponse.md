# UpdateCustomVoiceResponse

## Example Usage

```typescript
import { UpdateCustomVoiceResponse } from "@supertone/supertone/models";

let value: UpdateCustomVoiceResponse = {
  voiceId: "voice_123456789",
  name: "My Updated Voice",
  description: "An updated warm and friendly voice for customer service",
};
```

## Fields

| Field                                                   | Type                                                    | Required                                                | Description                                             | Example                                                 |
| ------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| `voiceId`                                               | *string*                                                | :heavy_check_mark:                                      | Unique identifier for the voice                         | voice_123456789                                         |
| `name`                                                  | *string*                                                | :heavy_check_mark:                                      | Name of the voice                                       | My Updated Voice                                        |
| `description`                                           | *string*                                                | :heavy_check_mark:                                      | Description of the voice                                | An updated warm and friendly voice for customer service |