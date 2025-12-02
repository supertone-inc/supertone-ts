# PayloadTooLargeErrorResponseMessage

Payload too large error details

## Example Usage

```typescript
import { PayloadTooLargeErrorResponseMessage } from "supertone/models";

let value: PayloadTooLargeErrorResponseMessage = {
  message: "File too large",
  error: "Payload Too Large",
  statusCode: 401,
};
```

## Fields

| Field              | Type               | Required           | Description        | Example            |
| ------------------ | ------------------ | ------------------ | ------------------ | ------------------ |
| `message`          | *string*           | :heavy_check_mark: | Error message      | Invalid API Key    |
| `error`            | *string*           | :heavy_check_mark: | Error type         | Unauthorized       |
| `statusCode`       | *number*           | :heavy_check_mark: | HTTP status code   | 401                |