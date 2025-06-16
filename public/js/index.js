document.addEventListener("DOMContentLoaded", async () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }

    try {
        await montarCarrosselDestaques();
        const response = await fetch('http://localhost:3000/filmes');
        const filmes = await response.json();
        
        filmes.sort((a, b) => b.ano - a.ano);
        const maisAssistidos = filmes.slice(0, 8);
        const classicos = filmes.slice(8);
        
        montarListaFilmes(maisAssistidos, 'maisAssistidos');
        montarListaFilmes(classicos, 'classicos');

        // Adicionar evento de pesquisa
        document.getElementById('search-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            filterItems(searchTerm, filmes);
        });

        document.getElementById('searchInput').addEventListener('input', () => {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            filterItems(searchTerm, filmes);
        });
    } catch (error) {
        console.error("Erro ao carregar filmes:", error);
        alert("Erro ao carregar filmes. Tente recarregar a página.");
    }
});

function filterItems(searchTerm, filmes) {
    const filteredFilmes = filmes.filter(filme => 
        filme.titulo.toLowerCase().includes(searchTerm) || 
        filme.sinopse.toLowerCase().includes(searchTerm)
    );
    const maisAssistidosFiltered = filteredFilmes.slice(0, 8);
    const classicosFiltered = filteredFilmes.slice(8);
    montarListaFilmes(maisAssistidosFiltered, 'maisAssistidos');
    montarListaFilmes(classicosFiltered, 'classicos');
}

function montarListaFilmes(filmes, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.className = 'movie-grid'; // Garante que use a classe movie-grid
    container.innerHTML = '';
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const favoritos = usuarioLogado?.favoritos || [];
    
    filmes.forEach(filme => {
        const isFavorito = favoritos.includes(filme.id) ? 'ativo' : '';
        const col = document.createElement('div');
        col.className = '';
        col.innerHTML = `
            <div class="filme-card">
                <a href="detalhes.html?id=${filme.id}">
                    <div class="filme-image-container">
                        <img src="${filme.imagem}" 
                             alt="${filme.titulo}" 
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/200x300?text=Poster+Não+Disponível'"
                             style="width: 100%; height: 100%; object-fit: cover;">
                        <button class="favorito ${isFavorito}" onclick="togglefavorito(this, '${filme.id}'); event.preventDefault();">
                            ❤️
                        </button>
                    </div>
                </a>
            </div>
        `;
        container.appendChild(col);
    });
}