// Adicionar eventos de clique buttons dropdown
document.querySelectorAll('.dropdown-button').forEach(button => {
    button.addEventListener('click', function (event) {
      // Fecha todos os menus abertos antes de abrir o atual
      document.querySelectorAll('.dropdown-options').forEach(menu => {
        // Esconde o menu que não foi clicado
        if (menu !== this.nextElementSibling) {
          menu.style.display = 'none';
        }
      });

      // Alterna o menu associado ao botão clicado
      const dropdownMenu = this.nextElementSibling;
      dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';

      // Impede que o clique no botão feche o menu imediatamente
      event.stopPropagation();
    });
  });

  // Fechar todos os menus ao clicar fora
  window.addEventListener('click', function () {
    document.querySelectorAll('.dropdown-options').forEach(menu => {
      menu.style.display = 'none';
    });
  });

  // button ano na aba grupo


