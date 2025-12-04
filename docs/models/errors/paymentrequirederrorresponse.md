# PaymentRequiredErrorResponse

## Example Usage

```typescript
import { PaymentRequiredErrorResponse } from "@supertone/supertone/models/errors";

// No examples available for this model
```

## Fields

| Field                                                                                             | Type                                                                                              | Required                                                                                          | Description                                                                                       | Example                                                                                           |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `status`                                                                                          | *string*                                                                                          | :heavy_check_mark:                                                                                | Response status                                                                                   | error                                                                                             |
| `message`                                                                                         | [models.PaymentRequiredErrorResponseMessage](../../models/paymentrequirederrorresponsemessage.md) | :heavy_check_mark:                                                                                | Payment required error details                                                                    | {<br/>"message": "Not enough credits",<br/>"error": "Payment Required",<br/>"statusCode": 402<br/>} |