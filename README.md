# Supertone TypeScript Library

![LOGO](https://github.com/supertone-inc/supertone-ts/blob/main/images/hero-light.png?raw=true)

<!-- Start Summary [summary] -->
## Summary

Supertone Public API: Supertone API is a RESTful API for using our state-of-the-art AI voice models.
<!-- End Summary [summary] -->

<!-- Start SDK Installation [installation] -->
## SDK Installation

The SDK can be installed with either [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/) or [yarn](https://classic.yarnpkg.com/en/) package managers.

### NPM

```bash
npm add @supertone/supertone
```

### PNPM

```bash
pnpm add @supertone/supertone
```

### Bun

```bash
bun add @supertone/supertone
```

### Yarn

```bash
yarn add @supertone/supertone zod

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

<!-- Placeholder for Future Speakeasy SDK Sections -->
