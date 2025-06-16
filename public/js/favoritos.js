async function togglefavorito(btn, id) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`);
        const usuario = await response.json();
        let favoritos = usuario.favoritos || [];

        if (favoritos.includes(id)) {
            favoritos = favoritos.filter(f => f !== id);
            btn.classList.remove('ativo');
        } else {
            favoritos.push(id);
            btn.classList.add('ativo');
        }

        await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favoritos })
        });

        localStorage.setItem('usuarioLogado', JSON.stringify({ ...usuario, favoritos }));
        if (window.location.pathname.includes("favoritos.html")) {
            mostrarFavoritos('lista-favoritos');
        }
    } catch (error) {
        console.error('Erro ao atualizar favoritos:', error);
    }
}

async function mostrarFavoritos(containerId) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`);
        const usuario = await response.json();
        const favoritosIds = usuario.favoritos || [];
        
        if (favoritosIds.length === 0) {
            document.getElementById('empty-favorites').classList.remove('hidden');
            document.getElementById(containerId).innerHTML = '';
            return;
        }
        
        const filmesResponse = await fetch('http://localhost:3000/filmes');
        const filmes = await filmesResponse.json();
        const filmesFavoritos = filmes.filter(filme => favoritosIds.includes(filme.id));
        
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
        document.getElementById('empty-favorites').classList.remove('hidden');
    }
}