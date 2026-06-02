# GetCharacterByIdResponse

## Example Usage

```typescript
import { GetCharacterByIdResponse } from "@supertone/supertone/models";

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
    "ar",
    "bg",
    "cs",
    "da",
    "de",
    "el",
    "en",
    "es",
    "et",
    "fi",
    "fr",
    "hi",
    "hu",
    "id",
    "it",
    "ja",
    "ko",
    "nl",
    "pl",
    "pt",
    "ro",
    "ru",
    "vi",
  ],
  styles: [
    "kind-default",
    "normal",
    "serene",
  ],
  models: [
    "sona_speech_1",
    "sona_speech_2",
    "sona_speech_2_flash",
    "supertonic_api_1",
    "supertonic_api_3",
  ],
  samples: [
    {
      language: "ko",
      style: "kind-default",
      model: "supertonic_api_1",
      url: "https://example.com/samples/sample-audio.wav",
    },
  ],
  thumbnailImageUrl: "https://example.com/thumbnails/voice-thumbnail.png",
};
```

## Fields

| Field               | Type                                                 | Required           | Description                                | Example                                                                                                                                                                                                                                      |
| ------------------- | ---------------------------------------------------- | ------------------ | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `voiceId`           | _string_                                             | :heavy_check_mark: | Unique identifier for the voice            | <voice-id>                                                                                                                                                                                                                                   |
| `name`              | _string_                                             | :heavy_check_mark: | Name of the voice                          | Agatha                                                                                                                                                                                                                                       |
| `description`       | _string_                                             | :heavy_minus_sign: | Description of the voice                   |                                                                                                                                                                                                                                              |
| `age`               | _string_                                             | :heavy_check_mark: | Age of the voice                           | young-adult                                                                                                                                                                                                                                  |
| `gender`            | _string_                                             | :heavy_check_mark: | Gender of the voice                        | female                                                                                                                                                                                                                                       |
| `useCase`           | _string_                                             | :heavy_check_mark: | Use case of the voice                      | narration                                                                                                                                                                                                                                    |
| `useCases`          | _string_[]                                           | :heavy_check_mark: | Use cases of the voice (array)             | [<br/>"narration",<br/>"storytelling"<br/>]                                                                                                                                                                                                  |
| `language`          | _string_[]                                           | :heavy_check_mark: | Languages supported by the voice           | [<br/>"ar",<br/>"bg",<br/>"cs",<br/>"da",<br/>"de",<br/>"el",<br/>"en",<br/>"es",<br/>"et",<br/>"fi",<br/>"fr",<br/>"hi",<br/>"hu",<br/>"id",<br/>"it",<br/>"ja",<br/>"ko",<br/>"nl",<br/>"pl",<br/>"pt",<br/>"ro",<br/>"ru",<br/>"vi"<br/>] |
| `styles`            | _string_[]                                           | :heavy_check_mark: | Styles available for the voice             | [<br/>"kind-default",<br/>"normal",<br/>"serene"<br/>]                                                                                                                                                                                       |
| `models`            | _string_[]                                           | :heavy_check_mark: | Models available for the voice             | [<br/>"sona_speech_1",<br/>"sona_speech_2",<br/>"sona_speech_2_flash",<br/>"supertonic_api_1",<br/>"supertonic_api_3"<br/>]                                                                                                                  |
| `samples`           | [models.APISampleData](../models/apisampledata.md)[] | :heavy_minus_sign: | URL to the sample audio file for the voice |                                                                                                                                                                                                                                              |
| `thumbnailImageUrl` | _string_                                             | :heavy_minus_sign: | URL to the thumbnail image for the voice   | https://example.com/thumbnails/voice-thumbnail.png                                                                                                                                                                                           |
