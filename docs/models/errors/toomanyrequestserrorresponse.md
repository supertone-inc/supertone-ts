# TooManyRequestsErrorResponse

## Example Usage

```typescript
import { TooManyRequestsErrorResponse } from "@supertone/supertone/models/errors";

// No examples available for this model
```

## Fields

| Field                                                                                             | Type                                                                                              | Required                                                                                          | Description                                                                                       | Example                                                                                           |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `status`                                                                                          | *string*                                                                                          | :heavy_check_mark:                                                                                | Response status                                                                                   | error                                                                                             |
| `message`                                                                                         | [models.TooManyRequestsErrorResponseMessage](../../models/toomanyrequestserrorresponsemessage.md) | :heavy_check_mark:                                                                                | Too many requests error details                                                                   | {<br/>"message": "rate limit exceeded",<br/>"error": "Too Many Requests",<br/>"statusCode": 429<br/>} |