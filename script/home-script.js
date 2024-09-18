document.addEventListener("DOMContentLoaded", function () {
    const cardsContainer = document.getElementById('cardsContainer');
    const carouselInner = document.getElementById('carouselInner');
    const pagination = document.getElementById('pagination');
    const searchForm = document.querySelector('form[role="search"]');
    const searchInput = searchForm.querySelector('input[type="search"]');
    const homeLink = document.getElementById('homeLink');

    let page = 1;
    const pageSize = 12;
    let searchQuery = '';

    function fetchShows(page, query = '') {
        let url = `https://api.tvmaze.com/shows?&select=id,name,genre,image`;
        if (query) {
            url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
        }

        axios.get(url)
            .then(response => {
                let shows = query ? response.data.map(item => item.show) : response.data;
                shows = shows.slice((page - 1) * pageSize, page * pageSize);

                let cardsHtml = '';
                let carouselHtml = '';
                shows.slice(0, 12).forEach(show => {
                    carouselHtml += `
                <div class="carousel-item${show === shows[0] ? ' active' : ''}">
                    <img src="${show.image ? show.image.original : '../icons/default.jpg'}" class="d-block w-100"
                        alt="${show.name}">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${show.name}</h5>
                    </div>
                </div>
            `;
                });

                carouselInner.innerHTML = carouselHtml;

                shows.forEach(show => {
                    cardsHtml += `
                <div class="col-md-3 mb-4">
                    <div class="card">
                        <img src="${show.image ? show.image.medium : '../icons/default.jpg'}" class="card-img-top" alt="${show.name}">
                        <div class="card-body">
                            <h5 class="card-title">${show.name}</h5>
                            <p class="card-text">${show.genres ? show.genres.join(', ') : 'No genre'}</p>
                            <a href="details.html?id=${show.id}" class="btn btn-more-info">Show Details</a>
                        </div>
                    </div>
                </div>
            `;
                });

                cardsContainer.innerHTML = cardsHtml;

                const totalItems = query ? response.data.length : response.data.length;
                const totalPages = Math.ceil(totalItems / pageSize);

                let paginationHtml = '';
                for (let i = 1; i <= totalPages; i++) {
                    paginationHtml += `
                <li class="page-item${i === page ? ' active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
                }
                pagination.innerHTML = paginationHtml;
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    fetchShows(page);

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        searchQuery = searchInput.value.trim();
        page = 1;
        fetchShows(page, searchQuery);
    });

    pagination.addEventListener('click', (event) => {
        if (event.target.classList.contains('page-link')) {
            page = parseInt(event.target.getAttribute('data-page'));
            fetchShows(page, searchQuery);
        }
    });

    homeLink.addEventListener('click', (event) => {
        event.preventDefault();
        searchQuery = '';
        searchInput.value = '';
        page = 1;
        fetchShows(page);
    });
});
