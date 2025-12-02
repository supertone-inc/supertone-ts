# GetCharacterByIdResponse

## Example Usage

```typescript
import { GetCharacterByIdResponse } from "supertone/models";

let value: GetCharacterByIdResponse = {
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
};
```

## Fields

| Field                                                | Type                                                 | Required                                             | Description                                          | Example                                              |
| ---------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| `voiceId`                                            | *string*                                             | :heavy_check_mark:                                   | Unique identifier for the voice                      | <voice-id>                                           |
| `name`                                               | *string*                                             | :heavy_check_mark:                                   | Name of the voice                                    | Agatha                                               |
| `description`                                        | *string*                                             | :heavy_check_mark:                                   | Description of the voice                             |                                                      |
| `age`                                                | *string*                                             | :heavy_check_mark:                                   | Age of the voice                                     | young-adult                                          |
| `gender`                                             | *string*                                             | :heavy_check_mark:                                   | Gender of the voice                                  | female                                               |
| `useCase`                                            | *string*                                             | :heavy_check_mark:                                   | Use case of the voice                                | narration                                            |
| `useCases`                                           | *string*[]                                           | :heavy_check_mark:                                   | Use cases of the voice (array)                       | [<br/>"narration",<br/>"storytelling"<br/>]          |
| `language`                                           | *string*[]                                           | :heavy_check_mark:                                   | Languages supported by the voice                     | [<br/>"ko",<br/>"en",<br/>"ja"<br/>]                 |
| `styles`                                             | *string*[]                                           | :heavy_check_mark:                                   | Styles available for the voice                       | [<br/>"kind-default",<br/>"normal",<br/>"serene"<br/>] |
| `models`                                             | *string*[]                                           | :heavy_check_mark:                                   | Models available for the voice                       | [<br/>"sona_speech_1"<br/>]                          |
| `samples`                                            | [models.APISampleData](../models/apisampledata.md)[] | :heavy_minus_sign:                                   | URL to the sample audio file for the voice           |                                                      |
| `thumbnailImageUrl`                                  | *string*                                             | :heavy_minus_sign:                                   | URL to the thumbnail image for the voice             | https://example.com/thumbnails/voice-thumbnail.png   |