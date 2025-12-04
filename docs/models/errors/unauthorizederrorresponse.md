# UnauthorizedErrorResponse

## Example Usage

```typescript
import { UnauthorizedErrorResponse } from "@supertone/supertone/models/errors";

// No examples available for this model
```

## Fields

| Field                                                                                       | Type                                                                                        | Required                                                                                    | Description                                                                                 | Example                                                                                     |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `status`                                                                                    | *string*                                                                                    | :heavy_check_mark:                                                                          | Response status                                                                             | error                                                                                       |
| `message`                                                                                   | [models.UnauthorizedErrorResponseMessage](../../models/unauthorizederrorresponsemessage.md) | :heavy_check_mark:                                                                          | Unauthorized error details                                                                  | {<br/>"message": "Invalid API Key",<br/>"error": "Unauthorized",<br/>"statusCode": 401<br/>} |