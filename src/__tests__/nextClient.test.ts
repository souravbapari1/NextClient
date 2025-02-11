import { NextClient } from "../index"; // Adjust the import based on your file structure

const nextClient = new NextClient({
  baseUrl: "https://fakestoreapi.com",
  debug: true,
  headers: {
    "Content-Type": "application/json",
  },
});

describe("NextClient Tests with Fake Store API", () => {
  it("GET /products should return a list of products", async () => {
    const response = await nextClient.get("/products").send();
    expect(response.data).toBeInstanceOf(Array);
    expect(response.status).toBe(200);
    expect(response.data.length).toBeGreaterThan(0);
  });

  it("GET /products/1 should return a single product", async () => {
    const response = await nextClient.get("/products/1").send();
    expect(response.data).toHaveProperty("id", 1);
    expect(response.status).toBe(200);
  });

  it("POST /products should create a new product", async () => {
    const newProduct = {
      title: "New Product",
      price: 29.99,
      description: "This is a new product.",
      image: "https://fakestoreapi.com/img/61IBJVvnlUL._AC_UL640_QL65_ML3_.jpg",
      category: "electronics",
    };

    // Note: The Fake Store API may not allow creating products without authentication.
    // This is just an example; you may need to adjust based on the API's requirements.
    const response = await nextClient.post("/products").json(newProduct).send();
    expect(response.data).toHaveProperty("id");
    expect(response.data.title).toBe(newProduct.title);
    expect(response.status).toBe(200);
  });

  it("PUT /products/1 should update the product", async () => {
    const updatedProduct = {
      id: 1,
      title: "Updated Product",
      price: 19.99,
      description: "This is an updated product.",
      image: "https://fakestoreapi.com/img/61IBJVvnlUL._AC_UL640_QL65_ML3_.jpg",
      category: "electronics",
    };

    // Note: The Fake Store API may not allow updating products without authentication.
    const response = await nextClient
      .put("/products/1")
      .json(updatedProduct)
      .send();
    expect(response.data).toHaveProperty("id", 1);
    expect(response.data.title).toBe(updatedProduct.title);
    expect(response.status).toBe(200);
  });

  it("DELETE /products/1 should delete the product", async () => {
    // Note: The Fake Store API may not allow deleting products without authentication.
    const response = await nextClient.delete("/products/1").send();
    expect(response.status).toBe(200);
  });

  it("GET /products/1 after deletion should return 404", async () => {
    await nextClient.delete("/products/1").send(); // Ensure the product is deleted
    try {
      await nextClient.get("/products/1").send();
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error); // Adjust this based on your error class
      expect(error.response.status).toBe(404);
    }
  });

  it("GET /products/999 should return 404", async () => {
    try {
      await nextClient.get("/products/999").send();
    } catch (error: any) {
      expect(error).toBeInstanceOf(Error); // Adjust this based on your error class
      expect(error.response.status).toBe(404);
    }
  });
});
