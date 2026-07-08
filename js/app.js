'use strict';

    function logCacheVersion() {
  // Como 'config' foi declarado no arquivo anterior, ele já está disponível globalmente
  console.log('A versão do cache atual é:', configuracaoCatalogo.cacheVersion);
}

logCacheVersion()

// =============================================================================
// 1. VALIDAÇÃO INICIAL E ESTADO GLOBAL
// =============================================================================

'use strict';

window.location.reload(true);

let produtos = [];
let acabamentosPadrao = {};
let dadosLinhas = {};

async function carregarDados() {

    try {

        const [respProdutos, respAcabamentos, respLinhas] =
            await Promise.all([

                fetch(
                    `dados/produtos.json?v=${configuracaoCatalogo.cacheVersion}`
                   
                ),

                fetch(
                    `dados/acabamentos.json?v=${configuracaoCatalogo.cacheVersion}`
                ),

                fetch(
                    `dados/dadosLinhas.json?v=${configuracaoCatalogo.cacheVersion}`
                )

            ]);

             
        produtos = await respProdutos.json();

        acabamentosPadrao =
            await respAcabamentos.json();

        dadosLinhas =
            await respLinhas.json();

        iniciarCatalogo();

    }
    catch (erro) {

        console.error(erro);

    }

}

// Armazena a linha atualmente selecionada para impressão ou outros usos.
let linhaAtual = null;

// Flags de ordem para ordenação (não são usadas atualmente na renderização, mantidas para possível implementação futura).
let ordemCodigoAsc = true;
let ordemLinhaAsc = true;
let ordemValorAsc = true;

// =============================================================================
// 3. FUNÇÕES UTILITÁRIAS
// =============================================================================

/**
 * Normaliza texto removendo acentos e convertendo para minúsculas.
 * Utilizado para buscas e comparações insensíveis a acentos.
 */
function normalizarTexto(texto) {
    return (texto || '')
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Formata um valor (string com vírgula ou número) para o formato de moeda brasileira.
 */
function formatarMoeda(valor) {
    const numero = parseFloat(
        valor.toString().replace(',', '.')
    ) || 0;

    return numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}


// =============================================================================
// 4. GERENCIAMENTO DAS LINHAS
// =============================================================================

/**
 * Popula a lista lateral com todas as linhas únicas encontradas em "produtos".
 */
function carregarLinhas() {
    const listaLinhas = document.getElementById('lista-linhas');
    if (!listaLinhas) return;

    listaLinhas.innerHTML = '';

    const linhasUnicas = [...new Set(
        produtos.map(produto => produto.linha.trim())
    )];

    linhasUnicas.sort();

    linhasUnicas.forEach(linha => {
        const li = document.createElement('li');
        li.innerText = linha;
        li.addEventListener('click', () => mostrarLinha(linha));
        listaLinhas.appendChild(li);
    });
}

/**
 * Exibe os detalhes da linha selecionada (Conceito, Composições, Acabamentos, Links) e
 * renderiza a tabela de produtos correspondente.
 */
function mostrarLinha(nomeLinha) {
    console.log('Cliquei na linha:', nomeLinha);

    linhaAtual = nomeLinha;

    const inputBusca = document.getElementById('busca');

    if (inputBusca) {
        inputBusca.value = '';
        inputBusca.placeholder = `Busca na linha: ${nomeLinha}`;
    }

    const detalhes = document.getElementById('detalhes-linha');
    if (!detalhes) return;

    // Busca os dados da linha, com fallback para informações em desenvolvimento.
    const dados = dadosLinhas[nomeLinha] || {
        Conceito: 'Descrição em desenvolvimento.',
        Composições: 'Informações em desenvolvimento.',
        acabamentos: null
    };

    // Garante valores padrão.
    dados.Conceito = dados.Conceito || '<p>Descrição em desenvolvimento.</p>';
    dados.Composições = dados.Composições || '<p>Informações em desenvolvimento.</p>';
    dados.acabamentos = dados.acabamentos || null;

    // Monta HTML dos acabamentos.
   let htmlAcabamentos = '';

if (dados.acabamentos && Object.keys(dados.acabamentos).length > 0) {

    Object.entries(dados.acabamentos).forEach(([categoria, chave]) => {

        const itens = acabamentosPadrao[chave] || [];

        htmlAcabamentos += `
            <h4>${categoria}</h4>

            <div class="grid-acabamentos">

                ${itens.map(item => `

                    <div class="card-acabamento">

                        <img
                            src="imagens/${item.imagem}"
                            class="imagem-acabamento"
                            onerror="this.src='imagens/sem_imagem.jpg'"
                        >

                        <p>${item.nome}</p>

                    </div>

                `).join('')}

            </div>

            <br>

        `;

    });

} else {

    htmlAcabamentos = '<p>Acabamentos em desenvolvimento.</p>';

}

// Observações dos acabamentos
if (dados.obs_acabamentos) {

    Object.entries(dados.obs_acabamentos).forEach(([nome, valor]) => {

        htmlAcabamentos += `
            <p><strong>${nome}:</strong> ${valor}</p>
        `;

    });

}

    // Monta HTML de links complementares.
    let htmlLinks = '';
    if (dados.links) {
        htmlLinks = '<div class="bloco-linha"><h3>Materiais Complementares</h3>';
        if (dados.links.catalogo) {
            htmlLinks += `<a href="${dados.links.catalogo}" target="_blank" class="btn-link-linha">📖 Catálogo Digital</a>`;
        }
        if (dados.links.imagens) {
            htmlLinks += `<a href="${dados.links.imagens}" target="_blank" class="btn-link-linha">🖼️ Imagens</a>`;
        }
        if (dados.links.videos) {
            htmlLinks += `<a href="${dados.links.videos}" target="_blank" class="btn-link-linha">🎥 Vídeos</a>`;
        }
        htmlLinks += '</div>';
    }

    // Constrói o HTML completo do painel de detalhes.
    detalhes.innerHTML = `
        <div class="header-linha">
                <button id="toggle-linha" class="btn-toggle-linha">Mostrar informações ▼</button>
                <div class="conteudo-linha" style="display:none;">
                <h1>${nomeLinha}</h1>
                <div class="bloco-linha">
                    <h3>Conceito</h3>
                    ${dados.Conceito}
                </div>
                <div class="bloco-linha">
                    <h3>Composições</h3>
                    ${dados.Composições}
                </div>
                <div class="bloco-linha">
                    <h3>Acabamentos</h3>
                    ${htmlAcabamentos}
                </div>
                ${htmlLinks}
                <div>
                  <button class="btn-imprimir" onclick="imprimirLinha()">🖨️ Imprimir Catálogo da Linha</button>
                </div>
            </div>
        </div>
    `;

    // Renderiza a tabela de produtos filtrada.
    const produtosLinha = produtos.filter(produto =>
        normalizarTexto(produto.linha) === normalizarTexto(nomeLinha)
    );
    renderizarTabela(produtosLinha);

    // Ativa o toggle de exibição das informações.
    const botaoToggle = document.getElementById('toggle-linha');
    const conteudoLinha = document.querySelector('.conteudo-linha');
    if (botaoToggle && conteudoLinha) {
        botaoToggle.addEventListener('click', () => {
            if (conteudoLinha.style.display === 'none') {
                conteudoLinha.style.display = 'block';
                botaoToggle.innerText = 'Ocultar informações ▲';
            } else {
                conteudoLinha.style.display = 'none';
                botaoToggle.innerText = 'Mostrar informações ▼';
            }
        });
    }
}


// =============================================================================
// 5. RENDERIZAÇÃO DOS PRODUTOS
// =============================================================================

/**
 * Renderiza a lista de produtos agrupados por grupo, exibindo cards com detalhes.
 * @param {Array} listaProdutos - Array de objetos de produto.
 */
function renderizarTabela(listaProdutos) {
    const container = document.getElementById('lista-produtos');
    if (!container) return;

    container.innerHTML = '';

    // Agrupa produtos pela propriedade "grupo" (padrão "OUTROS").
    const grupos = {};
    listaProdutos.forEach(produto => {
        const grupo = produto.grupo || 'OUTROS';
        if (!grupos[grupo]) {
            grupos[grupo] = [];
        }
        grupos[grupo].push(produto);
    });

    // Para cada grupo cria título, especificação opcional e área de cards.
    Object.entries(grupos).forEach(([nomeGrupo, produtosGrupo]) => {
        const especificacao = produtosGrupo[0].especificacao || '';
        const obs = produtosGrupo[0].obs || '';

        const tituloGrupo = document.createElement('h2');
        tituloGrupo.className = 'titulo-grupo';
        tituloGrupo.innerText = nomeGrupo;
        container.appendChild(tituloGrupo);

        if (especificacao) {
            const descricao = document.createElement('p');
            descricao.className = 'descricao-grupo';
            descricao.innerText = especificacao;
            container.appendChild(descricao);
        }
        
        if (obs) {
            const descricao = document.createElement('p');
            descricao.className = 'descricao-obs';
            descricao.innerText = obs;
            container.appendChild(descricao);
        }

        const areaGrupo = document.createElement('div');
        areaGrupo.className = 'cards-grupo';

        produtosGrupo.forEach(produto => {
            const card = document.createElement('div');
            card.classList.add('card-produto');
            card.innerHTML = `
                ${produto.badge ? `<div class="badge-produto">${produto.badge}</div>` : ''}
                <img
                   src="imagens/${produto.imagem || 'sem_imagem.jpg'}"
                   class="imagem-produto"
                   onerror="this.src='imagens/sem_imagem.jpg'"
                >
                <h3>${produto.codigo}</h3>
                <p class="descricao-produto">${produto.descricao}</p>
                <p class="dimensao-produto">L ${produto.largura} X P ${produto.profundidade} X A ${produto.altura}</p>
                <p class="valor-produto">${formatarMoeda(produto.valor)}</p>
                <button class="btn-detalhes">Ver detalhes</button>
            `;

            const botao = card.querySelector('.btn-detalhes');
            botao.addEventListener('click', () => abrirModalProduto(produto));

            areaGrupo.appendChild(card);
        });

        container.appendChild(areaGrupo);
    });
}

/**
 * Abre o modal com informações detalhadas do produto selecionado.
 */
function abrirModalProduto(produto) {
    const modal = document.getElementById('modal-produto');
    const detalhes = document.getElementById('detalhes-produto');
    if (!modal || !detalhes) return;

    detalhes.innerHTML = `
        <img
            src="imagens/${produto.imagem}"
            onerror="this.src='imagens/sem_imagem.jpg'"
            style="width:100%; max-height:300px; object-fit:contain; margin-bottom:20px;"
        >
        <h3>Informações Gerais</h3>
        <p><strong>Linha:</strong> ${produto.linha}</p>
        <p><strong>Código:</strong> ${produto.codigo}</p>
        <p><strong>Descrição:</strong> ${produto.descricao}</p>
        <p><strong>Código Focco:</strong> ${produto.cod_focco}</p>
        <hr>
        <h3>Dimensões</h3>
        <p><strong>Largura:</strong> ${produto.largura} mm</p>
        <p><strong>Profundidade:</strong> ${produto.profundidade} mm</p>
        <p><strong>Altura:</strong> ${produto.altura} mm</p>
        <hr>
        <h3>Valor Tabela</h3>
        ${formatarMoeda(produto.valor)}
        ${produto.obs ? `
            <hr>
            <h3>Observação</h3>
            <p>${produto.obs}</p>
        ` : ''}
    `;

    modal.style.display = 'block';
}


// =============================================================================
// 6. BUSCA E FILTROS
// =============================================================================

/**
 * Configura a barra de busca para filtrar produtos com base em vários campos.
 */
function configurarBusca() {
    const inputBusca = document.getElementById('busca');
    if (!inputBusca) return;

    inputBusca.addEventListener('keyup', () => {

        const termo = normalizarTexto(inputBusca.value);

        // Define a base da pesquisa
        let baseProdutos = produtos;

        // Se existe uma linha selecionada, pesquisa somente nela
        if (linhaAtual) {

            baseProdutos = produtos.filter(p =>
                normalizarTexto(p.linha) === normalizarTexto(linhaAtual)
            );

        }

        // Campo vazio: mostra a base atual
        if (!termo) {

            renderizarTabela(baseProdutos);

            return;

        }

        const filtrados = baseProdutos.filter(produto =>

            normalizarTexto(produto.codigo).includes(termo) ||
            normalizarTexto(produto.cod_focco).includes(termo) ||
            normalizarTexto(produto.descricao).includes(termo) ||
            normalizarTexto(produto.grupo).includes(termo) ||
            normalizarTexto(produto.valor).includes(termo)

        );

        renderizarTabela(filtrados);

    });
}


// =============================================================================
// 7. IMPRESSÃO E LINKS
// =============================================================================

/**
 * Prepara a impressão da linha atual, armazenando a seleção e abrindo uma nova janela.
 * Antes havia uma função simples que chamava window.print(), agora preserva a linha para impressao.html.
 */
function imprimirLinha() {
    if (!linhaAtual) {
        alert('Selecione uma linha antes de imprimir.');
        return;
    }

    localStorage.setItem('linhaImpressao', linhaAtual);
    window.open('impressao.html', '_blank');
}

/**
 * Abre um link externo (catálogo, imagens, vídeos) ou exibe alerta se não disponível.
 * @param {string} url - URL do recurso.
 * @param {string} nome - Nome amigável para exibição no alerta.
 */
function abrirLink(url, nome) {
    if (!url || url.trim() === '') {
        alert(`${nome} ainda não disponível para esta linha.`);
        return;
    }
    window.open(url, '_blank');
}


// =============================================================================
// 8. INICIALIZAÇÃO
// =============================================================================

// Só executa se existir a lista de linhas (página principal do catálogo).
function iniciarCatalogo() {

    if (document.getElementById('lista-linhas')) {

        carregarLinhas();

        configurarBusca();

    }

}

async function validarImagem(nomeImagem) {

    if (!nomeImagem) {

        return 'sem_imagem.jpg';

    }

    try {

        const resposta = await fetch(`imagens/${nomeImagem}`, {
            method: 'HEAD'
        });

        return resposta.ok
            ? nomeImagem
            : 'sem_imagem.jpg';

    } catch {

        return 'sem_imagem.jpg';

    }

}

carregarDados();

// Configura fechamento do modal de detalhes do produto.
const fecharModal = document.getElementById('fechar-modal');
if (fecharModal) {
    fecharModal.addEventListener('click', () => {
        const modal = document.getElementById('modal-produto');
        if (modal) modal.style.display = 'none';
    });
}
