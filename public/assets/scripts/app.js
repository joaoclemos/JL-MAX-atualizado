// Constantes TMDB
const API_KEY = '630cfcb6cf927832db7295efc7d27f32';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Função genérica para requisições à API
async function fetchTMDB(endpoint) {
    try {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        url.searchParams.append('api_key', API_KEY);
        url.searchParams.append('language', 'pt-BR');
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        return { results: [] };
    }
}

// Função para carregar filmes
async function carregarFilmes() {
    try {
        const [maisAssistidos, classicos] = await Promise.all([
            fetchTMDB('/movie/popular'),
            fetchTMDB('/discover/movie?sort_by=popularity.desc&include_adult=false&primary_release_year=1990')
        ]);
        
        return { 
            maisAssistidos: maisAssistidos.results,
            classicos: classicos.results
        };
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        return { maisAssistidos: [], classicos: [] };
    }
}

// Funções de favoritos (mantidas)
function togglefavorito(btn, id) {
    btn.classList.toggle("ativo");
    const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");

    if (favoritos.includes(id)) {
        localStorage.setItem("favoritos", JSON.stringify(favoritos.filter(f => f !== id)));
    } else {
        favoritos.push(id);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
    }
}

async function mostrarFavoritos(containerId) {
    const favoritosIds = JSON.parse(localStorage.getItem("favoritos") || "[]");
    const { maisAssistidos, classicos } = await carregarFilmes();
    const todosFilmes = [...maisAssistidos, ...classicos];
    const filmesFavoritos = todosFilmes.filter(filme => favoritosIds.includes(filme.id));
    montarFilmes(filmesFavoritos, containerId);
}

// Função para montar os filmes
function montarFilmes(lista, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = "";
    const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");

    lista.forEach(filme => {
        const ativo = favoritos.includes(filme.id) ? "ativo" : "";
        container.innerHTML += `
            <div class="col-auto mb-4">
                <a href="detalhes.html?id=${filme.id}">
                    <div class="filme" data-id="${filme.id}">
                        <img src="${IMAGE_BASE_URL}${filme.poster_path}" 
                             alt="${filme.title}" 
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/150x225?text=Poster+Não+Disponível'">
                        <button class="favorito ${ativo}" 
                                onclick="togglefavorito(this, ${filme.id}); event.preventDefault();">❤️</button>
                    </div>
                </a>
            </div>
        `;
    });
}

// Função para exibir detalhes do filme
async function exibirDetalhesDoFilme() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) return;

    try {
        const [filme, credits, videos] = await Promise.all([
            fetchTMDB(`/movie/${id}`),
            fetchTMDB(`/movie/${id}/credits`),
            fetchTMDB(`/movie/${id}/videos`)
        ]);

        if (!filme) {
            document.body.innerHTML = "<h1>Filme não encontrado</h1>";
            return;
        }

        // Processar dados
        const direcao = credits.crew.find(m => m.job === 'Director')?.name || '-';
        const elenco = credits.cast.slice(0, 5).map(a => a.name).join(', ') || '-';
        const trailer = videos.results.find(v => v.type === 'Trailer');

        // Preencher dados
        document.getElementById("titulo").textContent = filme.title;
        document.getElementById("imagem").src = `${IMAGE_BASE_URL}${filme.poster_path}`;
        document.getElementById("ano").textContent = filme.release_date?.split('-')[0] || '-';
        document.getElementById("genero").textContent = filme.genres.map(g => g.name).join(', ') || '-';
        document.getElementById("sinopse").textContent = filme.overview || 'Sinopse não disponível';
        document.getElementById("elenco").textContent = elenco;
        document.getElementById("direcao").textContent = direcao;
        document.getElementById("duracao").textContent = filme.runtime ? 
            `${Math.floor(filme.runtime/60)}h ${filme.runtime%60}m` : '-';
        document.getElementById("avaliacao").textContent = filme.vote_average?.toFixed(1);

        // Trailer
        const trailerContainer = document.getElementById("trailer-container");
        if (trailer) {
            trailerContainer.innerHTML = `
                <iframe width="100%" height="315"
                    src="https://www.youtube.com/embed/${trailer.key}"
                    title="Trailer de ${filme.title}"
                    frameborder="0"
                    allowfullscreen>
                </iframe>`;
        } else {
            trailerContainer.innerHTML = "<p>Trailer não disponível</p>";
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        document.body.innerHTML = "<h1>Erro ao carregar filme</h1>";
    }
}

// Função para montar o carrossel
async function montarCarrosselDestaques() {
    try {
        const response = await fetchTMDB('/movie/popular');
        const filmesDestaque = response.results.slice(0, 6);
        
        const carouselInner = document.getElementById('carousel-inner-container');
        const carouselIndicators = document.getElementById('carousel-indicators');
        
        carouselInner.innerHTML = '';
        carouselIndicators.innerHTML = '';
        
        const grupos = [];
        for (let i = 0; i < filmesDestaque.length; i += 3) {
            grupos.push(filmesDestaque.slice(i, i + 3));
        }

        // Indicadores
        grupos.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.dataset.bsTarget = '#destaquesCarousel';
            indicator.dataset.bsSlideTo = index;
            indicator.className = index === 0 ? 'active' : '';
            indicator.setAttribute('aria-current', index === 0 ? 'true' : 'false');
            indicator.setAttribute('aria-label', `Slide ${index + 1}`);
            carouselIndicators.appendChild(indicator);
        });

        // Slides
        grupos.forEach((grupo, index) => {
            const slideItem = document.createElement('div');
            slideItem.className = `carousel-item${index === 0 ? ' active' : ''}`;
            
            const row = document.createElement('div');
            row.className = 'row justify-content-center g-4';

            grupo.forEach(filme => {
                const col = document.createElement('div');
                col.className = 'col-md-4';
                col.innerHTML = `
                    <div class="card bg-dark text-white h-100">
                        <div class="carousel-img-container">
                            <img src="${IMAGE_BASE_URL}${filme.backdrop_path}" 
                                 class="card-img-top carousel-img" 
                                 alt="${filme.title}"
                                 loading="lazy"
                                 onerror="this.src='https://via.placeholder.com/800x450?text=Imagem+Não+Disponível'">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${filme.title}</h5>
                            <p class="card-text">${filme.overview.substring(0, 100)}...</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="badge bg-danger">${filme.vote_average.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                `;
                
                col.querySelector('.carousel-img').addEventListener('click', () => {
                    window.location.href = `detalhes.html?id=${filme.id}`;
                });
                
                row.appendChild(col);
            });

            slideItem.appendChild(row);
            carouselInner.appendChild(slideItem);
        });

        // Inicializar carrossel
        new bootstrap.Carousel(document.getElementById('destaquesCarousel'), {
            interval: 5000,
            keyboard: true,
            pause: 'hover',
            wrap: true
        });
    } catch (error) {
        console.error('Erro ao carregar carrossel:', error);
    }
}

// Inicialização da aplicação
document.addEventListener("DOMContentLoaded", async () => {
    if (!localStorage.getItem("favoritos")) {
        localStorage.setItem("favoritos", JSON.stringify([]));
    }

    if (window.location.pathname.includes("detalhes.html")) {
        await exibirDetalhesDoFilme();
    } else if (window.location.pathname.includes("favoritos.html")) {
        await mostrarFavoritos("lista-favoritos");
    } else {
        await montarCarrosselDestaques();
        const { maisAssistidos, classicos } = await carregarFilmes();
        montarFilmes(maisAssistidos, "maisAssistidos");
        montarFilmes(classicos, "classicos");
    }
});

// Exportar funções para uso global
window.togglefavorito = togglefavorito;
window.mostrarFavoritos = mostrarFavoritos;