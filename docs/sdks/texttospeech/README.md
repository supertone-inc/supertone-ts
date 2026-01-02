# TextToSpeech
(*textToSpeech*)

## Overview

Text-to-Speech API endpoints

### Available Operations

* [createSpeech](#createspeech) - Convert text to speech
* [streamSpeech](#streamspeech) - Convert text to speech with streaming response
* [predictDuration](#predictduration) - Predict text-to-speech duration

## createSpeech

Convert text to speech using the specified voice

### Example Usage

<!-- UsageSnippet language="typescript" operationID="create_speech" method="post" path="/v1/text-to-speech/{voice_id}" -->
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

### Standalone function

The standalone function version of this method:

```typescript
import { SupertoneCore } from "@supertone/supertone/core.js";
import { textToSpeechCreateSpeech } from "@supertone/supertone/funcs/textToSpeechCreateSpeech.js";

// Use `SupertoneCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const supertone = new SupertoneCore({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const res = await textToSpeechCreateSpeech(supertone, {
    voiceId: "<id>",
    apiConvertTextToSpeechUsingCharacterRequest: {
      text: "<value>",
      language: "ja",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("textToSpeechCreateSpeech failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.CreateSpeechRequest](../../models/operations/createspeechrequest.md)                                                                                               | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |


### Response

**Promise\<[operations.CreateSpeechResponse](../../models/operations/createspeechresponse.md)\>**

### Errors

| Error Type                          | Status Code                         | Content Type                        |
| ----------------------------------- | ----------------------------------- | ----------------------------------- |
| errors.BadRequestErrorResponse      | 400                                 | application/json                    |
| errors.UnauthorizedErrorResponse    | 401                                 | application/json                    |
| errors.PaymentRequiredErrorResponse | 402                                 | application/json                    |
| errors.ForbiddenErrorResponse       | 403                                 | application/json                    |
| errors.NotFoundErrorResponse        | 404                                 | application/json                    |
| errors.RequestTimeoutErrorResponse  | 408                                 | application/json                    |
| errors.TooManyRequestsErrorResponse | 429                                 | application/json                    |
| errors.InternalServerErrorResponse  | 500                                 | application/json                    |
| errors.SupertoneDefaultError        | 4XX, 5XX                            | \*/\*                               |

## streamSpeech

Convert text to speech using the specified voice with streaming response. Returns binary audio stream.

### Example Usage

<!-- UsageSnippet language="typescript" operationID="stream_speech" method="post" path="/v1/text-to-speech/{voice_id}/stream" -->
```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.textToSpeech.streamSpeech({
    voiceId: "<id>",
    apiConvertTextToSpeechUsingCharacterRequest: {
      text: "<value>",
      language: "pt",
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
import { textToSpeechStreamSpeech } from "@supertone/supertone/funcs/textToSpeechStreamSpeech.js";

// Use `SupertoneCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const supertone = new SupertoneCore({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const res = await textToSpeechStreamSpeech(supertone, {
    voiceId: "<id>",
    apiConvertTextToSpeechUsingCharacterRequest: {
      text: "<value>",
      language: "pt",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("textToSpeechStreamSpeech failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.StreamSpeechRequest](../../models/operations/streamspeechrequest.md)                                                                                               | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.StreamSpeechResponse](../../models/operations/streamspeechresponse.md)\>**

### Errors

| Error Type                          | Status Code                         | Content Type                        |
| ----------------------------------- | ----------------------------------- | ----------------------------------- |
| errors.BadRequestErrorResponse      | 400                                 | application/json                    |
| errors.UnauthorizedErrorResponse    | 401                                 | application/json                    |
| errors.PaymentRequiredErrorResponse | 402                                 | application/json                    |
| errors.ForbiddenErrorResponse       | 403                                 | application/json                    |
| errors.NotFoundErrorResponse        | 404                                 | application/json                    |
| errors.RequestTimeoutErrorResponse  | 408                                 | application/json                    |
| errors.TooManyRequestsErrorResponse | 429                                 | application/json                    |
| errors.InternalServerErrorResponse  | 500                                 | application/json                    |
| errors.SupertoneDefaultError        | 4XX, 5XX                            | \*/\*                               |


## Pronunciation Dictionary

You can customize how specific words or phrases are spoken by providing a **pronunciation dictionary** in each request.

This is useful for proper nouns, brand names, acronyms, or loanwords that may not be pronounced as intended by default.

The pronunciation dictionary is applied during **text pre-processing**, before the text is sent to the TTS engine.

---

### How it works

Each pronunciation rule consists of the following fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `text` | string | :heavy_check_mark: | The target text to replace |
| `pronunciation` | string | :heavy_check_mark: | The pronunciation that should be spoken |
| `partial_match` | boolean | :heavy_check_mark: | Whether to allow partial (substring) matching |

### Matching behavior

- **`partial_match = false`**
    
    Replaces the text only when it matches a **whole word** (word boundary match).
    
- **`partial_match = true`**
    
    Replaces **all occurrences** of the text as a substring, regardless of word boundaries.
    

### Rule order and conflicts

- Rules are applied **in the order they are provided**.
- If multiple rules target the same text, **the first matching rule takes precedence**.
- Once text is replaced by a rule, it is not re-replaced by later rules.

---

### Example Usage (TypeScript)

```tsx
import {Supertone }from"@supertone/supertone";

const supertone =newSupertone({
apiKey:"<YOUR_API_KEY_HERE>",
});

asyncfunctionrun() {
const result =await supertone.textToSpeech.createSpeech({
voiceId:"<id>",
apiConvertTextToSpeechUsingCharacterRequest: {
text:"The Supertone API supports TTS and STS.",
language:"en",
pronunciationDictionary: [
        {
text:"Supertone",
pronunciation:"super tone",
partial_match:false,
        },
        {
text:"TTS",
pronunciation:"text to speech",
partial_match:true,
        },
      ],
    },
  });

console.log(result);
}

run();

```

> The pronunciationDictionary parameter is optional.
> 
> If it is not provided, text-to-speech behaves exactly the same as before.


## predictDuration

Predict the duration of text-to-speech conversion without generating audio

### Example Usage

<!-- UsageSnippet language="typescript" operationID="predict_duration" method="post" path="/v1/predict-duration/{voice_id}" -->
```typescript
import { Supertone } from "@supertone/supertone";

const supertone = new Supertone({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const result = await supertone.textToSpeech.predictDuration({
    voiceId: "<id>",
    predictTTSDurationUsingCharacterRequest: {
      text: "<value>",
      language: "ja",
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
import { textToSpeechPredictDuration } from "@supertone/supertone/funcs/textToSpeechPredictDuration.js";

// Use `SupertoneCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const supertone = new SupertoneCore({
  apiKey: "<YOUR_API_KEY_HERE>",
});

async function run() {
  const res = await textToSpeechPredictDuration(supertone, {
    voiceId: "<id>",
    predictTTSDurationUsingCharacterRequest: {
      text: "<value>",
      language: "ja",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("textToSpeechPredictDuration failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.PredictDurationRequest](../../models/operations/predictdurationrequest.md)                                                                                         | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.PredictDurationResponse](../../models/operations/predictdurationresponse.md)\>**

### Errors

| Error Type                          | Status Code                         | Content Type                        |
| ----------------------------------- | ----------------------------------- | ----------------------------------- |
| errors.BadRequestErrorResponse      | 400                                 | application/json                    |
| errors.UnauthorizedErrorResponse    | 401                                 | application/json                    |
| errors.PaymentRequiredErrorResponse | 402                                 | application/json                    |
| errors.ForbiddenErrorResponse       | 403                                 | application/json                    |
| errors.NotFoundErrorResponse        | 404                                 | application/json                    |
| errors.RequestTimeoutErrorResponse  | 408                                 | application/json                    |
| errors.TooManyRequestsErrorResponse | 429                                 | application/json                    |
| errors.InternalServerErrorResponse  | 500                                 | application/json                    |
| errors.SupertoneDefaultError        | 4XX, 5XX                            | \*/\*                               |
