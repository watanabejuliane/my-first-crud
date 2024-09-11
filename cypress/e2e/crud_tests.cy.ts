describe('CRUD Operations', () => {
  beforeEach(() => {
    // Visita a página principal antes de cada teste e limpa o estado
    cy.visit('http://localhost:3000');  // Verifique se o servidor está rodando nesta URL

    // Limpa todos os itens existentes antes de cada teste
    cy.get('#itemsList').then(($list) => {
      if ($list.children().length > 0) {
        $list.children().each(($el) => {
          cy.wrap($el).find('button').contains('Delete').click();
        });
      }
    });
  });

  it('should add a new item', () => {
    cy.get('input#name').should('be.visible').type('Novo Item');
    cy.get('button[type="submit"]').contains('Add').click();
    cy.get('#itemsList').contains('Novo Item').should('exist');
  });

  it('should edit an existing item', () => {
    // Adiciona um item para editar
    cy.get('input#name').should('be.visible').type('Item para Editar');
    cy.get('button[type="submit"]').contains('Add').click();

    // Aguarda o item ser adicionado e então o botão "Edit" deve aparecer
    cy.get('#itemsList').contains('Item para Editar').parent().find('button').contains('Edit').should('be.visible').click();

    // Aguarda o formulário de edição estar visível
    cy.get('input#edit-name').should('be.visible').clear().type('Item Editado');
    cy.get('button[type="submit"]').contains('Update').click();

    // Verifica se o item foi editado
    cy.get('#itemsList').contains('Item Editado').should('exist');
  });

  it('should delete an item', () => {
    // Adiciona um item para deletar
    cy.get('input#name').should('be.visible').type('Item para Deletar');
    cy.get('button[type="submit"]').contains('Add').click();

    // Aguarda o item ser adicionado e então o botão "Delete" deve aparecer
    cy.get('#itemsList').contains('Item para Deletar').parent().find('button').contains('Delete').should('be.visible').click();

    // Verifica se o item foi removido
    cy.get('#itemsList').contains('Item para Deletar').should('not.exist');
  });
});
