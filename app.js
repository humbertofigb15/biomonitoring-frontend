// Configuración de la API
const API_BASE_URL = window.API_BASE_URL;

// Estado global de la aplicación
let currentUser = null;
let authToken = null;
let isOfflineMode = false;

// Elementos del DOM
const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const loginForm = document.getElementById('loginForm');
const reportForm = document.getElementById('reportForm');
const logoutBtn = document.getElementById('logoutBtn');
const tipoRegistroSelect = document.getElementById('tipoRegistro');
const specificFieldsContainer = document.getElementById('specificFields');
const imagesInput = document.getElementById('images');
const imagePreview = document.getElementById('imagePreview');

// Campos específicos por tipo de registro
const specificFieldsConfig = {
    fauna_transecto: [
    { name: 'numeroTransecto', label: 'Número de Transecto', type: 'number', required: true },  // Aquí sí mapeas a numeroTransecto de la tabla
    { name: 'tipoAnimal', label: 'Tipo de Animal', type: 'select', options: ['mamifero', 'ave', 'reptil', 'anfibio', 'insecto'], required: true },
    { name: 'nombreComun', label: 'Nombre Común', type: 'text', required: false },
    { name: 'nombreCientifico', label: 'Nombre Científico', type: 'text', required: false },
    { name: 'numeroIndividuos', label: 'Número de Individuos', type: 'number', required: true },
    { name: 'tipoObservacion', label: 'Tipo de Observación', type: 'select', options: ['la_vio', 'huella', 'rastro', 'caceria', 'le_dijeron'], required: true },
    { name: 'observaciones', label: 'Observaciones', type: 'textarea', required: false }
],
    fauna_punto_conteo: [
    { name: 'tipoAnimal', label: 'Tipo de Animal', type: 'select', options: ['mamifero', 'ave', 'reptil', 'anfibio', 'insecto'], required: true },
    { name: 'nombreComun', label: 'Nombre Común', type: 'text', required: false },
    { name: 'nombreCientifico', label: 'Nombre Científico', type: 'text', required: false },
    { name: 'numeroIndividuos', label: 'Número de Individuos', type: 'number', required: true },
    { name: 'tipoObservacion', label: 'Tipo de Observación', type: 'select', options: ['la_vio', 'huella', 'rastro', 'caceria', 'le_dijeron'], required: true },
    { name: 'observaciones', label: 'Observaciones', type: 'textarea', required: false }
],
    fauna_busqueda_libre: [
    { name: 'zona', label: 'Zona', type: 'select', options: ['bosque', 'arreglo_agroforestal', 'cultivos_transito'], required: true },
    { name: 'tipoAnimal', label: 'Tipo de Animal', type: 'select', options: ['mamifero', 'ave', 'reptil', 'anfibio', 'insecto'], required: true },
    { name: 'nombreComun', label: 'Nombre Común', type: 'text', required: false },
    { name: 'nombreCientifico', label: 'Nombre Científico', type: 'text', required: false },
    { name: 'numeroIndividuos', label: 'Número de Individuos', type: 'number', required: true },
    { name: 'tipoObservacion', label: 'Tipo de Observación', type: 'select', options: ['la_vio', 'huella', 'rastro', 'caceria', 'le_dijeron'], required: true },
    { name: 'alturaObservacion', label: 'Altura de Observación', type: 'select', options: ['baja_<1mt', 'media_1-3mt', 'alta_>3mt'], required: true },
    { name: 'observaciones', label: 'Observaciones', type: 'textarea', required: false }
],
    validacion_cobertura: [
    { name: 'codigo', label: 'Código', type: 'text', required: true },
    { name: 'seguimiento', label: 'Seguimiento', type: 'checkbox', required: false },
    { name: 'cambio', label: 'Cambio', type: 'checkbox', required: false },
    { name: 'cobertura', label: 'Cobertura', type: 'select', options: ['BD', 'RA', 'IF'], required: true },
    { name: 'tiposCultivo', label: 'Tipos de Cultivo', type: 'text', required: false },
    { name: 'disturbio', label: 'Disturbio', type: 'select', options: ['inundacion', 'quema', 'otro'], required: false },
    { name: 'observaciones', label: 'Observaciones', type: 'textarea', required: false }
],
    parcela_vegetacion: [
    { name: 'codigo', label: 'Código', type: 'text', required: true },
    { name: 'cuadrante', label: 'Cuadrante', type: 'select', options: ['A','B','C','D','E','F','G'], required: true },
    { name: 'subCuadrante', label: 'Sub Cuadrante', type: 'number', required: true },
    { name: 'habitoCrecimiento', label: 'Hábito de Crecimiento', type: 'select', options: ['arbusto_<1mt','arbolito_1-3mt','arbol_>3mt'], required: true },
    { name: 'nombreComun', label: 'Nombre Común', type: 'text', required: false },
    { name: 'nombreCientifico', label: 'Nombre Científico', type: 'text', required: false },
    { name: 'placa', label: 'Placa', type: 'text', required: false },
    { name: 'circunferenciaCm', label: 'Circunferencia (cm)', type: 'number', required: false },
    { name: 'distanciaMt', label: 'Distancia (m)', type: 'number', required: false },
    { name: 'estaturaBiomonitorMt', label: 'Estatura Biomonitor (m)', type: 'number', required: false },
    { name: 'alturaMt', label: 'Altura (m)', type: 'number', required: false },
    { name: 'observaciones', label: 'Observaciones', type: 'textarea', required: false }
],
    camaras_trampa: [
    { name: 'codigo', label: 'Código', type: 'text', required: true },
    { name: 'zona', label: 'Zona', type: 'text', required: true },
    { name: 'nombreCamara', label: 'Nombre de la Cámara', type: 'text', required: false },
    { name: 'placaCamara', label: 'Placa de la Cámara', type: 'text', required: false },
    { name: 'placaGuaya', label: 'Placa de la Guaya', type: 'text', required: false },
    { name: 'anchoCaminoMt', label: 'Ancho del Camino (m)', type: 'number', required: false },
    { name: 'fechaInstalacion', label: 'Fecha de Instalación', type: 'datetime-local', required: true },
    { name: 'distanciaObjetivoMt', label: 'Distancia al Objetivo (m)', type: 'number', required: false },
    { name: 'alturaLenteMt', label: 'Altura del Lente (m)', type: 'number', required: false },
    { name: 'listaChequeo', label: 'Lista de Chequeo (JSON)', type: 'textarea', required: false },
    { name: 'observaciones', label: 'Observaciones', type: 'textarea', required: false }
],
    variables_climaticas: [
    { name: 'zona', label: 'Zona', type: 'text', required: true },
    { name: 'pluviosidadMm', label: 'Humedad (mm)', type: 'number', required: false },
    { name: 'temperaturaMaxima', label: 'Temperatura Máxima (°C)', type: 'number', required: false },
    { name: 'temperaturaMinima', label: 'Temperatura Mínima (°C)', type: 'number', required: false },
    { name: 'nivelQuebradaMt', label: 'Nivel Quebrada (m)', type: 'number', required: false },
    { name: 'observaciones', label: 'Observaciones', type: 'textarea', required: false }
]
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    showLogin();
}

function addDemoMessage() {
    const loginContainer = document.querySelector('.login-container');
    const demoMessage = document.createElement('div');
    demoMessage.className = 'success-message';
    demoMessage.style.marginBottom = 'var(--space-16)';
    demoMessage.innerHTML = `
        <strong>Modo Demostración:</strong><br>
        Use cualquier usuario y contraseña para acceder al dashboard.<br>
        <small>El backend real debería estar en localhost:3000</small>
    `;
    loginContainer.insertBefore(demoMessage, loginContainer.querySelector('.login-form'));
}

function setupEventListeners() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout button
    logoutBtn.addEventListener('click', handleLogout);
    
    // Report form
    reportForm.addEventListener('submit', handleReportSubmit);
    reportForm.addEventListener('reset', handleFormReset);
    
    // Tipo de registro change
    tipoRegistroSelect.addEventListener('change', handleTipoRegistroChange);
    
    // Images input
    imagesInput.addEventListener('change', handleImagesChange);
}

// Funciones de autenticación
async function handleLogin(e) {
    e.preventDefault();

    const loginBtn = document.getElementById('loginBtn');
    const loginSpinner = document.getElementById('loginSpinner');
    const loginError = document.getElementById('loginError');
    const formData = new FormData(loginForm);

    const username = formData.get('username');
    const password = formData.get('password');

    if (!username || !password) {
        showError(loginError, 'Por favor ingrese usuario y contraseña');
        return;
    }

    loginBtn.classList.add('loading');
    loginSpinner.classList.remove('hidden');
    loginError.classList.add('hidden');

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            if (data.token) {
                authToken = data.token;
                // AQUÍ: guardas el id real del usuario
                currentUser = {
                    id: data.user.id,
                    username: data.user.username || data.user.correo, // depende de cómo regresas en backend
                };
                isOfflineMode = false;
                completLogin();
                return;
            }
        }

        const data = await response.json();
        throw new Error(data.message || 'Credenciales incorrectas');

    } catch (error) {
        console.log('Backend no disponible, activando modo demostración');

        setTimeout(() => {
            authToken = 'demo_token_' + Date.now();
            currentUser = { id: 9999, username: username }; // fake id para demo
            isOfflineMode = true;
            completLogin();
        }, 1000);
    }
}


function completLogin() {
    const loginBtn = document.getElementById('loginBtn');
    const loginSpinner = document.getElementById('loginSpinner');
    
    // Ocultar loading
    loginBtn.classList.remove('loading');
    loginSpinner.classList.add('hidden');
    
    // Mostrar dashboard
    showDashboard();
    
    // Mostrar mensaje de éxito si está en modo demostración
    if (isOfflineMode) {
        setTimeout(() => {
            const formSuccess = document.getElementById('formSuccess');
            showSuccess(formSuccess, 'Modo demostración activo - Los datos no se guardarán realmente');
        }, 500);
    }
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    isOfflineMode = false;
    showLogin();
    loginForm.reset();
}

// Funciones de navegación
function showLogin() {
    loginScreen.classList.remove('hidden');
    dashboardScreen.classList.add('hidden');
}

function showDashboard() {
    loginScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');
}

// Funciones del formulario de reporte
function handleTipoRegistroChange(e) {
    const selectedType = e.target.value;
    generateSpecificFields(selectedType);
}

function generateSpecificFields(tipoRegistro) {
    if (!tipoRegistro || !specificFieldsConfig[tipoRegistro]) {
        specificFieldsContainer.innerHTML = '';
        specificFieldsContainer.classList.add('hidden');
        return;
    }
    
    const fields = specificFieldsConfig[tipoRegistro];
    specificFieldsContainer.classList.remove('hidden');
    
    let html = `<h3>Campos Específicos - ${getTipoRegistroLabel(tipoRegistro)}</h3>`;
    
    fields.forEach(field => {
        html += `<div class="form-group">`;
        html += `<label for="${field.name}" class="form-label">${field.label}${field.required ? ' *' : ''}</label>`;
        
        if (field.type === 'select') {
            html += `<select id="${field.name}" name="${field.name}" class="form-control"${field.required ? ' required' : ''}>`;
            html += `<option value="">Seleccione</option>`;
            field.options.forEach(option => {
                const label = option.replace('_', ' ').split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                html += `<option value="${option}">${label}</option>`;
            });
            html += `</select>`;
        } else if (field.type === 'textarea') {
            html += `<textarea id="${field.name}" name="${field.name}" class="form-control" rows="3"${field.required ? ' required' : ''} placeholder="Ingrese ${field.label.toLowerCase()}"></textarea>`;
        } else {
            const placeholder = field.type === 'number' ? 'Ej: 10' : `Ingrese ${field.label.toLowerCase()}`;
            html += `<input type="${field.type}" id="${field.name}" name="${field.name}" class="form-control"${field.required ? ' required' : ''} placeholder="${placeholder}">`;
        }
        
        html += `</div>`;
    });
    
    specificFieldsContainer.innerHTML = html;
}

function getTipoRegistroLabel(tipo) {
    const labels = {
        'fauna_transecto': 'Fauna - Transecto',
        'fauna_punto_conteo': 'Fauna - Punto de Conteo',
        'fauna_busqueda_libre': 'Fauna - Búsqueda Libre',
        'validacion_cobertura': 'Validación de Cobertura',
        'parcela_vegetacion': 'Parcela de Vegetación',
        'camaras_trampa': 'Cámaras Trampa',
        'variables_climaticas': 'Variables Climáticas'
    };
    return labels[tipo] || tipo;
}

// Manejo de imágenes
function handleImagesChange(e) {
    const files = Array.from(e.target.files);
    const fileError = document.getElementById('fileError');
    
    // Limpiar errores previos
    fileError.classList.add('hidden');
    
    // Validar número de archivos
    if (files.length > 5) {
        showError(fileError, 'Máximo 5 archivos permitidos');
        e.target.value = '';
        imagePreview.innerHTML = '';
        return;
    }
    
    // Validar cada archivo
    const validFiles = [];
    let hasError = false;
    
    for (const file of files) {
        // Validar tipo
        if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
            showError(fileError, `Tipo de archivo no válido: ${file.name}. Use JPEG, JPG, PNG o GIF`);
            hasError = true;
            break;
        }
        
        // Validar tamaño (2MB = 2 * 1024 * 1024 bytes)
        if (file.size > 2 * 1024 * 1024) {
            showError(fileError, `Archivo muy grande: ${file.name} (máximo 2MB)`);
            hasError = true;
            break;
        }
        
        validFiles.push(file);
    }
    
    if (hasError) {
        e.target.value = '';
        imagePreview.innerHTML = '';
        return;
    }
    
    displayImagePreviews(validFiles);
}

function displayImagePreviews(files) {
    imagePreview.innerHTML = '';
    
    if (files.length === 0) return;
    
    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'image-preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index + 1}">
                <button type="button" class="remove-image" onclick="removeImage(${index})">×</button>
                <div class="image-info">
                    ${file.name}<br>
                    ${(file.size / 1024).toFixed(1)} KB
                </div>
            `;
            imagePreview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });
}

function removeImage(index) {
    const files = Array.from(imagesInput.files);
    const dt = new DataTransfer();
    
    files.forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });
    
    imagesInput.files = dt.files;
    displayImagePreviews(Array.from(dt.files));
}

// Envío del formulario
async function handleReportSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const submitSpinner = document.getElementById('submitSpinner');
    const formError = document.getElementById('formError');
    const formSuccess = document.getElementById('formSuccess');
    
    // Limpiar mensajes previos
    formError.classList.add('hidden');
    formSuccess.classList.add('hidden');
    
    // Validar formulario
    if (!validateForm()) {
        return;
    }
    
    // Mostrar loading
    submitBtn.classList.add('loading');
    submitSpinner.classList.remove('hidden');
    
    try {
        if (isOfflineMode) {
            // Modo demostración
            await simulateReportSubmission();
            showSuccess(formSuccess, 'Reporte creado exitosamente (modo demostración)');
        } else {
            // Envío real al backend
            const formData = createFormData();
            
            const response = await fetch(`${API_BASE_URL}/api/records`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            });
            
            if (response.ok) {
                showSuccess(formSuccess, 'Reporte creado exitosamente');
            } else {
                const data = await response.json();
                throw new Error(data.message || 'Error al crear el reporte');
            }
        }
        
        // Reset form on success
        reportForm.reset();
        handleFormReset();
        
    } catch (error) {
        console.error('Error al enviar reporte:', error);
        showError(formError, error.message || 'Error al conectar con el servidor');
    } finally {
        submitBtn.classList.remove('loading');
        submitSpinner.classList.add('hidden');
    }
}

async function simulateReportSubmission() {
    // Simular tiempo de procesamiento
    return new Promise(resolve => setTimeout(resolve, 2000));
}

function validateForm() {
    const requiredFields = ['estadoTiempo', 'estacion', 'tipoRegistro'];
    let isValid = true;
    let firstInvalidField = null;
    
    // Validar campos requeridos básicos
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field.value.trim()) {
            if (!firstInvalidField) firstInvalidField = field;
            isValid = false;
        }
    });
    
    // Validar campos específicos requeridos
    const tipoRegistro = document.getElementById('tipoRegistro').value;
    if (tipoRegistro && specificFieldsConfig[tipoRegistro]) {
        specificFieldsConfig[tipoRegistro].forEach(fieldConfig => {
            if (fieldConfig.required) {
                const field = document.getElementById(fieldConfig.name);
                if (field && !field.value.trim()) {
                    if (!firstInvalidField) firstInvalidField = field;
                    isValid = false;
                }
            }
        });
    }
    
    // Validar JSON de evidencias si se proporciona
    const evidenciasField = document.getElementById('evidencias');
    if (evidenciasField.value.trim()) {
        try {
            JSON.parse(evidenciasField.value);
        } catch (error) {
            showError(document.getElementById('formError'), 'El campo evidencias debe contener JSON válido');
            evidenciasField.focus();
            return false;
        }
    }
    
    if (!isValid && firstInvalidField) {
        firstInvalidField.focus();
        showError(document.getElementById('formError'), 'Por favor complete todos los campos requeridos');
    }
    
    return isValid;
}

function createFormData() {
    const formData = new FormData();

    // CAMPOS BÁSICOS
    const basicFields = ['estadoTiempo', 'estacion', 'tipoRegistro', 'reporteIdLocal', 'fechaCapturaLocal'];
    basicFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field && field.value) {
            formData.append(fieldName, field.value);
        }
    });

    // 🚨 AQUI metemos el usuario_id
    if (currentUser && currentUser.id) {
        formData.append('usuario_id', currentUser.id);
    }

    // CAMPOS ESPECÍFICOS
    const tipoRegistro = document.getElementById('tipoRegistro').value;
    if (tipoRegistro && specificFieldsConfig[tipoRegistro]) {
        specificFieldsConfig[tipoRegistro].forEach(fieldConfig => {
            const field = document.getElementById(fieldConfig.name);
            if (field) {
                let value = field.value;

                if (fieldConfig.name === 'listaChequeo') {
                    if (value.trim()) {
                        try {
                            JSON.parse(value);
                            formData.append(fieldConfig.name, value);
                        } catch (error) {
                            showError(document.getElementById('formError'), 'El campo Lista de Chequeo debe contener JSON válido');
                            throw new Error('Campo listaChequeo inválido');
                        }
                    }
                    return;
                }

                if (tipoRegistro === 'variables_climaticas' && fieldConfig.name === 'observaciones') {
                    return;
                }

                formData.append(fieldConfig.name, value);
            }
        });
    }

    // EVIDENCIAS
    const evidenciasField = document.getElementById('evidencias');
    if (evidenciasField.value.trim()) {
        formData.append('evidencias', evidenciasField.value);
    }

    // IMÁGENES
    const files = imagesInput.files;
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }

    return formData;
}

function handleFormReset() {
    specificFieldsContainer.innerHTML = '';
    specificFieldsContainer.classList.add('hidden');
    imagePreview.innerHTML = '';
    document.getElementById('formError').classList.add('hidden');
    document.getElementById('formSuccess').classList.add('hidden');
    document.getElementById('fileError').classList.add('hidden');
}

// Funciones de utilidad
function showError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
    setTimeout(() => {
        element.classList.add('hidden');
    }, 8000);
}

function showSuccess(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
    setTimeout(() => {
        element.classList.add('hidden');
    }, 8000);
}

// Funciones globales para ser llamadas desde HTML
window.removeImage = removeImage;