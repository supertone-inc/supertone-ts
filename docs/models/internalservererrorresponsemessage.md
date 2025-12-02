# InternalServerErrorResponseMessage

Internal server error details

## Example Usage

```typescript
import { InternalServerErrorResponseMessage } from "supertone/models";

let value: InternalServerErrorResponseMessage = {
  message: "Failed to convert text to speech",
  error: "Internal Server Error",
  statusCode: 401,
};
```

## Fields

| Field              | Type               | Required           | Description        | Example            |
| ------------------ | ------------------ | ------------------ | ------------------ | ------------------ |
| `message`          | *string*           | :heavy_check_mark: | Error message      | Invalid API Key    |
| `error`            | *string*           | :heavy_check_mark: | Error type         | Unauthorized       |
| `statusCode`       | *number*           | :heavy_check_mark: | HTTP status code   | 401                |