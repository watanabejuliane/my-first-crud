// Função para buscar todos os itens do banco de dados
async function fetchItems() {
    const response = await fetch('/items');
    const items = await response.json();
    const itemsList = document.getElementById('itemsList');
    if (itemsList) {
      itemsList.innerHTML = '';
      items.forEach((item: any) => {
        const li = document.createElement('li');
        li.textContent = item.name;
  
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editItem(item);
  
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteItem(item.id);
  
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        itemsList.appendChild(li);
      });
    }
  }
  
  // Função para adicionar um novo item
  document.getElementById('addItemForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = (document.getElementById('name') as HTMLInputElement).value;
  
    await fetch('/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
  
    (document.getElementById('name') as HTMLInputElement).value = '';
    fetchItems();
  });
  
  // Função para editar um item existente
  function editItem(item: any) {
    (document.getElementById('edit-id') as HTMLInputElement).value = item.id;
    (document.getElementById('edit-name') as HTMLInputElement).value = item.name;
    document.getElementById('editItemForm')!.style.display = 'block';
    document.getElementById('addItemForm')!.style.display = 'none';
  }
  
  // Função para cancelar a edição de um item
  function cancelEdit() {
    document.getElementById('editItemForm')!.style.display = 'none';
    document.getElementById('addItemForm')!.style.display = 'block';
  }
  
  // Função para atualizar um item
  document.getElementById('editItemForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = (document.getElementById('edit-id') as HTMLInputElement).value;
    const name = (document.getElementById('edit-name') as HTMLInputElement).value;
  
    await fetch(`/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
  
    cancelEdit();
    fetchItems();
  });
  
  // Função para excluir um item
  async function deleteItem(id: number) {
    await fetch(`/items/${id}`, {
      method: 'DELETE'
    });
    fetchItems();
  }
  
  // Carregar itens ao iniciar
  fetchItems();
  