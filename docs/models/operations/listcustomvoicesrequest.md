# ListCustomVoicesRequest

## Example Usage

```typescript
import { ListCustomVoicesRequest } from "supertone/models/operations";

let value: ListCustomVoicesRequest = {};
```

## Fields

| Field                                                             | Type                                                              | Required                                                          | Description                                                       |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| `pageSize`                                                        | *number*                                                          | :heavy_minus_sign:                                                | Number of items per page (default: 20, min: 10, max: 100)         |
| `nextPageToken`                                                   | *string*                                                          | :heavy_minus_sign:                                                | Token for pagination (obtained from the previous page's response) |