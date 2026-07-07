'use strict';

// =============================================================================
// 1. VALIDAÇÃO INICIAL E ESTADO GLOBAL
// =============================================================================

// Verifica se a variável "produtos" (carregada externamente) é um array.
if (!Array.isArray(produtos)) {
    alert('Arquivo produtos.js não encontrado.');
}

// Armazena a linha atualmente selecionada para impressão ou outros usos.
let linhaAtual = null;

// Flags de ordem para ordenação (não são usadas atualmente na renderização, mantidas para possível implementação futura).
let ordemCodigoAsc = true;
let ordemLinhaAsc = true;
let ordemValorAsc = true;


// =============================================================================
// 2. CONSTANTES (DADOS DO CATÁLOGO)
// =============================================================================

/**
 * Acabamentos Padrão reutilizáveis entre as linhas.
 * ATENÇÃO: a chave "melamínico" usa acento agudo em todas as referências.
 * Corrigida referência na linha LUNCH que estava sem acento.
 */
const acabamentosPadrao = {
    'melamínico': [
        { nome: 'Argila', imagem: 'mdp_argila.jpg' },
        { nome: 'Azul Secreto', imagem: 'mdp_azul_secreto.jpg' },
        { nome: 'Blush', imagem: 'mdp_blush.jpg' },
        { nome: 'Branco', imagem: 'mdp_branco.jpg' },
        { nome: 'Carvalho Avelã', imagem: 'mdp_carvalho_avela.jpg' },
        { nome: 'Carvalho Hanover', imagem: 'mdp_carvalho_hanover.jpg' },
        { nome: 'Carvalho Munique', imagem: 'mdp_carvalho_munique.jpg' },
        { nome: 'Carvalho Prata', imagem: 'mdp_carvalho_prata.jpg' },
        { nome: 'Cinza Sagrado', imagem: 'mdp_cinza_sagrado.jpg' },
        { nome: 'Grafite', imagem: 'mdp_grafite.jpg' },
        { nome: 'Itapuã', imagem: 'mdp_itapua.jpg' },
        { nome: 'Moss', imagem: 'mdp_moss.jpg' },
        { nome: 'Noce Mare', imagem: 'mdp_noce_mare.jpg' },
        { nome: 'Nogueira Thar', imagem: 'mdp_nogueira_thar.jpg' },
        { nome: 'Ovo', imagem: 'ovo.jpg' },
        { nome: 'Platina', imagem: 'mdp_platina.jpg' },
        { nome: 'Preto', imagem: 'mdp_preto.jpg' }
    ],
    'metalicos': [
        { nome: 'Terracota', imagem: 'metal_terracota.jpg' },
        { nome: 'Prata', imagem: 'metal_prata.jpg' },
        { nome: 'Oliva', imagem: 'metal_oliva.jpg' },
        { nome: 'Ocre', imagem: 'metal_ocre.jpg' },
        { nome: 'Branco', imagem: 'metal_branco.jpg' },
        { nome: 'Preto', imagem: 'metal_preto.jpg' },
        { nome: 'Platina', imagem: 'metal_platina.jpg' },
        { nome: 'Grafite', imagem: 'metal_grafite.jpg' },
        { nome: 'Argila', imagem: 'metal_argila.jpg' },
        { nome: 'Ovo', imagem: 'metal_ovo.jpg' }
    ],
        'tecido': [
        { nome: 'Vinho', imagem: 'tec_vinho.jpg' },
        { nome: 'Vermelho Concept', imagem: 'tec_vermelho_concept.jpg' },
        { nome: 'Vermelho', imagem: 'tec_vermelho.jpg' },
        { nome: 'Verde Concept', imagem: 'tec_verde_concept.jpg' },
        { nome: 'Verde', imagem: 'tec_verde.jpg' },
        { nome: 'Preto', imagem: 'tec_preto.jpg' },
        { nome: 'Laranja Concept', imagem: 'tec_laranja_concept.jpg' },
        { nome: 'Laranja', imagem: 'tec_laranja.jpg' },
        { nome: 'Cinza Concept', imagem: 'tec_cinza_concept.jpg' },
        { nome: 'Cinza', imagem: 'tec_cinza.jpg' },
        { nome: 'Bege Concept', imagem: 'tec_bege_concept.jpg' },
        { nome: 'Azul Escuro', imagem: 'tec_azul_escuro.jpg' },
        { nome: 'Azul Concept', imagem: 'tec_azul_concept.jpg' },
        { nome: 'Azul Claro', imagem: 'tec_azul_claro.jpg' }
    ],
    'vidros_coloridos': [
        { nome: 'Vermelho', imagem: 'vidro_vermelho.jpg' },
        { nome: 'Verde', imagem: 'vidro_verde.jpg' },
        { nome: 'Jateado', imagem: 'vidro_jateado.jpg' },
        { nome: 'Incolor', imagem: 'vidro_incolor.jpg' },
        { nome: 'Azul', imagem: 'vidro_azul.jpg' },
        { nome: 'Amarelo', imagem: 'vidro_amarelo.jpg' }
    ],
    'lâmina_madeira': [
        { nome: 'Black Walnut', imagem: 'verniz_black_walnut.jpg' },
        { nome: 'Carvalho Americano', imagem: 'verniz_carvalho_americano.jpg' },
        { nome: 'Freijo Quartier', imagem: 'verniz_freijo_quartier.jpg' },
        { nome: 'Pau Ferro', imagem: 'verniz_pau_ferro.jpg' },
        { nome: 'Wenge Linheiro Tipo 2', imagem: 'verniz_wenge_linheiro_tipo_2.jpg' }
    ],
    'gaveta_aço': [
        { nome: 'Argila', imagem: 'metal_argila.jpg' },
        { nome: 'Branco', imagem: 'metal_branco.jpg' },
        { nome: 'Ovo', imagem: 'metal_ovo.jpg' },
        { nome: 'Prata', imagem: 'metal_prata.jpg' },
        { nome: 'Preto', imagem: 'metal_preto.jpg' }
    ],
    'tecido_chatterbox': [
        { nome: 'Azul Claro (202890)', imagem: 'tec_azul_claro_202890.jpg' },
        { nome: 'Azul Escuro (162694)', imagem: 'tec_azul_escuro_162694.jpg' },
        { nome: 'Terracota (182741)', imagem: 'tec_terracota_182741.jpg' },
        { nome: 'Laranja (90033)', imagem: 'tec_laranja_90033.jpg' },
        { nome: 'Vermelho (50113)', imagem: 'tec_vermelho_50113.jpg' },
        { nome: 'Cerâmica (90052)', imagem: 'tec_ceramica_90052.jpg' },
        { nome: 'Verde Escuro (197561)', imagem: 'tec_verde_escuro_197561.jpg' },
        { nome: 'Verde Claro (162684)', imagem: 'tec_verde_claro_162684.jpg' },
        { nome: 'Grafite (30131)', imagem: 'tec_grafite_30131.jpg' },
        { nome: 'Cinza Claro (162687)', imagem: 'tec_cinza_claro_162687.jpg' },
        { nome: 'Natural (162679)', imagem: 'tec_natural_162679.jpg' },
        { nome: 'Amarelo (90035)', imagem: 'tec_amarelo_90035.jpg' }
    ],
    'corpo_mdp_armário_gaveteiro_argus': [
        { nome: 'Preto', imagem: 'mdp_preto.jpg' },
        { nome: 'Grafite', imagem: 'mdp_grafite.jpg' }
    ],
    'mármore': [
        { nome: 'Cachoeiro', imagem: 'marmore_cachoeiro.jpg' },
        { nome: 'Traventino', imagem: 'marmore_traventino.jpg' },
        { nome: 'Preto São Gabriel', imagem: 'marmore_preto_sao_gabriel.jpg' }
    ],
    'softline_corpo_arm_gav_pe_painel': [
        { nome: 'Argila', imagem: 'mdp_argila.jpg' },
        { nome: 'Branco', imagem: 'mdp_branco.jpg' },
        { nome: 'Gris', imagem: 'mdp_gris.jpg' },
        { nome: 'Ovo', imagem: 'mdp_ovo.jpg' },
        { nome: 'Platina', imagem: 'mdp_platina.jpg' },
        { nome: 'Preto Onix', imagem: 'mdp_preto_onix.jpg' }
    ],
    'lean_corpo_arm_gav_pe_painel': [
        { nome: 'Branco', imagem: 'mdp_branco.jpg' },
        { nome: 'Gris', imagem: 'mdp_gris.jpg' },
        { nome: 'Preto Onix', imagem: 'mdp_preto_onix.jpg' }
    ]
};

/**
 * Dados das linhas de produtos: conteúdo (Conceito, Composições) e mapeamento de acabamentos.
 * Atenção: a linha LUNCH usava "melaminico" sem acento, corrigido para "melamínico".
 */
const dadosLinhas = {
    'ARGUS': {
        'Composições': `
        <ul>
        <li>
        <strong>Armários Credence:</strong>
        Armário modelo credence possui tampo em MDP 25 mm revestido com lâmina de madeira e detalhes em alumínio anodizado, portas em MDF 
        revestido em lâmina de madeira nas duas faces e puxadores em alumínio, corpo em MDP 18 mm melamínico com acabamento em borda pvc.
        </li>
        <li>
        <strong>Gaveteiro Volante:</strong>
        Gaveteiro possui tampo em MDP 25 mm revestido com lâmina de madeira e detalhes em alumínio anodizado, frente de gaveta em MDF 18 mm 
        revestido em lâmina de madeira e puxadores em alumínio, corpo em MDP 18 mm melamínico com acabamento em borda pvc.
        </li>
        <li>
        <strong>Mesa Diretoria e Reunião:</strong>
        As Mesas modelo Diretória e Reunião possui tampo em MDP 25 mm revestido com lâmina de madeira e detalhes em aluminio anodizado, 
        pé painel em MDP 25 mm revestido em  lâmina de madeira nas duas faces e detalhes em alumínio anodizado. Caixa de tomada para 
        sistema de elétrica, dados e comunicação, subida de fios em perfil de alumínio.
        </li>
        </ul>
        `,
        acabamentos: {
            'Lâmina de madeira': acabamentosPadrao['lâmina_madeira'],
            'Melamínico corpo armário e gaveteiro': acabamentosPadrao.corpo_mdp_armário_gaveteiro_argus,
            'Gaveta em aço': acabamentosPadrao['gaveta_aço']
        }
    },
    'ARQUIVAMENTO': {
        'Conceito': `
        <P>        
        Muitas Possibilidades.
        </p>
        <p>
        Uma grande variedade de modelos para atender todas as necessidades de armazenamento dos espaços de trabalho atuais. 
        Armários nos mais diversos tamanhos e modelos, gaveteiros e guarda volumes em várias configurações de uso. 
        A alta qualidade em todos os materiais empregados e o cuidado estrutural, são diferenciais dessa linha. 
        Os armários da Linha Arquivamento aceitam configuração personalizada, garantindo um layout completo, com tempo de 
        fabricação reduzido ereposição adequada quando necessário.													
		</P>									
        `,
        'Composições': `
        <ul>
        <li>
        <strong>Armários:</strong>
        Os armários da Arquivamento aceitam configurações de tamanhos, garantindo um layout completo.
        Diferentes tipos de puxadores;
        Opção de armários com base metálica;
        Sapata reguladora de nível em todos os modelos;
        Robustez e durabilidade acima da média do mercado.
        </li>
        <li>
        <strong>Gaveteiros:</strong>
        Gaveteiros volantes, fixos de uso individual ou compartilhado, além de tamanhos de gavetas variados, para atender todo tipo de necessidade.
        Tampo superior de 25mm, corpo e frente de gavetas em 18mm;
        Corrediças metálicas de alta qualidade;
        Parte interna das gavetas em aço;
        Abertura pelas laterais das gavetas.
        </li>
        <li>
        <strong>Lockers ou Guarda-Volumes:</strong>
        Modulações diversas pensando em diferentes tipos de projetos.
        Portas com encaixe interno para maior segurança dos usuários;
        Corpos e portas em MDP de 15mm de alta qualidade;
        Inúmeras possibilidades de acabamento, incluindo portas com revestimento em Laca.
        Possibilidade de configurações sob medida.
        </li>
        </ul>
        `,
        acabamentos: {
            'Melamínico': acabamentosPadrao['melamínico'],
            'Corpo Armário Locker e armário Staff': acabamentosPadrao.softline_corpo_arm_gav_pe_painel,
            'Assento almofada gaveteiro Staff': acabamentosPadrao.tecido_chatterbox,
            'Metálicos': acabamentosPadrao.metalicos,
            'Gaveta em aço': acabamentosPadrao['gaveta_aço']
        },
        links: {
            catalogo: 'https://drive.google.com/file/d/1xSR6fLBfbU-ckqyv7Cos9xagPJZ9SRC-/view',
            imagens: 'https://drive.google.com/drive/folders/1Tv7WMvUUozuhsYSGjvaUxVqhMPFqWpjP',
            videos: null
        }
    },
    'CHATTERBOX': {
        'Conceito': `
        <P>        
        Projetadas para o seu conforto.
        </p>
        <p>
        As cabines de privacidade Chatterbox, foram projetadas pensando no usuário, com a atenção em cada detalhe. 
        Sua construção robusta permite redução dos ruídos emitidos no seu interior e também dos vindos de fora.
        </p>
        <p>
        São ideais para momentos de trabalho que exigem mais foco e concentração e para realização de chamadas telefônicas ou pequenas 
        reuniões, sem atrapalhar o escritório ou o escritório atrapalhar você.
        </p>
        <p>
       Chatterbox, para quem fala muito ou para quem precisa escapar das distrações do escritório.												
		</P>									
        `,
        'Composições': `
        <ul>
        <li>
        <strong>Cabine Simples:</strong>
        Cabine simples para uso individual, com duas opções de altura de tampo, com ou sem banco, possui sistema de ventilação e iluminação. 
        </li>
        <li>
        <strong>Cabine Dupla:</strong>
        Cabine para uso até duas pessoas, com duas opções de altura de tampo, com ou sem banco, possui sistema de ventilação e iluminação.
        </li>
        </ul>
        `,
        acabamentos: {
            'Melamínico': acabamentosPadrao['melamínico'],
            'Metálicos': acabamentosPadrao.metalicos,
            'Tecidos': acabamentosPadrao.tecido_chatterbox
        },
        obs_acabamentos: {
            'Utilização dos Melamínicos': 'Cabine e tampo.',
            'Utilização dos Tecidos': 'Abafadores internos e assentos.'
        },
        links: {
            catalogo: 'https://fortline.ind.br/produto/chatterbox/30',
            imagens: 'https://drive.google.com/drive/folders/1Ol9cnPt-GDWxkq5fXQ4mzxBVuNvrlWm0',
            videos: null
        }
    },
    'DUNNA': {
        'Conceito': `
        <p>
        Acabamentos sofisticados e detalhes exclusivos, compondo ambientes elegantes que dão o tom para seu espaço de trabalho 
        garantindo sofisticação e qualidade.
        `,
        'Composições': `
        <ul>
        <li>
        <strong>Mesa de Trabalho</strong>
        Tampo em MDF revestido em lâmina de madeira envernizada, acabamento em matizado preto nas bordas, 
        com detalhe na borda do usuário em couro ecológico preto, tampa da caixa de tomada confeccionada em MDF envernizado com bordas 
        matizadas na cor preto. Estrutura metálica preta revestido com couro ecológico preto.
        </li>
        <li>
        <strong>Mesa Gerencia</strong>
        Tampo duplo, sendo superior em MDF revestido em lâmina de madeira envernizada, bordas lâmina de madeira, 
        tampo inferior todo pintado matizado preto; Tampo de trabalho fixo revestido em couro ecológico preto e tampo deslizante 
        envernizado; Painel frontal verniz, Estrutura Pé  painel em MDF contraplacados na espessura de 50mm, frente de Gaveta, 
        lateral e fundo do gaveteiro em MDF verniz, portas e gavetas  com puxador tipo cava, acabamento matizado preto, demais bordas 
        lâmina de madeira, apenas partes internas  e tampo inferior em MDP.
        </li>
        <li>
        <strong>Mesas Diretoria</strong>
        Tampo duplo, sendo superior em MDF revestido em lâmina de madeira envernizada, bordas lâmina de madeira, 
        tampo inferior todo pintado matizado preto; Tampo de trabalho fixo com acabamento em couro ecológico preto, tampo deslizante 
        envernizado painel frontal verniz, Estrutura Pé Painel em MDF contraplacados na espessura de 50mm, frente de gaveta, portas, 
        lateral e fundo do armário / gaveteiro em MDF verniz, portas e gavetas com puxador tipo cava, acabamento matizado preto, 
        demais bordas lâmina de madeira, apenas partes internas e tampo inferior em MDP.
        </li>
        <li>
        <strong>Mesas Reunião</strong>
        Tampo superior MDF revestido em lâmina de madeira envernizada, acabamento em matizado preto nas bordas, 
        detalhe em couro ecológico, tampa da caixa de tomada confeccionada em MDF envernizado com bordas matizadas na cor preto. 
        Pé calandrado em aço revestido em couro ecológico. Reunião redondo com pé painel em MDF envernizado com bordas matizado preto.
        </li>
        <li>
        <strong>Armário</strong>
        Tampo superior e portas MDF revestido em lâmina de madeira envernizada, acabamento em matizado preto nas bordas ou 
        lâmina natural, parte interna do armário em MDP melamínico filetado, puxador modelo cava na parte superior da porta com acabamento matizado 
        preto, portas com dobradiças 270°.
        </li>
        <li>
        <strong>Gaveteiro</strong>
        Tampo superior e frente das Gavetas em MDF revestido em lâmina de madeira, corpo MDP melamínico filetado, frentes das gavetas com puxador modelo cava na 
        parte lateral com acabamento matizado preto, parte interna gavetas em aço com corrediças telescópicas;
        </li>
        </ul>
        `,
        acabamentos: {
            'Lâmina de madeira': acabamentosPadrao['lâmina_madeira'],
            'Melamínico': acabamentosPadrao['melamínico']
        },
        obs_acabamentos: {
            'Partes em aço e gavetas': 'Preto',
            'Detalhes em couro ecológico': 'Preto'
        }
    },
    'FIT': {
        'Conceito': `
        <P>        
        O mobiliário do seu jeito.
        </p>
        <p>
        Com uma família completa e diversas possibilidades de combinações, ela oferece soluções de plataformas, mesas individuais e de 
        reunião. Suas inúmeras combinações de acabamentos, composições e ajustes de medidas, permitem adequar cada projeto de forma 
        fácil e única.												
		</P>									
        `,
        'Composições': `
        <ul>
        <li>
        <strong>Plataforma:</strong>
        Uma ótima opção para quem busca um desenho elegante e marcante.
        Tampo bi-partido com usinagem central. Desenho único e elegante;
        Acesso fácil e descentralizado para tomadas;
        Pé shaft com tamanho ideal para subida e acomodações de cabos;
        Diferentes opções de pés metálicos.
        </li>
        <li>
        <strong>Individuais:</strong>
        Grande diversidade de medidas com elementos personalizáveis, que possibilitam a criação de postos de trabalho funcionais.
        Tampos com diversas opções de tamanhos, ideal para cada necessidade;
        Opções diferentes de pés;
        Tomadas posicionadas para melhor acomodação de carregadores e conexão de dados completa;
        Produto de acordo com as Normas Técnicas da ABNT.
        </li>
        <li>
        <strong>Reunião:</strong>
        As mesas de reunião Fit têm design elegante e minimalista.
        Diferentes formatos e medidas;
        Opções diferentes de pés;
        Soluções sob medida para necessidades especiais;
        Produto de acordo com as Normas Técnicas da ABNT.
        </li>
        <li>
        <strong>Bases:</strong>
        Na Linha Fit você escolhe por diferentes tipos de pés. Mais autonomia para você diferenciar seus projetos.
        </li>
        </ul>
        `,
        acabamentos: {
            'Melamínico': acabamentosPadrao['melamínico'],
            'Metálicos': acabamentosPadrao.metalicos,
            'Vidros': acabamentosPadrao.vidros_coloridos,
            'Gaveta em aço': acabamentosPadrao['gaveta_aço']
        }
    },
    'LUNCH': {
        'Conceito': `
        <P>        
        Lunch. Qualidade para ambientes coletivos.Com a expertise de quem entende de ambientes coletivos, 
        a Fortline desenvolveu a Linha Lunch, composta por mesas, bancos, aparadores e lixeiras criados com foco em durabilidade, 
        praticidade e conforto.												
		</P>									
        `,
        'Composições': `
        <ul>
        <li>
        <strong>Mesa Refeitório para cadeiras ou bancos:</strong>
        A Linha Lunch oferece uma ampla variedade de mesas e bancos, 
        desenvolvidos para atender diferentes necessidades de ambientes coletivos.
        </li>
        <li>
        <strong>Mesa Refeitório Infantil com Banco:</strong>
        A Linha Lunch também conta com mesas e bancos infantis, pensados especialmente para os pequenos. 
        Com design que prioriza a segurança e proporções adequadas, os móveis infantis promovem conforto e incentivam a convivência 
        em ambientes coletivos desde cedo.
        </li>
        <li>
        <strong>Mesa Refeitório com Assentos Escamoteáveis:</strong>
        A mesa com bancos acoplados e escamoteáveis garantem mais organização. Seu design facilita a limpeza do espaço e otimiza a 
        circulação, tornando o dia a dia mais prático sem abrir mão do conforto.
        </li>
        <li>
        <strong>Mesa Refeitório com Assentos Fixos:</strong>
        A mesa com assentos fixos se destaca pela robustez construtiva, ideal para ambientes de uso intenso, oferecendo estabilidade, 
        segurança e longa durabilidade, mesmo em rotinas exigentes.
        </li>
        <li>
        <strong>Bancadas Alta para Café:</strong>
        Produzidas em MDP de alta qualidade, oferecem uma solução prática e funcional para apoio em áreas de alimentação. Com design 
        discreto e eficiente, é ideal para organizar utensílios, bebidas e pequenos equipamentos.
        </li>
        <li>
        <strong>Aparadores:</strong>
        Os aparadores da Linha Lunch, produzidos em MDP, são ideais para dar suporte funcional e elegante a áreas de alimentação. 
        Disponíveis com ou sem gavetas, oferecem praticidade no armazenamento e organização de utensílios, mantendo o ambiente sempre pronto.
        </li>
        <li>
        <strong>Lixeiras:</strong>
        Disponíveis em diversas cores, as lixeiras da Linhas Lunch facilitam a identificação e a separação dos resíduos. 
        Com portas basculantes, garantem o armazenamento adequado do lixo até o descarte final, contribuindo para a organização, 
        higiene e sustentabilidade dos ambientes coletivos.
        </li>
        </ul>
        `,
        acabamentos: {
            'Melamínico': acabamentosPadrao['melamínico'], // Corrigido: antes estava 'melaminico' sem acento
            'Metálicos': acabamentosPadrao.metalicos
        }
    },
    'SOFTLINE': {
        'Conceito': `
        <P>        
        Equilíbrio entre leveza e robustez, flexibilidade e economicidade.
        A Softline reúne toda tecnologia e qualidade, em uma linha flexível e surpreendente.
        Muitas possibilidades de acabamentos e medidas configuráveis, com toda robustez e durabilidade que você já conhece.												
		</P>									
        `,
        'Composições': `
        <ul>
        <li>
        <strong>Plataformas:</strong>
        Maior quantidade de acabamentos disponíveis.
        Medidas confirguráveis para facilitar o projeto.
        Menor tempo na execução da montagem.
        Estabilidade e robustez garantidas.
        Acabamento premium.
        Feitas para durar, usando somente o necessário de forma inteligente e sustentável.
        </li>
        <li>
        <strong>Mesa Gerência:</strong>
        Disponível na opção com armário de apoio e autoportante;
        São 03 opções de pés para uma vasta personalização;
        Opção de painel frontal com desenho exclusivo.
        As mesas gerência da Softline são opções que permitem a personalização rápida, ajustáveis ao layout e as necessidades individuais.
        </li>
        <li>
        <strong>Mesa Individual:</strong>
        Diversos tamanhos com possibilidade de personalização;
        Pés metálicos em opção pé painel ou 03 modelos metálicos;
        Dispõem de acessorios para subida e passagem de fios e cabos.
        As mesas retas e deltas da linha Softline podem ser facilmente configuráveis.
        </li>
        <li>
        <strong>Reunião:</strong>
        Oferece 02 opções de pés metálicos;
        Caixas de tomadas permitem múltiplos usuários;
        Disponível em 03 formatos e medidas flexíveis para atender todo projeto.
        As mesas de reunião da linha Softline são perfeitamente adaptáveis a cada necessidade de projeto.
        </li>
        <li>
        <strong>Armário e Gaveteiro:</strong>
        Puxadores do tipo cava;
        Sapatas com regulagem de nível;
        Dobradiças com amortecimento.
        Diversos modelos com medidas configuráveis.
        </li>
        <li>
        <strong>Bases:</strong>
        Na Linha Softline você escolhe por diferentes tipos de pés. Mais autonomia para você diferenciar seus projetos.
        </li>
        </ul>
        `,
        acabamentos: {
            'Tampo, porta e frente de gaveta': acabamentosPadrao['melamínico'],
            'Corpo armário, gaveteiro e pé painel  portas e frente de gaveta': acabamentosPadrao.softline_corpo_arm_gav_pe_painel,
            'Metálicos': acabamentosPadrao.metalicos,
            'Painel suspenso vidro colorido': acabamentosPadrao.vidros_coloridos,
            'Gaveta em aço': acabamentosPadrao['gaveta_aço']
        },
        links: {
            catalogo: 'https://drive.google.com/file/d/1Dl2GTBER6pt7lfzNPZ_oeqDQKJ01hrk8/view',
            imagens: 'https://drive.google.com/drive/folders/15HgyprsBQuniYPFMoRogywg-EvOa58cx',
            videos: null
        }
    },
    'STEPHENS': {
        'Composições': `
        <ul>
        <li>
        <strong>Mesa Diretor</strong>
        Tampo produzido em duplo MDF com acabamento em lâmina de madeira, usinagem central para encaixe de mármore. 
        Acabamento e detalhes em perfil de alumínio. Estrutura pé painel em duplo MDF com acabamento em lâmina de madeira envernizado 
        com acabamento em perfil de alumínio.
        </li>
        <li>
        <strong>Armário</strong>
        Tampo de armário produzido em duplo MDF e acabamento em lâmina de madeira ervenizado, lateral em duplo MDF com acabamento em lamina de 
        madeira ervenizado. Portas e frentes de gaveta produzida em MDF pré composto com espessura de 18 mm com acabamento em verniz. 
        Gavetas em aço com pintura na cor preto e portas de armário com dobradiça com abertura 90º, acabamentos com detalhes em perfil 
        de alumínio.
        </li>
        <li>
        <strong>Gaveteiros</strong>
        Tampo produzido em duplo MDF com acabamento em lâmina de madeira envernizado, lateral em duplo MDF com acabamento em lâmina de madeira envernizada
        e detalhes em perfil de alumínio. Frentes de gaveta em MDF pré composto com espessura de 18 mm com acabamento em verniz. 
        Partes em aço (gavetas) com pintura na cor preto.
        </li>
        </ul>
        `,
        acabamentos: {
            'Lâmina de madeira': acabamentosPadrao['lâmina_madeira'],
            'Mármore': acabamentosPadrao['mármore']
        },
        obs_acabamentos: {
            'Gavetas em aço': 'Preto'
        },
        links: {
            catalogo: 'https://drive.google.com/file/d/1pnqq723k24u1pSXqdiNVOmv3YiLtuPuD/view',
            imagens: null,
            videos: null
        }
    },
    'LEAN': {
        'Conceito': `
        <p>
        A Lean foi desenvolvida para permitir inúmeras combinações, adaptando-se a qualquer projeto. Seu design e engenharia 
        apresentam a solução mais otimizada do mercado, que permite trabalhar com ergonomia e conforto em um mobiliário durável 
        e versátil.										
		</P>									
        `,
        'Composições': `
        <ul>
        <li>PLATAFORMA LADO A LADO ESTRUTURA EM AÇO</li>
        <li>PLATAFORMA FRENTE E VERSO ESTRUTURA EM AÇO</li>
        <li>PLATAFORMA LADO A LADO ESTRUTURA PAINEL</li>
        <li>PLATAFORMA FRENTE E VERSO ESTRUTURA PAINEL</li>
        <li>ARMÁRIO FLOREIRA</li>
        <li>MESA DELTA COM ESTRUTURA PAINEL</li>
        <li>MESA RETA COM ESTRUTURA PAINEL</li>
        <li>MESA REUNIÃO COM ESTRUTURA EM AÇO</li>
        <li>MESA REUNIÃO COM ESTRUTURA PAINEL</li>
        <li>MESA GERÊNCIA</li>
        <li>GAVETEIRO</li>
        <li>ARMÁRIO</li>
        <li>PAINEL DIVISOR SUSPENSO EM MDP</li>
        <li>PAINEL DIVISOR SUSPENSO EM VIDRO</li>
        <li>ACESSÓRIOS</li>
        </ul>
        `,
        acabamentos: {
            'Acabamentos Tampo, Porta e Frente de Gaveta': acabamentosPadrao['melamínico'],
            'Corpo Armário, Gaveteiro e Estrutura Painel': acabamentosPadrao.lean_corpo_arm_gav_pe_painel,
            'Metálicos': acabamentosPadrao.metalicos,
            'Gaveta em aço': acabamentosPadrao['gaveta_aço'],
            'Painel Suspenso Vidro Colorido': acabamentosPadrao.vidros_coloridos
        },
        links: {
            catalogo: 'https://drive.google.com/file/d/1OwILfKlCK_0kPIpUcnksOG53Ms4QRoY3/view',
            imagens: 'https://drive.google.com/drive/folders/1JFvhokNT5A3BBuvPUfKpt4ZfCCyTrUZo',
            videos: null
        }
    },
        'JUST': {
        'Conceito': `
        <p>
        <strong>Uma gama completa de soluções.</strong> Pensada para resolver de forma simples e versátil diferentes necessidades, 
        a Just foi desenhada reunindo soluções técnicas inteligentes, com design funcional dedicado à melhor experiência dos seus usuários.									
		</p>									
        `,
        'Composições': `
        <ul>
        <li>
        <strong>PLATAFORMA: </strong>
        Acesso Fácil e descentralizado para tomadas. Calha leito profunda para acomodação perfeita de cabos e fontes. Pé shaft com 
        tamanho ideal para subida e acomodação de cabos. Fixação fácil de painéis divisores pela parte superior do tampo. Planos de 
        trabalho moduláveis e dinâmicos para equipes.
        </li>
        <li>
        <strong>INDIVIDUAL: </strong>
        Tampos com diversas opções de tamanho, ideal para cada necessidade. Várias opções diferentes de pés. Tomadas posicionadas para 
        melhor acomodação de carregadores e conexão de dados completa. Produto de acordo com as normas técnicas da ABNT. Espaços de uso 
        individual, retas ou em "L'' com superficie de trabalho ampliada.
        </li>
        <li>
        <strong>GERÊNCIA: </strong>
        Diferentes de medidas de tampo. Armário de serviço com caixa de tomadas padrão Operis.Opções diferentes de pés. Soluções sob 
        medida para necessidades especiais. Produto de acordo com as Normas Técnicas da ABNT. Mesas individuais distintivas com armário 
        de apoio integrado.
        </li>
        <li>
        <strong>REUNIÃO: </strong>
        Diferentes formatos e medidas. Opções diferentes de pés Soluções sob medida para necessidades especiais. Produto de acordo com 
        as normas Técnicas da ABNT. Planos componíveis para ambientes de reunião de todas as escalas.
        </li>
        </ul>
        `,
        acabamentos: {
            'Melamínico': acabamentosPadrao['melamínico'],
            'Metálicos': acabamentosPadrao['metalicos'],
            'Gaveta em aço': acabamentosPadrao['gaveta_aço'],
            'Painel Suspenso Vidro Colorido': acabamentosPadrao['vidros_coloridos'],
            'Painel Suspenso Revestido em Tecido': acabamentosPadrao['tecido']
        },
        links: {
            catalogo: 'https://drive.google.com/file/d/194AsBjMRE8APgyvQcP54R9dXtrhEHzu_/view',
            imagens: 'https://drive.google.com/drive/folders/1whaLYClRdL9U-ME_YfBLaub3lEaqhIDg',
            videos: null
        }
    }
};


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
        Object.entries(dados.acabamentos).forEach(([categoria, itens]) => {
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

    // Adiciona observações opcionais sobre acabamentos.
    if (dados.obs_acabamentos) {
        Object.entries(dados.obs_acabamentos).forEach(([nome, valor]) => {
            htmlAcabamentos += `<p><strong>${nome}:</strong> ${valor}</p>`;
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
            <button id="toggle-linha" class="btn-toggle-linha">Ocultar informações ▲</button>
            <div class="conteudo-linha">
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

        if (!termo) {
            // Se o campo estiver vazio, volta a mostrar todos os produtos da linha atual.
            if (linhaAtual) {
                const produtosLinha = produtos.filter(p => normalizarTexto(p.linha) === normalizarTexto(linhaAtual));
                renderizarTabela(produtosLinha);
            }
            return;
        }

        const filtrados = produtos.filter(produto =>
            normalizarTexto(produto.codigo).includes(termo) ||
            normalizarTexto(produto.cod_focco).includes(termo) ||
            normalizarTexto(produto.descricao).includes(termo) ||
            normalizarTexto(produto.linha).includes(termo) ||
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
if (document.getElementById('lista-linhas')) {
    carregarLinhas();
    configurarBusca();
}

// Configura fechamento do modal de detalhes do produto.
const fecharModal = document.getElementById('fechar-modal');
if (fecharModal) {
    fecharModal.addEventListener('click', () => {
        const modal = document.getElementById('modal-produto');
        if (modal) modal.style.display = 'none';
    });
}