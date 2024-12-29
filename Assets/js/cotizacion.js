document.addEventListener('DOMContentLoaded', function() {
    const completeButtons = document.querySelectorAll('.complete-btn');
    const viewButtons = document.querySelectorAll('.view-btn');
    const modal = document.getElementById('quotationModal');
    const modalClose = document.getElementsByClassName('close')[0];

    const modalCompanyName = document.getElementById('modalCompanyName');
    const modalRNC = document.getElementById('modalRNC');
    const modalPhoneNumber = document.getElementById('modalPhoneNumber');
    const modalEmail = document.getElementById('modalEmail');
    const modalProducts = document.getElementById('modalProducts');

    /* - Menu - */
    const showMenu = (toggleId, navId) =>{
            const toggle = document.getElementById(toggleId),
            nav = document.getElementById(navId)
    
        toggle.addEventListener('click', () =>{
            nav.classList.toggle('show-menu')
            toggle.classList.toggle('show-icon')
        })
    }
    
    showMenu('nav-toggle','nav-menu')

    completeButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const index = this.getAttribute('data-index');
            const confirmed = confirm('¿Está seguro de que desea marcar esta cotización como completada?');
            if (confirmed) {
                fetch(`/complete/${index}`, {
                    method: 'POST'
                })
                .then(response => {
                    if (response.ok) {
                        window.location.reload(); // Recargar la página después de completar
                    } else {
                        alert('Hubo un error al marcar la cotización como completada.');
                    }
                })
                .catch(error => {
                    console.error('Error al completar la cotización:', error);
                    alert('Hubo un error al marcar la cotización como completada.');
                });
            } else {
                event.preventDefault(); // Cancelar el evento si no se confirma
            }
        });
    });

    viewButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const id = this.getAttribute('data-index');
            fetch('/quotations/json')  
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    let quotation = data.quotations;
                    let final;
                    quotation.forEach((element) => {
                        if (String(element.id) === id) final = element
                    })

                    document.getElementById('modalCompanyName').textContent = `Nombre de Empresa: ${final.company_name}`;
                    document.getElementById('modalRNC').textContent = `RNC: ${final.rnc}`;
                    document.getElementById('modalPhoneNumber').textContent = `Número de Teléfono: ${final.phone_number}`;
                    document.getElementById('modalEmail').textContent = `Correo Electrónico: ${final.email}`;
                    document.getElementById('modalProducts').textContent = `Productos: ${final.products.join(', ')}`;

                    modal.style.display = 'block'; 
                })
                .catch(error => {
                    console.error('Error al obtener la cotización:', error);
                    alert('Hubo un error al obtener los detalles de la cotización.');
                });
        });
    });

    const refreshButton = document.getElementById('refreshButton');
    refreshButton.addEventListener('click', function() {
        window.location.reload(); 
    });

    modalClose.addEventListener('click', function() {
        modal.style.display = "none";
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
});



