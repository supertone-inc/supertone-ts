# StreamSpeechRequest

## Example Usage

```typescript
import { StreamSpeechRequest } from "@supertone/supertone/models/operations";

let value: StreamSpeechRequest = {
  voiceId: "<id>",
  apiConvertTextToSpeechUsingCharacterRequest: {
    text: "<value>",
    language: "pt",
  },
};
```

## Fields

| Field                                                                                                             | Type                                                                                                              | Required                                                                                                          | Description                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `voiceId`                                                                                                         | *string*                                                                                                          | :heavy_check_mark:                                                                                                | N/A                                                                                                               |
| `apiConvertTextToSpeechUsingCharacterRequest`                                                                     | [models.APIConvertTextToSpeechUsingCharacterRequest](../../models/apiconverttexttospeechusingcharacterrequest.md) | :heavy_check_mark:                                                                                                | N/A                                                                                                               |