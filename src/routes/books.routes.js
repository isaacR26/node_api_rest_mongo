const express = require("express");
const router = express.Router();
const Book = require("../models/books.model");

//MIDDELWARE

const getBook = async (req, res, next) => {
  let book;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "el Id del libro no es valido",
    });
  }

  try {
    book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        message: "el libro no fue encontrado",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
  res.book = book;
  next();
};

//obtener todos los libros

router.get("/", async (req, res) => {
  try {
    const books = await Book.find(); // Asegúrate de que `Book` está importado correctamente
    console.log("GET ALL", books);

    if (books.length === 0) {
      return res.status(204).json([]); // 204 No Content
    }

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Crear un nuevo libro

router.post("/", async (req, res) => {
  try {
    const { title, author, genere, publication_date } = req?.body;
    if (!title || !author || !genere || !publication_date) {
      return res.status(400).json({
        message: "los campos titulo, autor, genero y fecha son obligatorios",
      });
    }
    const book = new Book({ title, author, genere, publication_date });
    const newBook = await book.save();
    console.log(newBook);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// GET INDIVIDUAL

router.get("/:id", getBook, async (req, res) => {
  res.json(res.book);
});

//PUT

router.put("/:id", getBook, async (req, res) => {
  try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genere = req.body.genere || book.genere;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({
      messge: error.message,
    });
  }
});

//PATCH

router.patch("/:id", getBook, async (req, res) => {
  if (
    !req.body.title &&
    !req.body.author &&
    !req.body.genere &&
    !req.body.publication_date
  ) {
    res.status(400).json({
      message:
        "Al menos uno de estos campos debe ser enviado: Titulo, Autor, Genero o fecha de publicacion. ",
    });
  }

  try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genere = req.body.genere || book.genere;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({
      messge: error.message,
    });
  }
});

//DELETE

router.delete("/:id", getBook, async (req, res) => {
  try {
    const book = res.book;
    await book.deleteOne({
      _id: book._id,
    });
    res.json({
      message: `El linro ${book.title} fue eliminado correctamente`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
