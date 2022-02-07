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

const responseData = (books) => {
  const {
    id, name, publisher,
  } = books;
  return {
    id, name, publisher,
  };
};

const getAllBooksHandler = (req, res) => {
  const { name, reading, finished } = req.query;
  let filteredBooks = bookshelf;
  if (name !== undefined) {
    filteredBooks = bookshelf.filter((bs) => (bs.name.toLowerCase().includes(name.toLowerCase())));
  } else if (reading !== undefined) {
    filteredBooks = bookshelf.filter((bs) => (bs.reading === (reading !== '0')));
  } else if (finished !== undefined) {
    filteredBooks = bookshelf.filter((bs) => (bs.finished === (finished !== '0')));
  }

  const data = filteredBooks.map(responseData);
  const response = res.response({
    status: 'success',
    data: {
      books: data,
    },
  });
  response.code(200);
  return response;
};

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

const updateBooksHandler = (req, res) => {
  const { bookId } = req.params;
  const index = bookshelf.findIndex((book) => book.id === bookId);
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;
  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  if (name === undefined) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = res.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    bookshelf[index] = {
      ...bookshelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = res.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = res.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBooksHandler = (req, res) => {
  const { bookId } = req.params;
  const index = bookshelf.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    bookshelf.splice(index, 1);
    const response = res.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = res.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBooksHandler,
  deleteBooksHandler,
};
