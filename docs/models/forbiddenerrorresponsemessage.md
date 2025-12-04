# ForbiddenErrorResponseMessage

Forbidden error details

## Example Usage

```typescript
import { ForbiddenErrorResponseMessage } from "@supertone/supertone/models";

let value: ForbiddenErrorResponseMessage = {
  message: "Permission denied",
  error: "Forbidden",
  statusCode: 401,
};
```

## Fields

| Field              | Type               | Required           | Description        | Example            |
| ------------------ | ------------------ | ------------------ | ------------------ | ------------------ |
| `message`          | *string*           | :heavy_check_mark: | Error message      | Invalid API Key    |
| `error`            | *string*           | :heavy_check_mark: | Error type         | Unauthorized       |
| `statusCode`       | *number*           | :heavy_check_mark: | HTTP status code   | 401                |