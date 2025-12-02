# PaymentRequiredErrorResponseMessage

Payment required error details

## Example Usage

```typescript
import { PaymentRequiredErrorResponseMessage } from "supertone/models";

let value: PaymentRequiredErrorResponseMessage = {
  message: "Not enough credits",
  error: "Payment Required",
  statusCode: 401,
};
```

## Fields

| Field              | Type               | Required           | Description        | Example            |
| ------------------ | ------------------ | ------------------ | ------------------ | ------------------ |
| `message`          | *string*           | :heavy_check_mark: | Error message      | Invalid API Key    |
| `error`            | *string*           | :heavy_check_mark: | Error type         | Unauthorized       |
| `statusCode`       | *number*           | :heavy_check_mark: | HTTP status code   | 401                |