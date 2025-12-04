# InternalServerErrorResponse

## Example Usage

```typescript
import { InternalServerErrorResponse } from "@supertone/supertone/models/errors";

// No examples available for this model
```

## Fields

| Field                                                                                                  | Type                                                                                                   | Required                                                                                               | Description                                                                                            | Example                                                                                                |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `status`                                                                                               | *string*                                                                                               | :heavy_check_mark:                                                                                     | Response status                                                                                        | error                                                                                                  |
| `message`                                                                                              | [models.InternalServerErrorResponseMessage](../../models/internalservererrorresponsemessage.md)        | :heavy_check_mark:                                                                                     | Internal server error details                                                                          | {<br/>"message": "Failed to convert text to speech",<br/>"error": "Internal Server Error",<br/>"statusCode": 500<br/>} |