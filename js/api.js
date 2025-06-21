// public/js/api.js

import { ALL_SITES } from './utils.js'; // Importa ALL_SITES de utils.js

// --- CARREGAMENTO DE DADOS ---

/**
 * Carrega o banco de dados de aparelhos do arquivo JSON.
 * O caminho é relativo à pasta 'public/js/'.
 * @returns {Promise<Array|null>} - Uma promessa que resolve com o array de aparelhos ou null em caso de erro.
 */
export async function loadAparelhosDB() {
    try {
        // Ajuste o caminho para ser relativo ao `index.html` (o arquivo raiz)
        // Se `api.js` está em `public/js/` e `aparelhos_db.json` está em `data/`,
        // o caminho é `../data/aparelhos_db.json`
        const response = await fetch('./data/aparelhos_db.json');
        if (!response.ok) {
            throw new Error(`Erro ao carregar aparelhos_db.json: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Não foi possível carregar o banco de dados de aparelhos:", error);
        return null;
    }
}

/**
 * Carrega a lista de sites ativos do arquivo JSON.
 * O caminho é relativo à pasta 'public/js/'.
 * @returns {Promise<Array|null>} - Uma promessa que resolve com o array de sites ativos ou null em caso de erro.
 */
export async function loadSitesAtivos() {
    try {
        // Ajuste o caminho para ser relativo ao `index.html` (o arquivo raiz)
        const response = await fetch('./data/sites_ativos.json');
        if (!response.ok) {
            throw new Error(`Erro ao carregar sites_ativos.json: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Não foi possível carregar a lista de sites ativos:", error);
        return null;
    }
}

// --- REDIRECIONAMENTOS E BUSCAS EXTERNAS ---

/**
 * Redireciona para o site imei.info com o IMEI fornecido.
 * Salva a busca no histórico.
 * @param {string} inputValue - O valor original digitado pelo usuário (para o histórico).
 * @param {string} imeiToUse - O IMEI real a ser usado na URL (pode ser corrigido).
 * @param {string|null} originalImei - O IMEI original antes da correção (opcional, para histórico).
 * @param {Function} saveToHistory - Função para salvar no histórico.
 */
export const redirectToImeiInfo = (inputValue, imeiToUse, originalImei, saveToHistory, settings, getImeiActionDetails) => { 
    saveToHistory({ type: 'imei', value: inputValue, originalImei: originalImei, timestamp: new Date().toISOString() }, settings, getImeiActionDetails); 
    window.open(`https://www.imei.info/?imei=${imeiToUse}`, '_blank'); 
};

/**
 * Redireciona para um site de busca de dispositivos com base na marca e modelo.
 * Salva a busca no histórico.
 * @param {string} brand - A marca do dispositivo.
 * @param {string} model - O modelo do dispositivo.
 * @param {string} site - O ID do site para onde redirecionar (e.g., 'kimovil', 'maiscelular').
 * @param {Function} saveToHistory - Função para salvar no histórico.
 * @param {Function} createSlug - Função para criar slug.
 * @param {Function} createQuery - Função para criar query.
 */
export const redirectToDeviceSearch = (brand, model, site, saveToHistory, createSlug, createQuery, settings, getImeiActionDetails) => {
    const brandSlug = createSlug(brand); 
    const modelSlug = createSlug(model); 
    const modelQuery = createQuery(model); 
    let url;

    switch(site) {
        case 'kimovil': url = `https://www.kimovil.com/pt/onde-comprar-${brandSlug}-${modelSlug}`; break;
        case 'maiscelular': url = `https://www.maiscelular.com.br/fichas-tecnicas/${brandSlug}/${modelSlug}/`; break;
        case 'gsmarena': url = `https://www.gsmarena.com/res.php3?sSearch=${modelQuery}`; break;
        default: console.error(`Site de busca desconhecido: ${site}`); return;
    }

    if (url) { 
        saveToHistory({ type: 'device', value: `${brand} ${model}`, site: site, timestamp: new Date().toISOString() }, settings, getImeiActionDetails); 
        window.open(url, '_blank'); 
    }
};
