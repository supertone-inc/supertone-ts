# PredictTTSDurationRequest

## Example Usage

```typescript
import { PredictTTSDurationRequest } from "@supertone/supertone/models";

let value: PredictTTSDurationRequest = {
  text: "<value>",
  language: "nl",
};
```

## Fields

| Field                                                                                              | Type                                                                                               | Required                                                                                           | Description                                                                                        |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `text`                                                                                             | *string*                                                                                           | :heavy_check_mark:                                                                                 | The text to convert to speech. Max length is 300 characters.                                       |
| `language`                                                                                         | [models.PredictTTSDurationRequestLanguage](../models/predictttsdurationrequestlanguage.md)         | :heavy_check_mark:                                                                                 | Language code of the voice                                                                         |
| `style`                                                                                            | *string*                                                                                           | :heavy_minus_sign:                                                                                 | The style of character to use for the text-to-speech conversion                                    |
| `model`                                                                                            | [models.PredictTTSDurationRequestModel](../models/predictttsdurationrequestmodel.md)               | :heavy_minus_sign:                                                                                 | The model type to use for the text-to-speech conversion                                            |
| `outputFormat`                                                                                     | [models.PredictTTSDurationRequestOutputFormat](../models/predictttsdurationrequestoutputformat.md) | :heavy_minus_sign:                                                                                 | The desired output format of the audio file (wav, mp3). Default is wav.                            |
| `voiceSettings`                                                                                    | [models.ConvertTextToSpeechParameters](../models/converttexttospeechparameters.md)                 | :heavy_minus_sign:                                                                                 | N/A                                                                                                |