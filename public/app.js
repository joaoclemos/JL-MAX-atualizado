// Constantes
const API_BASE_URL = 'http://localhost:3000';

// Função para carregar filmes da API
async function carregarFilmes() {
    try {
        const [maisAssistidos, classicos] = await Promise.all([
            fetch(`${API_BASE_URL}/maisAssistidos`).then(res => res.json()),
            fetch(`${API_BASE_URL}/classicos`).then(res => res.json())
        ]);
        return { maisAssistidos, classicos };
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        return { maisAssistidos: [], classicos: [] };
    }
}

// Funções de favoritos
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

// Função para montar os filmes na tela
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
                        <img src="${filme.imagem}" alt="${filme.titulo}" loading="lazy">
                        <button class="favorito ${ativo}" onclick="togglefavorito(this, '${filme.id}'); event.preventDefault();">❤️</button>
                    </div>
                </a>
            </div>
        `;
    });
}

// Função para extrair ID do YouTube
function extrairIdYoutube(url) {
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^?&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Função para exibir detalhes do filme
async function exibirDetalhesDoFilme() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) return;

    try {
        let response = await fetch(`${API_BASE_URL}/maisAssistidos?id=${id}`);
        let filme = (await response.json())[0];
        
        if (!filme) {
            response = await fetch(`${API_BASE_URL}/classicos?id=${id}`);
            filme = (await response.json())[0];
        }

        if (!filme) {
            document.body.innerHTML = "<h1>Filme não encontrado</h1>";
            return;
        }

        // Preenche os dados na página
        document.getElementById("titulo").textContent = filme.titulo;
        document.getElementById("imagem").src = filme.imagem;
        document.getElementById("imagem").alt = filme.titulo;
        document.getElementById("ano").textContent = filme.ano || "-";
        document.getElementById("genero").textContent = filme.genero || "-";
        document.getElementById("sinopse").textContent = filme.sinopse || "-";
        document.getElementById("elenco").textContent = filme.elenco || "-";
        document.getElementById("direcao").textContent = filme.direcao || "-";
        document.getElementById("duracao").textContent = filme.duracao || "-";
        document.getElementById("avaliacao").textContent = filme.avaliacao || "-";

        if (filme.Trailer) {
            document.getElementById("trailer-container").innerHTML = `
                <iframe width="100%" height="315"
                    src="https://www.youtube.com/embed/${extrairIdYoutube(filme.Trailer)}"
                    title="Trailer de ${filme.titulo}" frameborder="0"
                    allowfullscreen>
                </iframe>
            `;
        } else {
            document.getElementById("trailer-container").innerHTML = "<p>Trailer não disponível</p>";
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        document.body.innerHTML = "<h1>Erro ao carregar filme</h1>";
    }
}

// Função para montar o carrossel
async function montarCarrosselDestaques() {
    try {
        const response = await fetch(`${API_BASE_URL}/maisAssistidos`);
        const maisAssistidos = await response.json();
        const filmesDestaque = maisAssistidos.slice(0, 6);
        
        const carouselInner = document.getElementById('carousel-inner-container');
        const carouselIndicators = document.getElementById('carousel-indicators');
        
        carouselInner.innerHTML = '';
        carouselIndicators.innerHTML = '';
        
        const grupos = [];
        for (let i = 0; i < filmesDestaque.length; i += 3) {
            grupos.push(filmesDestaque.slice(i, i + 3));
        }

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
                            <img src="${filme.imagemCarrossel || filme.imagem}" 
                                 class="card-img-top carousel-img" 
                                 alt="${filme.titulo}"
                                 loading="lazy">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${filme.titulo}</h5>
                            <p class="card-text">${filme.sinopse.substring(0, 100)}...</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="badge bg-danger">${filme.avaliacao}</span>
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