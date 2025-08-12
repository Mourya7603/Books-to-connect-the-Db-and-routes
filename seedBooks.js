const { initializeDatabase } = require("./db/db.connect"); 
const Book = require("./models/book.models");
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
initializeDatabase();

// 1. Create a book
async function createBook(bookData) {
  try {
    const book = new Book(bookData);
    const savedBook = await book.save();
    console.log("New Book data:", savedBook);
    return savedBook;
  } catch (error) {
    throw error;
  }
}

app.post("/books", async (req, res) => {
  try {
    const savedBook = await createBook(req.body);
    res.status(201).json({ message: "Book added successfully.", book: savedBook });
  } catch (error) {
    res.status(500).json({ error: "Failed to add book." });
  }
});

// 3. Get all books
async function readAllBooks() {
  try {
    return await Book.find();
  } catch (error) {
    throw error;
  }
}

app.get("/books", async (req, res) => {
  try {
    const books = await readAllBooks();
    if (books.length !== 0) res.json(books);
    else res.status(404).json({ error: "No books found." });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// 4. Get book by title
async function readBookByTitle(title) {
  try {
    return await Book.findOne({ title });
  } catch (error) {
    throw error;
  }
}

app.get("/books/title/:title", async (req, res) => {
  try {
    const book = await readBookByTitle(req.params.title);
    if (book) res.json(book);
    else res.status(404).json({ error: "Book not found." });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book." });
  }
});

// 5. Get books by author
async function readBooksByAuthor(author) {
  try {
    return await Book.find({ author });
  } catch (error) {
    throw error;
  }
}

app.get("/books/author/:author", async (req, res) => {
  try {
    const books = await readBooksByAuthor(req.params.author);
    if (books.length !== 0) res.json(books);
    else res.status(404).json({ error: "No books found." });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// 6. Get books by genre
async function readBooksByGenre(genreName) {
  try {
    return await Book.find({ genre: genreName });
  } catch (error) {
    throw error;
  }
}

app.get("/books/genre/:genreName", async (req, res) => {
  try {
    const books = await readBooksByGenre(req.params.genreName);
    if (books.length !== 0) res.json(books);
    else res.status(404).json({ error: "No books found." });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// 7. Get books by year
async function readBooksByYear(year) {
  try {
    return await Book.find({ publishedYear: year });
  } catch (error) {
    throw error;
  }
}

app.get("/books/year/:year", async (req, res) => {
  try {
    const books = await readBooksByYear(parseInt(req.params.year));
    if (books.length !== 0) res.json(books);
    else res.status(404).json({ error: "No books found." });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// 8. Update book by ID
async function updateBookById(bookId, dataToUpdate) {
  try {
    return await Book.findByIdAndUpdate(bookId, dataToUpdate, { new: true });
  } catch (error) {
    throw error;
  }
}

app.post("/books/:bookId", async (req, res) => {
  try {
    const updatedBook = await updateBookById(req.params.bookId, req.body);
    if (updatedBook) {
      res.status(200).json({ message: "Book updated successfully.", updatedBook });
    } else {
      res.status(404).json({ error: "Book does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update book." });
  }
});

// 9. Update book by title
async function updateBookByTitle(title, dataToUpdate) {
  try {
    return await Book.findOneAndUpdate({ title }, dataToUpdate, { new: true });
  } catch (error) {
    throw error;
  }
}

app.post("/books/title/:title", async (req, res) => {
  try {
    const updatedBook = await updateBookByTitle(req.params.title, req.body);
    if (updatedBook) {
      res.status(200).json({ message: "Book updated successfully.", updatedBook });
    } else {
      res.status(404).json({ error: "Book does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update book." });
  }
});

// 10. Delete book by ID
async function deleteBook(bookId) {
  try {
    return await Book.findByIdAndDelete(bookId);
  } catch (error) {
    throw error;
  }
}

app.delete("/books/:bookId", async (req, res) => {
  try {
    const deletedBook = await deleteBook(req.params.bookId);
    if (deletedBook) {
      res.status(200).json({ message: "Book deleted successfully." });
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book." });
  }
});

const PORT = 7000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
