# Supertone TypeScript Library

![LOGO](https://github.com/supertone-inc/supertone-ts/blob/main/images/hero-light.svg)

<!-- Start Summary [summary] -->
## API & Docs

The official Python SDK for [Supertone API](https://www.supertone.ai/en/api)

<!-- End Summary [summary] -->

<!-- Start SDK Installation [installation] -->
## SDK Installation

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
## Speech Generation Example

### Example

```typescript
import { Supertone } from "supertone";

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
import { Supertone } from "supertone";

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

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

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

<!-- End Available Resources and Operations [operations] -->

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

### Error Handling Example
```typescript
import { Supertone } from "supertone";
import * as errors from "supertone/models/errors";

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

<!-- End Error Handling [errors] -->

<!-- Start Additional Example Code [examples] -->
## Additional Example Code

Additional example code can be found in the [examples](https://github.com/supertone-inc/supertone-ts/tree/main/examples) directory.

<!-- End Additional Example Code [examples] -->


<!-- Placeholder for Future Speakeasy SDK Sections -->
