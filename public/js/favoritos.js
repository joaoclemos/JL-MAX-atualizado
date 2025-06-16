function togglefavorito(btn, id) {
    btn.classList.toggle("ativo");
    const favoritos = JSON.parse(localStorage.getItem("favoritos") || "[]");

    if (favoritos.includes(id)) {
        localStorage.setItem("favoritos", JSON.stringify(favoritos.filter(f => f !== id)));
    } else {
        favoritos.push(id);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
    }
    console.log('Favoritos atualizados:', JSON.parse(localStorage.getItem("favoritos")));
    
    if (window.location.pathname.includes("favoritos.html")) {
        mostrarFavoritos('lista-favoritos');
    }
}

async function mostrarFavoritos(containerId) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }

    const favoritosIds = JSON.parse(localStorage.getItem("favoritos") || "[]");
    console.log('IDs dos favoritos:', favoritosIds);
    
    if (favoritosIds.length === 0) {
        document.getElementById('empty-favorites').classList.remove('hidden');
        if (document.getElementById(containerId)) {
            document.getElementById(containerId).innerHTML = '';
        }
        return;
    }
    
    try {
        const filmes = await carregarFilmesLocal();
        const filmesFavoritos = filmes.filter(filme => favoritosIds.includes(filme.id));
        console.log('Filmes favoritos:', filmesFavoritos);
        
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        filmesFavoritos.forEach(filme => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="card favorito-card bg-dark text-white h-100">
                    <div class="favorito-badge">
                        <i class="fas fa-heart"></i>
                    </div>
                    <div class="card-img-top-container">
                        <img src="${filme.imagem}" 
                             class="card-img-top" 
                             alt="${filme.titulo}"
                             onerror="this.src='https://via.placeholder.com/300x450?text=Poster+Não+Disponível'">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${filme.titulo}</h5>
                        <p class="card-text">${filme.sinopse.substring(0, 100)}...</p>
                        <a href="detalhes.html?id=${filme.id}" class="btn btn-danger">Ver Detalhes</a>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });
        
        document.getElementById('empty-favorites').classList.add('hidden');
    } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        if (document.getElementById('empty-favorites')) {
            document.getElementById('empty-favorites').classList.remove('hidden');
        }
    }
}