# RequestTimeoutErrorResponseMessage

Request timeout error details

## Example Usage

```typescript
import { RequestTimeoutErrorResponseMessage } from "supertone/models";

let value: RequestTimeoutErrorResponseMessage = {
  message: "Request timed out",
  error: "Request Timeout",
  statusCode: 401,
};
```

## Fields

| Field              | Type               | Required           | Description        | Example            |
| ------------------ | ------------------ | ------------------ | ------------------ | ------------------ |
| `message`          | *string*           | :heavy_check_mark: | Error message      | Invalid API Key    |
| `error`            | *string*           | :heavy_check_mark: | Error type         | Unauthorized       |
| `statusCode`       | *number*           | :heavy_check_mark: | HTTP status code   | 401                |