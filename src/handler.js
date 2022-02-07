const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');

const addBookHandler = (req, res) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  if (name === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBookshelf = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  bookshelf.push(newBookshelf);

  const isSuccess = bookshelf.filter((bs) => bs.id === id).length > 0;

  if (isSuccess) {
    const response = res.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = res.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = () => ({
  status: 'success',
  data: {
    books: bookshelf.map(({ id, name, publisher }) => ({
      id,
      name,
      publisher,
    })),
  },
});

const getBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const book = bookshelf.filter((b) => b.id === bookId)[0];
  if (book !== undefined) {
    const response = res.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = res.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBooksHandler = () => {};

const deleteBooksHandler = () => {};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBooksHandler,
  deleteBooksHandler,
};
