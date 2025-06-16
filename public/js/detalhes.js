async function exibirDetalhesDoFilme() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) return;

    try {
        const response = await fetch(`http://localhost:3000/filmes/${id}`);
        if (!response.ok) throw new Error('Filme não encontrado');
        const filme = await response.json();

        document.getElementById("titulo").textContent = filme.titulo;
        document.getElementById("imagem").src = filme.imagem;
        document.getElementById("ano").textContent = filme.ano || '-';
        document.getElementById("genero").textContent = filme.genero || '-';
        document.getElementById("sinopse").textContent = filme.sinopse || 'Sinopse não disponível';
        document.getElementById("elenco").textContent = filme.elenco || '-';
        document.getElementById("direcao").textContent = filme.direcao || '-';
        document.getElementById("duracao").textContent = filme.duracao || '-';
        document.getElementById("avaliacao").textContent = filme.avaliacao || '-';

        const trailerContainer = document.getElementById("trailer-container");
        
        if (filme.trailerId) {
            trailerContainer.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${filme.trailerId}" 
                    title="${filme.titulo} - Trailer" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
        } else if (filme.trailerUrl) {
            trailerContainer.innerHTML = `
                <iframe 
                    src="${filme.trailerUrl}" 
                    title="${filme.titulo} - Trailer" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
        } else {
            trailerContainer.innerHTML = `
                <div class="d-flex align-items-center justify-content-center h-100">
                    <div class="text-center">
                        <p class="mt-3">Trailer não disponível</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        document.getElementById("detalhes-container").innerHTML = `
            <div class="alert alert-danger">
                <h4>Erro ao carregar filme</h4>
                <p>${error.message}</p>
                <a href="index.html" class="btn btn-primary">Voltar à página inicial</a>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", exibirDetalhesDoFilme);