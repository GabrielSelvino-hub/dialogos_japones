document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS DOS DIÁLOGOS (AGORA DINÂMICO) ---
    const dialogos = [
        {
            nome: "Diálogo 001",
            pasta: "dialogos/dialogo_001"
        },
        {
            nome: "Diálogo 002",
            pasta: "dialogos/dialogo_002"
        }
        // Adicione mais objetos de diálogo aqui conforme necessário
    ];

    // --- ELEMENTOS DA PÁGINA ---
    const navContainer = document.getElementById('navegacao-dialogos');
    const imgElement = document.getElementById('dialogo-imagem');
    const textElement = document.getElementById('dialogo-texto').querySelector('p');
    const btnAlternarIdioma = document.getElementById('btn-alternar-idioma');
    const btnAlternarJapones = document.getElementById('btn-alternar-japones');
    const containerPrincipal = document.getElementById('container-principal');

    // --- ESTADO DA APLICAÇÃO ---
    let dialogoAtualIndex = -1;
    let idiomaAtual = 'japones'; // 'traducao' ou 'japones'
    let tipoJaponesAtual = 0; // 0: japones, 1: japones_sem_kanji, 2: romaji
    const tiposJapones = ['japones', 'japones_sem_kanji', 'romaji'];
    const nomesTiposJapones = ['Kanji', 'Hiragana/Kana', 'Romaji'];

    // --- FUNÇÕES ---

    /**
     * Função para carregar texto de arquivo .txt
     */
    async function carregarTexto(pasta, tipo) {
        try {
            const resposta = await fetch(`${pasta}/${tipo}.txt`);
            if (!resposta.ok) throw new Error('Erro ao carregar arquivo');
            return await resposta.text();
        } catch (e) {
            return '[Arquivo não encontrado]';
        }
    }

    /**
     * Carrega e exibe um diálogo específico com base no seu índice.
     */
    async function carregarDialogo(index) {
        if (index === dialogoAtualIndex) return; // Não recarrega o mesmo diálogo

        dialogoAtualIndex = index;
        const dialogo = dialogos[index];

        // Atualiza a imagem
        imgElement.src = `${dialogo.pasta}/imagem.png`;
        imgElement.alt = `Imagem para ${dialogo.nome}`;

        // Reseta para o estado inicial (japonês com kanji)
        idiomaAtual = 'japones';
        tipoJaponesAtual = 0;

        // Carrega todos os textos
        dialogo.textos = {
            traducao: await carregarTexto(dialogo.pasta, 'traducao'),
            japones: await carregarTexto(dialogo.pasta, 'japones'),
            japones_sem_kanji: await carregarTexto(dialogo.pasta, 'japones_sem_kanji'),
            romaji: await carregarTexto(dialogo.pasta, 'romaji')
        };
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
     * Preenche a barra de navegação superior com os diálogos disponíveis.
     */
    async function popularNavegacao() {
        navContainer.innerHTML = '';
        dialogos.forEach((dialogo, index) => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            // Criar miniatura da imagem
            const imgThumb = document.createElement('img');
            imgThumb.src = `${dialogo.pasta}/imagem.png`;
            imgThumb.alt = dialogo.nome;
            imgThumb.className = 'miniatura-dialogo';
            link.appendChild(imgThumb);
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                await carregarDialogo(index);
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
    popularNavegacao();
    atualizarBotoes(); // Mostra os botões desde o início
    // Se houver diálogos, já seleciona o primeiro
    if (dialogos.length > 0) {
        carregarDialogo(0);
    }
}); 