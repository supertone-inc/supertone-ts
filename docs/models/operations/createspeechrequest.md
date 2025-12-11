# CreateSpeechRequest

## Example Usage

```typescript
import { CreateSpeechRequest } from "@supertone/supertone/models/operations";

let value: CreateSpeechRequest = {
  voiceId: "<id>",
  apiConvertTextToSpeechUsingCharacterRequest: {
    text: "<value>",
    language: "hi",
  },
};
```

## Fields

| Field                                                                                                             | Type                                                                                                              | Required                                                                                                          | Description                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `voiceId`                                                                                                         | *string*                                                                                                          | :heavy_check_mark:                                                                                                | N/A                                                                                                               |
| `apiConvertTextToSpeechUsingCharacterRequest`                                                                     | [models.APIConvertTextToSpeechUsingCharacterRequest](../../models/apiconverttexttospeechusingcharacterrequest.md) | :heavy_check_mark:                                                                                                | N/A                                                                                                               |