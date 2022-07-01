const books = [];
const RENDER_EVENT = 'render-book';
const localStorageKey = 'BOOK_SHELF';
const SAVED_EVENT = 'saved-book';
const RENDER_SEARCH_RESULT = 'render-search-result';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    const searchForm = document.getElementById('searchBook');

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        searchResultBook();
    });

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    };
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(localStorageKey));
});

document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
    const uncompletedBookist = document.getElementById('incompleteBookshelfList');
    uncompletedBookist.innerHTML = '';

    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML = '';

    const resultBookList = document.getElementById('searchResultBookshelfList');
    resultBookList.innerHTML = '';
    resultBookList.append('');
    
    for (const bookItem of books) {
        const bookElement = makeBookShelf(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBookist.append(bookElement);
        } else {
            completedBookList.append(bookElement);
        }
    }
});

function searchResultBook(){
    const searchKey = document.getElementById('searchBookTitle').value;
    let results = books.filter((bookObject) => bookObject.title.toLowerCase() == searchKey.toLowerCase());

    const resultBookList = document.getElementById('searchResultBookshelfList');
    resultBookList.innerHTML = '';

    console.log("resut => ", results);
    for (const bookItem of results) {
        const bookElement = makeBookShelf(bookItem);
        resultBookList.append(bookElement)
    }
};

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(localStorageKey);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
};

function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookIsComplete = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookObject = generateTodoObject(generatedID, bookTitle, bookAuthor, bookYear, bookIsComplete);
    console.log(bookObject);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function generateId() {
    return +new Date();
};

function generateTodoObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
};

function makeBookShelf(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;
   
    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${bookObject.year}`;
   
    const article = document.createElement('article');
    article.classList.add('book_item');
    article.append(textTitle, textAuthor, textYear);
    article.setAttribute('id', `todo-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const doneButton = document.createElement('button');
        doneButton.classList.add('green');
        doneButton.innerText = 'Belum Selesai Dibaca'
     
        doneButton.addEventListener('click', function () {
            moveBookToComplete(bookObject.id);
        });
     
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus'
     
        deleteButton.addEventListener('click', function () {
            confirmRemove(bookObject.id);
        });

        const actionContainer = document.createElement('div');
        actionContainer.classList.add('action');
     
        actionContainer.append(doneButton, deleteButton);
        article.append(actionContainer);
      } else {
        const doneButton = document.createElement('button');
        doneButton.classList.add('green');
        doneButton.innerText = 'Selesai Dibaca';
     
        doneButton.addEventListener('click', function () {
            moveBookToComplete(bookObject.id);
        });
     
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus';
     
        deleteButton.addEventListener('click', function () {
            confirmRemove(bookObject.id);
        });
     
        const actionContainer = document.createElement('div');
        actionContainer.classList.add('action');
     
        actionContainer.append(doneButton, deleteButton);
        article.append(actionContainer);
      }
   
    return article;
};

function moveBookToComplete (bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = !bookTarget.isCompleted;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
};

function confirmRemove(bookId) {
    if (confirm("Apakah Kamu yakin?")) {
        deleteBookFromList(bookId)
    }
};

function deleteBookFromList(bookId) {
    const bookTarget = findBookIndex(bookId);
   
    if (bookTarget === -1) return;
   
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function findBookIndex(bookId) {
    for (const i in books) {
      if (books[i].id === bookId) {
        return i;
      }
    }
   
    return -1;
};

function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
};

function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(localStorageKey, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
};

