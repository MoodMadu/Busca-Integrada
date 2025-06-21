// public/js/main.js

// Importa as funções e constantes dos módulos utils.js e api.js
import { 
    HISTORY_LIMIT, COMPACT_HISTORY_LIMIT, DEBOUNCE_DELAY, ALL_SITES, SEARCH_RADIUS_KM,
    searchIconSVG, historyIconSVG, copyIconSVG, deleteIconSVG, checkCircleIconSVG, 
    warningCircleIconSVG, infoCircleIconSVG, signal4gSVG, signal5gSVG, volteSVG, esimSVG,
    debounce, getHistory, saveToHistory, formatRelativeTime, createSlug, createQuery,
    calculateLuhnCheckDigit, validateLuhn, copyToClipboard, identifyBrand, getImeiActionDetails,
    haversineDistance
} from './utils.js';

import { 
    loadAparelhosDB, loadSitesAtivos, redirectToImeiInfo, redirectToDeviceSearch
} from './api.js';

// --- ESTADO DA APLICAÇÃO ---
let localDeviceData = []; 
let activeSitesData = [];
let isHistoryExpanded = false;
let settings = {}; // Objeto para armazenar as configurações do usuário

// --- SELETORES DE ELEMENTOS ---
const views = {
    main: document.getElementById('main-view'),
    settings: document.getElementById('settings-view')
};
const searchInput = document.getElementById('unified-search-input');
const searchButton = document.getElementById('search-button');
const autocompleteContainer = document.getElementById('autocomplete-container');
const resultsContainer = document.getElementById('results-container');
const searchWrapper = document.getElementById('search-wrapper');
const menuItems = document.querySelectorAll('.menu-item');
const historyList = document.getElementById('history-list');
const historyToggleContainer = document.getElementById('history-toggle-container');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const settingsElements = {
    showSearchButton: document.getElementById('setting-show-search-button'),
    suggestImeiCorrection: document.getElementById('setting-suggest-imei'),
    searchSources: document.getElementById('search-sources-fieldset'),
    saveHistory: document.getElementById('setting-save-history'),
    showPastSearches: document.getElementById('setting-show-past'),
    dateFormat: document.querySelectorAll('input[name="date-format"]'),
    secureHistoryDeletion: document.getElementById('setting-secure-delete'),
};
const modal = {
    container: document.getElementById('confirm-clear-modal'),
    cancelBtn: document.getElementById('cancel-clear-btn'),
    confirmBtn: document.getElementById('confirm-clear-action-btn'),
};

// --- FUNÇÕES DE RENDERIZAÇÃO ---

/**
 * Exibe o histórico de buscas na interface.
 */
const displayHistory = () => {
    historyList.innerHTML = '';
    const history = getHistory();

    if (history.length === 0) {
        historyList.innerHTML = '<li class="text-zinc-500">Nenhuma busca realizada.</li>';
        historyToggleContainer.innerHTML = '';
        return;
    }
    
    // Agrupa entradas de histórico por valor para lidar com duplicatas
    const groupedHistory = history.reduce((acc, entry) => {
        const key = `${entry.type}-${entry.value}`; // Cria uma chave única por tipo e valor
        if (!acc[key]) acc[key] = [];
        acc[key].push(entry);
        return acc;
    }, {});

    const uniqueEntryGroups = Object.values(groupedHistory);
    // Decide quantas entradas mostrar com base no estado de expansão
    const groupsToShow = isHistoryExpanded ? uniqueEntryGroups : uniqueEntryGroups.slice(0, COMPACT_HISTORY_LIMIT);
    
    groupsToShow.forEach(group => {
        const mostRecentEntry = group[0]; // Pega a entrada mais recente do grupo
        const isDuplicateGroup = group.length > 1;

        // Define o ícone com base no tipo de busca (IMEI ou Dispositivo)
        const icon = mostRecentEntry.type === 'imei' ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upc-scan" viewBox="0 0 16 16"><path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5M3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zM6 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zM8 4a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 1 0v-7A.5.5 0 0 0 8 4m3 0.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0z"/></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-phone" viewBox="0 0 16 16"><path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/><path d="M7 14s-1 0-1-1 1-4 1-4 1 3 1 4-1 1-1 1"/></svg>`;
        const date = new Date(mostRecentEntry.timestamp);
        // Formata a data com base na configuração do usuário
        const formattedDate = settings.dateFormat === 'relative' ? formatRelativeTime(mostRecentEntry.timestamp) : date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        let additionalInfoHTML = ''; // Atualmente não usado no original, mas mantido para flexibilidade
        let expandedDetailsContent = ''; 

        // Adiciona detalhes específicos de cada tipo de busca
        if (mostRecentEntry.type === 'device') {
            expandedDetailsContent += `<div class="flex justify-between items-center text-xs text-zinc-500 border-t border-zinc-200/50 pt-2"><span>Buscado em: <span class="font-medium capitalize">${mostRecentEntry.site}</span></span><span>${formattedDate}</span></div>`;
        } else if (mostRecentEntry.type === 'imei') {
            const imeiOriginalFeedback = mostRecentEntry.imeiFeedback || 'IMEI consultado';
            // Remove tags HTML do feedback para exibição limpa no histórico
            expandedDetailsContent += `<div class="flex justify-between items-center text-xs ${mostRecentEntry.imeiColorClass || 'text-zinc-500'} border-t border-zinc-200/50 pt-2"><span>${mostRecentEntry.imeiIcon || ''} ${imeiOriginalFeedback.replace(/<\/?strong[^>]*>/g, '')}</span><span>${formattedDate}</span></div>`;
        }

        // Adiciona entradas mais antigas se houver
        const olderEntries = group.slice(1);
        if (olderEntries.length > 0) {
            olderEntries.forEach(entry => {
                const olderDate = new Date(entry.timestamp);
                const olderFormattedDate = settings.dateFormat === 'relative' ? formatRelativeTime(entry.timestamp) : olderDate.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                let detail = '';
                if (entry.type === 'device') {
                    detail = `em <em>${ALL_SITES[entry.site]}</em>`;
                } else if (entry.type === 'imei') {
                    detail = entry.imeiFeedback ? `(${entry.imeiFeedback.replace(/<\/?strong[^>]*>/g, '')})` : ''; 
                }
                expandedDetailsContent += `<div class="flex justify-between items-center text-xs text-zinc-500 border-t border-zinc-200/50 pt-2"><span>Buscado novamente ${detail}</span><span>${olderFormattedDate}</span></div>`;
            });
        }

        let duplicatesHTML = '';
        // Verifica se deve mostrar o container de duplicatas/detalhes
        const hasDetailedImeiFeedback = mostRecentEntry.type === 'imei' && (mostRecentEntry.originalImei || mostRecentEntry.imeiFeedback);
        if (isDuplicateGroup || (mostRecentEntry.type === 'device' && mostRecentEntry.site) || hasDetailedImeiFeedback) {
             duplicatesHTML = `<div id="duplicates-${mostRecentEntry.timestamp}" class="duplicates-container hidden pl-12 pr-4 pb-3 space-y-2">
                ${expandedDetailsContent}
            </div>`;
        }

        // Determina se o botão de "expandir" deve ser exibido
        const shouldShowExpandButton = isDuplicateGroup || (mostRecentEntry.type === 'device' && mostRecentEntry.site) || hasDetailedImeiFeedback;
        const finalExpandButtonText = isDuplicateGroup ? `Ver ${group.length - 1} mais` : 'Ver detalhes';
        const finalExpandButtonHTML = shouldShowExpandButton ? `<button class="expand-duplicates-btn text-xs text-blue-600 hover:underline" data-target="duplicates-${mostRecentEntry.timestamp}" data-count="${isDuplicateGroup ? group.length - 1 : 0}">${finalExpandButtonText}</button>` : '';

        // Cria o item da lista do histórico
        const li = document.createElement('li');
        li.className = "history-item-container bg-white/50 rounded-lg overflow-hidden transition-colors duration-200";
        li.innerHTML = `
            <div class="history-item group" data-value="${mostRecentEntry.value}">
                <div class="p-3 flex items-center justify-between">
                    <div class="flex items-center flex-1 min-w-0 cursor-pointer history-main-action" data-type="${mostRecentEntry.type}" data-value="${mostRecentEntry.value}" data-site="${mostRecentEntry.site || ''}" data-original-imei="${mostRecentEntry.originalImei || ''}">
                        <span class="mr-3 text-zinc-500 shrink-0">${icon}</span>
                        <div class="flex-1 truncate">
                            <span class="font-medium text-sm pointer-events-none">${mostRecentEntry.value}</span>
                            ${additionalInfoHTML}
                        </div>
                    </div>
                    <div class="flex items-center pl-2">
                        <div class="flex flex-col items-end mr-3 text-right">
                            <span class="text-xs text-zinc-400 pointer-events-none shrink-0">${formattedDate}</span>
                            ${finalExpandButtonHTML}
                        </div>
                        <div class="flex items-center">
                           <button class="copy-history-btn p-1 text-zinc-400 hover:text-blue-600" title="Copiar">${copyIconSVG}</button>
                           <button class="delete-history-btn p-1 text-zinc-400 hover:text-red-600" title="Excluir">${deleteIconSVG}</button>
                        </div>
                    </div>
                </div>
            </div>
            ${duplicatesHTML}`;
        historyList.appendChild(li);
    });

    // Mostra/oculta o botão de "mostrar todo o histórico"
    if (uniqueEntryGroups.length > COMPACT_HISTORY_LIMIT) {
        historyToggleContainer.innerHTML = `<button id="toggle-history-view" class="text-sm text-blue-600 hover:underline">${isHistoryExpanded ? 'Recolher' : 'Mostrar todo o histórico'}</button>`;
    } else {
        historyToggleContainer.innerHTML = '';
    }
};

/**
 * Renderiza os resultados de dispositivos na interface.
 * @param {Array} results - Os resultados dos dispositivos a serem exibidos.
 * @param {HTMLElement} container - O container onde os resultados serão renderizados.
 */
const renderDeviceResults = (results, container) => {
    if (results.length === 0) return;

    const header = document.createElement('h2');
    header.className = 'text-xl font-bold text-zinc-800 border-b pb-2';
    header.textContent = 'Aparelhos Encontrados';
    container.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'space-y-4';
    
    results.forEach((device, index) => {
        const card = document.createElement('div');
        card.className = 'result-card bg-white/80 backdrop-blur-lg border border-zinc-200/80 rounded-2xl shadow-sm transition-all hover:shadow-lg hover:border-zinc-300';
        
        const modelo = String(device['Modelo do dispositivo'] || 'N/A');
        const nomeComercial = String(device['Nome Comercial'] || 'Nome desconhecido');
        const fabricante = String(device['Fabricantes'] || 'Fabricante desconhecido');
        const tem4g = device['4G'] === 'Sim';
        const tem5g = device['5G'] === 'Sim';
        const temVolte = device['VoLTE'] === 'Sim';
        const temEsim = device['eSIM'] === 'Sim';
        const homologado = device['Homologado'] === 'Sim';

        const extraInfo = {
            '5G SA': device['5G SA'],
            '5G NSA': device['5G NSA'],
            '5G (N78)': device['5G - N78'],
            'Suporte de Rede': device['Network support'],
            'Testado em Campo': device['Testado em Cp.'],
            'Hardware 4G': device['4G - Hardware'],
            'Hardware 5G': device['5G - Hardware'],
        };
        
        let detailsHTML = '';
        for (const [key, value] of Object.entries(extraInfo)) {
            if (value && String(value).trim() !== '') {
               detailsHTML += `<div class="text-xs"><span class="font-medium text-zinc-600">${key}:</span> <span class="text-zinc-800">${value}</span></div>`;
            }
        }

        const homologadoText = homologado ? '*Homologado Brisanet' : '*Não Homologado';
        const homologadoClass = homologado ? 'text-green-600' : 'text-zinc-500';

        const featureIcon = (svg, label, available) => {
            const colorClass = available ? 'text-blue-600' : 'text-zinc-400';
            const labelClass = available ? 'font-semibold' : 'text-zinc-500';
            return `<div class="flex items-center space-x-1.5 ${colorClass}"><div class="w-5 h-5">${svg}</div><span class="${labelClass}">${label}</span></div>`;
        };

        const cardId = `device-details-${index}`;

        card.innerHTML = `
            <div class="p-4">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <p class="text-sm font-medium text-zinc-600">${fabricante}</p>
                        <h3 class="device-name text-lg font-bold text-zinc-900 mt-0.5 transition-colors cursor-pointer" data-brand="${fabricante}" data-model="${nomeComercial}">${nomeComercial}</h3>
                        <p class="text-xs text-zinc-500 font-mono">${modelo}</p>
                    </div>
                    <div class="flex items-center space-x-3 ml-4">
                        <p class="text-xs italic font-medium ${homologadoClass}">${homologadoText}</p>
                        <button class="expand-button p-1 rounded-full hover:bg-zinc-200" data-target="${cardId}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="transition-transform" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="mt-4 border-t border-zinc-200 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    ${featureIcon(signal4gSVG, '4G', tem4g)}
                    ${featureIcon(signal5gSVG, '5G', tem5g)}
                    ${featureIcon(volteSVG, 'VoLTE', temVolte)}
                    ${featureIcon(esimSVG, 'eSIM', temEsim)}
                </div>
            </div>
            <div id="${cardId}" class="details-content bg-zinc-100/70 px-4">
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 py-4">
                  ${detailsHTML}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    container.appendChild(grid);
};

/**
 * Renderiza os resultados de sites na interface.
 * @param {Array} results - Os resultados dos sites a serem exibidos.
 * @param {HTMLElement} container - O container onde os resultados serão renderizados.
 */
const renderSiteResults = (results, container) => {
     if (results.length === 0) return;
     
     const header = document.createElement('h2');
     header.className = 'text-xl font-bold text-zinc-800 border-b pb-2';
     header.textContent = 'Sites Encontrados';
     container.appendChild(header);

     const grid = document.createElement('div');
     grid.className = 'space-y-4';

     results.forEach(site => {
        const card = document.createElement('div');
        card.className = 'result-card bg-white/80 backdrop-blur-lg border border-zinc-200/80 rounded-2xl shadow-sm p-4';
        
        const codigo = site['Código'] || 'N/A';
        const cidade = site['Cidade'] || 'N/A';
        const estado = site['Estado__1'] || 'N/A';
        const bairro = site['Bairro'] || 'N/A';
        const zona = site['Zona'] || 'N/A';
        const status = site['Estado'] === '8 - Ativo';
        const statusText = status ? 'Ativo' : 'Inativo';
        const statusClass = status ? 'text-green-600' : 'text-red-600';

        let distanceInfo = '';
        if(site.distance !== undefined){
            distanceInfo = `<p class="text-sm font-medium text-blue-600">Distância: ${site.distance.toFixed(2)} km</p>`;
        }

         card.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-zinc-900">${cidade} - ${estado}</h3>
                    <p class="text-sm text-zinc-600">Bairro: ${bairro}</p>
                    <p class="text-xs text-zinc-500 font-mono mt-1">Código: ${codigo} | Zona: ${zona}</p>
                </div>
                <div class="text-right ml-4">
                    <p class="text-sm font-bold ${statusClass}">${statusText}</p>
                    ${distanceInfo}
                </div>
            </div>
         `;

         grid.appendChild(card);
     });
     container.appendChild(grid);
}

// --- FUNÇÕES DE BUSCA ---

/**
 * Executa a busca com base no valor do input.
 */
const executeSearch = () => {
    const value = searchInput.value.trim();
    const searchTerm = value.toLowerCase();
    resultsContainer.innerHTML = ''; // Limpa resultados anteriores
    autocompleteContainer.innerHTML = ''; // Limpa autocomplete
    autocompleteContainer.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');

    if (!searchTerm) return;

    const isOnlyDigits = /^\d+$/.test(searchTerm);
    const isCoords = /^-?\d+(\.\d+)?(,\s*|\s+)-?\d+(\.\d+)?$/.test(searchTerm);

    if (isOnlyDigits) {
        if (searchTerm.length >= 14) {
            const imeiDetails = getImeiActionDetails(value, settings);
            redirectToImeiInfo(value, imeiDetails.imeiToSearch, imeiDetails.originalImei, saveToHistory, settings, getImeiActionDetails);
        } else {
            resultsContainer.innerHTML = '<p class="text-center text-zinc-500">IMEI incompleto. Por favor, digite 14 ou 15 dígitos.</p>';
        }
        return;
    }

    // Filtra resultados de dispositivos locais
    const deviceResults = localDeviceData.filter(d => 
        String(d['Nome Comercial'] || '').toLowerCase().includes(searchTerm) || 
        String(d['Modelo do dispositivo'] || '').toLowerCase().includes(searchTerm)
    );

    if (deviceResults.length > 0) {
         renderDeviceResults(deviceResults, resultsContainer);
    } else if(isCoords) {
        const [lat, lon] = searchTerm.split(/,s*|s+/).map(s => parseFloat(s.replace(',', '.')));
        const sites = activeSitesData
            .map(site => {
                const siteLat = parseFloat(String(site.Latitude).replace(',', '.'));
                const siteLon = parseFloat(String(site.Longitude).replace(',', '.'));
                if (isNaN(siteLat) || isNaN(siteLon)) return null;

                const distance = haversineDistance(lat, lon, siteLat, siteLon);
                return { ...site, distance };
            })
            .filter(site => site && site.distance <= SEARCH_RADIUS_KM)
            .sort((a, b) => a.distance - b.distance);
        renderSiteResults(sites, resultsContainer);
        if(sites.length === 0) {
             resultsContainer.innerHTML = '<p class="text-center text-zinc-500">Nenhum site encontrado no raio de 5km.</p>';
        }
    } else {
         const siteResults = activeSitesData.filter(site => 
            String(site['Código'] || '').toLowerCase().includes(searchTerm) ||
            String(site['Cidade'] || '').toLowerCase().includes(searchTerm) ||
            String(site['Bairro'] || '').toLowerCase().includes(searchTerm)
        );
        
        renderDeviceResults(deviceResults, resultsContainer);
        renderSiteResults(siteResults, resultsContainer);

        // Se nenhum resultado local for encontrado, tenta busca externa
        if (deviceResults.length === 0 && siteResults.length === 0) {
            const brand = identifyBrand(value);
            // Pega a primeira fonte de busca externa habilitada como padrão
            const defaultSite = (settings.searchSources.find(s => s.enabled) || {id: 'gsmarena'}).id;
            redirectToDeviceSearch(brand || value, value, defaultSite, saveToHistory, createSlug, createQuery, settings, getImeiActionDetails);
        }
    }
};

/**
 * Lida com a funcionalidade de preenchimento automático.
 * @param {string} value - O valor atual do input de busca.
 */
const handleAutocomplete = (value) => {
    const searchTerm = value.trim().toLowerCase();
    autocompleteContainer.innerHTML = '';
    
    const isOnlyDigits = /^\d*$/.test(searchTerm);
    if (isOnlyDigits) {
        // Se for apenas dígitos, limita o input a 15 caracteres (IMEI)
        searchInput.setAttribute('maxlength', '15');
    } else {
        // Caso contrário, remove o limite de caracteres
        searchInput.removeAttribute('maxlength');
    }
    
    if (!searchTerm) {
        autocompleteContainer.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
        return;
    }

    let suggestionsHTML = '';
    
    if (isOnlyDigits && searchTerm.length >= 8) { // Sugestão para IMEI
        const imeiDetails = getImeiActionDetails(value, settings);
        suggestionsHTML = `
            <div class="flex flex-col items-center justify-center p-4 text-sm">
                <div class="flex items-center text-center ${imeiDetails.colorClass} mb-2">
                    ${imeiDetails.feedbackIcon}
                    <span class="ml-2">${imeiDetails.feedbackMessage}</span>
                    ${imeiDetails.imeiToSearch !== value || (imeiDetails.originalImei && imeiDetails.imeiToSearch !== imeiDetails.originalImei) ? `<button class="copy-feedback-btn ml-2 p-1 text-zinc-400 hover:text-blue-600" data-text="${imeiDetails.imeiToSearch}" title="Copiar">${copyIconSVG}</button>` : ''}
                </div>
                <div class="text-xs text-zinc-500 text-center">Pressione Enter para consultar no imei.info</div>
            </div>`;
    } else if (!isOnlyDigits && searchTerm.length > 2) { // Sugestão para modelos/marcas
         const deviceResults = localDeviceData.filter(d => 
            String(d['Nome Comercial'] || '').toLowerCase().includes(searchTerm) || 
            String(d['Modelo do dispositivo'] || '').toLowerCase().includes(searchTerm)
        );

        if (deviceResults.length > 0) {
            deviceResults.slice(0, 3).forEach(device => { // Mostra as 3 primeiras sugestões
                const nomeComercial = String(device['Nome Comercial'] || '');
                const fabricante = String(device['Fabricantes'] || '');
                suggestionsHTML += `<div class="suggestion-item p-3 px-4 flex items-center cursor-pointer border-b border-zinc-100 last:border-b-0 hover:bg-blue-50 transition-colors duration-150" data-type="local" data-value="${nomeComercial}">
                    ${searchIconSVG}
                    <span>${nomeComercial} <em class="text-zinc-500">(${fabricante})</em></span>
                </div>`;
            });
        }
    }

    if(suggestionsHTML){
        autocompleteContainer.innerHTML = suggestionsHTML;
        autocompleteContainer.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
    } else {
        autocompleteContainer.classList.remove('opacity-100', 'scale-100', 'pointer-events-none');
    }
};

const debouncedAutocomplete = debounce(handleAutocomplete, DEBOUNCE_DELAY);

// --- FUNÇÕES DE GERENCIAMENTO DE UI/ESTADO ---

/**
 * Alterna a visualização entre 'main' (Busca) e 'settings' (Ajustes).
 * @param {string} viewName - O nome da view para ativar ('main' ou 'settings').
 */
const switchView = (viewName) => {
    Object.keys(views).forEach(key => {
        views[key].classList.toggle('active-view', key === viewName);
        views[key].classList.toggle('hidden-view', key !== viewName);
    });
    
    // Atualiza o estilo dos itens do menu de navegação
    menuItems.forEach(item => {
         const isTarget = item.dataset.view === viewName;
         item.classList.toggle('bg-blue-50', isTarget);
         item.classList.toggle('font-semibold', isTarget);
         item.classList.toggle('text-blue-700', isTarget);
         item.classList.toggle('text-zinc-600', !isTarget);
         item.classList.toggle('hover:bg-zinc-100', !isTarget);
    });

    // Lógicas específicas ao alternar views
    if (viewName === 'settings') {
        isHistoryExpanded = false; // Recolhe o histórico ao ir para ajustes
        updateSettingsUI();
        displayHistory();
    } else if (viewName === 'main') {
        searchInput.focus(); // Foca no campo de busca ao retornar para a view principal
    }
};

/**
 * Salva as configurações atuais no localStorage.
 * @param {Object} newSettings - O objeto de configurações a ser salvo.
 */
const saveSettings = (newSettings) => localStorage.setItem('unifiedSettings', JSON.stringify(newSettings));

/**
 * Carrega as configurações do localStorage ou usa valores padrão.
 */
const loadSettings = () => {
    const defaults = { 
        showSearchButton: true,
        suggestImeiCorrection: true, 
        searchSources: Object.keys(ALL_SITES).map(id => ({id, enabled: true})), // Fontes de busca externas padrão
        saveHistory: true, 
        showPastSearches: true, 
        dateFormat: 'absolute', 
        secureHistoryDeletion: true 
    };
    const stored = JSON.parse(localStorage.getItem('unifiedSettings'));
    settings = { ...defaults, ...stored };

    // Garante que searchSources seja inicializado corretamente mesmo se não houver no stored
    if (!stored || !stored.searchSources) {
        settings.searchSources = defaults.searchSources;
    } else {
         // Mescla as fontes padrão com as armazenadas, mantendo as habilitadas
         settings.searchSources = Object.keys(ALL_SITES).map(id => {
            const storedSource = stored.searchSources.find(s => s.id === id);
            return { id, enabled: storedSource ? storedSource.enabled : true };
        });
    }
    // Aplica a configuração do botão de busca imediatamente
    searchButton.classList.toggle('hidden', !settings.showSearchButton);
};

/**
 * Atualiza a interface de usuário dos ajustes com base nas configurações carregadas.
 */
const updateSettingsUI = () => {
    settingsElements.showSearchButton.checked = settings.showSearchButton;
    settingsElements.suggestImeiCorrection.checked = settings.suggestImeiCorrection;
    // Atualiza checkboxes das fontes de busca
    settings.searchSources.forEach(source => { const chk = document.getElementById(`source-${source.id}`); if (chk) chk.checked = source.enabled; });
    settingsElements.saveHistory.checked = settings.saveHistory;
    settingsElements.showPastSearches.checked = settings.showPastSearches;
    // Atualiza radio buttons do formato de data
    settingsElements.dateFormat.forEach(radio => radio.checked = radio.value === settings.dateFormat);
    settingsElements.secureHistoryDeletion.checked = settings.secureHistoryDeletion;
};

/**
 * Constrói dinamicamente a interface para as opções de fontes de busca.
 */
const buildSearchSourcesUI = () => {
    let html = '';
    settings.searchSources.forEach(source => {
        html += `<div class="flex items-center"><input id="source-${source.id}" name="source-${source.id}" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"><label for="source-${source.id}" class="ml-3 text-sm text-zinc-600">${ALL_SITES[source.id]}</label></div>`;
    });
    settingsElements.searchSources.innerHTML = html;
};

// --- FUNÇÕES DE MANIPULAÇÃO DE EVENTOS ---

/**
 * Lida com o evento de tecla pressionada no input de busca.
 * @param {KeyboardEvent} e - O objeto do evento de teclado.
 */
const handleKeydown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Previne quebra de linha em inputs de texto
        executeSearch();
    }
};

/**
 * Lida com o clique no botão de busca.
 */
const handleButtonClick = () => {
    executeSearch();
};

/**
 * Lida com cliques dentro do container de preenchimento automático.
 * @param {MouseEvent} e - O objeto do evento de mouse.
 */
const handleAutocompleteClick = (e) => {
    const suggestionItem = e.target.closest('.suggestion-item'); 
    if (suggestionItem) { 
        const { type, value } = suggestionItem.dataset; 
        
        if (type === 'local') {
            searchInput.value = value;
            executeSearch(); // Executa a busca com o valor sugerido
            return;
        }
    }
    // Lida com o clique no botão de copiar feedback
    const copyBtn = e.target.closest('.copy-feedback-btn'); 
    if(copyBtn) { 
        copyToClipboard(copyBtn.dataset.text, copyBtn); 
    }
    // Oculta o autocomplete após a interação
    autocompleteContainer.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
};

/**
 * Lida com cliques nos itens do menu de navegação.
 * @param {MouseEvent} e - O objeto do evento de mouse.
 */
const handleMenuClick = (e) => {
    e.preventDefault();
    switchView(e.currentTarget.dataset.view);
};

/**
 * Lida com alterações nos elementos da tela de ajustes.
 * @param {Event} e - O objeto do evento de alteração.
 */
const handleSettingsChange = (e) => {
    const { name, type, value, checked, id } = e.target;
    let settingKey;

    // Mapeia o ID/nome do elemento para a chave de configuração
    if (id === 'setting-show-search-button') settingKey = 'showSearchButton';
    else if (id === 'setting-suggest-imei') settingKey = 'suggestImeiCorrection';
    else if (id === 'setting-save-history') settingKey = 'saveHistory';
    else if (id === 'setting-show-past') settingKey = 'showPastSearches';
    else if (id === 'setting-secure-delete') settingKey = 'secureHistoryDeletion';
    else if (name === 'date-format') settingKey = 'dateFormat';
    else if (name.startsWith('source-')) { // Lida com checkboxes de fontes de busca
        const sourceId = name.split('-')[1];
        const source = settings.searchSources.find(s => s.id === sourceId);
        if (source) source.enabled = checked;
        saveSettings(settings); // Salva imediatamente para checkboxes de fontes
        return;
    }

    // Atualiza o valor da configuração
    if (settingKey) {
        settings[settingKey] = (type === 'checkbox') ? checked : value;
    }
    
    saveSettings(settings); // Salva as configurações no localStorage

    // Aplica mudanças na UI em tempo real para certas configurações
    if (id === 'setting-show-search-button') {
        searchButton.classList.toggle('hidden', !checked);
    }
    if (name === 'date-format') {
        displayHistory(); // Atualiza o histórico se o formato de data mudar
    }
};

/**
 * Inicializa os event listeners para toda a aplicação.
 */
function initializeEventListeners() {
    // Eventos para busca unificada
    searchInput.addEventListener('input', (e) => debouncedAutocomplete(e.target.value));
    searchInput.addEventListener('keydown', handleKeydown);
    searchButton.addEventListener('click', handleButtonClick);
    autocompleteContainer.addEventListener('click', handleAutocompleteClick);

    // Event listener para expandir/recolher detalhes nos resultados
    resultsContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.result-card');
        const expandButton = e.target.closest('.expand-button');
        const deviceName = e.target.closest('.device-name');

        // Lógica do menu de busca externa (ao clicar no nome do dispositivo)
        if (deviceName) {
            e.preventDefault();
            e.stopPropagation(); // Impede que o clique se propague e feche o menu imediatamente
            const existingMenu = document.getElementById('external-search-menu');
            if (existingMenu) existingMenu.remove(); // Remove menu existente antes de criar um novo

            const { brand, model } = deviceName.dataset;
            const enabledSources = settings.searchSources.filter(s => s.enabled);
            
            if (enabledSources.length === 1) {
                 // Se apenas uma fonte habilitada, redireciona diretamente
                 redirectToDeviceSearch(brand, model, enabledSources[0].id, saveToHistory, createSlug, createQuery, settings, getImeiActionDetails);
            } else if (enabledSources.length > 1) {
                // Se múltiplas fontes, cria o menu pop-up
                const menu = document.createElement('div');
                menu.id = 'external-search-menu';
                menu.className = 'external-search-menu';
                
                enabledSources.forEach(source => {
                    const button = document.createElement('button');
                    button.textContent = `Buscar em ${ALL_SITES[source.id]}`;
                    button.onclick = () => redirectToDeviceSearch(brand, model, source.id, saveToHistory, createSlug, createQuery, settings, getImeiActionDetails);
                    menu.appendChild(button);
                });
                
                document.body.appendChild(menu);
                // Posiciona o menu abaixo do nome do dispositivo
                menu.style.top = `${deviceName.getBoundingClientRect().bottom + window.scrollY}px`;
                menu.style.left = `${deviceName.getBoundingClientRect().left + window.scrollX}px`;
            }
            return;
        }

        // Lógica para expandir/recolher card de resultados
        if (expandButton) {
            e.stopPropagation(); 
            const targetId = expandButton.dataset.target;
            const detailsDiv = document.getElementById(targetId);
            const icon = expandButton.querySelector('svg');

            if (detailsDiv) {
                detailsDiv.classList.toggle('expanded');
                icon.classList.toggle('rotate-180');
            }
            return;
        }
    });

    // Fecha o menu de busca externa e o autocomplete ao clicar fora
    document.addEventListener('click', e => { 
        if (!e.target.closest('.device-name') && !e.target.closest('#external-search-menu')) {
             const existingMenu = document.getElementById('external-search-menu');
             if (existingMenu) existingMenu.remove();
        }

        if (searchWrapper && !searchWrapper.contains(e.target)) {
            autocompleteContainer.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
            autocompleteContainer.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
        }
    });
    
    // Lida com o botão "Limpar Tudo" do histórico
    clearHistoryBtn.addEventListener('click', () => { 
        if (settings.secureHistoryDeletion) {
            modal.container.classList.remove('hidden'); // Exibe o modal de confirmação
        } else {
            localStorage.removeItem('unifiedHistory'); // Limpa direto se a confirmação estiver desativada
            displayHistory(); 
        }
    });
    // Botões do modal de confirmação
    modal.cancelBtn.addEventListener('click', () => modal.container.classList.add('hidden'));
    modal.confirmBtn.addEventListener('click', () => {
         localStorage.removeItem('unifiedHistory');
         displayHistory(); 
         modal.container.classList.add('hidden');
    });

    // Lida com cliques na lista do histórico (expandir, copiar, deletar, pesquisar novamente)
    historyList.addEventListener('click', (e) => {
        const container = e.target.closest('.history-item-container');
        const expandBtn = e.target.closest('.expand-duplicates-btn');
        if (expandBtn) {
            e.preventDefault();
            const targetId = expandBtn.dataset.target;
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const isHidden = targetElement.classList.toggle('hidden');
                expandBtn.textContent = isHidden ? (expandBtn.dataset.count > 0 ? `Ver ${expandBtn.dataset.count} mais` : 'Recolher') : 'Recolher';
            }
            return;
        }

        const mainAction = e.target.closest('.history-main-action');
        if(mainAction){
            if(container) {
                container.classList.add('bg-blue-100'); // Efeito visual de clique
                setTimeout(() => container.classList.remove('bg-blue-100'), 200);
            }
            // Pequeno delay para o efeito visual antes de redirecionar
            setTimeout(() => {
                const { type, value, site, originalImei } = mainAction.dataset; 
                if (type === 'imei') { 
                    // Tenta encontrar a entrada completa no histórico para usar imeiActualSearchValue
                    const entry = getHistory().find(h => h.value === value && h.type === 'imei');
                    if (entry && entry.imeiActualSearchValue) {
                        redirectToImeiInfo(value, entry.imeiActualSearchValue, originalImei || null, saveToHistory, settings, getImeiActionDetails);
                    } else {
                        redirectToImeiInfo(value, value, originalImei || null, saveToHistory, settings, getImeiActionDetails);
                    }
                } 
                else if (type === 'device') { 
                    const [brand, ...modelParts] = value.split(' '); 
                    const model = modelParts.join(' '); 
                    redirectToDeviceSearch(brand, model, site, saveToHistory, createSlug, createQuery, settings, getImeiActionDetails); 
                }
            }, 100);
            return;
        }

        const deleteBtn = e.target.closest('.delete-history-btn');
        if (deleteBtn) {
            const valueToDelete = e.target.closest('.history-item').dataset.value;
            let history = getHistory().filter(item => item.value !== valueToDelete);
            localStorage.setItem('unifiedHistory', JSON.stringify(history));
            displayHistory(); // Atualiza a exibição do histórico
            return;
        }

        const copyBtn = e.target.closest('.copy-history-btn');
        if (copyBtn) {
            const valueToCopy = e.target.closest('.history-item').dataset.value;
            copyToClipboard(valueToCopy, copyBtn);
            return;
        }
    });

    // Lida com o toggle de expansão do histórico
    historyToggleContainer.addEventListener('click', (e) => {
        if(e.target.id === 'toggle-history-view') {
            isHistoryExpanded = !isHistoryExpanded;
            displayHistory();
        }
    });

    // Adiciona listeners para os itens do menu e alterações nas configurações
    menuItems.forEach(item => item.addEventListener('click', handleMenuClick));
    views.settings.addEventListener('change', handleSettingsChange);
}

/**
 * Função de inicialização principal da aplicação.
 * Carrega dados, configurações e configura os event listeners.
 */
async function initializeApp() {
    try {
        // Carrega os dados JSON de forma assíncrona
        const [devicesResponse, sitesResponse] = await Promise.all([
            loadAparelhosDB(),
            loadSitesAtivos()
        ]);

        localDeviceData = devicesResponse || [];
        activeSitesData = sitesResponse || [];

        if (!devicesResponse) {
            console.error('Falha ao carregar aparelhosDB.');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'text-center text-red-500 bg-red-100 p-3 rounded-lg my-4 max-w-3xl mx-auto';
            errorDiv.textContent = 'Erro: Falha ao carregar o arquivo de dados de aparelhos (aparelhos_db.json). Verifique se o arquivo existe e está no formato correto.';
            views.main.prepend(errorDiv);
        } else {
            console.log('Base de dados de aparelhos carregada.');
        }

        if (!sitesResponse) {
            console.error('Falha ao carregar sitesAtivos.');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'text-center text-red-500 bg-red-100 p-3 rounded-lg my-4 max-w-3xl mx-auto';
            errorDiv.textContent = 'Erro: Falha ao carregar o arquivo de dados de sites ativos (sites_ativos.json). Verifique se o arquivo existe e está no formato correto.';
            views.main.prepend(errorDiv);
        } else {
            console.log('Base de dados de sites ativos carregada.');
        }

    } catch (error) {
        console.error("Erro geral na inicialização das bases de dados:", error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-center text-red-500 bg-red-100 p-3 rounded-lg my-4 max-w-3xl mx-auto';
        errorDiv.textContent = 'Erro: Não foi possível carregar as bases de dados. Verifique a conexão ou os arquivos de dados.';
        views.main.prepend(errorDiv);
    }

    loadSettings(); // Carrega as configurações do usuário
    buildSearchSourcesUI(); // Constrói a UI das fontes de busca com base nas configurações
    initializeEventListeners(); // Configura todos os event listeners
    switchView('main'); // Ativa a view principal ao iniciar a aplicação
}

// Inicia a aplicação quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', initializeApp);
