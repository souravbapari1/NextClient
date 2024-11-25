import { HttpError } from "../errror";
import { NextClient } from "../request";
const client = new NextClient(
  "https://g2g-files.souravbapari.in",
  {
    headers: {
      "x-secret-key": "123456",
    },
  },
  {
    debug: true,
  }
);

const getData = async () => {
  const file = new File(["sadsa"], "sourav.pdf", { type: "application/pdf" });
  const file2 = new File(["sadsasdsaa"], "sourav3.pdf", {
    type: "application/pdf",
  });

  try {
    const response = await client
      .post("/test")
      .form({
        status: true,
        age: 5,
        map: { sourav: "sourav" },
        files: [file, file2],
      })
      .send();
    console.log(response);
  } catch (error) {
    if (error instanceof HttpError) {
      console.log(error.response.code);
    }
  }
};

console.log("hello");
getData();
