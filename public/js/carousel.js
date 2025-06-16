async function montarCarrosselDestaques() {
    try {
        const filmes = await carregarFilmesLocal();
        const filmesDestaque = filmes.slice(0, 6);
        
        const carouselInner = document.getElementById('carousel-inner-container');
        const carouselIndicators = document.getElementById('carousel-indicators');
        
        if (!carouselInner || !carouselIndicators) return;
        
        carouselInner.innerHTML = '';
        carouselIndicators.innerHTML = '';
        
        const grupos = [];
        for (let i = 0; i < filmesDestaque.length; i += 3) {
            grupos.push(filmesDestaque.slice(i, i + 3));
        }

        grupos.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.dataset.bsTarget = '#destaquesCarousel';
            indicator.dataset.bsSlideTo = index;
            indicator.className = index === 0 ? 'active' : '';
            indicator.setAttribute('aria-current', index === 0 ? 'true' : 'false');
            indicator.setAttribute('aria-label', `Slide ${index + 1}`);
            carouselIndicators.appendChild(indicator);
        });

        grupos.forEach((grupo, index) => {
            const slideItem = document.createElement('div');
            slideItem.className = `carousel-item${index === 0 ? ' active' : ''}`;
            
            const row = document.createElement('div');
            row.className = 'row justify-content-center g-4';

            grupo.forEach(filme => {
                const col = document.createElement('div');
                col.className = 'col-md-4';
                col.innerHTML = `
                    <div class="card bg-dark text-white h-100">
                        <div class="carousel-img-container">
                            <img src="${filme.imagemCarrossel || filme.imagem}" 
                                 class="card-img-top carousel-img" 
                                 alt="${filme.titulo}"
                                 loading="lazy"
                                 onerror="this.src='https://via.placeholder.com/200x300?text=Imagem+Não+Disponível'">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${filme.titulo}</h5>
                            <p class="card-text">${filme.sinopse.substring(0, 100)}...</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="badge bg-danger">-</span>
                            </div>
                        </div>
                    </div>
                `;
                
                col.querySelector('.carousel-img').addEventListener('click', () => {
                    window.location.href = `detalhes.html?id=${filme.id}`;
                });
                
                row.appendChild(col);
            });

            slideItem.appendChild(row);
            carouselInner.appendChild(slideItem);
        });

        new bootstrap.Carousel(document.getElementById('destaquesCarousel'), {
            interval: 5000,
            keyboard: true,
            pause: 'hover',
            wrap: true
        });
    } catch (error) {
        console.error('Erro ao carregar carrossel:', error);
    }
}