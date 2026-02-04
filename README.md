# Supertone TypeScript Library

![LOGO](https://github.com/supertone-inc/supertone-ts/blob/main/images/hero-light.png?raw=true)

<!-- Start Summary [summary] -->
## Summary

Supertone Public API: Supertone API is a RESTful API for using our state-of-the-art AI voice models.
<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
* [Supertone TypeScript Library](#supertone-typescript-library)
  * [SDK Installation](#sdk-installation)
  * [Requirements](#requirements)
  * [SDK Example Usage](#sdk-example-usage)
  * [Authentication](#authentication)
  * [Models](#models)
  * [Available Resources and Operations](#available-resources-and-operations)
  * [Standalone functions](#standalone-functions)
  * [File uploads](#file-uploads)
  * [Retries](#retries)
  * [Error Handling](#error-handling)
  * [Additional Example Code](#additional-example-code)
  * [Server Selection](#server-selection)
  * [Custom HTTP Client](#custom-http-client)
  * [Debugging](#debugging)

<!-- End Table of Contents [toc] -->

<!-- Start SDK Installation [installation] -->
## SDK Installation

> [!TIP]
> To finish publishing your SDK to npm and others you must [run your first generation action](https://www.speakeasy.com/docs/github-setup#step-by-step-guide).


The SDK can be installed with either [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/) or [yarn](https://classic.yarnpkg.com/en/) package managers.

### NPM

```bash
npm add <UNSET>
```

### PNPM

```bash
pnpm add <UNSET>
```

### Bun

```bash
bun add <UNSET>
```

### Yarn

```bash
yarn add <UNSET> zod

# Note that Yarn does not install peer dependencies automatically. You will need
# to install zod as shown above.
```

> [!NOTE]
> This package is published with CommonJS and ES Modules (ESM) support.
<!-- End SDK Installation [installation] -->

<!-- Start Requirements [requirements] -->
## Requirements

For supported JavaScript runtimes, please consult [RUNTIMES.md](RUNTIMES.md).
<!-- End Requirements [requirements] -->

<!-- Start SDK Example Usage [usage] -->
## SDK Example Usage

### Example

```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.textToSpeech.createSpeech({
    voiceId: "<id>",
    apiConvertTextToSpeechUsingCharacterRequest: {
      text: "<value>",
      language: "ja",
    },
  });

  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->

<!-- Start Authentication [security] -->
## Authentication

### Per-Client Security Schemes

This SDK supports the following security scheme globally:

| Name     | Type   | Scheme  |
| -------- | ------ | ------- |
| `apiKey` | apiKey | API key |

To authenticate with the API the `apiKey` parameter must be set when initializing the SDK client instance. For example:
```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.textToSpeech.createSpeech({
    voiceId: "<id>",
    apiConvertTextToSpeechUsingCharacterRequest: {
      text: "<value>",
      language: "ja",
    },
  });

  console.log(result);
}

run();

```
<!-- End Authentication [security] -->

<!-- Start Models [models] -->

## Models

Supertone’s Text-to-Speech API provides multiple TTS models, each with different supported languages, available voice settings, and streaming capabilities.

### Model Overview

| Model Name         | Identifier        | Streaming Support (`stream_speech`) | Voice Settings Support                                   |
|--------------------|-------------------|--------------------------------------|----------------------------------------------------------|
| **SONA Speech 1**  | `sona_speech_1`   | ✅ Supported                         | Supports **all** Voice Settings                          |
| **Supertonic API 1** | `supertonic_api_1` | ❌ Not supported                  | Supports **only** the `speed` setting (others are ignored) |
| **SONA Speech 2**  | `sona_speech_2`   | ❌ Not supported                     | Supports **all** Voice Settings **except** `subharmonic_amplitude_control` |
| **SONA Speech 2 Flash**  | `sona_speech_2_flash`   | ❌ Not supported | Supports **all** Voice Settings **except** `similarity`, `text_guidance`,`subharmonic_amplitude_control` |

> [!NOTE]
> **Streaming Support**
>
> Streaming TTS using the `stream_speech` endpoint is **only available for the `sona_speech_1` model**.
>
> **Normalized Text Support**
>
> The `normalized_text` parameter is supported **only with the `sona_speech_2` and `sona_speech_2_flash` models**.  
> It is ignored when used with other models.
---

### Supported Languages by Model

> [!NOTE]
> The set of supported input languages varies depending on the TTS model.

- **sona_speech_1**
  - `en`, `ko`, `ja`

- **supertonic_api_1**
  - `en`, `ko`, `ja`, `es`, `pt`

- **sona_speech_2**
  - `en`, `ko`, `ja`, `bg`, `cs`, `da`, `el`, `es`, `et`, `fi`, `hu`, `it`, `nl`, `pl`, `pt`, `ro`,  
    `ar`, `de`, `fr`, `hi`, `id`, `ru`, `vi`

- **sona_speech_2_flash**
  - `en`, `ko`, `ja`, `bg`, `cs`, `da`, `el`, `es`, `et`, `fi`, `hu`, `it`, `nl`, `pl`, `pt`, `ro`,  
    `ar`, `de`, `fr`, `hi`, `id`, `ru`, `vi`

---

### Voice Settings (Optional)

Some TTS models support optional voice settings that allow fine control over output speech characteristics (e.g., speed, pitch, pitch variance).

> [!NOTE]
> The available Voice Settings vary depending on the TTS model.

- **sona_speech_1**
  - Supports **all** available Voice Settings.

- **supertonic_api_1**
  - Supports **only** the `speed` setting.  
    All other settings will be ignored.

- **sona_speech_2**
  - Supports **all** Voice Settings **except** `subharmonic_amplitude_control`.

- **sona_speech_2_flash**
  - Supports **all** Voice Settings **except** `similarity`, `text_guidance`, `subharmonic_amplitude_control`.

> All Voice Settings are optional. When omitted, each model’s default values will be applied.

<!-- End Models [models] -->

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

<details open>
<summary>Available methods</summary>

### [customVoices](docs/sdks/customvoices/README.md)

* [createClonedVoice](docs/sdks/customvoices/README.md#createclonedvoice) - Create cloned voice
* [listCustomVoices](docs/sdks/customvoices/README.md#listcustomvoices) - Gets custom (cloned) voices
* [searchCustomVoices](docs/sdks/customvoices/README.md#searchcustomvoices) - Search custom (cloned) voices
* [getCustomVoice](docs/sdks/customvoices/README.md#getcustomvoice) - Get single cloned voice
* [editCustomVoice](docs/sdks/customvoices/README.md#editcustomvoice) - Update cloned voice (partial update)
* [deleteCustomVoice](docs/sdks/customvoices/README.md#deletecustomvoice) - Delete cloned voice


### [textToSpeech](docs/sdks/texttospeech/README.md)

* [createSpeech](docs/sdks/texttospeech/README.md#createspeech) - Convert text to speech
* [streamSpeech](docs/sdks/texttospeech/README.md#streamspeech) - Convert text to speech with streaming response
* [predictDuration](docs/sdks/texttospeech/README.md#predictduration) - Predict text-to-speech duration

### [usage](docs/sdks/usage/README.md)

* [getVoiceUsage](docs/sdks/usage/README.md#getvoiceusage) - Retrieve TTS API usage data
* [getUsage](docs/sdks/usage/README.md#getusage) - Retrieve advanced API usage analytics
* [getCreditBalance](docs/sdks/usage/README.md#getcreditbalance) - Retrieve credit balance

### [voices](docs/sdks/voices/README.md)

* [listVoices](docs/sdks/voices/README.md#listvoices) - Gets available voices
* [searchVoices](docs/sdks/voices/README.md#searchvoices) - Search voices.
* [getVoice](docs/sdks/voices/README.md#getvoice) - Get voice details by ID

</details>
<!-- End Available Resources and Operations [operations] -->

<!-- Start Standalone functions [standalone-funcs] -->
## Standalone functions

All the methods listed above are available as standalone functions. These
functions are ideal for use in applications running in the browser, serverless
runtimes or other environments where application bundle size is a primary
concern. When using a bundler to build your application, all unused
functionality will be either excluded from the final bundle or tree-shaken away.

To read more about standalone functions, check [FUNCTIONS.md](./FUNCTIONS.md).

<details>

<summary>Available standalone functions</summary>

- [`customVoicesCreateClonedVoice`](docs/sdks/customvoices/README.md#createclonedvoice) - Create cloned voice
- [`customVoicesDeleteCustomVoice`](docs/sdks/customvoices/README.md#deletecustomvoice) - Delete cloned voice
- [`customVoicesEditCustomVoice`](docs/sdks/customvoices/README.md#editcustomvoice) - Update cloned voice (partial update)
- [`customVoicesGetCustomVoice`](docs/sdks/customvoices/README.md#getcustomvoice) - Get single cloned voice
- [`customVoicesListCustomVoices`](docs/sdks/customvoices/README.md#listcustomvoices) - Gets custom (cloned) voices
- [`customVoicesSearchCustomVoices`](docs/sdks/customvoices/README.md#searchcustomvoices) - Search custom (cloned) voices
- [`textToSpeechCreateSpeech`](docs/sdks/texttospeech/README.md#createspeech) - Convert text to speech
- [`textToSpeechPredictDuration`](docs/sdks/texttospeech/README.md#predictduration) - Predict text-to-speech duration
- [`textToSpeechStreamSpeech`](docs/sdks/texttospeech/README.md#streamspeech) - Convert text to speech with streaming response
- [`usageGetCreditBalance`](docs/sdks/usage/README.md#getcreditbalance) - Retrieve credit balance
- [`usageGetUsage`](docs/sdks/usage/README.md#getusage) - Retrieve advanced API usage analytics
- [`usageGetVoiceUsage`](docs/sdks/usage/README.md#getvoiceusage) - Retrieve TTS API usage data
- [`voicesGetVoice`](docs/sdks/voices/README.md#getvoice) - Get voice details by ID
- [`voicesListVoices`](docs/sdks/voices/README.md#listvoices) - Gets available voices
- [`voicesSearchVoices`](docs/sdks/voices/README.md#searchvoices) - Search voices.

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Start File uploads [file-upload] -->
## File uploads

Certain SDK methods accept files as part of a multi-part request. It is possible and typically recommended to upload files as a stream rather than reading the entire contents into memory. This avoids excessive memory consumption and potentially crashing with out-of-memory errors when working with very large files. The following example demonstrates how to attach a file stream to a request.

> [!TIP]
>
> Depending on your JavaScript runtime, there are convenient utilities that return a handle to a file without reading the entire contents into memory:
>
> - **Node.js v20+:** Since v20, Node.js comes with a native `openAsBlob` function in [`node:fs`](https://nodejs.org/docs/latest-v20.x/api/fs.html#fsopenasblobpath-options).
> - **Bun:** The native [`Bun.file`](https://bun.sh/docs/api/file-io#reading-files-bun-file) function produces a file handle that can be used for streaming file uploads.
> - **Browsers:** All supported browsers return an instance to a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) when reading the value from an `<input type="file">` element.
> - **Node.js v18:** A file stream can be created using the `fileFrom` helper from [`fetch-blob/from.js`](https://www.npmjs.com/package/fetch-blob).

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
<!-- End File uploads [file-upload] -->

<!-- Start Retries [retries] -->
## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:
```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.textToSpeech.createSpeech({
    voiceId: "<id>",
    apiConvertTextToSpeechUsingCharacterRequest: {
      text: "<value>",
      language: "ja",
    },
  }, {
    retries: {
      strategy: "backoff",
      backoff: {
        initialInterval: 1,
        maxInterval: 50,
        exponent: 1.1,
        maxElapsedTime: 100,
      },
      retryConnectionErrors: false,
    },
  });

  console.log(result);
}

run();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:
```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  retryConfig: {
    strategy: "backoff",
    backoff: {
      initialInterval: 1,
      maxInterval: 50,
      exponent: 1.1,
      maxElapsedTime: 100,
    },
    retryConnectionErrors: false,
  },
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.textToSpeech.createSpeech({
    voiceId: "<id>",
    apiConvertTextToSpeechUsingCharacterRequest: {
      text: "<value>",
      language: "ja",
    },
  });

  console.log(result);
}

run();

```
<!-- End Retries [retries] -->

<!-- Start Error Handling [errors] -->
## Error Handling

[`SupertoneError`](./src/models/errors/supertoneerror.ts) is the base class for all HTTP error responses. It has the following properties:

| Property            | Type       | Description                                                                             |
| ------------------- | ---------- | --------------------------------------------------------------------------------------- |
| `error.message`     | `string`   | Error message                                                                           |
| `error.statusCode`  | `number`   | HTTP response status code eg `404`                                                      |
| `error.headers`     | `Headers`  | HTTP response headers                                                                   |
| `error.body`        | `string`   | HTTP body. Can be empty string if no body is returned.                                  |
| `error.rawResponse` | `Response` | Raw HTTP response                                                                       |
| `error.data$`       |            | Optional. Some errors may contain structured data. [See Error Classes](#error-classes). |

### Example
```typescript
import { Supertone } from "@supertone/supertone";
import * as errors from "@supertone/supertone/models/errors";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  try {
    const result = await supertone.textToSpeech.createSpeech({
      voiceId: "<id>",
      apiConvertTextToSpeechUsingCharacterRequest: {
        text: "<value>",
        language: "ja",
      },
    });

    console.log(result);
  } catch (error) {
    // The base class for HTTP error responses
    if (error instanceof errors.SupertoneError) {
      console.log(error.message);
      console.log(error.statusCode);
      console.log(error.body);
      console.log(error.headers);

      // Depending on the method different errors may be thrown
      if (error instanceof errors.BadRequestErrorResponse) {
        console.log(error.data$.status); // string
        console.log(error.data$.message); // string
      }
    }
  }
}

run();

```

### Error Classes
**Primary error:**
* [`SupertoneError`](./src/models/errors/supertoneerror.ts): The base class for HTTP error responses.

<details><summary>Less common errors (16)</summary>

<br />

**Network errors:**
* [`ConnectionError`](./src/models/errors/httpclienterrors.ts): HTTP client was unable to make a request to a server.
* [`RequestTimeoutError`](./src/models/errors/httpclienterrors.ts): HTTP request timed out due to an AbortSignal signal.
* [`RequestAbortedError`](./src/models/errors/httpclienterrors.ts): HTTP request was aborted by the client.
* [`InvalidRequestError`](./src/models/errors/httpclienterrors.ts): Any input used to create a request is invalid.
* [`UnexpectedClientError`](./src/models/errors/httpclienterrors.ts): Unrecognised or unexpected error.


**Inherit from [`SupertoneError`](./src/models/errors/supertoneerror.ts)**:
* [`UnauthorizedErrorResponse`](./src/models/errors/unauthorizederrorresponse.ts): Unauthorized: Invalid API key. Status code `401`. Applicable to 10 of 15 methods.*
* [`InternalServerErrorResponse`](./src/models/errors/internalservererrorresponse.ts): Status code `500`. Applicable to 10 of 15 methods.*
* [`NotFoundErrorResponse`](./src/models/errors/notfounderrorresponse.ts): Status code `404`. Applicable to 9 of 15 methods.*
* [`BadRequestErrorResponse`](./src/models/errors/badrequesterrorresponse.ts): Status code `400`. Applicable to 5 of 15 methods.*
* [`ForbiddenErrorResponse`](./src/models/errors/forbiddenerrorresponse.ts): Status code `403`. Applicable to 4 of 15 methods.*
* [`RequestTimeoutErrorResponse`](./src/models/errors/requesttimeouterrorresponse.ts): Status code `408`. Applicable to 4 of 15 methods.*
* [`TooManyRequestsErrorResponse`](./src/models/errors/toomanyrequestserrorresponse.ts): Status code `429`. Applicable to 4 of 15 methods.*
* [`PaymentRequiredErrorResponse`](./src/models/errors/paymentrequirederrorresponse.ts): Status code `402`. Applicable to 3 of 15 methods.*
* [`PayloadTooLargeErrorResponse`](./src/models/errors/payloadtoolargeerrorresponse.ts): Payload Too Large: File size exceeds 3MB limit. Status code `413`. Applicable to 1 of 15 methods.*
* [`UnsupportedMediaTypeErrorResponse`](./src/models/errors/unsupportedmediatypeerrorresponse.ts): Unsupported Media Type: Invalid audio file format. Status code `415`. Applicable to 1 of 15 methods.*
* [`ResponseValidationError`](./src/models/errors/responsevalidationerror.ts): Type mismatch between the data returned from the server and the structure expected by the SDK. See `error.rawValue` for the raw value and `error.pretty()` for a nicely formatted multi-line string.

</details>

\* Check [the method documentation](#available-resources-and-operations) to see if the error is applicable.
<!-- End Error Handling [errors] -->

<!-- Start Additional Example Code [examples] -->

## Additional Example Code

Additional example code can be found in the [examples](https://github.com/supertone-inc/supertone-ts/tree/main/examples) directory.

<!-- End Additional Example Code [examples] -->


<!-- Start Server Selection [server] -->
## Server Selection

### Override Server URL Per-Client

The default server can be overridden globally by passing a URL to the `serverURL: string` optional parameter when initializing the SDK client instance. For example:
```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  serverURL: "https://supertoneapi.com",
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.textToSpeech.createSpeech({
    voiceId: "<id>",
    apiConvertTextToSpeechUsingCharacterRequest: {
      text: "<value>",
      language: "ja",
    },
  });

  console.log(result);
}

run();

```
<!-- End Server Selection [server] -->

<!-- Start Custom HTTP Client [http-client] -->
## Custom HTTP Client

The TypeScript SDK makes API calls using an `HTTPClient` that wraps the native
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This
client is a thin wrapper around `fetch` and provides the ability to attach hooks
around the request lifecycle that can be used to modify the request or handle
errors and response.

The `HTTPClient` constructor takes an optional `fetcher` argument that can be
used to integrate a third-party HTTP client or when writing tests to mock out
the HTTP client and feed in fixtures.

The following example shows how to use the `"beforeRequest"` hook to to add a
custom header and a timeout to requests and how to use the `"requestError"` hook
to log errors:

```typescript
import { Supertone } from "@supertone/supertone";
import { HTTPClient } from "@supertone/supertone/lib/http";

const httpClient = new HTTPClient({
  // fetcher takes a function that has the same signature as native `fetch`.
  fetcher: (request) => {
    return fetch(request);
  }
});

httpClient.addHook("beforeRequest", (request) => {
  const nextRequest = new Request(request, {
    signal: request.signal || AbortSignal.timeout(5000)
  });

  nextRequest.headers.set("x-custom-header", "custom value");

  return nextRequest;
});

httpClient.addHook("requestError", (error, request) => {
  console.group("Request Error");
  console.log("Reason:", `${error}`);
  console.log("Endpoint:", `${request.method} ${request.url}`);
  console.groupEnd();
});

const sdk = new Supertone({ httpClient });
```
<!-- End Custom HTTP Client [http-client] -->

<!-- Start Debugging [debug] -->
## Debugging

You can setup your SDK to emit debug logs for SDK requests and responses.

You can pass a logger that matches `console`'s interface as an SDK option.

> [!WARNING]
> Beware that debug logging will reveal secrets, like API tokens in headers, in log messages printed to a console or files. It's recommended to use this feature only during local development and not in production.

```typescript
import { Supertone } from "@supertone/supertone";

const sdk = new Supertone({ debugLogger: console });
```
<!-- End Debugging [debug] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->
