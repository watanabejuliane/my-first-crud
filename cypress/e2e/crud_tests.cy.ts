describe('CRUD Operations', () => {
  beforeEach(() => {
    // Visita a página principal antes de cada teste e limpa o estado
    cy.visit('http://localhost:3000'); // Verifique se o servidor está rodando nesta URL

    // Limpa todos os itens existentes antes de cada teste
    cy.get('#itemsList').within(() => {
      cy.get('li').each(($el) => {
        cy.wrap($el).find('button').contains('Delete').click();
      });
    });
  });

  it('should add a new item', () => {
    cy.get('input#name').should('be.visible').type('Novo Item');
    cy.get('button[type="submit"]').contains('Add').click();
    
    // Usa `within` para procurar dentro de `#itemsList` o item recém-adicionado
    cy.get('#itemsList').within(() => {
      cy.contains('li', 'Novo Item').should('exist');
    });
  });

  it('should edit an existing item', () => {
    // Adiciona um item para editar
    cy.get('input#name').should('be.visible').type('Item para Editar');
    cy.get('button[type="submit"]').contains('Add').click();

    // Usa `within` para encontrar o item e o botão "Edit"
    cy.get('#itemsList').within(() => {
      cy.contains('li', 'Item para Editar').find('button').contains('Edit').click();
    });

    // Aguarda o formulário de edição estar visível e edita o item
    cy.get('input#edit-name').should('be.visible').clear().type('Item Editado');
    cy.get('button[type="submit"]').contains('Update').click();

    // Verifica se o item foi editado
    cy.get('#itemsList').within(() => {
      cy.contains('li', 'Item Editado').should('exist');
    });
  });

  it('should delete an item', () => {
    // Adiciona um item para deletar
    cy.get('input#name').should('be.visible').type('Item para Deletar');
    cy.get('button[type="submit"]').contains('Add').click();

    // Usa `within` para encontrar o item e o botão "Delete"
    cy.get('#itemsList').within(() => {
      cy.contains('li', 'Item para Deletar').find('button').contains('Delete').click();
    });

    // Verifica se o item foi removido
    cy.get('#itemsList').within(() => {
      cy.contains('li', 'Item para Deletar').should('not.exist');
    });
  });
});
