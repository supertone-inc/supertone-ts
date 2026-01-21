# GetCustomVoiceResponse

## Example Usage

```typescript
import { GetCustomVoiceResponse } from "@supertone/supertone/models";

let value: GetCustomVoiceResponse = {
  voiceId: "voice_123456789",
  name: "My Custom Voice",
  description: "A warm and friendly voice for customer service",
};
```

## Fields

| Field                                          | Type                                           | Required                                       | Description                                    | Example                                        |
| ---------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| `voiceId`                                      | *string*                                       | :heavy_check_mark:                             | Unique identifier for the voice                | voice_123456789                                |
| `name`                                         | *string*                                       | :heavy_check_mark:                             | Name of the voice                              | My Custom Voice                                |
| `description`                                  | *string*                                       | :heavy_check_mark:                             | Description of the voice                       | A warm and friendly voice for customer service |