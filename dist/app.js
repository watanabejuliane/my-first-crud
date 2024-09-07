"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
// Função para buscar todos os itens do banco de dados
function fetchItems() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('/items');
        const items = yield response.json();
        const itemsList = document.getElementById('itemsList');
        if (itemsList) {
            itemsList.innerHTML = '';
            items.forEach((item) => {
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
    });
}
// Função para adicionar um novo item
(_a = document.getElementById('addItemForm')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const name = document.getElementById('name').value;
    yield fetch('/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    document.getElementById('name').value = '';
    fetchItems();
}));
// Função para editar um item existente
function editItem(item) {
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-name').value = item.name;
    document.getElementById('editItemForm').style.display = 'block';
    document.getElementById('addItemForm').style.display = 'none';
}
// Função para cancelar a edição de um item
function cancelEdit() {
    document.getElementById('editItemForm').style.display = 'none';
    document.getElementById('addItemForm').style.display = 'block';
}
// Função para atualizar um item
(_b = document.getElementById('editItemForm')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value;
    yield fetch(`/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    cancelEdit();
    fetchItems();
}));
// Função para excluir um item
function deleteItem(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`/items/${id}`, {
            method: 'DELETE'
        });
        fetchItems();
    });
}
// Carregar itens ao iniciar
fetchItems();
