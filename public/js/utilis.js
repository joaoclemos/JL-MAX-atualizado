const BASE_URL = 'http://localhost:3000/';

async function carregarFilmesLocal() {
    try {
        const response = await fetch(`${BASE_URL}filmes`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        return [];
    }
}

async function carregarFilmes() {
    const filmes = await carregarFilmesLocal();
    
    // Ordenar filmes por ano de lançamento (do mais recente para o mais antigo)
    filmes.sort((a, b) => parseInt(b.ano) - parseInt(a.ano));
    
    // Mais assistidos: últimos 8 filmes (mais recentes)
    const maisAssistidos = filmes.slice(0, 8);
    
    // Clássicos: filmes mais antigos (excluindo os mais recentes)
    const classicos = filmes.slice(8);
    
    return { maisAssistidos, classicos };
}

function montarFilmes(lista, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} não encontrado`);
        return;
    }
    
    container.innerHTML = "";
    
    lista.forEach(filme => {
        const col = document.createElement('div');
        col.className = 'col-md-3 col-sm-4 col-6 mb-4';
        col.innerHTML = `
            <div class="filme-card">
                <a href="detalhes.html?id=${filme.id}">
                    <div class="filme-image-container">
                        <img src="${filme.imagem}" 
                             alt="${filme.titulo}" 
                             class="img-fluid"
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/300x450?text=Poster+Não+Disponível'">
                        <div class="favorito-overlay">
                            <button class="favorito" onclick="togglefavorito(this, '${filme.id}'); event.preventDefault();">
                                ❤️
                            </button>
                        </div>
                    </div>
                    <h5 class="mt-2 text-truncate">${filme.titulo}</h5>
                    <small class="text-muted">${filme.ano}</small>
                </a>
            </div>
        `;
        container.appendChild(col);
    });
}

function updateLoginUI() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (loginBtn && logoutBtn) {
        if (usuarioLogado) {
            loginBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
        } else {
            loginBtn.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
        }
    }
}

function checkAdminAccess() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const adminLink = document.getElementById('admin-link');
    
    if (adminLink) {
        if (usuarioLogado && usuarioLogado.login === 'admin') {
            adminLink.classList.remove('hidden');
        } else {
            adminLink.classList.add('hidden');
        }
    }
}