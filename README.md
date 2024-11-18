# NextClient API Documentation

## Overview

The `NextClient` library provides a simple and consistent interface for interacting with RESTful APIs. It supports multiple HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) and includes helpers for working with query parameters, JSON data, and `FormData`.

---

## Installation

Include the library in your project by importing the necessary classes:

```javascript
import { NextClient } from "./NextClient";
```

---

## Usage

### 1. **Initialize the Client**

Create an instance of the `NextClient` by specifying the base URL of your API.

```javascript
const client = new NextClient("https://api.example.com", {
  headers: {
    Authorization: "Bearer YOUR_API_TOKEN",
  },
});
```

---

### 2. **Available Methods**

#### `GET` Requests

Use `get()` to fetch data. Optionally include query parameters.

```javascript
client
  .get("/users", { limit: 10, page: 1 })
  .send()
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

---

#### `POST` Requests

Use `post()` to send data as JSON.

```javascript
client
  .post("/users", { name: "John Doe", email: "john@example.com" })
  .send()
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

---

#### `PUT` Requests

Use `put()` to update resources.

```javascript
client
  .put("/users/1", { email: "john.new@example.com" })
  .send()
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

---

#### `PATCH` Requests

Use `patch()` for partial updates.

```javascript
client
  .patch("/users/1", { email: "john.partial@example.com" })
  .send()
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

---

#### `DELETE` Requests

Use `delete()` to remove a resource.

```javascript
client
  .delete("/users/1")
  .send()
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

---

### 3. **Form Data Handling**

If you need to send `FormData` instead of JSON, use the `form()` method.

```javascript
client
  .post("/upload")
  .form({
    file: new Blob(["file content"], { type: "text/plain" }),
    name: "example.txt",
  })
  .send()
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

You can also append files:

```javascript
client
  .post("/upload")
  .form({})
  .append("file", new File(["file content"], "example.txt"))
  .send()
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

---

### 4. **Handling Errors**

The library throws an `HttpError` for non-200 HTTP responses. Handle it like this:

```javascript
client
  .get("/invalid-endpoint")
  .send()
  .catch((error) => {
    if (error instanceof HttpError) {
      console.error(`HTTP Error ${error.statusCode}:`, error.response);
    } else {
      console.error("Request failed:", error);
    }
  });
```

---

## Classes Overview

### `NextClient`

Main entry point to configure the API client.

- **Constructor**

  - `baseUrl`: Base URL for all requests.
  - `init`: Default `RequestInit` settings (e.g., headers).

- **Methods**
  - `.get(path, query?)`
  - `.post(path, query?)`
  - `.put(path, query?)`
  - `.patch(path, query?)`
  - `.delete(path, query?)`

---

### `ToPath`

Intermediate handler for HTTP methods.

- **Methods**
  - `.form(data)`: Converts JSON to `FormData`.
  - `.json(data)`: Sends JSON body.
  - `.send(headers?)`: Executes the request.

---

### `JsonRequest`

Handles sending JSON payloads with the `Content-Type: application/json` header.

---

### `FormRequest`

Handles sending `FormData`, supporting file uploads.

---

### `HttpError`

Custom error for non-200 responses.

- **Properties**
  - `statusCode`: HTTP status code.
  - `response`: Error response text or object.

---

## Examples

### Fetch with Query Parameters

```javascript
client
  .get("/search", { term: "example", limit: 5 })
  .send()
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

### Create a Resource

```javascript
client
  .post("/items", { name: "New Item", description: "A test item" })
  .send()
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

### Update a Resource

```javascript
client
  .put("/items/1", { description: "Updated description" })
  .send()
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

### Upload a File

```javascript
const file = new File(["Hello, world!"], "hello.txt", { type: "text/plain" });

client
  .post("/upload")
  .form({})
  .append("file", file)
  .send()
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

---

## Error Handling Example

```javascript
client
  .get("/non-existent")
  .send()
  .catch((error) => {
    if (error instanceof HttpError) {
      console.error("Server responded with an error:", error.response);
    } else {
      console.error("An unexpected error occurred:", error);
    }
  });
```

---

## License

MIT License. See `LICENSE` file for details.
