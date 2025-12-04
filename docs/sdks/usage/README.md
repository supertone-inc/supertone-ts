# Usage
(*usage*)

## Overview

Usage Analytics API endpoints

### Available Operations

* [getVoiceUsage](#getvoiceusage) - Retrieve TTS API usage data
* [getUsage](#getusage) - Retrieve advanced API usage analytics
* [getCreditBalance](#getcreditbalance) - Retrieve credit balance

## getVoiceUsage

Retrieves a list of all TTS API usage records filtered by a specified date range. All dates are in UTC+0 timezone.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="get_voice_usage" method="get" path="/v1/voice-usage" -->
```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.usage.getVoiceUsage({
    startDate: "2024-11-01",
    endDate: "2024-11-30",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SupertoneCore } from "@supertone/supertone/core.js";
import { usageGetVoiceUsage } from "@supertone/supertone/funcs/usageGetVoiceUsage.js";

// Use `SupertoneCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const supertone = new SupertoneCore({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const res = await usageGetVoiceUsage(supertone, {
    startDate: "2024-11-01",
    endDate: "2024-11-30",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("usageGetVoiceUsage failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.GetVoiceUsageRequest](../../models/operations/getvoiceusagerequest.md)                                                                                             | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.GetUsageListV1Response](../../models/getusagelistv1response.md)\>**

### Errors

| Error Type                   | Status Code                  | Content Type                 |
| ---------------------------- | ---------------------------- | ---------------------------- |
| errors.SupertoneDefaultError | 4XX, 5XX                     | \*/\*                        |

## getUsage

Retrieves API usage data with advanced features including time bucketing, multi-dimensional breakdowns, and pagination. All timestamps should be in RFC3339 format.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="get_usage" method="get" path="/v1/usage" -->
```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.usage.getUsage({
    startTime: "2024-01-01T00:00:00+09:00",
    endTime: "2024-01-31T23:59:59+09:00",
    breakdownType: [
      "voice_name",
    ],
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SupertoneCore } from "@supertone/supertone/core.js";
import { usageGetUsage } from "@supertone/supertone/funcs/usageGetUsage.js";

// Use `SupertoneCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const supertone = new SupertoneCore({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const res = await usageGetUsage(supertone, {
    startTime: "2024-01-01T00:00:00+09:00",
    endTime: "2024-01-31T23:59:59+09:00",
    breakdownType: [
      "voice_name",
    ],
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("usageGetUsage failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.GetUsageRequest](../../models/operations/getusagerequest.md)                                                                                                       | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.UsageAnalyticsResponse](../../models/usageanalyticsresponse.md)\>**

### Errors

| Error Type                         | Status Code                        | Content Type                       |
| ---------------------------------- | ---------------------------------- | ---------------------------------- |
| errors.BadRequestErrorResponse     | 400                                | application/json                   |
| errors.UnauthorizedErrorResponse   | 401                                | application/json                   |
| errors.RequestTimeoutErrorResponse | 408                                | application/json                   |
| errors.InternalServerErrorResponse | 500                                | application/json                   |
| errors.SupertoneDefaultError       | 4XX, 5XX                           | \*/\*                              |

## getCreditBalance

Retrieves credit balance of the user.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="get_credit_balance" method="get" path="/v1/credits" -->
```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.usage.getCreditBalance();

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SupertoneCore } from "@supertone/supertone/core.js";
import { usageGetCreditBalance } from "@supertone/supertone/funcs/usageGetCreditBalance.js";

// Use `SupertoneCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const supertone = new SupertoneCore({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const res = await usageGetCreditBalance(supertone);
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("usageGetCreditBalance failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.GetCreditBalanceResponse](../../models/getcreditbalanceresponse.md)\>**

### Errors

| Error Type                   | Status Code                  | Content Type                 |
| ---------------------------- | ---------------------------- | ---------------------------- |
| errors.SupertoneDefaultError | 4XX, 5XX                     | \*/\*                        |