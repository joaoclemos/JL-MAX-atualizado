document.addEventListener("DOMContentLoaded", () => {
    // Alternar entre abas
    document.querySelectorAll('.login-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.login-form').forEach(f => f.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`form-${tab.dataset.tab}`).classList.add('active');
        });
    });
    
    // Lidar com o login
    document.getElementById('form-login').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch(`http://localhost:3000/usuarios?login=${encodeURIComponent(username)}`);
            if (!response.ok) throw new Error('Erro na rede');
            
            const usuarios = await response.json();
            const usuario = usuarios.find(u => u.senha === password);
            
            if (usuario) {
                localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
                alert('Login bem-sucedido!');
                window.location.href = 'index.html';
            } else {
                alert('Credenciais inválidas. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
        }
    });
    
    // Lidar com o cadastro
    document.getElementById('form-cadastro').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const login = document.getElementById('login').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;
        
        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }
        
        const novoUsuario = {
            id: crypto.randomUUID(),
            nome: nome,
            email: email,
            login: login,
            senha: senha
        };
        
        try {
            // Verificar se o login já existe
            const checkResponse = await fetch(`http://localhost:3000/usuarios?login=${encodeURIComponent(login)}`);
            const usuariosExistentes = await checkResponse.json();
            
            if (usuariosExistentes.length > 0) {
                alert('Este login já está em uso. Por favor, escolha outro.');
                return;
            }
            
            const response = await fetch('http://localhost:3000/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoUsuario)
            });
            
            if (response.ok) {
                alert('Cadastro realizado com sucesso! Faça login para continuar.');
                document.querySelector('.login-tab[data-tab="login"]').click();
                e.target.reset();
            } else {
                throw new Error('Erro no servidor');
            }
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            alert('Erro ao cadastrar. Tente novamente mais tarde.');
        }
    });
    
    // Botão Home
    document.getElementById('home-btn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});