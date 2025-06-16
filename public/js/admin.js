document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado || usuarioLogado.login !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

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
                    <button class="btn btn-editar" onclick="editarFilme('${filme.id}')"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-excluir" onclick="excluirFilme('${filme.id}')"><i class="fas fa-trash-alt"></i> Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
    }
}

async function editarFilme(id) {
    try {
        const response = await fetch(`http://localhost:3000/filmes/${id}`);
        const filme = await response.json();
        document.getElementById('id').value = filme.id;
        document.getElementById('titulo').value = filme.titulo;
        document.getElementById('imagem').value = filme.imagem;
        document.getElementById('imagemCarrossel').value = filme.imagemCarrossel;
        document.getElementById('sinopse').value = filme.sinopse;
        document.getElementById('ano').value = filme.ano;
        document.getElementById('genero').value = filme.genero;
        document.getElementById('trailerId').value = filme.trailerId;
        document.getElementById('elenco').value = filme.elenco;
        document.getElementById('direcao').value = filme.direcao;
        document.getElementById('duracao').value = filme.duracao;
        document.getElementById('avaliacao').value = filme.avaliacao;
    } catch (error) {
        console.error('Erro ao carregar filme para edição:', error);
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
    
    const id = document.getElementById('id').value;
    const novoFilme = {
        id: id || crypto.randomUUID(),
        titulo: document.getElementById('titulo').value,
        imagem: document.getElementById('imagem').value,
        imagemCarrossel: document.getElementById('imagemCarrossel').value,
        sinopse: document.getElementById('sinopse').value,
        ano: document.getElementById('ano').value,
        genero: document.getElementById('genero').value,
        trailerId: document.getElementById('trailerId').value || '',
        avaliacao: document.getElementById('avaliacao').value || "0/10",
        elenco: document.getElementById('elenco').value || "",
        direcao: document.getElementById('direcao').value || "",
        duracao: document.getElementById('duracao').value || ""
    };
    
    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `http://localhost:3000/filmes/${id}` : 'http://localhost:3000/filmes';
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoFilme)
        });
        
        if (response.ok) {
            alert(id ? 'Filme atualizado com sucesso!' : 'Filme cadastrado com sucesso!');
            e.target.reset();
            carregarFilmes();
        } else {
            throw new Error('Erro ao salvar filme');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar filme.');
    }
});