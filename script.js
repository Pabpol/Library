// Book class
class Book {
    constructor(title, author, pages, read) {
        this.id = Store.getBooks().length+1;
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
        const deleteEditColumn = document.createElement('td');

        titleColumn.textContent = book.title;
        authorColumn.textContent = book.author;
        pagesColumn.textContent = book.pages;
        readColumn.innerHTML = book.read === 'yes' ? UI.toggleRead('Read', 'checked') : UI.toggleRead('Read', '');
        deleteEditColumn.innerHTML = `<a href="#" class="delete icon" style="margin: 0px 10px 0px 0px;"><i class="fas fa-trash-alt"></i></a><a href="#" class="edit icon"><i class="fas fa-edit"></i></a>`;

        row.appendChild(titleColumn);
        row.appendChild(authorColumn);
        row.appendChild(pagesColumn);
        row.appendChild(readColumn);
        row.appendChild(deleteEditColumn);

        list.appendChild(row);

        // Delete button
        deleteEditColumn.firstChild.addEventListener('click', (e) =>{
            Store.removeBook(book.title);
            UI.deleteBook(e.target);
            UI.showAlert('Book Removed', 'remove');
           
        });

        // Edit button
        deleteEditColumn.lastChild.addEventListener('click', () => {
            UI.openModal(book);
            document.querySelector('.closeBtn').addEventListener('click', () => UI.closModal());
        });
        // Toggle button
        readColumn.firstElementChild.firstElementChild.firstElementChild.addEventListener('click', (e) =>{
            Store.editReadBook(book.title)
            
        });

    }
    static cleanTable(){
        const books = Store.getBooks();
        books.forEach((book) => document.querySelector('table').lastElementChild.firstElementChild.remove())
    }
    static deleteBook(el) {
        if (el.parentElement.classList.contains('delete')) {
            el.parentElement.parentElement.parentElement.remove();
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
    }

    static toggleRead(state, checked){

        let toggleBtn = 
        
        `<div class="radio-list">
        <label class="radio" for="radio__toggle1">
          <input class="radio__toggle" type="checkbox" value="1" ${checked} >
          <span class="radio__span">
            ${state}
          </span>
        </label>
        </div>`
        return  toggleBtn;
        
    }
    static openModal= (book) => {

        document.getElementById('simpleModal').style.display = 'block'
        document.getElementById('title-modal').value = `${book.title}`;
        document.getElementById('author-modal').value = `${book.author}`;
        document.getElementById('pages-modal').value = `${book.pages}`;
        document.getElementById('id-modal').value = `${book.id}`;

    };
    static closModal= () => document.getElementById('simpleModal').style.display = 'none';

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

    static editReadBook(title) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.title === title) {
                book.read === 'yes'? book.read = 'no' :book.read = 'yes';
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
        
    }
    static editBook(editedBook, id) {
        const books = Store.getBooks();

        books.forEach((book) => {
            if (book.id == id) {
                book.title = editedBook.title;
                book.author = editedBook.author;
                book.pages = editedBook.pages;
               
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
    const read = document.forms.form.elements.read.value;
    

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
    }
});

// Event Edit book
document.querySelector('#book-form-modal').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get edit form values
    const titleModal = document.querySelector('#title-modal').value;
    const authorModal = document.querySelector('#author-modal').value;
    const pagesModal = document.querySelector('#pages-modal').value;
    const idModal = document.querySelector('#id-modal').value

    // Validate
    if (titleModal === '' || authorModal === '' || pagesModal === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // Instatiate book
        const editedBook = new Book(titleModal, authorModal, pagesModal);
        
        // Add book to store
        Store.editBook(editedBook, idModal);
        // Remove old books
        UI.cleanTable();
        // Load new books
        UI.displayBooks();
        // Close modal
        UI.closModal();
        // Show success message
        UI.showAlert('Book edited', 'success');

    }
})
