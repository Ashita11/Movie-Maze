const API_KEY = 'api_key=bc7df0bc132af1112d2132e02079429e';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL+'/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const searchURL = BASE_URL + '/search/movie?' + API_KEY;
const viewMoreButton = document.getElementById('more');

let currentPage = 1;
let currentSearchTerm = '';

function fetchMovies(url) {
    fetch(url).then(res => res.json()).then(data => {
            showMovies(data.results);
            if (data.page < data.total_pages) {
                viewMoreButton.style.display = 'block';
            } else {
                viewMoreButton.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
        });
}


function getColor(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const { title, poster_path, vote_average, overview, id } = movie;
        const me = document.createElement('div');
        me.classList.add('movie');

        const link = document.createElement('a');
        link.href = `https://www.themoviedb.org/movie/${id}`;
        link.target = '_blank';
        link.classList.add('link');

        link.innerHTML = `
            <img src="${IMG_URL + poster_path}" alt="${title}">
            <div class="movieinfo">
                <h3>${title}</h3>
                <span class=${getColor(vote_average)}>${vote_average}</span>
            </div>
            <div class="overview">
                ${overview}
            </div>
        `;

        me.appendChild(link);
        main.appendChild(me);
    });
}

fetchMovies(API_URL);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    currentSearchTerm = search.value;

    if (currentSearchTerm && currentSearchTerm !== '') {
        currentPage = 1;
        main.innerHTML = '';
        fetchMovies(`${searchURL}${currentSearchTerm}&page=${currentPage}`);
        search.value = '';
    } else {
        window.location.reload();
    }
});

viewMoreButton.addEventListener('click', () => {
    currentPage++;
    if (currentSearchTerm && currentSearchTerm !== '') {
        fetchMovies(`${searchURL}${currentSearchTerm}&page=${currentPage}`);
    } else {
        fetchMovies(`${API_URL}&page=${currentPage}`);
    }
});
