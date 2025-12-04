# UsageAnalyticsResponse

## Example Usage

```typescript
import { UsageAnalyticsResponse } from "@supertone/supertone/models";

let value: UsageAnalyticsResponse = {
  data: [],
  total: 5861.75,
};
```

## Fields

| Field                                            | Type                                             | Required                                         | Description                                      |
| ------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------ |
| `data`                                           | [models.UsageBucket](../models/usagebucket.md)[] | :heavy_check_mark:                               | Array of time buckets containing usage data      |
| `nextPageToken`                                  | *string*                                         | :heavy_minus_sign:                               | Pagination token for next page                   |
| `total`                                          | *number*                                         | :heavy_check_mark:                               | Total number of time buckets across all pages    |