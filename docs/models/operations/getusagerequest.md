# GetUsageRequest

## Example Usage

```typescript
import { GetUsageRequest } from "supertone/models/operations";

let value: GetUsageRequest = {
  startTime: "2024-01-01T00:00:00+09:00",
  endTime: "2024-01-31T23:59:59+09:00",
  breakdownType: [
    "voice_name",
  ],
};
```

## Fields

| Field                                                                  | Type                                                                   | Required                                                               | Description                                                            | Example                                                                |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `startTime`                                                            | *string*                                                               | :heavy_check_mark:                                                     | Start time in RFC3339 format                                           | 2024-01-01T00:00:00+09:00                                              |
| `endTime`                                                              | *string*                                                               | :heavy_check_mark:                                                     | End time in RFC3339 format                                             | 2024-01-31T23:59:59+09:00                                              |
| `bucketWidth`                                                          | [operations.BucketWidth](../../models/operations/bucketwidth.md)       | :heavy_minus_sign:                                                     | Time bucket width for aggregation                                      |                                                                        |
| `breakdownType`                                                        | [operations.BreakdownType](../../models/operations/breakdowntype.md)[] | :heavy_minus_sign:                                                     | Dimensions to break down usage data                                    | [<br/>"voice_name"<br/>]                                               |
| `pageSize`                                                             | *number*                                                               | :heavy_minus_sign:                                                     | Number of results per page                                             |                                                                        |
| `nextPageToken`                                                        | *string*                                                               | :heavy_minus_sign:                                                     | Pagination token from previous response                                |                                                                        |