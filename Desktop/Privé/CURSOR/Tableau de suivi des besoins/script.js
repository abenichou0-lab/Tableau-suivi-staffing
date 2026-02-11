// Stockage des données dans localStorage
const STORAGE_KEY = 'staffingRequests';
const LAST_SAVE_FILE_KEY = 'lastSaveFileName';
const USERS_STORAGE_KEY = 'staffingUsers';
const SETTINGS_ACCESS_CODE = '080914';
const SESSION_KEY = 'staffingSession';

// Gestion des utilisateurs
function getUsers() {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    if (!data) {
        // Créer un utilisateur par défaut si aucun utilisateur n'existe
        const defaultUsers = [
            { id: '1', username: 'admin', password: 'admin123' }
        ];
        saveUsers(defaultUsers);
        return defaultUsers;
    }
    return JSON.parse(data);
}

function saveUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Vérifier si l'utilisateur est connecté
function isAuthenticated() {
    return localStorage.getItem(SESSION_KEY) === 'true';
}

// Authentifier l'utilisateur
function authenticate(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem(SESSION_KEY, 'true');
        return true;
    }
    return false;
}

// Déconnecter l'utilisateur
function logout() {
    localStorage.removeItem(SESSION_KEY);
    showLoginPage();
}

// Afficher la page de login
function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginError').style.display = 'none';
}

// Afficher le contenu principal
function showMainContent() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
}

// Gestion du login
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    if (!username || !password) {
        errorDiv.textContent = 'Veuillez remplir tous les champs';
        errorDiv.style.display = 'block';
        return;
    }

    if (authenticate(username, password)) {
        showMainContent();
        // Initialiser l'application après la connexion
        initializeApp();
    } else {
        errorDiv.textContent = 'Nom d\'utilisateur ou mot de passe incorrect';
        errorDiv.style.display = 'block';
    }
}

// Gestion des paramètres
function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    document.getElementById('accessCodeInput').value = '';
    document.getElementById('accessCodeError').style.display = 'none';
    document.getElementById('usersManagement').style.display = 'none';
    modal.style.display = 'block';
}

function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = 'none';
    document.getElementById('accessCodeInput').value = '';
    document.getElementById('accessCodeError').style.display = 'none';
}

function verifyAccessCode() {
    const code = document.getElementById('accessCodeInput').value.trim();
    const errorDiv = document.getElementById('accessCodeError');

    if (code === SETTINGS_ACCESS_CODE) {
        document.getElementById('settingsAccessCode').style.display = 'none';
        document.getElementById('usersManagement').style.display = 'block';
        renderUsersList();
    } else {
        errorDiv.textContent = 'Code d\'accès incorrect';
        errorDiv.style.display = 'block';
    }
}

function renderUsersList() {
    const users = getUsers();
    const container = document.getElementById('usersList');
    
    if (users.length === 0) {
        container.innerHTML = '<p style="color: #6c757d; font-style: italic;">Aucun utilisateur</p>';
        return;
    }

    container.innerHTML = users.map(user => `
        <div class="user-item">
            <div class="user-info">
                <div class="user-username">${user.username}</div>
            </div>
            <div class="user-actions">
                <button class="btn-edit-user" onclick="editUser('${user.id}')">✏️ Modifier</button>
                <button class="btn-delete-user" onclick="deleteUser('${user.id}')">🗑️ Supprimer</button>
            </div>
        </div>
    `).join('');
}

function openUserModal(userId = null) {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');
    const title = document.getElementById('userModalTitle');

    if (userId) {
        title.textContent = 'Modifier l\'utilisateur';
        const users = getUsers();
        const user = users.find(u => u.id === userId);
        if (user) {
            document.getElementById('userId').value = user.id;
            document.getElementById('userUsername').value = user.username;
            document.getElementById('userPassword').value = '';
        }
    } else {
        title.textContent = 'Ajouter un utilisateur';
        form.reset();
        document.getElementById('userId').value = '';
    }

    modal.style.display = 'block';
}

function closeUserModal() {
    const modal = document.getElementById('userModal');
    modal.style.display = 'none';
    document.getElementById('userForm').reset();
}

function saveUser(event) {
    event.preventDefault();
    const userId = document.getElementById('userId').value;
    const username = document.getElementById('userUsername').value.trim();
    const password = document.getElementById('userPassword').value;
    const users = getUsers();

    if (!username || !password) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    // Vérifier si le nom d'utilisateur existe déjà (sauf pour l'utilisateur en cours de modification)
    const existingUser = users.find(u => u.username === username && u.id !== userId);
    if (existingUser) {
        alert('Ce nom d\'utilisateur existe déjà');
        return;
    }

    if (userId) {
        // Modification
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index].username = username;
            users[index].password = password;
        }
    } else {
        // Ajout
        const newUser = {
            id: Date.now().toString(),
            username: username,
            password: password
        };
        users.push(newUser);
    }

    saveUsers(users);
    renderUsersList();
    closeUserModal();
}

function editUser(userId) {
    openUserModal(userId);
}

function deleteUser(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) return;

    if (users.length === 1) {
        alert('Impossible de supprimer le dernier utilisateur');
        return;
    }

    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.username}" ?`)) {
        const filtered = users.filter(u => u.id !== userId);
        saveUsers(filtered);
        renderUsersList();
    }
}

// Fonction pour obtenir toutes les demandes
function getRequests() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Fonction pour sauvegarder les demandes
function saveRequests(requests) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

// Fonction pour sauvegarder dans un fichier JSON
async function saveToFile() {
    try {
        // S'assurer que les données sont à jour dans localStorage
        const requests = getRequests();
        if (requests.length === 0) {
            const confirmEmpty = confirm('Aucune donnée à sauvegarder.\n\nVoulez-vous quand même créer un fichier de sauvegarde vide ?');
            if (!confirmEmpty) {
                return;
            }
        }
        
        const dataToSave = {
            version: '1.0',
            savedAt: new Date().toISOString(),
            requests: requests
        };
        
        const jsonData = JSON.stringify(dataToSave, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        
        // Générer un nom de fichier avec timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const fileName = `sauvegarde_staffing_${timestamp}.json`;
        
        // Vérifier si l'API File System Access est disponible (Chrome/Edge)
        if ('showSaveFilePicker' in window) {
            try {
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: fileName,
                    types: [{
                        description: 'Fichier JSON',
                        accept: { 'application/json': ['.json'] }
                    }]
                });
                
                const writable = await fileHandle.createWritable();
                await writable.write(blob);
                await writable.close();
                
                // Sauvegarder le nom du fichier pour le chargement automatique
                localStorage.setItem(LAST_SAVE_FILE_KEY, fileHandle.name);
                
                alert(`✅ Sauvegarde réussie !\n\nFichier : ${fileHandle.name}\n\n💾 ${requests.length} demande(s) sauvegardée(s).\n\nCette sauvegarde sera proposée au prochain chargement.`);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Erreur lors de la sauvegarde:', err);
                    // Fallback sur le téléchargement
                    downloadFile(blob, fileName);
                }
            }
        } else {
            // Fallback : téléchargement du fichier
            downloadFile(blob, fileName);
        }
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        alert('Erreur lors de la sauvegarde : ' + error.message);
    }
}

// Fonction helper pour télécharger un fichier
function downloadFile(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Sauvegarder le nom du fichier
    localStorage.setItem(LAST_SAVE_FILE_KEY, fileName);
    
    const requests = getRequests();
    alert(`✅ Sauvegarde téléchargée !\n\nFichier : ${fileName}\n💾 ${requests.length} demande(s) sauvegardée(s).\n\n📁 Enregistrez ce fichier dans un dossier de sauvegarde pour pouvoir le recharger plus tard avec le bouton "Charger".`);
}

// Fonction pour charger depuis un fichier JSON
async function loadFromFile() {
    try {
        // Vérifier si l'API File System Access est disponible
        if ('showOpenFilePicker' in window) {
            try {
                const [fileHandle] = await window.showOpenFilePicker({
                    types: [{
                        description: 'Fichier JSON',
                        accept: { 'application/json': ['.json'] }
                    }]
                });
                
                const file = await fileHandle.getFile();
                const text = await file.text();
                
                loadDataFromJSON(text, fileHandle.name);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Erreur lors du chargement:', err);
                    // Fallback sur input file
                    loadFromFileInput();
                }
            }
        } else {
            // Fallback : utiliser input file
            loadFromFileInput();
        }
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        alert('Erreur lors du chargement : ' + error.message);
    }
}

// Fonction helper pour charger depuis un input file
function loadFromFileInput() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const text = await file.text();
            loadDataFromJSON(text, file.name);
        }
    };
    input.click();
}

// Fonction pour charger les données depuis un JSON
function loadDataFromJSON(jsonText, fileName) {
    try {
        const data = JSON.parse(jsonText);
        
        // Vérifier la structure du fichier
        if (!data.requests || !Array.isArray(data.requests)) {
            throw new Error('Format de fichier invalide');
        }
        
        // Demander confirmation avant de remplacer les données
        const currentRequests = getRequests();
        if (currentRequests.length > 0) {
            const confirmLoad = confirm(
                `⚠️ Vous allez remplacer ${currentRequests.length} demande(s) existante(s) par ${data.requests.length} demande(s) du fichier.\n\n` +
                `Voulez-vous continuer ?`
            );
            if (!confirmLoad) {
                return;
            }
        }
        
        // Sauvegarder les nouvelles données
        saveRequests(data.requests);
        localStorage.setItem(LAST_SAVE_FILE_KEY, fileName);
        
        // Rafraîchir l'affichage
        renderTable();
        updateStats();
        filterRequests();
        
        alert(`✅ Données chargées avec succès !\n\n📂 Fichier : ${fileName}\n📊 ${data.requests.length} demande(s) chargée(s).\n\nCette sauvegarde sera proposée au prochain chargement.`);
    } catch (error) {
        console.error('Erreur lors du parsing du fichier:', error);
        alert('Erreur lors du chargement du fichier : ' + error.message + '\n\nVérifiez que le fichier est un fichier JSON valide.');
    }
}

// Fonction pour charger automatiquement la dernière sauvegarde
async function loadLastSave() {
    const lastSaveFileName = localStorage.getItem(LAST_SAVE_FILE_KEY);
    const requests = getRequests();
    
    // Si aucune donnée n'existe et qu'une sauvegarde a été faite précédemment
    if (requests.length === 0 && lastSaveFileName) {
        // Proposer de charger la dernière sauvegarde
        const shouldLoad = confirm(
            `📂 Dernière sauvegarde détectée : ${lastSaveFileName}\n\n` +
            `Aucune donnée n'est actuellement chargée.\n\n` +
            `Voulez-vous charger cette sauvegarde maintenant ?\n\n` +
            `(Vous pouvez aussi cliquer sur "Annuler" et utiliser le bouton "Charger" pour sélectionner un autre fichier)`
        );
        if (shouldLoad) {
            // Attendre un peu pour que l'interface soit prête
            setTimeout(() => {
                loadFromFile();
            }, 100);
        }
    } else if (lastSaveFileName) {
        // Afficher une info dans la console
        console.log('💾 Dernière sauvegarde:', lastSaveFileName);
    }
}

// Fonction pour calculer les heures ouvrables entre deux dates
function getBusinessHoursBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let hours = 0;
    let current = new Date(start);
    
    // Heures ouvrables : 9h-18h, lundi-vendredi
    while (current < end) {
        const dayOfWeek = current.getDay();
        const hour = current.getHours();
        
        // Si c'est un jour ouvrable (lundi=1 à vendredi=5)
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            // Si c'est dans les heures ouvrables
            if (hour >= 9 && hour < 18) {
                hours++;
            }
        }
        
        current.setHours(current.getHours() + 1);
    }
    
    return hours;
}

// Fonction pour déterminer le statut de couleur
function getStatusColor(entryDate, entryTime, cvSent) {
    if (cvSent > 0) {
        return 'green'; // CV envoyé = vert
    }
    
    const entryDateTime = new Date(`${entryDate}T${entryTime}`);
    const now = new Date();
    const businessHours = getBusinessHoursBetween(entryDateTime, now);
    
    if (businessHours < 24) {
        return 'green';
    } else if (businessHours < 48) {
        return 'orange';
    } else {
        return 'red';
    }
}

// Fonction pour formater la date et l'heure
function formatDateTime(date, time) {
    if (!date) return '';
    const d = new Date(`${date}T${time || '00:00'}`);
    return d.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Fonction pour afficher les statistiques
function updateStats() {
    const requests = getRequests();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Fonction helper pour obtenir la valeur N d'une demande
    const getN = (req) => parseInt(req.numberOfPositions) || 1;
    
    // Total demandes = somme de toutes les valeurs N
    const totalRequests = requests.reduce((sum, req) => sum + getN(req), 0);
    document.getElementById('totalRequests').textContent = totalRequests;
    
    // Demandes ce mois = somme des N pour les demandes de ce mois
    const monthlyRequests = requests.filter(req => {
        const reqDate = new Date(`${req.entryDate}T${req.entryTime}`);
        return reqDate.getMonth() === currentMonth && reqDate.getFullYear() === currentYear;
    });
    const monthlyRequestsN = monthlyRequests.reduce((sum, req) => sum + getN(req), 0);
    document.getElementById('monthlyRequests').textContent = monthlyRequestsN;
    
    // Jobs ouverts / fermés = somme des N pour chaque statut
    const openJobs = requests
        .filter(req => req.status === 'ouvert' || !req.status)
        .reduce((sum, req) => sum + getN(req), 0);
    const closedJobs = requests
        .filter(req => req.status === 'ferme')
        .reduce((sum, req) => sum + getN(req), 0);
    document.getElementById('openClosedJobs').textContent = `${openJobs} / ${closedJobs}`;
    
    // Taux de transformation (deals / total demandes basé sur N)
    const deals = requests
        .filter(req => req.isDeal === 'oui')
        .reduce((sum, req) => sum + getN(req), 0);
    const conversionRate = totalRequests > 0 ? ((deals / totalRequests) * 100).toFixed(1) : 0;
    document.getElementById('conversionRate').textContent = `${conversionRate}%`;
    
    // Taux de réponse (demandes avec CV envoyés / total basé sur N)
    const withCVs = requests
        .filter(req => req.cvSent > 0)
        .reduce((sum, req) => sum + getN(req), 0);
    const responseRate = totalRequests > 0 ? ((withCVs / totalRequests) * 100).toFixed(1) : 0;
    document.getElementById('responseRate').textContent = `${responseRate}%`;
    
    // Deals total = somme des N pour les deals
    document.getElementById('dealsCount').textContent = deals;
    
    // Deals ce mois = somme des N pour les deals dont la date du deal est dans le mois en cours
    const monthlyDeals = requests
        .filter(req => {
            if (req.isDeal !== 'oui' || !req.dealDate) return false;
            const dealDate = new Date(req.dealDate);
            return dealDate.getMonth() === currentMonth && dealDate.getFullYear() === currentYear;
        })
        .reduce((sum, req) => sum + getN(req), 0);
    document.getElementById('monthlyDeals').textContent = monthlyDeals;
    
    // Marge totale
    const totalMargin = requests.reduce((sum, req) => {
        return sum + (parseFloat(req.marginAmount) || 0);
    }, 0);
    document.getElementById('totalMargin').textContent = `${totalMargin.toFixed(2)}€`;
}

// Fonction pour trier les demandes (ouverts d'abord, puis fermés, triés par date)
function sortRequests(requests) {
    // Séparer les jobs ouverts et fermés
    const openJobs = requests.filter(req => req.status === 'ouvert' || !req.status);
    const closedJobs = requests.filter(req => req.status === 'ferme');
    
    // Fonction de tri par date (plus récent en premier)
    const sortByDate = (a, b) => {
        const dateA = new Date(`${a.entryDate}T${a.entryTime || '00:00'}`);
        const dateB = new Date(`${b.entryDate}T${b.entryTime || '00:00'}`);
        return dateB - dateA;
    };
    
    // Trier les jobs ouverts par date (plus récent en premier)
    openJobs.sort(sortByDate);
    
    // Trier les jobs fermés par date (plus récent en premier)
    closedJobs.sort(sortByDate);
    
    // Combiner : jobs ouverts d'abord, puis jobs fermés
    return [...openJobs, ...closedJobs];
}

// Fonction pour afficher le tableau
function renderTable(filteredRequests = null) {
    const requests = filteredRequests || getRequests();
    const tbody = document.getElementById('tableBody');
    
    if (requests.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="16" class="empty-table">
                    <p>Aucune donnée disponible</p>
                    <p>Cliquez sur "+ Nouvelle demande" pour ajouter votre première demande</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Trier les demandes avec la même logique que l'export
    const sortedRequests = sortRequests(requests);
    
    tbody.innerHTML = sortedRequests.map((request, index) => {
        const statusColor = getStatusColor(request.entryDate, request.entryTime, request.cvSent);
        const rowClass = statusColor === 'green' ? 'ok-row' : statusColor === 'orange' ? 'warning-row' : 'overdue-row';
        
        // Formater les consultants
        const consultants = request.consultants || [];
        const consultantsDisplay = consultants.length > 0 
            ? consultants.map(c => c.name || '').join(', ') 
            : '-';
        
        // Formater les interviews
        const interviews = request.interviews || [];
        const interviewsDisplay = interviews.length > 0
            ? interviews.map(i => {
                const date = i.date ? new Date(i.date).toLocaleDateString('fr-FR') : '';
                const time = i.time || '';
                const candidate = i.candidate || '';
                return `${date} ${time} - ${candidate}`;
            }).join('<br>')
            : '-';
        
        return `
            <tr class="${rowClass}">
                <td>
                    <span class="status-badge status-${request.status || 'ouvert'}">
                        ${request.status === 'ferme' ? 'Fermé' : 'Ouvert'}
                    </span>
                </td>
                <td>${formatDateTime(request.entryDate, request.entryTime)}</td>
                <td>${request.clientName || ''}</td>
                <td>${request.clientPhone || ''}</td>
                <td>${request.clientEmail || ''}</td>
                <td>
                    ${request.jobFunctionFileData 
                        ? `<a href="#" class="job-function-link" onclick="openJobFunctionFile('${request.id}'); return false;">${request.jobFunction || ''}</a>`
                        : request.jobFunction || ''}
                </td>
                <td style="text-align: center;">${request.numberOfPositions || 1}</td>
                <td style="text-align: center;">
                    <span class="quality-badge quality-${(request.jobQuality || '').toLowerCase()}">
                        ${request.jobQuality || '-'}
                    </span>
                </td>
                <td style="text-align: center;">
                    <span class="reliability-badge ${(request.reliability || 0) >= 7 ? 'reliability-high' : (request.reliability || 0) >= 4 ? 'reliability-medium' : 'reliability-low'}">
                        ${request.reliability || '-'}
                    </span>
                </td>
                <td>${request.cvSent || 0}</td>
                <td>${consultantsDisplay}</td>
                <td class="interviews-cell">${interviewsDisplay}</td>
                <td>
                    ${request.cvFileLink 
                        ? `<span class="file-path-link" onclick="openFolder('${request.cvFileLink.replace(/'/g, "\\'")}'); return false;" title="${request.cvFileLink}">📁 Ouvrir</span>`
                        : '-'}
                </td>
                <td>
                    <span class="deal-badge deal-${request.isDeal || 'non'}">
                        ${request.isDeal === 'oui' ? 'Oui' : 'Non'}
                    </span>
                </td>
                <td>${request.marginAmount ? `${parseFloat(request.marginAmount).toFixed(2)}€` : '-'}</td>
                <td class="actions-cell">
                    <button class="btn-action" onclick="editRequest('${request.id}')" title="Modifier">✏️</button>
                    <button class="btn-action btn-delete" onclick="deleteRequest('${request.id}')" title="Supprimer">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Fonction pour filtrer les demandes
function filterRequests() {
    const requests = getRequests();
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const qualityFilter = document.getElementById('qualityFilter').value;
    const showOnlyOpen = document.getElementById('showOnlyOpen').checked;
    
    let filtered = requests.filter(request => {
        // Filtre de recherche
        if (searchTerm) {
            const searchableText = `
                ${request.entryDate || ''} 
                ${request.clientName || ''} 
                ${request.jobFunction || ''}
            `.toLowerCase();
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }
        
        // Filtre de qualité
        if (qualityFilter !== 'all' && request.jobQuality !== qualityFilter) {
            return false;
        }
        
        // Filtre statut ouvert/fermé
        if (showOnlyOpen && request.status !== 'ouvert') {
            return false;
        }
        
        // Filtre de couleur de statut
        if (statusFilter !== 'all') {
            const statusColor = getStatusColor(request.entryDate, request.entryTime, request.cvSent);
            if (statusFilter === 'red' && statusColor !== 'red') return false;
            if (statusFilter === 'orange' && statusColor !== 'orange') return false;
            if (statusFilter === 'green' && statusColor !== 'green') return false;
        }
        
        return true;
    });
    
    renderTable(filtered);
}

// Fonction pour ouvrir le modal d'ajout/modification
function openModal(requestId = null) {
    const modal = document.getElementById('requestModal');
    const form = document.getElementById('requestForm');
    const modalTitle = document.getElementById('modalTitle');
    
    if (requestId) {
        // Mode édition
        modalTitle.textContent = 'Modifier la demande';
        const request = getRequests().find(r => r.id === requestId);
        if (request) {
            document.getElementById('requestId').value = request.id;
            document.getElementById('entryDate').value = request.entryDate || '';
            document.getElementById('entryTime').value = request.entryTime || '';
            document.getElementById('clientName').value = request.clientName || '';
            document.getElementById('clientPhone').value = request.clientPhone || '';
            document.getElementById('clientEmail').value = request.clientEmail || '';
            document.getElementById('jobFunction').value = request.jobFunction || '';
            document.getElementById('jobFunctionFileData').value = request.jobFunctionFileData || '';
            document.getElementById('jobFunctionFileName').textContent = request.jobFunctionFileName || '';
            document.getElementById('numberOfPositions').value = request.numberOfPositions || 1;
            document.getElementById('jobQuality').value = request.jobQuality || '';
            document.getElementById('reliability').value = request.reliability || '';
            document.getElementById('cvSent').value = request.cvSent || 0;
            document.getElementById('cvFileLink').value = request.cvFileLink || '';
            document.getElementById('requestStatus').value = request.status || 'ouvert';
            document.getElementById('isDeal').value = request.isDeal || 'non';
            document.getElementById('dealDate').value = request.dealDate || '';
            document.getElementById('marginAmount').value = request.marginAmount || '';
            
            // Charger les consultants
            renderConsultants(request.consultants || []);
            
            // Charger les interviews
            renderInterviews(request.interviews || []);
            
            // Afficher/masquer le groupe marge
            document.getElementById('marginGroup').style.display = request.isDeal === 'oui' ? 'block' : 'none';
        }
    } else {
        // Mode ajout
        modalTitle.textContent = 'Nouvelle demande';
        form.reset();
        document.getElementById('requestId').value = '';
        document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('entryTime').value = new Date().toTimeString().slice(0, 5);
        document.getElementById('numberOfPositions').value = 1;
        document.getElementById('cvSent').value = 0;
        document.getElementById('requestStatus').value = 'ouvert';
        document.getElementById('isDeal').value = 'non';
        document.getElementById('marginGroup').style.display = 'none';
        document.getElementById('consultantsContainer').innerHTML = '';
        document.getElementById('interviewsContainer').innerHTML = '';
        document.getElementById('jobFunctionFileData').value = '';
        document.getElementById('jobFunctionFileName').textContent = '';
    }
    
    modal.style.display = 'block';
}

// Fonction pour fermer le modal
function closeModal() {
    const modal = document.getElementById('requestModal');
    modal.style.display = 'none';
}

// Fonction pour gérer le changement de fichier de fonction
function handleJobFunctionFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('jobFunctionFileData').value = e.target.result;
            document.getElementById('jobFunctionFileName').textContent = file.name;
        };
        reader.readAsDataURL(file);
    }
}

// Fonction pour ouvrir le fichier de fonction
function openJobFunctionFile(requestId) {
    const request = getRequests().find(r => r.id === requestId);
    if (request && request.jobFunctionFileData) {
        const link = document.createElement('a');
        link.href = request.jobFunctionFileData;
        link.download = request.jobFunctionFileName || 'document.pdf';
        link.click();
    }
}

// Fonction pour ouvrir un dossier
function openFolder(path) {
    // Sur Windows, on peut essayer d'ouvrir le dossier avec file://
    // Note: cela ne fonctionne que si le chemin est valide
    alert(`Pour ouvrir le dossier, copiez ce chemin dans l'explorateur de fichiers:\n${path}`);
}

// Configuration ATS
const ATS_API_URL = 'http://localhost:4000';

// Fonction pour rechercher des candidats dans l'ATS
async function searchATSCandidates(searchTerm) {
    if (!searchTerm || searchTerm.length < 2) {
        return [];
    }
    
    try {
        // Essayer différentes routes possibles de l'API ATS
        const endpoints = [
            `${ATS_API_URL}/api/candidates/search?q=${encodeURIComponent(searchTerm)}`,
            `${ATS_API_URL}/api/search?q=${encodeURIComponent(searchTerm)}`,
            `${ATS_API_URL}/api/candidates?search=${encodeURIComponent(searchTerm)}`,
            `${ATS_API_URL}/candidates/search?q=${encodeURIComponent(searchTerm)}`,
            `${ATS_API_URL}/search?q=${encodeURIComponent(searchTerm)}`,
            `${ATS_API_URL}/api/cv/search?q=${encodeURIComponent(searchTerm)}`
        ];
        
        for (const endpoint of endpoints) {
            try {
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    mode: 'cors'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    // Adapter selon la structure de la réponse
                    let candidates = [];
                    
                    if (Array.isArray(data)) {
                        candidates = data;
                    } else if (data.candidates && Array.isArray(data.candidates)) {
                        candidates = data.candidates;
                    } else if (data.results && Array.isArray(data.results)) {
                        candidates = data.results;
                    } else if (data.data && Array.isArray(data.data)) {
                        candidates = data.data;
                    } else if (data.cvs && Array.isArray(data.cvs)) {
                        candidates = data.cvs;
                    }
                    
                    if (candidates.length > 0) {
                        // Normaliser les données pour avoir un format cohérent
                        return candidates.map(candidate => ({
                            name: candidate.name || candidate.fullName || candidate.nom || candidate.firstName + ' ' + candidate.lastName || 'Nom inconnu',
                            email: candidate.email || candidate.mail || '',
                            id: candidate.id || candidate._id || null
                        })).slice(0, 10);
                    }
                }
            } catch (err) {
                // Essayer le prochain endpoint
                continue;
            }
        }
        
        // Si aucune route ne fonctionne, essayer de récupérer tous les candidats et filtrer localement
        const getAllEndpoints = [
            `${ATS_API_URL}/api/candidates`,
            `${ATS_API_URL}/api/cv`,
            `${ATS_API_URL}/candidates`
        ];
        
        for (const endpoint of getAllEndpoints) {
            try {
                const allCandidatesResponse = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    mode: 'cors'
                });
                
                if (allCandidatesResponse.ok) {
                    const allData = await allCandidatesResponse.json();
                    let candidates = [];
                    
                    if (Array.isArray(allData)) {
                        candidates = allData;
                    } else if (allData.candidates && Array.isArray(allData.candidates)) {
                        candidates = allData.candidates;
                    } else if (allData.data && Array.isArray(allData.data)) {
                        candidates = allData.data;
                    } else if (allData.cvs && Array.isArray(allData.cvs)) {
                        candidates = allData.cvs;
                    }
                    
                    const searchLower = searchTerm.toLowerCase();
                    
                    return candidates
                        .map(candidate => ({
                            name: candidate.name || candidate.fullName || candidate.nom || 
                                  (candidate.firstName && candidate.lastName ? `${candidate.firstName} ${candidate.lastName}` : null) ||
                                  'Nom inconnu',
                            email: candidate.email || candidate.mail || '',
                            id: candidate.id || candidate._id || null
                        }))
                        .filter(candidate => {
                            const name = candidate.name.toLowerCase();
                            const email = candidate.email.toLowerCase();
                            return name.includes(searchLower) || email.includes(searchLower);
                        })
                        .slice(0, 10); // Limiter à 10 résultats
                }
            } catch (err) {
                // Essayer le prochain endpoint
                continue;
            }
        }
        
        return [];
    } catch (error) {
        console.error('Erreur lors de la recherche ATS:', error);
        return [];
    }
}

// Fonction pour afficher les résultats de recherche ATS
function showATSSearchResults(input, results) {
    // S'assurer que le wrapper existe
    let wrapper = input.parentElement;
    if (!wrapper.classList.contains('candidate-input-wrapper')) {
        // Créer le wrapper si il n'existe pas
        wrapper = document.createElement('div');
        wrapper.className = 'candidate-input-wrapper';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
    }
    
    // Supprimer les résultats précédents
    const existingResults = wrapper.querySelector('.ats-search-results');
    if (existingResults) {
        existingResults.remove();
    }
    
    if (results.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'ats-search-results';
        noResults.innerHTML = '<div class="ats-result-item no-results">Aucun résultat trouvé dans l\'ATS</div>';
        wrapper.appendChild(noResults);
        return;
    }
    
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'ats-search-results';
    
    results.forEach(candidate => {
        const resultItem = document.createElement('div');
        resultItem.className = 'ats-result-item';
        
        const name = candidate.name || 'Nom inconnu';
        const email = candidate.email || '';
        
        resultItem.innerHTML = `
            <div style="font-weight: 500; color: #2c3e50;">${name}</div>
            ${email ? `<div class="ats-result-email">${email}</div>` : ''}
        `;
        
        resultItem.addEventListener('click', () => {
            input.value = name;
            resultsContainer.remove();
            // Déclencher un événement input pour mettre à jour les autres listeners
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });
        
        resultsContainer.appendChild(resultItem);
    });
    
    wrapper.appendChild(resultsContainer);
}

// Fonction pour initialiser la recherche ATS sur un champ
function initATSSearch(input) {
    // S'assurer que le wrapper existe
    let wrapper = input.parentElement;
    if (!wrapper.classList.contains('candidate-input-wrapper')) {
        wrapper = document.createElement('div');
        wrapper.className = 'candidate-input-wrapper';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
    }
    
    let searchTimeout;
    
    input.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        
        // Annuler la recherche précédente
        clearTimeout(searchTimeout);
        
        // Supprimer les résultats si le champ est vide
        if (searchTerm.length < 2) {
            const wrapper = this.parentElement.classList.contains('candidate-input-wrapper') 
                ? this.parentElement 
                : this.parentElement.querySelector('.candidate-input-wrapper');
            if (wrapper) {
                const existingResults = wrapper.querySelector('.ats-search-results');
                if (existingResults) {
                    existingResults.remove();
                }
            }
            return;
        }
        
        // Attendre 300ms avant de rechercher (debounce)
        searchTimeout = setTimeout(async () => {
            const results = await searchATSCandidates(searchTerm);
            showATSSearchResults(this, results);
        }, 300);
    });
    
    // Fermer les résultats si on clique ailleurs (une seule fois par champ)
    const closeResultsHandler = function(event) {
        const wrapper = input.parentElement.classList.contains('candidate-input-wrapper') 
            ? input.parentElement 
            : input.closest('.candidate-input-wrapper');
        
        if (wrapper && !wrapper.contains(event.target)) {
            const existingResults = wrapper.querySelector('.ats-search-results');
            if (existingResults) {
                existingResults.remove();
            }
        }
    };
    
    // Utiliser capture pour s'assurer que l'événement est bien capturé
    document.addEventListener('click', closeResultsHandler, true);
    
    // Nettoyer l'event listener quand le champ est supprimé (si possible)
    input.addEventListener('remove', () => {
        document.removeEventListener('click', closeResultsHandler, true);
    });
}

// Fonction pour ajouter un consultant
function addConsultant() {
    const container = document.getElementById('consultantsContainer');
    const consultantItem = document.createElement('div');
    consultantItem.className = 'consultant-item';
    consultantItem.innerHTML = `
        <div class="consultant-row">
            <div class="candidate-input-wrapper">
                <input type="text" class="consultant-name" placeholder="Nom du consultant" data-consultant-index="${container.children.length}">
            </div>
            <button type="button" class="btn-remove-consultant" onclick="removeConsultant(this)">×</button>
        </div>
    `;
    container.appendChild(consultantItem);
    
    // Initialiser la recherche ATS sur le nouveau champ
    const input = consultantItem.querySelector('.consultant-name');
    initATSSearch(input);
}

// Fonction pour supprimer un consultant
function removeConsultant(button) {
    button.closest('.consultant-item').remove();
}

// Fonction pour afficher les consultants
function renderConsultants(consultants) {
    const container = document.getElementById('consultantsContainer');
    container.innerHTML = '';
    consultants.forEach((consultant, index) => {
        const consultantItem = document.createElement('div');
        consultantItem.className = 'consultant-item';
        consultantItem.innerHTML = `
            <div class="consultant-row">
                <div class="candidate-input-wrapper">
                    <input type="text" class="consultant-name" value="${consultant.name || ''}" placeholder="Nom du consultant" data-consultant-index="${index}">
                </div>
                <button type="button" class="btn-remove-consultant" onclick="removeConsultant(this)">×</button>
            </div>
        `;
        container.appendChild(consultantItem);
        
        // Initialiser la recherche ATS sur le champ
        const input = consultantItem.querySelector('.consultant-name');
        initATSSearch(input);
    });
}

// Fonction pour ajouter une interview
function addInterview() {
    const container = document.getElementById('interviewsContainer');
    const interviewItem = document.createElement('div');
    interviewItem.className = 'interview-item';
    interviewItem.innerHTML = `
        <div class="interview-row">
            <input type="date" class="interview-date" placeholder="Date" data-interview-index="${container.children.length}">
            <input type="time" class="interview-time" placeholder="Heure">
            <div class="candidate-input-wrapper">
                <input type="text" class="interview-candidate" placeholder="Candidat">
            </div>
            <button type="button" class="btn-remove-interview" onclick="removeInterview(this)">×</button>
        </div>
    `;
    container.appendChild(interviewItem);
    
    // Initialiser la recherche ATS sur le nouveau champ candidat
    const input = interviewItem.querySelector('.interview-candidate');
    initATSSearch(input);
}

// Fonction pour supprimer une interview
function removeInterview(button) {
    button.closest('.interview-item').remove();
}

// Fonction pour afficher les interviews
function renderInterviews(interviews) {
    const container = document.getElementById('interviewsContainer');
    container.innerHTML = '';
    interviews.forEach((interview, index) => {
        const interviewItem = document.createElement('div');
        interviewItem.className = 'interview-item';
        interviewItem.innerHTML = `
            <div class="interview-row">
                <input type="date" class="interview-date" value="${interview.date || ''}" placeholder="Date" data-interview-index="${index}">
                <input type="time" class="interview-time" value="${interview.time || ''}" placeholder="Heure">
                <div class="candidate-input-wrapper">
                    <input type="text" class="interview-candidate" value="${interview.candidate || ''}" placeholder="Candidat">
                </div>
                <button type="button" class="btn-remove-interview" onclick="removeInterview(this)">×</button>
            </div>
        `;
        container.appendChild(interviewItem);
        
        // Initialiser la recherche ATS sur le champ candidat
        const input = interviewItem.querySelector('.interview-candidate');
        initATSSearch(input);
    });
}

// Fonction pour sauvegarder une demande
function saveRequest(event) {
    event.preventDefault();
    
    const requests = getRequests();
    const requestId = document.getElementById('requestId').value;
    const isEdit = !!requestId;
    
    // Récupérer les consultants
    const consultants = [];
    document.querySelectorAll('.consultant-name').forEach(input => {
        if (input.value.trim()) {
            consultants.push({ name: input.value.trim() });
        }
    });
    
    // Récupérer les interviews
    const interviews = [];
    document.querySelectorAll('.interview-item').forEach(item => {
        const date = item.querySelector('.interview-date').value;
        const time = item.querySelector('.interview-time').value;
        const candidate = item.querySelector('.interview-candidate').value;
        if (date || time || candidate) {
            interviews.push({ date, time, candidate });
        }
    });
    
    const requestData = {
        id: isEdit ? requestId : Date.now().toString(),
        entryDate: document.getElementById('entryDate').value,
        entryTime: document.getElementById('entryTime').value,
        clientName: document.getElementById('clientName').value,
        clientPhone: document.getElementById('clientPhone').value,
        clientEmail: document.getElementById('clientEmail').value,
        jobFunction: document.getElementById('jobFunction').value,
        jobFunctionFileData: document.getElementById('jobFunctionFileData').value,
        jobFunctionFileName: document.getElementById('jobFunctionFileName').textContent,
        numberOfPositions: parseInt(document.getElementById('numberOfPositions').value) || 1,
        jobQuality: document.getElementById('jobQuality').value,
        reliability: document.getElementById('reliability').value,
        cvSent: parseInt(document.getElementById('cvSent').value) || 0,
        consultants: consultants,
        interviews: interviews,
        cvFileLink: document.getElementById('cvFileLink').value,
        status: document.getElementById('requestStatus').value,
        isDeal: document.getElementById('isDeal').value,
        dealDate: document.getElementById('dealDate').value,
        marginAmount: document.getElementById('marginAmount').value || '0'
    };
    
    if (isEdit) {
        const index = requests.findIndex(r => r.id === requestId);
        if (index !== -1) {
            requests[index] = requestData;
        }
    } else {
        requests.push(requestData);
    }
    
    saveRequests(requests);
    renderTable();
    updateStats();
    closeModal();
    filterRequests();
}

// Fonction pour modifier une demande
function editRequest(requestId) {
    openModal(requestId);
}

// Fonction pour supprimer une demande
function deleteRequest(requestId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
        const requests = getRequests();
        const filtered = requests.filter(r => r.id !== requestId);
        saveRequests(filtered);
        renderTable();
        updateStats();
        filterRequests();
    }
}

// Fonction pour exporter en XLSX (Excel)
function exportToCSV() {
    const requests = getRequests();
    if (requests.length === 0) {
        alert('Aucune donnée à exporter');
        return;
    }
    
    // Vérifier que la bibliothèque XLSX est chargée
    if (typeof XLSX === 'undefined') {
        alert('Erreur : La bibliothèque Excel n\'est pas chargée. Veuillez rafraîchir la page.');
        return;
    }
    
    // Trier les demandes dans le même ordre que l'interface
    const sortedRequests = sortRequests(requests);
    
    // Calculer les statistiques (même logique que updateStats)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const getN = (req) => parseInt(req.numberOfPositions) || 1;
    
    const totalRequests = requests.reduce((sum, req) => sum + getN(req), 0);
    
    const monthlyRequests = requests.filter(req => {
        const reqDate = new Date(`${req.entryDate}T${req.entryTime || '00:00'}`);
        return reqDate.getMonth() === currentMonth && reqDate.getFullYear() === currentYear;
    });
    const monthlyRequestsN = monthlyRequests.reduce((sum, req) => sum + getN(req), 0);
    
    const openJobs = requests
        .filter(req => req.status === 'ouvert' || !req.status)
        .reduce((sum, req) => sum + getN(req), 0);
    const closedJobs = requests
        .filter(req => req.status === 'ferme')
        .reduce((sum, req) => sum + getN(req), 0);
    
    const deals = requests
        .filter(req => req.isDeal === 'oui')
        .reduce((sum, req) => sum + getN(req), 0);
    const conversionRate = totalRequests > 0 ? ((deals / totalRequests) * 100).toFixed(1) : 0;
    
    const withCVs = requests
        .filter(req => req.cvSent > 0)
        .reduce((sum, req) => sum + getN(req), 0);
    const responseRate = totalRequests > 0 ? ((withCVs / totalRequests) * 100).toFixed(1) : 0;
    
    // Deals ce mois = somme des N pour les deals dont la date du deal est dans le mois en cours
    const monthlyDeals = requests
        .filter(req => {
            if (req.isDeal !== 'oui' || !req.dealDate) return false;
            const dealDate = new Date(req.dealDate);
            return dealDate.getMonth() === currentMonth && dealDate.getFullYear() === currentYear;
        })
        .reduce((sum, req) => sum + getN(req), 0);
    
    // Préparer les statistiques pour l'export
    const statsRows = [
        ['STATISTIQUES', ''],
        ['Total demandes', totalRequests],
        ['Demandes ce mois', monthlyRequestsN],
        ['Jobs ouverts / fermés', `${openJobs} / ${closedJobs}`],
        ['Taux de transformation', `${conversionRate}%`],
        ['Taux de réponse', `${responseRate}%`],
        ['Deals total', deals],
        ['Deals ce mois', monthlyDeals],
        ['', ''], // Ligne vide pour séparer
    ];
    
    // Préparer les données du tableau
    const headers = [
        'Statut', 'Date entrée', 'Heure entrée', 'Client', 'Téléphone', 'Email',
        'Fonction recherchée', 'N', 'Q', 'F', 'CV envoyés', 'Consultants',
        'Interviews', 'Fichier CVs', 'Deal', 'Date deal', 'Marge'
    ];
    
    const rows = sortedRequests.map(request => {
        const consultants = (request.consultants || []).map(c => c.name).join(' | ');
        const interviews = (request.interviews || []).map(i => {
            const date = i.date ? new Date(i.date).toLocaleDateString('fr-FR') : '';
            const time = i.time || '';
            const candidate = i.candidate || '';
            return `${date} ${time} - ${candidate}`;
        }).join(' | ');
        
        // Formater la date et l'heure
        let formattedDate = '';
        let formattedTime = '';
        if (request.entryDate) {
            const date = new Date(`${request.entryDate}T${request.entryTime || '00:00'}`);
            formattedDate = date.toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
            });
            formattedTime = date.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
        
        // Formater la marge
        const margin = request.marginAmount ? parseFloat(request.marginAmount).toFixed(2) : '0.00';
        
        return [
            request.status || '',
            formattedDate,
            formattedTime,
            request.clientName || '',
            request.clientPhone || '',
            request.clientEmail || '',
            request.jobFunction || '',
            request.numberOfPositions || 1,
            request.jobQuality || '',
            request.reliability || '',
            request.cvSent || 0,
            consultants,
            interviews,
            request.cvFileLink || '',
            request.isDeal || 'non',
            request.dealDate ? new Date(request.dealDate).toLocaleDateString('fr-FR') : '',
            margin
        ];
    });
    
    // Créer un workbook
    const wb = XLSX.utils.book_new();
    
    // Créer une feuille avec les statistiques en haut, puis les données
    const wsData = [...statsRows, headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Définir les largeurs de colonnes
    // Colonnes pour les statistiques (2 colonnes)
    const statsColWidths = [
        { wch: 25 },  // Label statistique
        { wch: 15 }   // Valeur statistique
    ];
    
    // Colonnes pour le tableau de données
    const dataColWidths = [
        { wch: 10 },  // Statut
        { wch: 12 },  // Date entrée
        { wch: 10 },  // Heure entrée
        { wch: 25 },  // Client
        { wch: 15 },  // Téléphone
        { wch: 30 },  // Email
        { wch: 30 },  // Fonction recherchée
        { wch: 5 },   // N
        { wch: 5 },   // Q
        { wch: 5 },   // F
        { wch: 12 },  // CV envoyés
        { wch: 40 },  // Consultants
        { wch: 40 },  // Interviews
        { wch: 40 },  // Fichier CVs
        { wch: 8 },   // Deal
        { wch: 12 },  // Date deal
        { wch: 12 }   // Marge
    ];
    
    // Utiliser les largeurs du tableau de données (les stats n'utilisent que les 2 premières colonnes)
    ws['!cols'] = dataColWidths;
    
    // Formater la section statistiques
    const statsStartRow = 0;
    const statsEndRow = statsRows.length - 1;
    
    // Titre "STATISTIQUES"
    const statsTitleCell = XLSX.utils.encode_cell({ r: statsStartRow, c: 0 });
    if (ws[statsTitleCell]) {
        ws[statsTitleCell].s = {
            font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "667EEA" } },
            alignment: { horizontal: "left", vertical: "center" },
            border: {
                top: { style: "medium", color: { rgb: "000000" } },
                bottom: { style: "medium", color: { rgb: "000000" } },
                left: { style: "medium", color: { rgb: "000000" } },
                right: { style: "medium", color: { rgb: "000000" } }
            }
        };
    }
    
    // Formater les lignes de statistiques
    for (let row = statsStartRow + 1; row <= statsEndRow - 1; row++) {
        const labelCell = XLSX.utils.encode_cell({ r: row, c: 0 });
        const valueCell = XLSX.utils.encode_cell({ r: row, c: 1 });
        
        if (ws[labelCell]) {
            ws[labelCell].s = {
                font: { bold: true, sz: 11 },
                fill: { fgColor: { rgb: "F0F0F0" } },
                alignment: { horizontal: "left", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "CCCCCC" } },
                    bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                    left: { style: "thin", color: { rgb: "CCCCCC" } },
                    right: { style: "thin", color: { rgb: "CCCCCC" } }
                }
            };
        }
        
        if (ws[valueCell]) {
            ws[valueCell].s = {
                font: { sz: 11 },
                fill: { fgColor: { rgb: "FFFFFF" } },
                alignment: { horizontal: "left", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "CCCCCC" } },
                    bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                    left: { style: "thin", color: { rgb: "CCCCCC" } },
                    right: { style: "thin", color: { rgb: "CCCCCC" } }
                }
            };
        }
    }
    
    // Formater l'en-tête du tableau (après les statistiques)
    const headerRow = statsRows.length;
    const headerRange = XLSX.utils.decode_range(ws['!ref']);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: col });
        if (!ws[cellAddress]) continue;
        
        // Style pour l'en-tête : gras, fond coloré, texte blanc
        ws[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
            fill: { fgColor: { rgb: "667EEA" } },
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } }
            }
        };
    }
    
    // Formater les lignes de données
    const dataStartRow = headerRow + 1;
    for (let row = dataStartRow; row < dataStartRow + rows.length; row++) {
        for (let col = 0; col < headers.length; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!ws[cellAddress]) continue;
            
            // Style pour les données
            ws[cellAddress].s = {
                font: { sz: 10 },
                alignment: { 
                    horizontal: col === 7 || col === 8 || col === 9 || col === 10 || col === 16 ? "center" : "left",
                    vertical: "top",
                    wrapText: true
                },
                border: {
                    top: { style: "thin", color: { rgb: "E0E0E0" } },
                    bottom: { style: "thin", color: { rgb: "E0E0E0" } },
                    left: { style: "thin", color: { rgb: "E0E0E0" } },
                    right: { style: "thin", color: { rgb: "E0E0E0" } }
                }
            };
            
            // Format numérique pour N, Q, F, CV envoyés, Marge
            if (col === 7 || col === 8 || col === 9 || col === 10) {
                ws[cellAddress].z = '0';
            } else if (col === 16) {
                ws[cellAddress].z = '#,##0.00';
            }
        }
        
        // Alterner les couleurs de fond pour les lignes (zebra striping)
        if (row % 2 === 0) {
            for (let col = 0; col < headers.length; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                if (ws[cellAddress] && ws[cellAddress].s) {
                    ws[cellAddress].s.fill = { fgColor: { rgb: "FAFAFA" } };
                }
            }
        }
    }
    
    // Ajouter la feuille au workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Demandes de staffing');
    
    // Générer le nom de fichier avec la date
    const fileName = `staffing_requests_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Télécharger le fichier
    XLSX.writeFile(wb, fileName);
    
    alert(`✅ Export Excel réussi !\n\nFichier : ${fileName}\n📊 ${requests.length} demande(s) exportée(s).`);
}

// Flag pour éviter d'ajouter les listeners plusieurs fois
let appInitialized = false;

// Fonction d'initialisation de l'application
function initializeApp() {
    // Éviter d'initialiser plusieurs fois
    if (appInitialized) return;
    appInitialized = true;

    // Événements des boutons de filtre
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterRequests();
        });
    });
    
    // Événement de recherche
    document.getElementById('searchInput').addEventListener('input', filterRequests);
    
    // Événement du bouton effacer recherche
    document.getElementById('searchInput').addEventListener('input', function() {
        document.getElementById('clearSearch').style.display = this.value ? 'block' : 'none';
    });
    
    document.getElementById('clearSearch').addEventListener('click', function() {
        document.getElementById('searchInput').value = '';
        this.style.display = 'none';
        filterRequests();
    });
    
    // Événements des filtres
    document.getElementById('qualityFilter').addEventListener('change', filterRequests);
    document.getElementById('showOnlyOpen').addEventListener('change', filterRequests);
    
    // Événements du modal
    document.getElementById('addRequestBtn').addEventListener('click', () => openModal());
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('requestModal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Événement du formulaire
    document.getElementById('requestForm').addEventListener('submit', saveRequest);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    
    // Événement du bouton ajouter consultant
    document.getElementById('addConsultantBtn').addEventListener('click', addConsultant);
    
    // Événement du bouton ajouter interview
    document.getElementById('addInterviewBtn').addEventListener('click', addInterview);
    
    // Événement du select Deal
    document.getElementById('isDeal').addEventListener('change', function() {
        document.getElementById('marginGroup').style.display = this.value === 'oui' ? 'block' : 'none';
    });
    
    // Événement export CSV
    document.getElementById('exportCsvBtn').addEventListener('click', exportToCSV);
    
    // Événement sauvegarder
    document.getElementById('saveBtn').addEventListener('click', saveToFile);
    
    // Événement charger
    document.getElementById('loadBtn').addEventListener('click', loadFromFile);
    
    // Événement paramètres
    document.getElementById('settingsBtn').addEventListener('click', openSettingsModal);
    document.querySelector('.close-settings').addEventListener('click', closeSettingsModal);
    document.getElementById('verifyAccessCodeBtn').addEventListener('click', verifyAccessCode);
    document.getElementById('accessCodeInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyAccessCode();
        }
    });
    
    // Événements modal utilisateur
    document.getElementById('addUserBtn').addEventListener('click', () => openUserModal());
    document.getElementById('userForm').addEventListener('submit', saveUser);
    document.getElementById('cancelUserBtn').addEventListener('click', closeUserModal);
    document.querySelector('.close-user-modal').addEventListener('click', closeUserModal);
    
    window.addEventListener('click', function(event) {
        const settingsModal = document.getElementById('settingsModal');
        const userModal = document.getElementById('userModal');
        if (event.target === settingsModal) {
            closeSettingsModal();
        }
        if (event.target === userModal) {
            closeUserModal();
        }
    });
    
    // Charger automatiquement la dernière sauvegarde si aucune donnée n'existe
    loadLastSave();
    
    // Initialiser l'affichage
    renderTable();
    updateStats();
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Événement du formulaire de login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Vérifier si l'utilisateur est déjà connecté
    if (isAuthenticated()) {
        showMainContent();
        initializeApp();
    } else {
        showLoginPage();
    }
});

// Exposer les fonctions globales nécessaires
window.openJobFunctionFile = openJobFunctionFile;
window.openFolder = openFolder;
window.editRequest = editRequest;
window.deleteRequest = deleteRequest;
window.removeConsultant = removeConsultant;
window.removeInterview = removeInterview;
window.handleJobFunctionFileChange = handleJobFunctionFileChange;
window.editUser = editUser;
window.deleteUser = deleteUser;
