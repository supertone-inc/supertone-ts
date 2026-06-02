# UnsupportedMediaTypeErrorResponseMessage

Unsupported media type error details

## Example Usage

```typescript
import { UnsupportedMediaTypeErrorResponseMessage } from "@supertone/supertone/models";

let value: UnsupportedMediaTypeErrorResponseMessage = {
  message:
    "Unsupported audio format. Supported formats: WAV, MP3. Received: application/json",
  error: "Unsupported Media Type",
  statusCode: 401,
};
```

## Fields

| Field              | Type               | Required           | Description        | Example            |
| ------------------ | ------------------ | ------------------ | ------------------ | ------------------ |
| `message`          | *string*           | :heavy_check_mark: | Error message      | Invalid API Key    |
| `error`            | *string*           | :heavy_check_mark: | Error type         | Unauthorized       |
| `statusCode`       | *number*           | :heavy_check_mark: | HTTP status code   | 401                |