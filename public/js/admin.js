document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado || usuarioLogado.login !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'login.html';
    });

    carregarFilmes();
});

async function carregarFilmes() {
    try {
        const response = await fetch('http://localhost:3000/filmes');
        const filmes = await response.json();
        const tbody = document.getElementById('filmes-tbody');
        tbody.innerHTML = '';
        
        filmes.forEach(filme => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${filme.titulo}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="excluirFilme('${filme.id}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
    }
}

async function excluirFilme(id) {
    if (confirm('Tem certeza que deseja excluir este filme?')) {
        try {
            await fetch(`http://localhost:3000/filmes/${id}`, {
                method: 'DELETE'
            });
            alert('Filme excluído com sucesso!');
            carregarFilmes();
        } catch (error) {
            console.error('Erro ao excluir filme:', error);
            alert('Erro ao excluir filme.');
        }
    }
}

document.getElementById('form-filme').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const novoFilme = {
        id: crypto.randomUUID(),
        titulo: document.getElementById('titulo').value,
        imagem: document.getElementById('imagem').value,
        imagemCarrossel: document.getElementById('imagemCarrossel').value,
        sinopse: document.getElementById('sinopse').value,
        ano: document.getElementById('ano').value,
        genero: document.getElementById('genero').value,
        trailerId: document.getElementById('trailerId').value || '',
        avaliacao: "0/10",
        elenco: "",
        direcao: "",
        duracao: ""
    };
    
    try {
        const response = await fetch('http://localhost:3000/filmes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoFilme)
        });
        
        if (response.ok) {
            alert('Filme cadastrado com sucesso!');
            e.target.reset();
            carregarFilmes();
        } else {
            throw new Error('Erro ao cadastrar filme');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar filme.');
    }
});