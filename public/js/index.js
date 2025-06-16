document.addEventListener("DOMContentLoaded", async () => {
    // Verificar login e redirecionar se não estiver logado
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar botão de logout e link admin se aplicável
    document.getElementById('logout-btn').classList.remove('hidden');
    if (usuarioLogado.login === 'admin') {
        const adminLink = document.getElementById('admin-cadastro-filme');
        if (adminLink) {
            adminLink.classList.remove('hidden');
        }
    }

    // Evento de logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'login.html';
    });

    // Carregar filmes
    try {
        await montarCarrosselDestaques();
        const response = await fetch('http://localhost:3000/filmes');
        const filmes = await response.json();
        
        filmes.sort((a, b) => b.ano - a.ano);
        const maisAssistidos = filmes.slice(0, 8);
        const classicos = filmes.slice(8);
        
        montarListaFilmes(maisAssistidos, 'maisAssistidos');
        montarListaFilmes(classicos, 'classicos');
    } catch (error) {
        console.error("Erro ao carregar filmes:", error);
        alert("Erro ao carregar filmes. Tente recarregar a página.");
    }
});

function montarListaFilmes(filmes, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    filmes.forEach(filme => {
        const col = document.createElement('div');
        col.className = 'col-md-3 col-sm-6 mb-4';
        col.innerHTML = `
            <div class="filme-card">
                <a href="detalhes.html?id=${filme.id}">
                    <div class="filme-image-container">
                        <img src="${filme.imagem}" 
                             alt="${filme.titulo}" 
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/300x450?text=Poster+Não+Disponível'">
                        <button class="favorito" onclick="togglefavorito(this, '${filme.id}'); event.preventDefault();">
                            ❤️
                        </button>
                    </div>
                </a>
            </div>
        `;
        container.appendChild(col);
    });
}