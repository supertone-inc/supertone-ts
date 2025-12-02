# UsageBucket

## Example Usage

```typescript
import { UsageBucket } from "supertone/models";

let value: UsageBucket = {
  startingAt: "2024-01-01T00:00:00+09:00",
  endingAt: "2024-01-01T01:00:00+09:00",
  results: [],
};
```

## Fields

| Field                                            | Type                                             | Required                                         | Description                                      | Example                                          |
| ------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------ |
| `startingAt`                                     | *string*                                         | :heavy_check_mark:                               | RFC3339 timestamp for bucket start               | 2024-01-01T00:00:00+09:00                        |
| `endingAt`                                       | *string*                                         | :heavy_check_mark:                               | RFC3339 timestamp for bucket end                 | 2024-01-01T01:00:00+09:00                        |
| `results`                                        | [models.UsageResult](../models/usageresult.md)[] | :heavy_check_mark:                               | Array of usage results within this time bucket   |                                                  |