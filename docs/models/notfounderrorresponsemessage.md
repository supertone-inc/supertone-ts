# NotFoundErrorResponseMessage

Not found error details

## Example Usage

```typescript
import { NotFoundErrorResponseMessage } from "@supertone/supertone/models";

let value: NotFoundErrorResponseMessage = {
  message: "Voice not found",
  error: "Not Found",
  statusCode: 401,
};
```

## Fields

| Field              | Type               | Required           | Description        | Example            |
| ------------------ | ------------------ | ------------------ | ------------------ | ------------------ |
| `message`          | *string*           | :heavy_check_mark: | Error message      | Invalid API Key    |
| `error`            | *string*           | :heavy_check_mark: | Error type         | Unauthorized       |
| `statusCode`       | *number*           | :heavy_check_mark: | HTTP status code   | 401                |