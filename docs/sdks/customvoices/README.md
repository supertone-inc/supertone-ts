# CustomVoices
(*customVoices*)

## Overview

Custom Voice Management API endpoints

### Available Operations

* [createClonedVoice](#createclonedvoice) - Create cloned voice
* [listCustomVoices](#listcustomvoices) - Gets custom (cloned) voices
* [searchCustomVoices](#searchcustomvoices) - Search custom (cloned) voices
* [getCustomVoice](#getcustomvoice) - Get single cloned voice
* [editCustomVoice](#editcustomvoice) - Update cloned voice (partial update)
* [deleteCustomVoice](#deletecustomvoice) - Delete cloned voice

## createClonedVoice

Creates a custom (cloned) voice from uploaded audio files.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="create_cloned_voice" method="post" path="/v1/custom-voices/cloned-voice" -->
```typescript
import { Supertone } from "@supertone/supertone";
import { openAsBlob } from "node:fs";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.customVoices.createClonedVoice({
    files: await openAsBlob("example.file"),
    name: "<value>",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SupertoneCore } from "@supertone/supertone/core.js";
import { customVoicesCreateClonedVoice } from "@supertone/supertone/funcs/customVoicesCreateClonedVoice.js";
import { openAsBlob } from "node:fs";

// Use `SupertoneCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const supertone = new SupertoneCore({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const res = await customVoicesCreateClonedVoice(supertone, {
    files: await openAsBlob("example.file"),
    name: "<value>",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("customVoicesCreateClonedVoice failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.CreateClonedVoiceRequest](../../models/operations/createclonedvoicerequest.md)                                                                                     | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.CreateCustomVoiceResponse](../../models/createcustomvoiceresponse.md)\>**

### Errors

| Error Type                               | Status Code                              | Content Type                             |
| ---------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| errors.BadRequestErrorResponse           | 400                                      | application/json                         |
| errors.UnauthorizedErrorResponse         | 401                                      | application/json                         |
| errors.ForbiddenErrorResponse            | 403                                      | application/json                         |
| errors.NotFoundErrorResponse             | 404                                      | application/json                         |
| errors.PayloadTooLargeErrorResponse      | 413                                      | application/json                         |
| errors.UnsupportedMediaTypeErrorResponse | 415                                      | application/json                         |
| errors.TooManyRequestsErrorResponse      | 429                                      | application/json                         |
| errors.InternalServerErrorResponse       | 500                                      | application/json                         |
| errors.SupertoneDefaultError             | 4XX, 5XX                                 | \*/\*                                    |

## listCustomVoices

Gets a paginated list of custom (cloned) voices available to the user, using token-based pagination.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="list_custom_voices" method="get" path="/v1/custom-voices" -->
```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.customVoices.listCustomVoices();

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SupertoneCore } from "@supertone/supertone/core.js";
import { customVoicesListCustomVoices } from "@supertone/supertone/funcs/customVoicesListCustomVoices.js";

// Use `SupertoneCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const supertone = new SupertoneCore({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const res = await customVoicesListCustomVoices(supertone);
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("customVoicesListCustomVoices failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ListCustomVoicesRequest](../../models/operations/listcustomvoicesrequest.md)                                                                                       | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.GetCustomVoiceListResponse](../../models/getcustomvoicelistresponse.md)\>**

### Errors

| Error Type                         | Status Code                        | Content Type                       |
| ---------------------------------- | ---------------------------------- | ---------------------------------- |
| errors.UnauthorizedErrorResponse   | 401                                | application/json                   |
| errors.NotFoundErrorResponse       | 404                                | application/json                   |
| errors.InternalServerErrorResponse | 500                                | application/json                   |
| errors.SupertoneDefaultError       | 4XX, 5XX                           | \*/\*                              |

## searchCustomVoices

Search and filter custom (cloned) voices based on various parameters. Space-separated terms in name/description fields use AND condition (all terms must be present).

### Example Usage

<!-- UsageSnippet language="typescript" operationID="search_custom_voices" method="get" path="/v1/custom-voices/search" -->
```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.customVoices.searchCustomVoices();

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SupertoneCore } from "@supertone/supertone/core.js";
import { customVoicesSearchCustomVoices } from "@supertone/supertone/funcs/customVoicesSearchCustomVoices.js";

// Use `SupertoneCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const supertone = new SupertoneCore({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const res = await customVoicesSearchCustomVoices(supertone);
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("customVoicesSearchCustomVoices failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.SearchCustomVoicesRequest](../../models/operations/searchcustomvoicesrequest.md)                                                                                   | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.GetCustomVoiceListResponse](../../models/getcustomvoicelistresponse.md)\>**

### Errors

| Error Type                         | Status Code                        | Content Type                       |
| ---------------------------------- | ---------------------------------- | ---------------------------------- |
| errors.UnauthorizedErrorResponse   | 401                                | application/json                   |
| errors.NotFoundErrorResponse       | 404                                | application/json                   |
| errors.InternalServerErrorResponse | 500                                | application/json                   |
| errors.SupertoneDefaultError       | 4XX, 5XX                           | \*/\*                              |

## getCustomVoice

Gets details of a specific custom (cloned) voice by ID.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="get_custom_voice" method="get" path="/v1/custom-voices/{voice_id}" -->
```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.customVoices.getCustomVoice({
    voiceId: "<id>",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SupertoneCore } from "@supertone/supertone/core.js";
import { customVoicesGetCustomVoice } from "@supertone/supertone/funcs/customVoicesGetCustomVoice.js";

// Use `SupertoneCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const supertone = new SupertoneCore({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const res = await customVoicesGetCustomVoice(supertone, {
    voiceId: "<id>",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("customVoicesGetCustomVoice failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.GetCustomVoiceRequest](../../models/operations/getcustomvoicerequest.md)                                                                                           | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.GetCustomVoiceResponse](../../models/getcustomvoiceresponse.md)\>**

### Errors

| Error Type                         | Status Code                        | Content Type                       |
| ---------------------------------- | ---------------------------------- | ---------------------------------- |
| errors.UnauthorizedErrorResponse   | 401                                | application/json                   |
| errors.NotFoundErrorResponse       | 404                                | application/json                   |
| errors.InternalServerErrorResponse | 500                                | application/json                   |
| errors.SupertoneDefaultError       | 4XX, 5XX                           | \*/\*                              |

## editCustomVoice

Partially updates properties of a custom (cloned) voice by ID.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="edit_custom_voice" method="patch" path="/v1/custom-voices/{voice_id}" -->
```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.customVoices.editCustomVoice({
    voiceId: "<id>",
    updateCustomVoiceRequest: {
      name: "My Updated Voice",
      description: "An updated warm and friendly voice for customer service",
    },
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SupertoneCore } from "@supertone/supertone/core.js";
import { customVoicesEditCustomVoice } from "@supertone/supertone/funcs/customVoicesEditCustomVoice.js";

// Use `SupertoneCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const supertone = new SupertoneCore({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const res = await customVoicesEditCustomVoice(supertone, {
    voiceId: "<id>",
    updateCustomVoiceRequest: {
      name: "My Updated Voice",
      description: "An updated warm and friendly voice for customer service",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("customVoicesEditCustomVoice failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.EditCustomVoiceRequest](../../models/operations/editcustomvoicerequest.md)                                                                                         | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.UpdateCustomVoiceResponse](../../models/updatecustomvoiceresponse.md)\>**

### Errors

| Error Type                         | Status Code                        | Content Type                       |
| ---------------------------------- | ---------------------------------- | ---------------------------------- |
| errors.UnauthorizedErrorResponse   | 401                                | application/json                   |
| errors.NotFoundErrorResponse       | 404                                | application/json                   |
| errors.InternalServerErrorResponse | 500                                | application/json                   |
| errors.SupertoneDefaultError       | 4XX, 5XX                           | \*/\*                              |

## deleteCustomVoice

Deletes a custom (cloned) voice by ID.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="delete_custom_voice" method="delete" path="/v1/custom-voices/{voice_id}" -->
```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  await supertone.customVoices.deleteCustomVoice({
    voiceId: "<id>",
  });


}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SupertoneCore } from "@supertone/supertone/core.js";
import { customVoicesDeleteCustomVoice } from "@supertone/supertone/funcs/customVoicesDeleteCustomVoice.js";

// Use `SupertoneCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const supertone = new SupertoneCore({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const res = await customVoicesDeleteCustomVoice(supertone, {
    voiceId: "<id>",
  });
  if (res.ok) {
    const { value: result } = res;
    
  } else {
    console.log("customVoicesDeleteCustomVoice failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.DeleteCustomVoiceRequest](../../models/operations/deletecustomvoicerequest.md)                                                                                     | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<void\>**

### Errors

| Error Type                         | Status Code                        | Content Type                       |
| ---------------------------------- | ---------------------------------- | ---------------------------------- |
| errors.UnauthorizedErrorResponse   | 401                                | application/json                   |
| errors.NotFoundErrorResponse       | 404                                | application/json                   |
| errors.InternalServerErrorResponse | 500                                | application/json                   |
| errors.SupertoneDefaultError       | 4XX, 5XX                           | \*/\*                              |