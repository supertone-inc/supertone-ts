# UsageResult

## Example Usage

```typescript
import { UsageResult } from "supertone/models";

let value: UsageResult = {
  minutesUsed: 9691.33,
};
```

## Fields

| Field                      | Type                       | Required                   | Description                |
| -------------------------- | -------------------------- | -------------------------- | -------------------------- |
| `voiceId`                  | *string*                   | :heavy_minus_sign:         | Voice identifier           |
| `voiceName`                | *string*                   | :heavy_minus_sign:         | Human-readable voice name  |
| `apiKey`                   | *string*                   | :heavy_minus_sign:         | API key used               |
| `model`                    | *string*                   | :heavy_minus_sign:         | Model used                 |
| `minutesUsed`              | *number*                   | :heavy_check_mark:         | Total minutes of API usage |