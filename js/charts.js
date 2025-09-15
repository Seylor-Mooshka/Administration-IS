document.addEventListener('DOMContentLoaded', function() {
    // Загружаем книги из localStorage
    let books = JSON.parse(localStorage.getItem('books'));

    console.log("Проверка localStorage на странице статистики:", books);

    // Проверяем, есть ли книги
    if (!books || books.length === 0) {
        const chartsContainer = document.querySelector('.charts-container');
        if (chartsContainer) {
            chartsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chart-pie"></i>
                    <p>Нет данных для отображения графиков.</p>
                    <a href="index.html" class="btn btn-primary">Добавить книги</a>
                </div>
            `;
        }
        return;
    }

    // Подготовка данных для графиков
    const genres = {};
    books.forEach(book => {
        if (book.genre) {
            genres[book.genre] = (genres[book.genre] || 0) + 1;
        }
    });

    // Если нет данных по жанрам, добавляем дефолтные значения
    if (Object.keys(genres).length === 0) {
        genres["Без жанра"] = books.length;
    }

    // Подготовка данных для графика "Прочитано по месяцам"
    const readBooks = books.filter(book => book.status === 'read');

    console.log("Прочитанные книги на странице статистики:", readBooks);
    console.log("ID прочитанных книг:", readBooks.map(book => book.id));

    // Подробная отладка прочитанных книг
    console.group("Статистика: проверка прочитанных книг");
    console.log("Всего книг:", books.length);
    console.log("Прочитано книг:", readBooks.length);
    console.table(readBooks.map(b => ({
        id: b.id,
        title: b.title,
        author: b.author,
        status: b.status,
        startDate: b.startDate || null,
        finishDate: b.finishDate || null,
        rating: typeof b.rating === 'number' ? b.rating : null,
        isFavorite: !!b.isFavorite
    })));

    // Возможные несоответствия статусов/дат
    const finishedButNotRead = books.filter(b => b.status !== 'read' && b.finishDate);
    if (finishedButNotRead.length) {
        console.warn("Найдены книги с датой окончания, но статус не 'read':", finishedButNotRead.map(b => ({ id: b.id, title: b.title, status: b.status, finishDate: b.finishDate })));
    } else {
        console.log("Несоответствий статусов/дат не обнаружено.");
    }

    // Группировка прочитанных по месяцам (YYYY-MM)
    const readByMonth = readBooks.reduce((acc, b) => {
        const dateSrc = b.finishDate || b.startDate;
        if (!dateSrc) return acc;
        const d = new Date(dateSrc);
        if (isNaN(d)) return acc;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    console.log("Прочитано по месяцам (YYYY-MM):", readByMonth);
    console.groupEnd();

    // График по жанрам
    const genreCtx = document.getElementById('genreChart');
    if (genreCtx) {
        new Chart(genreCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(genres),
                datasets: [{
                    data: Object.values(genres),
                    backgroundColor: [
                        'rgba(200, 169, 113, 0.8)',
                        'rgba(177, 127, 75, 0.8)',
                        'rgba(139, 69, 19, 0.8)',
                        'rgba(160, 82, 45, 0.8)',
                        'rgba(105, 105, 105, 0.8)'
                    ],
                    borderColor: [
                        'rgba(200, 169, 113, 1)',
                        'rgba(177, 127, 75, 1)',
                        'rgba(139, 69, 19, 1)',
                        'rgba(160, 82, 45, 1)',
                        'rgba(105, 105, 105, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#e8e0c9',
                            font: {
                                family: "'Playfair Display', serif"
                            }
                        }
                    }
                }
            }
        });
    }

    // График по месяцам
    const monthlyCtx = document.getElementById('monthlyChart');
    if (monthlyCtx) {
        new Chart(monthlyCtx, {
            type: 'bar',
            data: {
                labels: ["Текущий месяц"],
                datasets: [{
                    label: 'Прочитано книг',
                    data: [readBooks.length],
                    backgroundColor: 'rgba(200, 169, 113, 0.8)',
                    borderColor: 'rgba(200, 169, 113, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#e8e0c9'
                        },
                        grid: {
                            color: 'rgba(200, 169, 113, 0.2)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#e8e0c9',
                            font: {
                                size: 10
                            }
                        },
                        grid: {
                            color: 'rgba(200, 169, 113, 0.2)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#e8e0c9',
                            font: {
                                family: "'Playfair Display', serif"
                            }
                        }
                    }
                }
            }
        });
    }
});
