document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos del DOM ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const closeMenuBtn = document.querySelector('.close-menu-btn');

    const heroSection = document.querySelector('.hero'); // Sección Hero
    const sectionsToAnimate = document.querySelectorAll('.fade-in-section');
    
    const contactForm = document.getElementById('contact-form');


    // --- Menú desplegable ---
    function handleResize() {
        if (window.innerWidth <= 768) {
            navLinks.classList.add('no-transition');
        } else {
            navLinks.classList.remove('no-transition');
            navLinks.classList.remove('active');
        }
    }

    function toggleMenu() {
        navLinks.classList.remove('no-transition');
        setTimeout(() => {
            navLinks.classList.toggle('active');
        }, 0);
    }

    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', toggleMenu);
    }
    if (closeMenuBtn && navLinks) {
        closeMenuBtn.addEventListener('click', toggleMenu);
    }
    handleResize();
    window.addEventListener('resize', handleResize);


    // --- Lógica de la calculadora ---
    const metalTypeSelect = document.getElementById('metal-type');
    const purezaSelect = document.getElementById('pureza');
    const pesoInput = document.getElementById('peso');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultElement = document.getElementById('result');

    // Nota: El objeto 'precios' se encuentra en un archivo js separado.
    // Por lo tanto, esta lógica asume que el archivo de precios ya se ha cargado.
    function updatePurezaOptions() {
        if (!precios || !precios[metalTypeSelect.value]) return;
        const metal = metalTypeSelect.value;
        const purezas = Object.keys(precios[metal]);
        purezaSelect.innerHTML = '';

        purezas.forEach(pureza => {
            const option = document.createElement('option');
            option.value = pureza;
            const textContent = (metal === 'oro') ? `${pureza}` : `${pureza}`;
            option.textContent = textContent;
            purezaSelect.appendChild(option);
        });
    }

    function calcularValor() {
        const metal = metalTypeSelect.value;
        const peso = parseFloat(pesoInput.value);
        const pureza = purezaSelect.value;

        if (isNaN(peso) || peso <= 0) {
            resultElement.textContent = 'Ingrese un peso válido';
            return;
        }

        const precioPorGramo = precios[metal][pureza];
        const valorEstimado = peso * precioPorGramo;
        resultElement.textContent = `$${valorEstimado.toFixed(2)}`;
    }

    if (metalTypeSelect && purezaSelect && pesoInput && calculateBtn && resultElement) {
        metalTypeSelect.addEventListener('change', updatePurezaOptions);
        calculateBtn.addEventListener('click', calcularValor);
        updatePurezaOptions();
    }


    // --- Lógica para enviar el formulario a WhatsApp ---
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const phoneNumber = '584121546895'; 

            // Creamos el mensaje sin codificar los saltos de línea
            const whatsappMessage = `¡Hola! Soy ${name}.\n\nMi correo electrónico es: ${email}.\n\nMi consulta es la siguiente:\n${message}`;

            // Codificamos el mensaje para que sea seguro en la URL
            const encodedMessage = encodeURIComponent(whatsappMessage);

            // Usamos la variable codificada en la URL
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            // Abrimos el enlace en una nueva pestaña
            window.open(whatsappURL, '_blank');
        });
    }


    // --- Lógica para el hero y precarga ---
    if (heroSection) {
        const candidateImagePaths = [
            '../images/heroprueba.webp',
            '../images/joyas.webp',
            '../images/autos.webp',
            '../images/moto.webp',
            '../images/relojes.webp',
            '../images/inmuebles.webp'
        ];

        // Función para precargar imágenes
        const preloadImage = (src) => new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => reject(src);
            img.src = src;
        });

        // Función principal que precarga y luego inicia el carrusel
        const startHeroCarousel = async () => {
            const loadedImages = await Promise.allSettled(candidateImagePaths.map(preloadImage));
            const validImages = loadedImages
                .filter(r => r.status === 'fulfilled')
                .map(r => r.value);
            
            if (!validImages || validImages.length <= 1) {
                heroSection.style.opacity = 1; // Si no hay imágenes, al menos mostramos el hero
                return;
            }

            let currentIndex = 0;
            heroSection.style.setProperty('--hero-bg', `url('${validImages[currentIndex]}')`);
            heroSection.style.opacity = 1; // Mostramos el hero una vez que la primera imagen está cargada

            const transitionDurationMs = 1200;
            const intervalMs = 4000;

            const performTransition = () => {
                const nextIndex = (currentIndex + 1) % validImages.length;
                const nextUrl = `url('${validImages[nextIndex]}')`;
                heroSection.style.setProperty('--hero-next-bg', nextUrl);
                heroSection.classList.add('is-transitioning');

                setTimeout(() => {
                    heroSection.style.setProperty('--hero-bg', nextUrl);
                    heroSection.classList.remove('is-transitioning');
                    currentIndex = nextIndex;
                }, transitionDurationMs);
            };

            setInterval(performTransition, intervalMs);
        };
        
        startHeroCarousel();
    }


    // --- Animación de entrada para las secciones ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    sectionsToAnimate.forEach(section => {
        observer.observe(section);
    });

});
