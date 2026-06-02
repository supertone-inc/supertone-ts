# BadRequestErrorResponse

## Example Usage

```typescript
import { BadRequestErrorResponse } from "@supertone/supertone/models/errors";

// No examples available for this model
```

## Fields

| Field                                                                                   | Type                                                                                    | Required                                                                                | Description                                                                             | Example                                                                                 |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `status`                                                                                | *string*                                                                                | :heavy_check_mark:                                                                      | Response status                                                                         | error                                                                                   |
| `message`                                                                               | [models.BadRequestErrorResponseMessage](../../models/badrequesterrorresponsemessage.md) | :heavy_check_mark:                                                                      | Bad request error details                                                               | {<br/>"message": "Invalid request data",<br/>"error": "Bad Request",<br/>"statusCode": 400<br/>} |