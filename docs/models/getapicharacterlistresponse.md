# GetAPICharacterListResponse

## Example Usage

```typescript
import { GetAPICharacterListResponse } from "@supertone/supertone/models";

let value: GetAPICharacterListResponse = {
  items: [
    {
      voiceId: "<voice-id>",
      name: "Agatha",
      description: "",
      age: "young-adult",
      gender: "female",
      useCase: "narration",
      useCases: [
        "narration",
        "storytelling",
      ],
      language: [
        "ko",
        "en",
        "ja",
      ],
      styles: [
        "kind-default",
        "normal",
        "serene",
      ],
      models: [
        "sona_speech_1",
      ],
      samples: [
        {
          language: "ko",
          style: "kind-default",
          model: "sona_speech_1",
          url: "https://example.com/samples/sample-audio.wav",
        },
      ],
      thumbnailImageUrl: "https://example.com/thumbnails/voice-thumbnail.png",
    },
  ],
  total: 150,
  nextPageToken: "some_opaque_token_string_representing_last_id",
};
```

## Fields

| Field                                                                            | Type                                                                             | Required                                                                         | Description                                                                      | Example                                                                          |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `items`                                                                          | [models.GetAPICharacterResponseData](../models/getapicharacterresponsedata.md)[] | :heavy_check_mark:                                                               | List of character items                                                          |                                                                                  |
| `total`                                                                          | *number*                                                                         | :heavy_check_mark:                                                               | Total number of available characters (might be approximate or removed in future) | 150                                                                              |
| `nextPageToken`                                                                  | *string*                                                                         | :heavy_minus_sign:                                                               | Token for fetching the next page of results. Undefined if no more pages.         | some_opaque_token_string_representing_last_id                                    |