// public/js/utils.js

// --- CONSTANTES E CONFIGURAÇÕES ---
export const HISTORY_LIMIT = 25;
export const COMPACT_HISTORY_LIMIT = 5;
export const DEBOUNCE_DELAY = 300;
export const ALL_SITES = { kimovil: 'Kimovil', maiscelular: 'MaisCelular', gsmarena: 'GSMArena' };
export const SEARCH_RADIUS_KM = 5;

// --- ÍCONES SVG ---
export const searchIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search text-zinc-400 mr-3 shrink-0" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg>`;
export const historyIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-history text-zinc-400 mr-3 shrink-0" viewBox="0 0 16 16"><path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zM5.56 1.838a6.99 6.99 0 0 0-1.225.434l.485.875a6 6 0 0 1 1.037-.375l-.297-.934zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/></svg>`;
export const copyIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5-.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/></svg>`;
export const deleteIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>`;
export const checkCircleIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>`;
export const warningCircleIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>`;
export const infoCircleIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/></svg>`;
export const signal4gSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="currentColor" d="M148 200h-16v-56h16Zm-36-28h-24v-28h24v-28h-24v-20h44v76h-20Zm88-144v144h-24V56h-52v20h52v44h-28v-28h-20v56h20v24h80V56Z"/></svg>`;
export const signal5gSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14.5c0-2.8 2.2-5 5-5v1.5c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5v1.5c-2.8 0-5-2.2-5-5m-5 0c0-4.4 3.6-8 8-8v1.5c-3.6 0-6.5 2.9-6.5 6.5s2.9 6.5 6.5 6.5v1.5c-4.4 0-8-3.6-8-8m-5.5 0C5 7 8.1 4 12 4v1.5c-3.6 0-6.5 2.9-6.5 6.5s2.9 6.5 6.5 6.5V16c-3.9 0-7-3.1-7-7M3 13h4.5v2H1V9h2v2.5h2V9h2v4zM16 9h-2v6h2V9zm4 0h-2v6h2V9z"/></svg>`;
export const volteSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m7.5 18l-3-6H6l1.5 3l1.5-3H12l-3 6zm7.5 0h-2V6h2zM3 3h18v18H3zm2 2v14h14V5z"/></svg>`;
export const esimSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M18 2h-8L4 8v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2M9.5 17a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m-5-5a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3"/></svg>`;

// --- BASE DE DADOS DE PALAVRAS-CHAVE ---
export const brandKeywords = { 'Xiaomi': ['redmi', 'poco', 'mi'], 'Samsung': ['galaxy', 'note'], 'Apple': ['iphone'], 'Motorola': ['moto', 'edge', 'razr'], 'Google': ['pixel'], 'Huawei': ['p20', 'p30', 'p40', 'p50', 'p60', 'mate', 'nova'], 'OnePlus': ['oneplus'], 'Sony': ['xperia'], 'Oppo': ['oppo', 'find', 'reno'], 'Asus': ['zenfone', 'rog'], 'Realme': ['realme'], 'Vivo': ['vivo'], 'Nokia': ['nokia'], 'Lenovo': ['legion'], 'Honor': ['honor'] };
export const brandPriorityOrder = ['Xiaomi', 'Samsung', 'Apple', 'Motorola', 'Google', 'Huawei', 'OnePlus', 'Sony', 'Oppo', 'Asus', 'Realme', 'Vivo', 'Nokia', 'Lenovo', 'Honor'];

// --- FUNÇÕES DE LÓGICA E UTILITÁRIOS ---

/**
 * Retorna uma função debounced que executa a função original
 * após um atraso especificado desde a última invocação.
 * @param {Function} func - A função a ser debounced.
 * @param {number} wait - O número de milissegundos a aguardar.
 * @returns {Function} - A função debounced.
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Obtém o histórico de buscas do localStorage.
 * @returns {Array} O histórico de buscas.
 */
export const getHistory = () => JSON.parse(localStorage.getItem('unifiedHistory')) || [];

/**
 * Salva uma nova entrada no histórico de buscas.
 * @param {Object} entry - A entrada do histórico a ser salva.
 * @param {Object} settings - As configurações atuais da aplicação.
 * @param {Function} getImeiActionDetails - Função para obter detalhes do IMEI.
 */
export const saveToHistory = (entry, settings, getImeiActionDetails) => {
    if (!settings.saveHistory) return;
    let history = getHistory();
    if (entry.type === 'imei') {
        const imeiDetails = getImeiActionDetails(entry.value, settings);
        entry.imeiFeedback = imeiDetails.feedbackMessage;
        entry.imeiColorClass = imeiDetails.colorClass;
        entry.imeiIcon = imeiDetails.feedbackIcon;
        entry.imeiActualSearchValue = imeiDetails.imeiToSearch;
    }
    // Evita duplicatas sequenciais do mesmo tipo e valor
    if(history.length > 0 && history[0].value === entry.value && history[0].type === entry.type) return;

    history.unshift(entry); // Adiciona no início
    history = history.slice(0, HISTORY_LIMIT); // Limita o tamanho do histórico
    localStorage.setItem('unifiedHistory', JSON.stringify(history));
};

/**
 * Formata um timestamp ISO string para tempo relativo (ex: "há 5 minutos").
 * @param {string} isoString - O timestamp em formato ISO.
 * @returns {string} - A string de tempo formatada.
 */
export const formatRelativeTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return "agora mesmo";
    if (minutes < 60) return `há ${minutes} min`;
    if (hours < 24) return `há ${hours}h`;
    if (days === 1) return "ontem";
    if (days < 7) return `há ${days} dias`;
    return `em ${date.toLocaleDateString('pt-BR')}`;
};

/**
 * Converte uma string para um slug URL-friendly.
 * @param {string} text - O texto a ser convertido.
 * @returns {string} - O slug.
 */
export const createSlug = (text) => text.toLowerCase().replace(/\s+/g, '-');

/**
 * Converte uma string para uma query de URL-friendly (espaços por '+').
 * @param {string} text - O texto a ser convertido.
 * @returns {string} - A query.
 */
export const createQuery = (text) => text.replace(/\s+/g, '+');

/**
 * Calcula o dígito verificador Luhn para um número base de 14 dígitos.
 * @param {string} base - Os primeiros 14 dígitos do IMEI.
 * @returns {number|null} - O dígito verificador ou null se o input for inválido.
 */
export const calculateLuhnCheckDigit = (base) => {
    if (!/^\d{14}$/.test(base)) return null;
    let sum = 0;
    let alternate = true;
    for (let i = base.length - 1; i > -1; i--) {
        let digit = parseInt(base[i], 10);
        if (alternate) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        alternate = !alternate;
    }
    return (10 - (sum % 10)) % 10;
};

/**
 * Valida um número completo (15 dígitos) usando o algoritmo de Luhn.
 * @param {string} fullNumber - O número completo a ser validado.
 * @returns {boolean} - True se o número for válido de acordo com Luhn, false caso contrário.
 */
export const validateLuhn = (fullNumber) => {
    if (!/^\d{15}$/.test(fullNumber)) return false;
    let sum = 0;
    let alternate = false;
    for (let i = fullNumber.length - 1; i > -1; i--) {
        let digit = parseInt(fullNumber[i], 10);
        if (alternate) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        alternate = !alternate;
    }
    return (sum % 10 === 0);
};

/**
 * Copia texto para a área de transferência e fornece feedback visual.
 * @param {string} text - O texto a ser copiado.
 * @param {HTMLElement} button - O botão que acionou a cópia para feedback visual.
 */
export const copyToClipboard = (text, button) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px"; // Fora da tela
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy'); // Método antigo mas funciona em iframes
        const originalContent = button.innerHTML;
        button.innerHTML = 'Copiado!';
        button.classList.add('text-green-600');
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.classList.remove('text-green-600');
        }, 1500);
    } catch (err) {
        console.error('Falha ao copiar:', err);
    } finally {
        document.body.removeChild(textArea);
    }
};

/**
 * Identifica a marca de um modelo de dispositivo baseado em palavras-chave.
 * @param {string} model - O modelo do dispositivo.
 * @returns {string|null} - A marca identificada ou null.
 */
export const identifyBrand = (model) => {
    const modelLower = model.toLowerCase();
    // Prioriza correspondência exata no início
    for (const brand of brandPriorityOrder) {
        if (modelLower.startsWith(brand.toLowerCase())) return brand;
    }
    // Em seguida, busca por palavras-chave
    for (const brand of brandPriorityOrder) {
        const keywords = brandKeywords[brand];
        if (keywords.some(keyword => modelLower.includes(keyword))) return brand;
    }
    return null;
};

/**
 * Obtém detalhes e feedback sobre um IMEI para exibição e busca.
 * @param {string} value - O valor do IMEI inserido.
 * @param {Object} settings - As configurações atuais da aplicação, incluindo `suggestImeiCorrection`.
 * @returns {Object} - Um objeto com `imeiToSearch`, `originalImei`, `feedbackMessage`, `feedbackIcon`, `colorClass`, `canSearch`.
 */
export const getImeiActionDetails = (value, settings) => {
    const result = { imeiToSearch: value, originalImei: null, feedbackMessage: '', feedbackIcon: '', colorClass: '', canSearch: true };
    const isFifteenDigits = /^\d{15}$/.test(value);
    const isFourteenDigits = /^\d{14}$/.test(value);
    const isValidLuhn = validateLuhn(value);

    if (settings.suggestImeiCorrection) {
        if (isFourteenDigits) {
            const checkDigit = calculateLuhnCheckDigit(value);
            result.imeiToSearch = value + checkDigit;
            result.originalImei = value;
            result.feedbackMessage = `IMEI sugerido: <strong class="font-mono">${result.imeiToSearch}</strong>`;
            result.colorClass = 'text-blue-600';
            result.feedbackIcon = infoCircleIconSVG;
        } else if (isFifteenDigits && isValidLuhn) {
            result.feedbackMessage = `IMEI válido.`;
            result.colorClass = 'text-green-600';
            result.feedbackIcon = checkCircleIconSVG;
        } else if (isFifteenDigits && !isValidLuhn) {
            const base = value.substring(0, 14);
            const checkDigit = calculateLuhnCheckDigit(base);
            result.imeiToSearch = base + checkDigit;
            result.originalImei = value;
            result.feedbackMessage = `IMEI inválido. Corrigido para <strong class="font-mono">${result.imeiToSearch}</strong>`;
            result.colorClass = 'text-orange-600';
            result.feedbackIcon = warningCircleIconSVG;
        } else {
            result.feedbackMessage = `IMEI deve ter 14 ou 15 dígitos para validação.`;
            result.colorClass = 'text-red-600';
            result.feedbackIcon = warningCircleIconSVG;
            result.imeiToSearch = value;
        }
    } else { // Se a correção de IMEI não estiver ativa, apenas valida o IMEI inserido
        result.imeiToSearch = value;
        if (isFifteenDigits && isValidLuhn) {
            result.feedbackMessage = `IMEI válido.`;
            result.colorClass = 'text-green-600';
            result.feedbackIcon = checkCircleIconSVG;
        } else if (isFifteenDigits && !isValidLuhn) {
            result.feedbackMessage = `IMEI inválido.`;
            result.colorClass = 'text-red-600';
            result.feedbackIcon = warningCircleIconSVG;
        } else if (isFourteenDigits) {
            const checkDigit = calculateLuhnCheckDigit(value);
            result.feedbackMessage = `IMEI incompleto. Dígito final deve ser ${checkDigit}.`;
            result.colorClass = 'text-blue-600';
            result.feedbackIcon = infoCircleIconSVG;
        } else {
            result.feedbackMessage = `IMEI deve ter 14 ou 15 dígitos.`;
            result.colorClass = 'text-red-600';
            result.feedbackIcon = warningCircleIconSVG;
        }
    }
    return result;
};

/**
 * Calcula a distância entre duas coordenadas geográficas usando a fórmula de Haversine.
 * @param {number} lat1 - Latitude do ponto 1.
 * @param {number} lon1 - Longitude do ponto 1.
 * @param {number} lat2 - Latitude do ponto 2.
 * @param {number} lon2 - Longitude do ponto 2.
 * @returns {number} - A distância em quilômetros.
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
}
