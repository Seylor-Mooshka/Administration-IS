document.addEventListener('DOMContentLoaded', function() {
    // Объявление всех переменных
    const booksContainer = document.getElementById('booksContainer');
    const addBookBtn = document.getElementById('addBookBtn');
    const bookModal = document.getElementById('bookModal');
    const detailModal = document.getElementById('detailModal');
    const closeModal = document.getElementById('closeModal');
    const closeDetailModal = document.getElementById('closeDetailModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const bookForm = document.getElementById('bookForm');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const coverUpload = document.getElementById('coverUpload');
    const coverInput = document.getElementById('coverInput');
    const coverPreview = document.getElementById('coverPreview');
    const totalBooksEl = document.getElementById('totalBooks');
    const readBooksEl = document.getElementById('readBooks');
    const toReadBooksEl = document.getElementById('toReadBooks');
    const favoriteBooksEl = document.getElementById('favoriteBooks');

    let currentFilter = 'all';
    let selectedBookId = null;
    let currentRating = 0;
    let coverImage = null;

    // Пример начальных данных
    const sampleBooks = [
        {
            id: 1,
            title: "Преступление и наказание",
            author: "Федор Достоевский",
            genre: "Классика",
            pages: 671,
            status: "read",
            startDate: "2024-01-15",
            finishDate: "2024-02-20",
            language: "Русский",
            quote: "Я не тебе кланяюсь, я всему страданию человеческому кланяюсь.",
            rating: 5,
            isFavorite: true,
            cover: "https://cdn.culture.ru/images/6b4e7d6f-5c0c-5f72-8e44-37153d3a80f6"
        },
        {
            id: 2,
            title: "Мастер и Маргарита",
            author: "Михаил Булгаков",
            genre: "Роман",
            pages: 480,
            status: "read",
            startDate: "2024-03-01",
            finishDate: "2024-03-15",
            language: "Русский",
            quote: "Рукописи не горят.",
            rating: 5,
            isFavorite: true,
            cover: "https://cdn.culture.ru/images/6f2503f1-1c6c-5f0d-931e-1f8d6c7c8c4f"
        },
        {
            id: 3,
            title: "1984",
            author: "Джордж Оруэлл",
            genre: "Антиутопия",
            pages: 328,
            status: "read",
            startDate: "2024-03-01",
            finishDate: "2024-03-15",
            language: "Русский",
            rating: 0,
            isFavorite: false,
            cover: "https://m.media-amazon.com/images/I/71rpa1-kyvL._AC_UF1000,1000_QL80_.jpg"
        },
        {
            id: 4,
            title: "Тень ветра",
            author: "Карлос Руис Сафон",
            genre: "Мистика",
            pages: 572,
            status: "unread",
            language: "Русский",
            quote: "Каждая книга — это мир, который открывается перед нами.",
            rating: 4,
            isFavorite: false,
            cover: "https://cdn.culture.ru/images/8d4e6f3a-7b9c-5d72-8e44-37153d3a80f6"
        },
        {
            id: 5,
            title: "Атлант расправил плечи",
            author: "Айн Рэнд",
            genre: "Философский роман",
            pages: 1394,
            status: "read",
            startDate: "2024-05-10",
            finishDate: "2024-05-25",
            language: "Русский",
            quote: "Я никогда не буду жить ради другого человека и никогда не попрошу другого человека жить ради меня.",
            rating: 4,
            isFavorite: true,
            cover: "https://m.media-amazon.com/images/I/71lK8ReLzLL._AC_UF1000,1000_QL80_.jpg"
        },
        {
            id: 6,
            title: "Маленькие женщины",
            author: "Луиза Мэй Олкотт",
            genre: "Роман",
            pages: 759,
            status: "unread",
            language: "Русский",
            quote: "Я не боюсь бурь, ведь я учусь управлять своим кораблем.",
            rating: 0,
            isFavorite: false,
            cover: "https://cdn.culture.ru/images/5b4e7d6f-5c0c-5f72-8e44-37153d3a80f6"
        }
    ];

    // Загружаем книги из localStorage или используем примеры
    let books = JSON.parse(localStorage.getItem('books'));

    // Если нет книг в localStorage, сохраняем примеры
    if (!books) {
        books = sampleBooks;
        localStorage.setItem('books', JSON.stringify(books));
    }

    // Сохраняем книги в localStorage
    function saveBooks() {
        localStorage.setItem('books', JSON.stringify(books));
        updateStats();
        console.log("Данные сохранены в localStorage:", JSON.parse(localStorage.getItem('books')));
    }

    // Обновляем статистику
    function updateStats() {
        const total = books.length;
        const read = books.filter(book => book.status === 'read').length;
        const toRead = books.filter(book => book.status === 'unread').length;
        const favorites = books.filter(book => book.isFavorite).length;

        if (totalBooksEl) totalBooksEl.textContent = total;
        if (readBooksEl) readBooksEl.textContent = read;
        if (toReadBooksEl) toReadBooksEl.textContent = toRead;
        if (favoriteBooksEl) favoriteBooksEl.textContent = favorites;

        console.log("Обновление статистики:");
        console.log("Всего книг:", total);
        console.log("Прочитано:", read);
        console.log("В планах:", toRead);
        console.log("Избранное:", favorites);
        console.log("Прочитанные книги:", books.filter(book => book.status === 'read').map(book => book.id));
    }

    // Функция для отображения книг
    function renderBooks() {
        if (!booksContainer) return;

        booksContainer.innerHTML = '';

        let filteredBooks = books;

        if (currentFilter === 'read') {
            filteredBooks = books.filter(book => book.status === 'read');
        } else if (currentFilter === 'unread') {
            filteredBooks = books.filter(book => book.status === 'unread');
        } else if (currentFilter === 'favorites') {
            filteredBooks = books.filter(book => book.isFavorite);
        } else if (currentFilter === 'recent') {
            filteredBooks = [...books].sort((a, b) => b.id - a.id).slice(0, 5);
        }

        if (filteredBooks.length === 0) {
            booksContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <p>В этой категории пока нет книг</p>
                    <button class="btn btn-primary" id="addFirstBook">Добавить первую книгу</button>
                </div>
            `;

            const addFirstBookBtn = document.getElementById('addFirstBook');
            if (addFirstBookBtn) {
                addFirstBookBtn.addEventListener('click', () => {
                    if (bookModal) bookModal.style.display = 'flex';
                });
            }
            return;
        }

        filteredBooks.forEach((book) => {
            const bookEl = document.createElement('div');
            bookEl.className = `book ${book.status}`;
            bookEl.dataset.id = book.id;

            const coverStyle = book.cover ? `background-image: url('${book.cover}')` : '';

            bookEl.innerHTML = `
                <div class="book-inner">
                    <div class="book-cover" style="${coverStyle}">
                        <div class="book-actions">
                            <button class="book-action-btn toggle-favorite">
                                <i class="${book.isFavorite ? 'fas' : 'far'} fa-star"></i>
                            </button>
                            <button class="book-action-btn delete-book">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="book-spine"></div>
                        <div class="book-title">${book.title}</div>
                        <div class="book-author">${book.author}</div>
                        ${book.pages ? `<div class="book-pages">${book.pages} стр.</div>` : ''}
                    </div>
                </div>
            `;
            booksContainer.appendChild(bookEl);

            bookEl.addEventListener('click', (e) => {
                if (!e.target.closest('.book-actions')) {
                    showBookDetails(book.id);
                }
            });

            const favoriteBtn = bookEl.querySelector('.toggle-favorite');
            const deleteBtn = bookEl.querySelector('.delete-book');

            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleFavorite(book.id);
                });
            }

            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteBook(book.id);
                });
            }
        });
    }

    // Показать детали книги
    function showBookDetails(bookId) {
        const book = books.find(b => b.id === bookId);
        if (!book || !detailModal) return;

        selectedBookId = bookId;

        const coverStyle = book.cover ? `background-image: url('${book.cover}')` : '';

        const detailsHtml = `
            <div class="book-cover-large" style="${coverStyle}">
                <div class="book-spine"></div>
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
            </div>
            <div class="book-info">
                <h2>${book.title}</h2>
                <div class="book-info-item">
                    <span class="book-info-label">Автор:</span>
                    <span class="book-info-value">${book.author}</span>
                </div>
                ${book.genre ? `<div class="book-info-item">
                    <span class="book-info-label">Жанр:</span>
                    <span class="book-info-value">${book.genre}</span>
                </div>` : ''}
                ${book.pages ? `<div class="book-info-item">
                    <span class="book-info-label">Страниц:</span>
                    <span class="book-info-value">${book.pages}</span>
                </div>` : ''}
                <div class="book-info-item">
                    <span class="book-info-label">Статус:</span>
                    <span class="book-info-value">${book.status === 'read' ? 'Прочитано' : 'В планах/В процессе'}</span>
                </div>
                ${book.startDate ? `<div class="book-info-item">
                    <span class="book-info-label">Начало:</span>
                    <span class="book-info-value">${formatDate(book.startDate)}</span>
                </div>` : ''}
                ${book.finishDate ? `<div class="book-info-item">
                    <span class="book-info-label">Окончание:</span>
                    <span class="book-info-value">${formatDate(book.finishDate)}</span>
                </div>` : ''}
                ${book.language ? `<div class="book-info-item">
                    <span class="book-info-label">Язык:</span>
                    <span class="book-info-value">${book.language}</span>
                </div>` : ''}
                ${book.rating > 0 ? `<div class="book-info-item">
                    <span class="book-info-label">Оценка:</span>
                    <span class="book-info-value">
                        ${generateRatingStars(book.rating)}
                    </span>
                </div>` : ''}
                ${book.quote ? `<div class="book-info-item">
                    <span class="book-info-label">Любимая цитата:</span>
                    <span class="book-info-value"><em>${book.quote}</em></span>
                </div>` : ''}
                <div class="form-actions">
                    <button class="btn btn-secondary" id="closeDetailsBtn">Закрыть</button>
                    <button class="btn btn-primary" id="editBookBtn">Редактировать</button>
                </div>
            </div>
        `;

        document.getElementById('bookDetails').innerHTML = detailsHtml;
        detailModal.style.display = 'flex';

        document.getElementById('closeDetailsBtn').addEventListener('click', () => {
            detailModal.style.display = 'none';
        });

        document.getElementById('editBookBtn').addEventListener('click', () => {
            detailModal.style.display = 'none';
            editBook(bookId);
        });
    }

    // Форматирование даты
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }

    // Генерация звезд рейтинга
    function generateRatingStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="${i <= rating ? 'fas' : 'far'} fa-star"></i> `;
        }
        return stars;
    }

    // Переключение избранного
    function toggleFavorite(bookId) {
        const bookIndex = books.findIndex(b => b.id === bookId);
        if (bookIndex !== -1) {
            books[bookIndex].isFavorite = !books[bookIndex].isFavorite;
            saveBooks();
            renderBooks();
        }
    }

    // Удаление книги
    function deleteBook(bookId) {
        if (confirm('Вы уверены, что хотите удалить эту книгу?')) {
            books = books.filter(b => b.id !== bookId);
            saveBooks();
            renderBooks();
        }
    }

    // Редактирование книги
    function editBook(bookId) {
        const book = books.find(b => b.id === bookId);
        if (!book || !bookModal) return;

        document.getElementById('title').value = book.title || '';
        document.getElementById('author').value = book.author || '';
        document.getElementById('genre').value = book.genre || '';
        document.getElementById('pages').value = book.pages || '';
        document.getElementById('status').value = book.status || 'unread';
        document.getElementById('startDate').value = book.startDate || '';
        document.getElementById('finishDate').value = book.finishDate || '';
        document.getElementById('language').value = book.language || '';
        document.getElementById('quote').value = book.quote || '';

        currentRating = book.rating || 0;
        updateRatingStars();

        if (book.cover) {
            coverPreview.style.display = 'block';
            coverPreview.src = book.cover;
            coverImage = book.cover;
        }

        bookModal.style.display = 'flex';

        bookForm.onsubmit = function(e) {
            e.preventDefault();

            const bookIndex = books.findIndex(b => b.id === bookId);
            if (bookIndex !== -1) {
                books[bookIndex] = {
                    ...books[bookIndex],
                    title: document.getElementById('title').value.trim(),
                    author: document.getElementById('author').value.trim(),
                    genre: document.getElementById('genre').value.trim(),
                    pages: document.getElementById('pages').value ? parseInt(document.getElementById('pages').value, 10) : undefined,
                    status: document.getElementById('status').value,
                    startDate: document.getElementById('startDate').value,
                    finishDate: document.getElementById('finishDate').value,
                    language: document.getElementById('language').value.trim(),
                    quote: document.getElementById('quote').value.trim(),
                    rating: currentRating,
                    cover: coverImage
                };

                saveBooks();
                renderBooks();
                bookModal.style.display = 'none';
                bookForm.reset();
                coverPreview.style.display = 'none';
                coverImage = null;

                bookForm.onsubmit = originalSubmitHandler;
            }
        };
    }

    // Обработчик добавления новой книги
    const originalSubmitHandler = function(e) {
        e.preventDefault();

        const newBook = {
            id: Date.now(),
            title: document.getElementById('title').value.trim(),
            author: document.getElementById('author').value.trim(),
            genre: document.getElementById('genre').value.trim(),
            pages: document.getElementById('pages').value ? parseInt(document.getElementById('pages').value, 10) : undefined,
            status: document.getElementById('status').value,
            startDate: document.getElementById('startDate').value,
            finishDate: document.getElementById('finishDate').value,
            language: document.getElementById('language').value.trim(),
            quote: document.getElementById('quote').value.trim(),
            rating: currentRating,
            isFavorite: false,
            cover: coverImage
        };

        books.push(newBook);
        saveBooks();
        renderBooks();
        if (bookModal) bookModal.style.display = 'none';
        bookForm.reset();
        if (coverPreview) {
            coverPreview.style.display = 'none';
            coverPreview.src = '';
        }
        coverImage = null;
        currentRating = 0;
        updateRatingStars();
    };

    // Обработка загрузки обложки
    if (coverUpload) {
        coverUpload.addEventListener('click', () => {
            if (coverInput) coverInput.click();
        });
    }

    if (coverInput) {
        coverInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    if (coverPreview) {
                        coverPreview.style.display = 'block';
                        coverPreview.src = e.target.result;
                    }
                    coverImage = e.target.result;
                }

                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    // Обновление звезд рейтинга
    function updateRatingStars() {
        const stars = document.querySelectorAll('#rating .rating-star');
        stars.forEach(star => {
            const value = parseInt(star.dataset.value);
            if (value <= currentRating) {
                star.classList.add('fas');
                star.classList.remove('far');
            } else {
                star.classList.add('far');
                star.classList.remove('fas');
            }
        });
    }

    // Сброс состояния формы и модалки
    function resetFormState() {
        if (!bookForm) return;
        bookForm.reset();
        currentRating = 0;
        updateRatingStars();
        coverImage = null;
        if (coverPreview) {
            coverPreview.style.display = 'none';
            coverPreview.src = '';
        }
    }

    // Обработчики событий
    if (addBookBtn) {
        addBookBtn.addEventListener('click', () => {
            if (bookModal) bookModal.style.display = 'flex';
            resetFormState();
            bookForm.onsubmit = originalSubmitHandler;
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (bookModal) bookModal.style.display = 'none';
            resetFormState();
        });
    }

    if (closeDetailModal) {
        closeDetailModal.addEventListener('click', () => {
            if (detailModal) detailModal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (bookModal) bookModal.style.display = 'none';
            resetFormState();
        });
    }

    const ratingElement = document.getElementById('rating');
    if (ratingElement) {
        ratingElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('rating-star')) {
                currentRating = parseInt(e.target.dataset.value);
                updateRatingStars();
            }
        });
    }

    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                renderBooks();
            });
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === bookModal) {
            if (bookModal) bookModal.style.display = 'none';
            resetFormState();
        }
        if (e.target === detailModal) {
            if (detailModal) detailModal.style.display = 'none';
        }
    });

    // Инициализация
    if (bookForm) {
        bookForm.onsubmit = originalSubmitHandler;
    }
    updateStats();
    renderBooks();
});
