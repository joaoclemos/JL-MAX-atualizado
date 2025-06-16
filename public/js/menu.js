document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const logoutBtn = document.getElementById('logout-btn');
    const adminLink = document.getElementById('admin-cadastro-filme');

    if (usuarioLogado) {
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (adminLink) {
            adminLink.classList.toggle('hidden', usuarioLogado.login !== 'admin');
        }
    } else {
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (adminLink) adminLink.classList.add('hidden');
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('usuarioLogado');
            window.location.href = 'login.html';
        });
    }
});