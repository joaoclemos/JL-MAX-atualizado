document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Carregar dados dos filmes do JSON Server
        const response = await fetch('http://localhost:3000/filmes');
        const filmes = await response.json();

        // Gráfico de Pizza por Gênero
        const generos = {};
        filmes.forEach(filme => {
            generos[filme.genero] = (generos[filme.genero] || 0) + 1;
        });
        new Chart(document.getElementById('pizzaGenero'), {
            type: 'pie',
            data: {
                labels: Object.keys(generos),
                datasets: [{
                    data: Object.values(generos),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#fff'
                        }
                    }
                }
            }
        });

        // Gráfico de Barras com Avaliação Média por Ano
        const anos = {};
        filmes.forEach(filme => {
            const ano = filme.ano;
            if (!anos[ano]) anos[ano] = { total: 0, count: 0 };
            anos[ano].total += parseFloat(filme.avaliacao) || 0;
            anos[ano].count += 1;
        });
        const dadosAnos = Object.keys(anos).map(ano => ({
            ano: ano,
            media: (anos[ano].count > 0) ? (anos[ano].total / anos[ano].count).toFixed(2) : 0
        }));
        new Chart(document.getElementById('barrasAvaliacao'), {
            type: 'bar',
            data: {
                labels: dadosAnos.map(d => d.ano),
                datasets: [{
                    label: 'Média de Avaliação',
                    data: dadosAnos.map(d => d.media),
                    backgroundColor: '#FF6384',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#fff'
                        },
                        title: {
                            display: true,
                            text: 'Média de Avaliação',
                            color: '#fff'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#fff'
                        },
                        title: {
                            display: true,
                            text: 'Ano',
                            color: '#fff'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#fff'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Erro ao carregar dados para os gráficos:', error);
        document.getElementById('dashboard-chart').innerHTML = '<p class="text-white">Erro ao carregar os gráficos. Tente novamente mais tarde.</p>';
    }
});