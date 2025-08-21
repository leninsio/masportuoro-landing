document.addEventListener('DOMContentLoaded', () => {
    const loadingSpinner = document.getElementById('loading-spinner');
    const priceDisplayContainer = document.getElementById('price-display-container');
    const lastUpdatedElement = document.getElementById('last-updated');

    // Function to show a temporary message box on the screen.
    const showMessage = (message, isSuccess) => {
        const messageBox = document.createElement('div');
        messageBox.textContent = message;
        messageBox.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg text-white transition-opacity duration-300 z-50';
        messageBox.style.opacity = '0';
        messageBox.style.pointerEvents = 'none';

        if (isSuccess) {
            messageBox.classList.add('bg-green-600');
        } else {
            messageBox.classList.add('bg-red-600');
        }

        document.body.appendChild(messageBox);
        setTimeout(() => messageBox.style.opacity = '1', 10);
        setTimeout(() => {
            messageBox.style.opacity = '0';
            setTimeout(() => messageBox.remove(), 300);
        }, 5000);
    };

    // Initially, show the loading spinner.
    if (loadingSpinner) loadingSpinner.classList.remove('hidden');

    // Attempt to retrieve and parse price data from localStorage.
    try {
        const savedPrices = localStorage.getItem('priceData');
        if (savedPrices) {
            const priceData = JSON.parse(savedPrices);
            
            // Get all elements with the class 'price' that have a data-price-id attribute.
            const priceElements = document.querySelectorAll('.price[data-price-id]');

            priceElements.forEach(element => {
                // Get the specific ID from the 'data-price-id' attribute.
                const priceId = element.getAttribute('data-price-id');
                
                // Look up the value in the priceData object and update the text.
                if (priceData.hasOwnProperty(priceId)) {
                    element.textContent = `$${priceData[priceId].toFixed(2)} / gramo`;
                }
            });

            // Display the last update time.
            const lastUpdatedDate = new Date(priceData.lastUpdated);
            if (lastUpdatedElement) {
                 lastUpdatedElement.textContent = `Última actualización: ${lastUpdatedDate.toLocaleDateString()} a las ${lastUpdatedDate.toLocaleTimeString()}`;
            }

            // Hide the spinner and show the content.
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
            if (priceDisplayContainer) priceDisplayContainer.classList.remove('hidden');
            showMessage('Precios cargados exitosamente.', true);

        } else {
            // Hide the spinner and show an error message if no data is found.
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
            showMessage('No se encontraron precios guardados en el almacenamiento local.', false);
        }
    } catch (e) {
        // Hide the spinner and show an error message if an error occurs.
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
        console.error("Error al cargar los precios: ", e);
        showMessage('Error al cargar los precios. Datos corruptos o no encontrados.', false);
    }
});