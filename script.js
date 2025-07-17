document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS DOS DIÁLOGOS (AGORA VEM DA API) ---
    // A constante 'dialogos' agora começa como um array vazio.
    let dialogos = [];

    // --- ELEMENTOS DA PÁGINA (continua igual) ---
    const navContainer = document.getElementById('navegacao-dialogos');
    const imgElement = document.getElementById('dialogo-imagem');
    const textElement = document.getElementById('dialogo-texto').querySelector('p');
    const btnAlternarIdioma = document.getElementById('btn-alternar-idioma');
    const btnAlternarJapones = document.getElementById('btn-alternar-japones');
    const containerPrincipal = document.getElementById('container-principal');

    // --- ESTADO DA APLICAÇÃO (continua igual) ---
    let dialogoAtualIndex = -1;
    let idiomaAtual = 'japones';
    let tipoJaponesAtual = 0;
    const tiposJapones = ['japones', 'japones_sem_kanji', 'romaji'];
    const nomesTiposJapones = ['Kanji', 'Hiragana/Kana', 'Romaji'];

    // --- FUNÇÕES ---

    /**
     * NOVA FUNÇÃO: Busca todos os diálogos da sua API no Azure.
     */
    async function carregarDialogosDaAPI() {
        const apiUrl = window.API_URL;

        try {
            const resposta = await fetch(apiUrl);
            if (!resposta.ok) {
                throw new Error(`Erro ao buscar dados: ${resposta.statusText}`);
            }
            // A API retorna um array de objetos, que colocamos na nossa variável 'dialogos'
            dialogos = await resposta.json();
        } catch (error) {
            console.error("Falha ao carregar diálogos da API:", error);
            textElement.innerHTML = "Não foi possível carregar os diálogos. Tente novamente mais tarde.";
        }
    }

    /**
     * FUNÇÃO ATUALIZADA: Carrega um diálogo a partir dos dados já buscados.
     */
    async function carregarDialogo(index) {
        if (index === dialogoAtualIndex || !dialogos[index]) return;

        dialogoAtualIndex = index;
        const dialogo = dialogos[index];

        // Agora os dados vêm diretamente do objeto 'dialogo'
        imgElement.src = dialogo.url_Img; // Use o nome da coluna do banco
        imgElement.alt = `Imagem para ${dialogo.nome}`;

        // Mapeamos os textos para o formato que o resto do código espera
        dialogo.textos = {
            traducao: dialogo.traducao,
            japones: dialogo.japones,
            japones_sem_kanji: dialogo.japones_Sem_Kanji,
            romaji: dialogo.romaji
        };

        idiomaAtual = 'japones';
        tipoJaponesAtual = 0;

        atualizarTexto();
        atualizarBotoes();
        atualizarNavAtiva();
    }

    /**
     * Atualiza o texto principal com base no estado atual.
     */
    function atualizarTexto() {
        if (dialogoAtualIndex === -1) return;
        const dialogo = dialogos[dialogoAtualIndex];
        let textoParaExibir = '';
        if (!dialogo.textos) return;
        if (idiomaAtual === 'traducao') {
            textoParaExibir = dialogo.textos.traducao;
        } else {
            const chaveJapones = tiposJapones[tipoJaponesAtual];
            textoParaExibir = dialogo.textos[chaveJapones];
        }
        // Permitir múltiplas linhas
        textElement.innerHTML = textoParaExibir.replace(/\n/g, '<br>');
    }

    /**
     * Atualiza a aparência e o texto dos botões.
     */
    function atualizarBotoes() {
        if (dialogoAtualIndex === -1) {
            containerPrincipal.classList.add('hidden');
            btnAlternarIdioma.classList.add('hidden');
            btnAlternarJapones.classList.add('hidden');
            return;
        }
        containerPrincipal.classList.remove('hidden');
        btnAlternarIdioma.classList.remove('hidden');

        if (idiomaAtual === 'traducao') {
            btnAlternarIdioma.textContent = 'Mostrar Japonês';
            btnAlternarJapones.classList.add('hidden');
        } else {
            btnAlternarIdioma.textContent = 'Mostrar Tradução';
            btnAlternarJapones.classList.remove('hidden');

            const proximoIndex = (tipoJaponesAtual + 1) % tiposJapones.length;
            btnAlternarJapones.textContent = `Alternar para ${nomesTiposJapones[proximoIndex]}`;
        }
    }

    /**
     * Marca o link de navegação do diálogo atual como ativo.
     */
    function atualizarNavAtiva() {
        document.querySelectorAll('#navegacao-dialogos li a').forEach((link, index) => {
            if (index === dialogoAtualIndex) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * FUNÇÃO ATUALIZADA: A navegação agora é populada com os dados da API.
     */
    function popularNavegacao() {
        navContainer.innerHTML = '';
        dialogos.forEach((dialogo, index) => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';

            const imgThumb = document.createElement('img');
            imgThumb.src = dialogo.url_Img; // Use o nome da coluna do banco
            imgThumb.alt = dialogo.nome;
            imgThumb.className = 'miniatura-dialogo';
            link.appendChild(imgThumb);

            link.addEventListener('click', (e) => {
                e.preventDefault();
                carregarDialogo(index);
            });
            listItem.appendChild(link);
            navContainer.appendChild(listItem);
        });
    }

    // --- EVENT LISTENERS DOS BOTÕES ---

    btnAlternarIdioma.addEventListener('click', () => {
        idiomaAtual = (idiomaAtual === 'traducao') ? 'japones' : 'traducao';
        atualizarTexto();
        atualizarBotoes();
    });

    btnAlternarJapones.addEventListener('click', () => {
        tipoJaponesAtual = (tipoJaponesAtual + 1) % tiposJapones.length;
        atualizarTexto();
        atualizarBotoes();
    });

    // --- INICIALIZAÇÃO ---
    // A inicialização agora chama a nova função da API
    async function inicializarApp() {
        await carregarDialogosDaAPI(); // Busca os dados primeiro
        if (dialogos.length > 0) {
            popularNavegacao(); // Popula a navegação com os dados recebidos
            carregarDialogo(0); // Carrega o primeiro diálogo
        }
        atualizarBotoes();
    }

    inicializarApp(); // Inicia a aplicação

}); 