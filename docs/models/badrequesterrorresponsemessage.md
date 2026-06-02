# BadRequestErrorResponseMessage

Bad request error details

## Example Usage

```typescript
import { BadRequestErrorResponseMessage } from "@supertone/supertone/models";

let value: BadRequestErrorResponseMessage = {
  message: "Invalid request data",
  error: "Bad Request",
  statusCode: 401,
};
```

## Fields

| Field              | Type               | Required           | Description        | Example            |
| ------------------ | ------------------ | ------------------ | ------------------ | ------------------ |
| `message`          | *string*           | :heavy_check_mark: | Error message      | Invalid API Key    |
| `error`            | *string*           | :heavy_check_mark: | Error type         | Unauthorized       |
| `statusCode`       | *number*           | :heavy_check_mark: | HTTP status code   | 401                |