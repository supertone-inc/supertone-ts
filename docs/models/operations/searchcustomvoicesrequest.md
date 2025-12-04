# SearchCustomVoicesRequest

## Example Usage

```typescript
import { SearchCustomVoicesRequest } from "@supertone/supertone/models/operations";

let value: SearchCustomVoicesRequest = {};
```

## Fields

| Field                                                             | Type                                                              | Required                                                          | Description                                                       |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| `pageSize`                                                        | *number*                                                          | :heavy_minus_sign:                                                | Number of items per page (default: 20, min: 10, max: 100)         |
| `nextPageToken`                                                   | *string*                                                          | :heavy_minus_sign:                                                | Token for pagination (obtained from the previous page's response) |
| `name`                                                            | *string*                                                          | :heavy_minus_sign:                                                | Search across name. Space separated.                              |
| `description`                                                     | *string*                                                          | :heavy_minus_sign:                                                | Search across description. Space separated.                       |