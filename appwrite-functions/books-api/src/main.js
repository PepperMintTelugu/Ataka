import { Client, Databases, Storage, Query, ID } from "node-appwrite";

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const storage = new Storage(client);

  const DATABASE_ID = "ataka_db";
  const BOOKS_COLLECTION = "books";

  try {
    const { path, method, ...body } = JSON.parse(req.bodyRaw || "{}");

    switch (path) {
      case "/books":
        if (method === "GET") {
          return await getBooks(body);
        } else if (method === "POST") {
          return await createBook(body);
        }
        break;

      case "/books/:id":
        if (method === "GET") {
          return await getBook(body.id);
        } else if (method === "PUT") {
          return await updateBook(body.id, body);
        } else if (method === "DELETE") {
          return await deleteBook(body.id);
        }
        break;

      case "/books/search":
        return await searchBooks(body);

      case "/books/featured":
        return await getFeaturedBooks(body);

      case "/books/bestsellers":
        return await getBestsellers(body);

      case "/books/category/:category":
        return await getBooksByCategory(body.category, body);

      default:
        return res.json({ success: false, message: "Endpoint not found" }, 404);
    }
  } catch (err) {
    error("Error processing request:", err);
    return res.json({ success: false, message: err.message }, 500);
  }

  async function getBooks(filters = {}) {
    try {
      const queries = [Query.equal("isActive", true)];

      if (filters.category) {
        queries.push(Query.equal("category", filters.category));
      }
      if (filters.featured) {
        queries.push(Query.equal("featured", true));
      }
      if (filters.bestseller) {
        queries.push(Query.equal("bestseller", true));
      }
      if (filters.newArrival) {
        queries.push(Query.equal("newArrival", true));
      }
      if (filters.limit) {
        queries.push(Query.limit(parseInt(filters.limit)));
      }
      if (filters.offset) {
        queries.push(Query.offset(parseInt(filters.offset)));
      }

      queries.push(Query.orderDesc("$createdAt"));

      const response = await databases.listDocuments(
        DATABASE_ID,
        BOOKS_COLLECTION,
        queries,
      );

      return res.json({
        success: true,
        data: response.documents,
        total: response.total,
      });
    } catch (err) {
      throw new Error(`Failed to fetch books: ${err.message}`);
    }
  }

  async function getBook(id) {
    try {
      const book = await databases.getDocument(
        DATABASE_ID,
        BOOKS_COLLECTION,
        id,
      );
      return res.json({ success: true, data: book });
    } catch (err) {
      throw new Error(`Failed to fetch book: ${err.message}`);
    }
  }

  async function createBook(bookData) {
    try {
      const book = await databases.createDocument(
        DATABASE_ID,
        BOOKS_COLLECTION,
        ID.unique(),
        {
          ...bookData,
          createdAt: new Date().toISOString(),
          isActive: true,
          rating: 0,
          reviewCount: 0,
          salesCount: 0,
        },
      );
      return res.json({ success: true, data: book });
    } catch (err) {
      throw new Error(`Failed to create book: ${err.message}`);
    }
  }

  async function updateBook(id, bookData) {
    try {
      const book = await databases.updateDocument(
        DATABASE_ID,
        BOOKS_COLLECTION,
        id,
        {
          ...bookData,
          updatedAt: new Date().toISOString(),
        },
      );
      return res.json({ success: true, data: book });
    } catch (err) {
      throw new Error(`Failed to update book: ${err.message}`);
    }
  }

  async function deleteBook(id) {
    try {
      await databases.updateDocument(DATABASE_ID, BOOKS_COLLECTION, id, {
        isActive: false,
        deletedAt: new Date().toISOString(),
      });
      return res.json({ success: true, message: "Book deleted successfully" });
    } catch (err) {
      throw new Error(`Failed to delete book: ${err.message}`);
    }
  }

  async function searchBooks(filters) {
    try {
      const queries = [Query.equal("isActive", true)];

      if (filters.search) {
        queries.push(Query.search("title", filters.search));
      }
      if (filters.limit) {
        queries.push(Query.limit(parseInt(filters.limit)));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        BOOKS_COLLECTION,
        queries,
      );

      return res.json({
        success: true,
        data: response.documents,
        total: response.total,
      });
    } catch (err) {
      throw new Error(`Failed to search books: ${err.message}`);
    }
  }

  async function getFeaturedBooks(filters = {}) {
    try {
      const queries = [
        Query.equal("isActive", true),
        Query.equal("featured", true),
        Query.limit(parseInt(filters.limit) || 10),
        Query.orderDesc("$createdAt"),
      ];

      const response = await databases.listDocuments(
        DATABASE_ID,
        BOOKS_COLLECTION,
        queries,
      );

      return res.json({
        success: true,
        data: response.documents,
      });
    } catch (err) {
      throw new Error(`Failed to fetch featured books: ${err.message}`);
    }
  }

  async function getBestsellers(filters = {}) {
    try {
      const queries = [
        Query.equal("isActive", true),
        Query.equal("bestseller", true),
        Query.limit(parseInt(filters.limit) || 10),
        Query.orderDesc("salesCount"),
      ];

      const response = await databases.listDocuments(
        DATABASE_ID,
        BOOKS_COLLECTION,
        queries,
      );

      return res.json({
        success: true,
        data: response.documents,
      });
    } catch (err) {
      throw new Error(`Failed to fetch bestsellers: ${err.message}`);
    }
  }

  async function getBooksByCategory(category, filters = {}) {
    try {
      const queries = [
        Query.equal("isActive", true),
        Query.equal("category", category),
        Query.limit(parseInt(filters.limit) || 20),
        Query.orderDesc("$createdAt"),
      ];

      if (filters.offset) {
        queries.push(Query.offset(parseInt(filters.offset)));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        BOOKS_COLLECTION,
        queries,
      );

      return res.json({
        success: true,
        data: response.documents,
        total: response.total,
      });
    } catch (err) {
      throw new Error(`Failed to fetch books by category: ${err.message}`);
    }
  }
};
