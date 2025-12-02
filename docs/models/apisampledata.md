# APISampleData

## Example Usage

```typescript
import { APISampleData } from "supertone/models";

let value: APISampleData = {
  language: "ko",
  style: "kind-default",
  model: "sona_speech_1",
  url: "https://example.com/samples/sample-audio.wav",
};
```

## Fields

| Field                                        | Type                                         | Required                                     | Description                                  | Example                                      |
| -------------------------------------------- | -------------------------------------------- | -------------------------------------------- | -------------------------------------------- | -------------------------------------------- |
| `language`                                   | *string*                                     | :heavy_check_mark:                           | Language of the sample                       | ko                                           |
| `style`                                      | *string*                                     | :heavy_check_mark:                           | Style of the sample                          | kind-default                                 |
| `model`                                      | *string*                                     | :heavy_check_mark:                           | Model of the sample                          | sona_speech_1                                |
| `url`                                        | *string*                                     | :heavy_check_mark:                           | URL to the sample audio file                 | https://example.com/samples/sample-audio.wav |