# NotFoundErrorResponse

## Example Usage

```typescript
import { NotFoundErrorResponse } from "supertone/models/errors";

// No examples available for this model
```

## Fields

| Field                                                                               | Type                                                                                | Required                                                                            | Description                                                                         | Example                                                                             |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `status`                                                                            | *string*                                                                            | :heavy_check_mark:                                                                  | Response status                                                                     | error                                                                               |
| `message`                                                                           | [models.NotFoundErrorResponseMessage](../../models/notfounderrorresponsemessage.md) | :heavy_check_mark:                                                                  | Not found error details                                                             | {<br/>"message": "Voice not found",<br/>"error": "Not Found",<br/>"statusCode": 404<br/>} |