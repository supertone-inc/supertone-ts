# ForbiddenErrorResponse

## Example Usage

```typescript
import { ForbiddenErrorResponse } from "supertone/models/errors";

// No examples available for this model
```

## Fields

| Field                                                                                 | Type                                                                                  | Required                                                                              | Description                                                                           | Example                                                                               |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `status`                                                                              | *string*                                                                              | :heavy_check_mark:                                                                    | Response status                                                                       | error                                                                                 |
| `message`                                                                             | [models.ForbiddenErrorResponseMessage](../../models/forbiddenerrorresponsemessage.md) | :heavy_check_mark:                                                                    | Forbidden error details                                                               | {<br/>"message": "Permission denied",<br/>"error": "Forbidden",<br/>"statusCode": 403<br/>} |