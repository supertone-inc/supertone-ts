# RequestTimeoutErrorResponse

## Example Usage

```typescript
import { RequestTimeoutErrorResponse } from "@supertone/supertone/models/errors";

// No examples available for this model
```

## Fields

| Field                                                                                           | Type                                                                                            | Required                                                                                        | Description                                                                                     | Example                                                                                         |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `status`                                                                                        | *string*                                                                                        | :heavy_check_mark:                                                                              | Response status                                                                                 | error                                                                                           |
| `message`                                                                                       | [models.RequestTimeoutErrorResponseMessage](../../models/requesttimeouterrorresponsemessage.md) | :heavy_check_mark:                                                                              | Request timeout error details                                                                   | {<br/>"message": "Request timed out",<br/>"error": "Request Timeout",<br/>"statusCode": 408<br/>} |