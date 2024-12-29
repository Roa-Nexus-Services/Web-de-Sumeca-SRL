document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quotationForm');
    const selectedProductsList = document.getElementById('selectedProductsList');
    const searchInput = document.getElementById('searchBar');
    const sectionSelect = document.getElementById('sectionSelect');
    const productCards = document.querySelectorAll('.product-card');
    const bottomMenu = document.querySelector('.bottom-menu');
    const banner = document.getElementById('banner');
    const categorias = document.getElementById('categorias');
    const sliderContainer = document.getElementById('slider-container');

    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const selectedProducts = Array.from(selectedProductsList.querySelectorAll('li')).map(item => ({ name: item.textContent }));

        const productsInput = document.createElement('input');
        productsInput.setAttribute('type', 'hidden');
        productsInput.setAttribute('name', 'products[]');
        productsInput.setAttribute('value', JSON.stringify(selectedProducts));
        form.appendChild(productsInput);

        form.submit();
    });

    // Filter products based on search input and selected category
    searchInput.addEventListener('input', filterProducts);
    sectionSelect.addEventListener('change', filterProducts);

    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedSection = sectionSelect.value.toLowerCase();

        let visibleCount = 0;
        let anyVisible = false;

        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productDescription = card.querySelector('p').textContent.toLowerCase();

            const matchesSearch = productName.includes(searchTerm);
            const matchesSection = selectedSection === "" || productDescription.includes(selectedSection);

            if (matchesSearch && matchesSection) {
                if (visibleCount < 20) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
                anyVisible = true;  // At least one product is visible
            } else {
                card.style.display = 'none';
            }
        });

        // Hide banner, categorias, and sliderContainer if filtering or searching is active
        if (searchTerm || selectedSection) {
            banner.style.display = 'none';
            categorias.style.display = 'none';
            sliderContainer.style.display = 'none';
        } else {
            banner.style.display = '';
            categorias.style.display = '';
            sliderContainer.style.display = '';
        }

        // If no products are visible, show the sections again
        if (!anyVisible) {
            banner.style.display = '';
            categorias.style.display = '';
            sliderContainer.style.display = '';
        }
    }

    // Toggle visibility of the bottom menu based on selected products
    function updateBottomMenuVisibility() {
        const hasSelectedProducts = selectedProductsList.querySelectorAll('li').length > 0;
        bottomMenu.style.display = hasSelectedProducts ? 'flex' : 'none';
    }

    updateBottomMenuVisibility();

    // Handle product selection
    productCards.forEach((card, index) => {
        const button = card.querySelector('button');
        button.addEventListener('click', () => {
            const productName = card.querySelector('h3').textContent;
            toggleSelection(card, button, productName);
            updateBottomMenuVisibility();
        });
    });

    // Toggle selection of a product
    function toggleSelection(card, button, productName) {
        const isSelected = card.classList.contains('selected');

        if (isSelected) {
            card.classList.remove('selected');
            button.innerHTML = '<img src="../static/img/Carrito de Compras.webp" alt="Agregar" style="width:20px; height:20px;">Agregar';
            removeProductFromList(productName);
        } else {
            card.classList.add('selected');
            button.innerHTML = '<img src="../static/img/eliminar_icono.webp" alt="Eliminar" style="width:20px; height:20px;">Eliminar';
            addProductToList(productName);
        }
    }

    // Add product to the selected products list
    function addProductToList(productName) {
        if (!Array.from(selectedProductsList.querySelectorAll('li')).some(item => item.textContent === productName)) {
            const listItem = document.createElement('li');
            listItem.textContent = productName;
            selectedProductsList.appendChild(listItem);
        }
    }

    // Remove product from the selected products list
    function removeProductFromList(productName) {
        const items = selectedProductsList.querySelectorAll('li');
        items.forEach(item => {
            if (item.textContent === productName) {
                selectedProductsList.removeChild(item);
            }
        });
    }

    // Show the form if there are selected products
    function showForm() {
        if (selectedProductsList.querySelectorAll('li').length > 0) {
            document.querySelectorAll('.product-card').forEach(card => card.style.display = 'none');
            document.getElementById('readyButton').style.display = 'none'; 
            categorias.style.display = 'none';
            sliderContainer.style.display = 'none'; 
            document.getElementById('titulo_new_products').style.display = 'none';
            document.getElementById('header').style.display = 'none';
            document.getElementById('formContainer').style.display = 'block'; 
        } else {
            alert("Por favor, seleccione al menos un producto.");
        }
    }

    // Filter products by category
    function filterByCategory(category) {
        let visibleCount = 0;
        let anyVisible = false;

        productCards.forEach(card => {
            const productCategory = card.querySelector('p').textContent.toLowerCase();

            if (productCategory === category.toLowerCase()) {
                if (visibleCount < 20) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
                anyVisible = true;
            } else {
                card.style.display = 'none';
            }
        });

        // Hide banner, categorias, and sliderContainer if filtering by category is active
        if (anyVisible) {
            banner.style.display = 'none';
            categorias.style.display = 'none';
            sliderContainer.style.display = 'none';
        } else {
            banner.style.display = '';
            categorias.style.display = '';
            sliderContainer.style.display = '';
        }
    }

    // Expose filterByCategory to the global scope
    window.filterByCategory = filterByCategory;

    // Initialize filtering on page load
    filterProducts();

    // Form validation
    function validateForm() {
        const phoneNumber = document.getElementById('phone_number').value;
        const email = document.getElementById('email').value;

        const phonePattern = /^\+1 \(\d{3}\) \d{3}-\d{4}$/;
        if (!phonePattern.test(phoneNumber)) {
            alert("Por favor, ingrese un número de teléfono válido en el formato +1 (000) 000-0000.");
            return false;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailPattern.test(email)) {
            alert("Por favor, ingrese una dirección de correo electrónico de Gmail válida.");
            return false;
        }

        return true;
    }

    // Format phone number automatically
    document.getElementById('phone_number').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('1')) {
            value = value.slice(1);
        }
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        let formattedValue = '+1 ';
        if (value.length > 0) {
            formattedValue += `(${value.slice(0, 3)}`;
        }
        if (value.length >= 4) {
            formattedValue += `) ${value.slice(3, 6)}`;
        }
        if (value.length >= 7) {
            formattedValue += `-${value.slice(6, 10)}`;
        }
        e.target.value = formattedValue;
    });

    // Set +1 prefix automatically on page load
    document.addEventListener('DOMContentLoaded', function () {
        const phoneNumberField = document.getElementById('phone_number');
        if (!phoneNumberField.value.startsWith('+1 ')) {
            phoneNumberField.value = '+1 ';
        }
    });

    // Auto slide functionality
    const slider = document.getElementById('slider');
    let currentIndex = 0;

    function autoSlide() {
        currentIndex++;
        if (currentIndex >= slider.children.length) {
            currentIndex = 0;
        }
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    setInterval(autoSlide, 3000); // Cambia cada 3 segundos
});
