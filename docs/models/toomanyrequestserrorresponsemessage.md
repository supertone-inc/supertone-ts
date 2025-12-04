# TooManyRequestsErrorResponseMessage

Too many requests error details

## Example Usage

```typescript
import { TooManyRequestsErrorResponseMessage } from "@supertone/supertone/models";

let value: TooManyRequestsErrorResponseMessage = {
  message: "rate limit exceeded",
  error: "Too Many Requests",
  statusCode: 401,
};
```

## Fields

| Field              | Type               | Required           | Description        | Example            |
| ------------------ | ------------------ | ------------------ | ------------------ | ------------------ |
| `message`          | *string*           | :heavy_check_mark: | Error message      | Invalid API Key    |
| `error`            | *string*           | :heavy_check_mark: | Error type         | Unauthorized       |
| `statusCode`       | *number*           | :heavy_check_mark: | HTTP status code   | 401                |