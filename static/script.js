/**
 * Script pentru gestionarea interacțiunii cu API-ul și a interfeței utilizator
 */

// Variabile globale
let currentItemId = null;
let itemModal;
let deleteModal;

document.addEventListener('DOMContentLoaded', function() {
    // Inițializare Bootstrap modals
    itemModal = new bootstrap.Modal(document.getElementById('itemModal'));
    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    // Selectori DOM
    const itemsTable = document.getElementById('itemsTable');
    const itemForm = document.getElementById('itemForm');
    const searchInput = document.getElementById('searchInput');
    const btnSearch = document.getElementById('btnSearch');
    const btnAddItem = document.getElementById('btnAddItem');
    const btnSaveItem = document.getElementById('btnSaveItem');
    const btnConfirmDelete = document.getElementById('btnConfirmDelete');
    const modalTitle = document.getElementById('itemModalLabel');

    // Încarcă produsele la pornirea paginii
    loadItems();
    
    // Eveniment pentru butonul de adăugare
    btnAddItem.addEventListener('click', resetForm);
    
    // Eveniment pentru butonul de salvare
    btnSaveItem.addEventListener('click', saveItem);
    
    // Eveniment pentru butonul de confirmare a ștergerii
    btnConfirmDelete.addEventListener('click', deleteItem);
    
    // Eveniment pentru căutare
    btnSearch.addEventListener('click', searchItems);
    
    // Eveniment pentru căutare la apăsarea Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchItems();
        }
    });
});

// Funcție pentru afișarea notificărilor
function showNotification(message, type = 'success') {
    const notifications = document.getElementById('notifications');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    notifications.appendChild(alert);

    // Șterge notificarea după 5 secunde
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Încarcă produsele din API și le afișează în tabel
async function loadItems() {
    try {
        const response = await fetch('/items');
        if (!response.ok) {
            throw new Error(`Eroare HTTP: ${response.status}`);
        }
        
        const items = await response.json();
        displayItems(items);
    } catch (error) {
        console.error('Eroare la încărcarea produselor:', error);
        showNotification(`Eroare la încărcarea produselor: ${error.message}`, 'danger');
    }
}

// Afișează produsele în tabel
function displayItems(items) {
    const itemsTable = document.getElementById('itemsTable');
    itemsTable.innerHTML = '';
    
    if (items.length === 0) {
        itemsTable.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">Nu există produse disponibile</td>
            </tr>
        `;
        return;
    }
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nume}</td>
            <td>${item.pret.toFixed(2)} lei</td>
            <td>${item.categorie}</td>
            <td>${item.stoc}</td>
            <td>
                <button class="btn btn-sm btn-info edit-item" data-id="${item.id}">Editează</button>
                <button class="btn btn-sm btn-danger delete-item" data-id="${item.id}">Șterge</button>
            </td>
        `;
        itemsTable.appendChild(row);
    });
    
    // Adaugă evenimentele pentru butoanele de editare și ștergere
    addTableEventListeners();
}

// Adaugă evenimentele pentru butoanele din tabel
function addTableEventListeners() {
    // Adaugă evenimente pentru butoanele de editare
    document.querySelectorAll('.edit-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.dataset.id);
            editItem(itemId);
        });
    });
    
    // Adaugă evenimente pentru butoanele de ștergere
    document.querySelectorAll('.delete-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.dataset.id);
            confirmDelete(itemId);
        });
    });
}

// Deschide modalul pentru editarea unui produs
async function editItem(itemId) {
    try {
        const response = await fetch(`/items/${itemId}`);
        if (!response.ok) {
            throw new Error(`Eroare HTTP: ${response.status}`);
        }
        
        const item = await response.json();
        
        // Populează formularul cu datele produsului
        document.getElementById('itemId').value = item.id;
        document.getElementById('nume').value = item.nume;
        document.getElementById('pret').value = item.pret;
        document.getElementById('categorie').value = item.categorie;
        document.getElementById('stoc').value = item.stoc;
        document.getElementById('descriere').value = item.descriere || '';
        
        // Actualizează titlul modalului și ID-ul curent
        document.getElementById('itemModalLabel').textContent = 'Editează Produs';
        currentItemId = item.id;
        
        // Deschide modalul
        itemModal.show();
    } catch (error) {
        console.error('Eroare la obținerea detaliilor produsului:', error);
        showNotification(`Eroare la obținerea detaliilor produsului: ${error.message}`, 'danger');
    }
}

// Deschide modalul pentru confirmarea ștergerii
function confirmDelete(itemId) {
    currentItemId = itemId;
    deleteModal.show();
}

// Șterge un produs
async function deleteItem() {
    if (!currentItemId) return;
    
    try {
        const response = await fetch(`/items/${currentItemId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`Eroare HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        showNotification(data.message);
        
        // Reîncarcă produsele
        loadItems();
        
        // Închide modalul
        deleteModal.hide();
    } catch (error) {
        console.error('Eroare la ștergerea produsului:', error);
        showNotification(`Eroare la ștergerea produsului: ${error.message}`, 'danger');
    }
}

// Salvează un produs (create sau update)
async function saveItem() {
    // Obține datele din formular
    const nume = document.getElementById('nume').value.trim();
    const pret = parseFloat(document.getElementById('pret').value);
    const categorie = document.getElementById('categorie').value.trim();
    const stoc = parseInt(document.getElementById('stoc').value);
    const descriere = document.getElementById('descriere').value.trim();
    
    // Validare simplă
    if (!nume || isNaN(pret) || !categorie || isNaN(stoc)) {
        showNotification('Toate câmpurile sunt obligatorii și trebuie să fie valide!', 'warning');
        return;
    }
    
    // Pregătește datele pentru API
    const itemData = {
        nume,
        pret,
        categorie,
        stoc,
        descriere
    };
    
    try {
        let url = '/items';
        let method = 'POST';
        let successMessage = 'Produs adăugat cu succes!';
        
        // Dacă avem un ID curent, este o actualizare
        if (currentItemId) {
            url = `/items/${currentItemId}`;
            method = 'PUT';
            successMessage = 'Produs actualizat cu succes!';
        }
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        });
        
        if (!response.ok) {
            throw new Error(`Eroare HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        showNotification(successMessage);
        
        // Reîncarcă produsele
        loadItems();
        
        // Închide modalul
        itemModal.hide();
    } catch (error) {
        console.error('Eroare la salvarea produsului:', error);
        showNotification(`Eroare la salvarea produsului: ${error.message}`, 'danger');
    }
}

// Resetează formularul pentru adăugarea unui nou produs
function resetForm() {
    document.getElementById('itemForm').reset();
    document.getElementById('itemId').value = '';
    document.getElementById('itemModalLabel').textContent = 'Adaugă Produs';
    currentItemId = null;
}

// Filtrează produsele după text
async function searchItems() {
    const searchInput = document.getElementById('searchInput');
    const searchText = searchInput.value.toLowerCase().trim();
    
    try {
        const response = await fetch('/items');
        if (!response.ok) {
            throw new Error(`Eroare HTTP: ${response.status}`);
        }
        
        const items = await response.json();
        
        if (searchText) {
            // Filtrează produsele care conțin textul căutat
            const filteredItems = items.filter(item => 
                item.nume.toLowerCase().includes(searchText) || 
                item.categorie.toLowerCase().includes(searchText) ||
                (item.descriere && item.descriere.toLowerCase().includes(searchText))
            );
            
            displayItems(filteredItems);
        } else {
            // Dacă nu există text de căutare, afișează toate produsele
            displayItems(items);
        }
    } catch (error) {
        console.error('Eroare la căutarea produselor:', error);
        showNotification(`Eroare la căutarea produselor: ${error.message}`, 'danger');
    }
}
