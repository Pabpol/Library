// Book class
class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;

    }
}

// UI class
class UI {
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book))

    }
    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');
        const titleColumn = document.createElement('td');
        const authorColumn = document.createElement('td');
        const pagesColumn = document.createElement('td');
        const readColumn = document.createElement('td');
        const deleteColumn = document.createElement('td');

        titleColumn.textContent = book.title;
        authorColumn.textContent = book.author;
        pagesColumn.textContent = book.pages;
        readColumn.textContent = book.read === 'yes' ? 'Read' : 'Not read';
        deleteColumn.innerHTML = '<a href="#" class="delete">X</a>';

      

        row.appendChild(titleColumn);
        row.appendChild(authorColumn);
        row.appendChild(pagesColumn);
        row.appendChild(readColumn);
        row.appendChild(deleteColumn);

        list.appendChild(row);
    }
    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('body');
        const form = document.querySelector('.form');
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#pages').value = '';
        document.querySelector('.read').value = '';
    }
}

// Storeage class
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(title) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.title === title) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
        
    }

}

// Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);
// Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const pages = document.querySelector('#pages').value;
    const read = document.querySelector('.read').value;

    // Validate
    if (title === '' || author === '' || pages === '' || read === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // Instatiate book
        const book = new Book(title, author, pages, read);

        // Add Book to UI
        UI.addBookToList(book);

        // Add book to store
        Store.addBook(book);

        // Show success message
        UI.showAlert('Book Added', 'success');

        // Clear fields
        UI.clearFields();

        //Delete button function
        // Event: Remove a book
        document.querySelectorAll('.delete').forEach((btn) => {
            btn.addEventListener('click', (e) =>{
                Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent);
                UI.deleteBook(e.target);
                UI.showAlert('Book Removed', 'remove');
            });
        }); 
    }
});

