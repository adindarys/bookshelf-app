const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];

function isStorageExist() {
  return typeof Storage !== "undefined";
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) books = JSON.parse(data);
}

function generateId() {
  return +new Date();
}

function addBook(title, author, year, isComplete) {
  const newBook = {
    id: generateId(),
    title,
    author,
    year: Number(year),
    isComplete,
  };
  books.push(newBook);
  saveData();
  renderBooks();
}

function editBook(id, newTitle, newAuthor, newYear, newIsComplete) {
  const book = books.find((b) => b.id === id);
  if (book) {
    book.title = newTitle;
    book.author = newAuthor;
    book.year = Number(newYear);
    book.isComplete = newIsComplete;
    saveData();
    renderBooks();
  }
}

function deleteBook(id) {
  books = books.filter((b) => b.id !== id);
  saveData();
  renderBooks();
}

function toggleBookStatus(id) {
  const book = books.find((b) => b.id === id);
  if (book) {
    book.isComplete = !book.isComplete;
    saveData();
    renderBooks();
  }
}

function renderBooks(filterTitle = "") {
  const incompleteList = document.getElementById("incompleteBookList");
  const completeList = document.getElementById("completeBookList");

  incompleteList.innerHTML = "";
  completeList.innerHTML = "";

  books
    .filter((book) =>
      book.title.toLowerCase().includes(filterTitle.toLowerCase())
    )
    .forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.setAttribute("data-bookid", book.id);
      bookItem.setAttribute("data-testid", "bookItem");

      bookItem.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
          <button data-testid="bookItemIsCompleteButton">
            ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
          </button>
          <button data-testid="bookItemDeleteButton">Hapus Buku</button>
          <button data-testid="bookItemEditButton">Edit Buku</button>
        </div>
      `;

      bookItem
        .querySelector("[data-testid=bookItemIsCompleteButton]")
        .addEventListener("click", () => toggleBookStatus(book.id));

      bookItem
        .querySelector("[data-testid=bookItemDeleteButton]")
        .addEventListener("click", () => {
          if (confirm("Yakin mau hapus buku ini?")) deleteBook(book.id);
        });

      bookItem
        .querySelector("[data-testid=bookItemEditButton]")
        .addEventListener("click", () => openEditForm(book));

      if (book.isComplete) {
        completeList.appendChild(bookItem);
      } else {
        incompleteList.appendChild(bookItem);
      }
    });
}

function openEditForm(book) {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  const form = document.createElement("form");
  form.classList.add("edit-form");
  form.innerHTML = `
    <h3>Edit Buku</h3>
    <input type="text" id="editTitle" value="${book.title}" required />
    <input type="text" id="editAuthor" value="${book.author}" required />
    <input type="number" id="editYear" value="${book.year}" required />
    <label>
      <input type="checkbox" id="editIsComplete" 
        ${book.isComplete ? "checked" : ""}/> 
      Selesai dibaca
    </label>
    <div class="form-actions">
      <button type="submit">Simpan</button>
      <button type="button" id="cancelEdit">Batal</button>
    </div>
  `;

  overlay.appendChild(form);
  document.body.appendChild(overlay);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    editBook(
      book.id,
      document.getElementById("editTitle").value,
      document.getElementById("editAuthor").value,
      document.getElementById("editYear").value,
      document.getElementById("editIsComplete").checked
    );
    document.body.removeChild(overlay);
  });

  form.querySelector("#cancelEdit").addEventListener("click", () => {
    document.body.removeChild(overlay);
  });
}

document.getElementById("bookForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  addBook(title, author, year, isComplete);
  this.reset();
});

document.getElementById("searchBook").addEventListener("submit", function (e) {
  e.preventDefault();
  const searchValue = document.getElementById("searchBookTitle").value.trim();
  renderBooks(searchValue);
});

window.addEventListener("DOMContentLoaded", () => {
  if (isStorageExist()) loadData();
  renderBooks();
});