# Voices
(*voices*)

## Overview

Voice Library API endpoints

### Available Operations

* [listVoices](#listvoices) - Gets available voices
* [searchVoices](#searchvoices) - Search voices.
* [getVoice](#getvoice) - Get voice details by ID

## listVoices

Gets a paginated list of voices available to the user based on internal group logic, using token-based pagination.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="list_voices" method="get" path="/v1/voices" -->
```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.voices.listVoices();

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SupertoneCore } from "@supertone/supertone/core.js";
import { voicesListVoices } from "@supertone/supertone/funcs/voicesListVoices.js";

// Use `SupertoneCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const supertone = new SupertoneCore({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const res = await voicesListVoices(supertone);
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("voicesListVoices failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.ListVoicesRequest](../../models/operations/listvoicesrequest.md)                                                                                                   | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.GetAPICharacterListResponse](../../models/getapicharacterlistresponse.md)\>**

### Errors

| Error Type                   | Status Code                  | Content Type                 |
| ---------------------------- | ---------------------------- | ---------------------------- |
| errors.SupertoneDefaultError | 4XX, 5XX                     | \*/\*                        |

## searchVoices

Search and filter voices based on various parameters.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="search_voices" method="get" path="/v1/voices/search" -->
```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.voices.searchVoices();

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { SupertoneCore } from "@supertone/supertone/core.js";
import { voicesSearchVoices } from "@supertone/supertone/funcs/voicesSearchVoices.js";

// Use `SupertoneCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const supertone = new SupertoneCore({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const res = await voicesSearchVoices(supertone);
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("voicesSearchVoices failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.SearchVoicesRequest](../../models/operations/searchvoicesrequest.md)                                                                                               | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.GetAPICharacterListResponse](../../models/getapicharacterlistresponse.md)\>**

### Errors

| Error Type                   | Status Code                  | Content Type                 |
| ---------------------------- | ---------------------------- | ---------------------------- |
| errors.SupertoneDefaultError | 4XX, 5XX                     | \*/\*                        |

## getVoice

Gets detailed information about a specific voice by its voice ID. Only supports preset voices.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="get_voice" method="get" path="/v1/voices/{voice_id}" -->
```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.voices.getVoice({
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
import { voicesGetVoice } from "@supertone/supertone/funcs/voicesGetVoice.js";

// Use `SupertoneCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const supertone = new SupertoneCore({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const res = await voicesGetVoice(supertone, {
    voiceId: "<id>",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("voicesGetVoice failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.GetVoiceRequest](../../models/operations/getvoicerequest.md)                                                                                                       | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[models.GetCharacterByIdResponse](../../models/getcharacterbyidresponse.md)\>**

### Errors

| Error Type                   | Status Code                  | Content Type                 |
| ---------------------------- | ---------------------------- | ---------------------------- |
| errors.SupertoneDefaultError | 4XX, 5XX                     | \*/\*                        |