Busca Integrada de Dados de Telefonia
=====================================

Este projeto oferece uma ferramenta unificada para buscar informações sobre aparelhos celulares e sites de telefonia, consolidando dados de diversas fontes e apresentando-os de forma clara e organizada.

Funcionalidade
--------------

A aplicação "Busca Integrada" oferece as seguintes funcionalidades principais:

*   **Busca Unificada:** Um único campo de busca permite ao usuário pesquisar por:
    
    *   **IMEI (International Mobile Equipment Identity):** Ao digitar um número IMEI (14 ou 15 dígitos), o sistema valida o formato e sugere o dígito de verificação Luhn, se aplicável. A busca redireciona para sites externos especializados em informações de IMEI, como o imei.info, para fornecer detalhes abrangentes sobre o aparelho.
        
    *   **Modelo/Marca de Dispositivo:** A busca por texto permite encontrar informações sobre modelos e marcas de aparelhos celulares diretamente do banco de dados local da aplicação. Os resultados são exibidos com detalhes como fabricante, suporte a 4G/5G, VoLTE e eSIM, além de status de homologação.
        
    *   **Endereço ou Coordenadas de Sites de Telefonia:** Para informações de sites de telefonia, a busca pode ser realizada por nome de cidade/distrito, bairro ou até mesmo por coordenadas geográficas (latitude e longitude). A aplicação calcula a distância do ponto pesquisado para os sites encontrados, exibindo informações como tipo de site (Greenfield, Rooftop, Poste), altura da estrutura, país, estado, cidade, bairro, tipo de lugar, zona (urbana/rural) e status.
        
*   **Sugestões de Preenchimento Automático:** Conforme o usuário digita no campo de busca, o sistema oferece sugestões em tempo real para aparelhos e sites, facilitando a localização de informações. Para IMEIs, são fornecidas dicas de validação.
    
*   **Histórico de Buscas:** Todas as pesquisas realizadas são salvas localmente no histórico do navegador. O histórico agrupa buscas repetidas, mostrando a entrada mais recente e permitindo expandir para ver detalhes de pesquisas anteriores do mesmo item.
    
*   **Configurações Personalizáveis:** A seção de ajustes permite ao usuário customizar a experiência:
    
    *   Alternar a visibilidade do botão de pesquisa.
        
    *   Ativar/desativar sugestões de correção de IMEI.
        
    *   Selecionar as fontes de busca externas preferidas (Kimovil, MaisCelular, GSMArena) para consultas de dispositivos.
        
    *   Controlar o salvamento de histórico de buscas.
        
    *   Escolher entre formato de data relativa ("há 5 minutos") ou absoluta ("em DD/MM/AAAA HH:MM").
        
    *   Ativar a exclusão segura do histórico, que exige confirmação para apagar os dados.
        
*   **Design Responsivo:** A interface foi desenvolvida para ser totalmente responsiva, garantindo uma experiência de usuário otimizada em dispositivos de todos os tamanhos (celulares, tablets e desktops).
    
*   **Gestão de Dados Locais:** A aplicação carrega e utiliza bancos de dados JSON locais (aparelhos\_db.json e sites\_ativos.json) para as buscas de dispositivos e sites, garantindo rapidez e autonomia na apresentação dos resultados primários.
    

Motivações do Projeto
---------------------

O "MeuProjeto: Busca Integrada" surgiu da necessidade de centralizar e simplificar a pesquisa de informações essenciais no setor de telefonia. As principais motivações incluem:

*   **Centralização de Informações:** O desafio de encontrar dados dispersos sobre aparelhos e infraestruturas de rede em múltiplas plataformas levou à ideia de uma ferramenta que agregasse e facilitasse o acesso a esses dados.
    
*   **Otimização do Fluxo de Trabalho:** Profissionais e entusiastas da área frequentemente precisam consultar especificações de dispositivos ou detalhes de sites. Uma ferramenta de busca integrada agiliza esse processo, economizando tempo e esforço.
    
*   **Validação e Consistência de Dados:** A validação automática de IMEIs e a apresentação organizada de dados de sites, incluindo status e localização, visam melhorar a precisão e a confiabilidade das informações consultadas.
    
*   **Experiência do Usuário Aprimorada:** O foco no design responsivo, preenchimento automático e opções de personalização reflete o objetivo de criar uma ferramenta intuitiva e agradável de usar, adaptada às necessidades do usuário moderno.
    
*   **Base para Expansão Futura:** A arquitetura modular do projeto, com dados carregados de arquivos JSON e funções de redirecionamento para APIs externas, permite fácil expansão e integração com novas fontes de dados ou funcionalidades no futuro. A base local garante que as funcionalidades principais permaneçam acessíveis mesmo sem conexão externa.
