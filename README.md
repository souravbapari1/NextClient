# NextClient

`NextClient` is a TypeScript-based HTTP client designed for making API requests with support for JSON and FormData. It provides a simple and intuitive interface for interacting with RESTful APIs.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Creating an Instance](#creating-an-instance)
  - [Making Requests](#making-requests)
    - [GET Request](#get-request)
    - [POST Request](#post-request)
    - [PUT Request](#put-request)
    - [PATCH Request](#patch-request)
    - [DELETE Request](#delete-request)
  - [File Uploads](#file-uploads)
  - [Setting Headers](#setting-headers)
  - [Handling Form Data](#handling-form-data)
  - [Handling Errors](#handling-errors)
- [API Reference](#api-reference)
  - [NextClient](#nextclient)
  - [NextApiError](#nextapierror)
  - [handleNextError](#handlenexterror)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install `NextClient` using npm or yarn. Run the following command in your terminal:

```bash
npm install nextclient
```

or

```bash
yarn add nextclient
```

## Usage

### Creating an Instance

To create an instance of `NextClient`, you need to provide a configuration object with the base URL and optional headers.

```typescript
import { NextClient } from "nextclient";

const nextClient = new NextClient({
  baseUrl: "https://api.example.com",
  debug: true,
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Making Requests

You can make various types of HTTP requests using the methods provided by `NextClient`.

#### GET Request

```typescript
nextClient
  .get("/endpoint")
  .send()
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    handleNextError(error, (res) => {
      console.error(res);
    });
  });
```

#### POST Request

```typescript
nextClient
  .post("/upload")
  .json({ key: "value" })
  .send()
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    handleNextError(error, (res) => {
      console.error(res);
    });
  });
```

#### PUT Request

```typescript
nextClient
  .put("/update/1")
  .json({ key: "newValue" })
  .send()
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    handleNextError(error, (res) => {
      console.error(res);
    });
  });
```

#### PATCH Request

```typescript
nextClient
  .patch("/update/1")
  .json({ key: "updatedValue" })
  .send()
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    handleNextError(error, (res) => {
      console.error(res);
    });
  });
```

#### DELETE Request

```typescript
nextClient
  .delete("/delete/1")
  .send()
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    handleNextError(error, (res) => {
      console.error(res);
    });
  });
```

### File Uploads

To upload files, you can use the `form` method to create a form data request. Here's how to do it:

```typescript
const fileInput = document.querySelector(
  'input[type="file"]'
) as HTMLInputElement;

if (fileInput.files) {
=
  nextClient
    .post("/upload")
    .form({
      file: fileInput.files[0],
    })
    .send()
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      handleNextError(error, (res) => {
        console.error(res);
      });
    });
}
```

### Setting Headers

You can set custom headers for your requests using the `headers` method:

```typescript
nextClient
  .post("/upload")
  .json({ key: "value" })
  .headers({
    Authorization: "Bearer your_token_here",
    "Custom-Header": "CustomValue",
  })
  .send()
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    handleNextError(error, (res) => {
      console.error(res);
    });
  });
```

### Handling Form Data

To send form data, you can use the `form` method. This is useful for submitting forms that include files and other data types:

```typescript
nextClient
  .post("/submit-form")
  .form({
    name: "John Doe",
    age: 30,
    file: new File(["content"], "example.txt", { type: "text/plain" }),
  })
  .send()
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    handleNextError(error, (res) => {
      console.error(res);
    });
  });
```

### Handling Errors

You can handle errors using the `handleNextError` utility function. This function takes an error and a callback to process the error details.

```typescript
import { handleNextError } from "nextclient";

nextClient
  .get("/non-existent-endpoint")
  .send()
  .catch((error) => {
    handleNextError(
      error,
      (res) => {
        console.error("Error details:", res);
      },
      () => {
        console.error("An unexpected error occurred.");
      }
    );
  });
```

## API Reference

### NextClient

#### Constructor

```typescript
constructor(config: NextClientConfig)
```

- **Parameters**:
  - `config`: Configuration object for the client.
    - `baseUrl`: The base URL for the API.
    - `debug`: (optional) Enable debug logging.
    - `headers`: (optional) Default headers for requests.

#### Methods

- `get(path: string, query?: Record<string, any>)`
- `post(path: string, query?: Record<string, any>)`
- `put(path: string, query?: Record<string, any>)`
- `patch(path: string, query?: Record<string, any>)`
- `delete(path: string, query?: Record<string, any>)`
- `send<R>(params?: ParamsSend)`

### NextApiError

`NextApiError` is an error class that extends the built-in `Error` class. It provides additional properties for handling API errors.

#### Properties

- `status`: HTTP status code.
- `statusText`: HTTP status text.
- `url`: The URL of the request.
- `response`: The response object containing error details.

### handleNextError

```typescript
handleNextError<T>(
  error: any,
  callback: (e: { data?: Partial<T>; statusText: string; url: string; message: string }) => void,
  pass?: () => void
)
```

- **Parameters**:
  - `error`: The error object to handle.
  - `callback`: A function to process the error details.
  - `pass`: An optional function to call if the error is not an instance of `NextApiError`.

## Examples

You can find more examples in the `examples` directory of the repository.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.

---

### Conclusion

This documentation provides a comprehensive guide on how to use your `NextClient` package, including detailed sections on file uploads, setting headers, handling form data, and error handling. You can further enhance it by adding more examples, usage scenarios, or specific details about the API endpoints you are working with. Make sure to keep the documentation updated as you make changes to the package.
