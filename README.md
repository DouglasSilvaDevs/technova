# TechNova — HTML, CSS e JavaScript

Recriação da página TechNova a partir da referência fornecida, preservando a direção visual: fundo branco, cabeçalho escuro, azul e roxo, banner de tecnologia, categorias circulares, vitrines, promoções e rodapé. Os textos principais estão em português brasileiro. Esta edição inclui 80 produtos, com dez modelos de design distinto e imagem própria em cada categoria, mantendo a alta resolução e a correção do espaçamento entre imagens e textos.

## Como abrir

1. Extraia o ZIP inteiro, mantendo as pastas.
2. Abra `index.html` no navegador.

Não é necessário instalar dependências, executar npm ou compilar o site.

Para testar a persistência do carrinho entre acessos com um endereço local consistente, use o servidor opcional. Na pasta `technova`, execute:

```sh
node scripts/serve.mjs
```

Abra **http://localhost:8080**. O servidor usa apenas recursos do Node.js e exige Node 18 ou mais recente. Encerre com Ctrl+C. Também é possível usar qualquer servidor de arquivos estáticos.

## Arquivos

- `index.html`: estrutura da página, cabeçalho, categorias, banners, benefícios, newsletter, rodapé e janela de interação.
- `css/styles.css`: identidade visual, estados e adaptação para computador, tablet e celular.
- `js/catalog.js`: produtos, categorias, busca, validação do carrinho e cálculo dos valores em centavos.
- `js/app.js`: carrossel, busca, filtros, detalhes, favoritos, carrinho, perfil e pedidos de teste.
- `assets/images/`: fotografias PNG em alta resolução e a referência JPG original, guardada para consulta.
- `assets/icons/favicon.svg`: símbolo da marca; os demais ícones vetoriais estão no HTML e usam `currentColor`.
- `assets/image-manifest.json`: lista dos arquivos, dimensões, transparência e origem das novas imagens.
- `assets/image-prompts.json`: instruções usadas para recriar cada imagem com a ferramenta integrada imagegen.
- `scripts/serve.mjs`: servidor local opcional.
- `scripts/check.mjs`: verificações da lógica do catálogo e dos assets.
- `scripts/check-ui.mjs`: verificações de navegação e interações em um DOM simulado, sem dependências.

## Imagens e tipografia

As imagens da edição anterior eram regiões de uma captura de 736 × 1307 pixels. Os produtos tinham cerca de 80 a 110 pixels de origem, o que fazia perder nitidez ao ampliar no computador.

Nesta edição, **produtos, categorias e banners foram recriados com imagegen em alta resolução**, usando a captura como referência de forma, composição e cores. Não se trata de uma recuperação das fotos originais: detalhes dos dispositivos podem variar. A identidade geral e a estrutura da página foram preservadas.

Os produtos usam **80 imagens PNG próprias com fundo transparente: dez imagens distintas em cada categoria**. Nenhuma fotografia de produto é compartilhada entre modelos. Nesta revisão foram criadas 45 novas imagens para os itens que ainda compartilhavam fotografias. Os dez smartwatches continuam com os designs já apresentados.

Os modelos diferem no desenho do corpo, formato, acabamento, componentes e tipo de uso. A seleção inclui notebooks tradicionais, conversíveis, gamers e de duas telas; celulares compactos, dobráveis e reforçados; fones, headsets e caixas de som; diferentes dispositivos de automação; controles, consoles e periféricos; câmeras de ação, mirrorless, compactas e 360 graus; e acessórios de formatos distintos. Nomes e descrições foram ajustados para corresponder aos designs.

As imagens são ilustrações fotográficas criadas com a ferramenta integrada imagegen, e os modelos são fictícios. Elas não são fotografias oficiais de fabricantes.

Banners não contêm tipografia gravada: os textos continuam editáveis no HTML. Os círculos das categorias, os ícones e os selos das lojas de aplicativos são elementos de HTML/CSS/SVG e permanecem nítidos ao ampliar.

O manifesto inclui a resolução exata de cada arquivo. As instruções de geração estão em `assets/image-prompts.json`. Todos os assets usados estão dentro do pacote e não dependem de links de imagens externos.

O CSS usa `object-fit: contain` nos produtos e `object-fit: cover` apenas nos cenários dos banners, preservando a proporção de cada imagem. O fundo do banner principal tem largura de exibição limitada a 1920 pixels em telas muito largas, evitando ampliação excessiva. Nenhum filtro de nitidez ou ampliação artificial da captura é usado.

Nos cartões, a imagem ocupa uma área com altura definida, posicionamento interno e recorte de qualquer conteúdo que extrapole o quadro. Nomes, resumos e preços ficam no fluxo separado abaixo da foto. O espaçamento acompanha os tamanhos de tela; nomes longos podem ocupar mais de uma linha sem invadir a imagem.

As fontes originais não foram fornecidas nem podem ser identificadas com certeza a partir de uma captura. Foi usada a pilha local Arial/Helvetica/sans-serif para aproximar a referência; não há fontes externas ou downloads em tempo de execução. A marca foi recriada em vetor. O projeto preserva a identidade visual, mas não promete igualdade pixel a pixel nem arquivos originais de marca ou tipografia.

## Funcionalidades

- Carrossel com quatro destaques, setas e seleção por indicadores.
- Busca por nome, categoria, descrição e especificações, sem distinção de acentos e letras maiúsculas.
- Filtros por categoria, ofertas e novidades.
- Ordenação por destaques, menor preço, maior preço e nome.
- Contagem de modelos em cada categoria e carregamento de mais 20 produtos na lista completa.
- Detalhes e quantidade de cada produto.
- Favoritos e carrinho persistidos no navegador, quando permitido.
- Aumento, redução e remoção de itens, com limite de 99 unidades por produto.
- Frete ilustrativo grátis a partir de R$ 299 em produtos; R$ 19,90 abaixo disso.
- Perfil local demonstrativo, sem senha ou autenticação.
- Finalização e consulta de pedidos de teste, mantendo no máximo 20 registros.
- Validação local do e-mail da newsletter.
- Menu para celular, janelas com fechamento por Escape, rótulos acessíveis e foco visível.
- Respeito à preferência por movimento reduzido.

O catálogo tem **80 produtos ilustrativos: dez modelos com imagens próprias em cada uma das oito categorias**: notebooks, smartphones, áudio, smartwatches, casa inteligente, games, câmeras e acessórios. O monitor foi organizado em acessórios; os IDs e preços dos itens foram preservados para manter carrinhos e favoritos anteriores. Alguns nomes mudaram para acompanhar os novos designs. A página inicial mantém cinco destaques e cinco recomendações. Ao selecionar uma categoria, seus dez modelos aparecem juntos; a lista completa começa com vinte produtos e permite carregar os demais.

Nomes, preços em reais, avaliações, condições comerciais e especificações são exemplos, sem conversão dos preços da captura. O contador de ofertas é visual e reinicia ao abrir a página. Os botões de suporte e informações abrem conteúdos de demonstração; os selos de aplicativos não representam apps publicados. Os links sociais apontam para as páginas gerais das plataformas.

## Dados e limites da demonstração

**Não há backend, pagamentos, autenticação real, newsletter enviada ou logística.** Nenhum dado de formulário é transmitido por este código. Use dados fictícios nos formulários.

Carrinho, favoritos, perfil e pedidos de teste ficam no `localStorage` deste navegador. Não são privados por conta, sincronizados com outros dispositivos nem recuperáveis como compras reais. Sair do perfil não remove os pedidos de teste. A newsletter somente valida o e-mail e não o armazena.

Se o navegador bloquear o armazenamento, as interações continuam na página aberta. Para limpar os registros, remova os dados do site nas configurações do navegador; as chaves desta demonstração começam com `technova.`.

Para uso comercial, conecte serviços reais e substitua conteúdo, fotos, canais oficiais e condições demonstrativas pelos dados autorizados da loja.

## Verificação

```sh
node --check js/catalog.js
node --check js/app.js
node scripts/check.mjs
node scripts/check-ui.mjs
```

O projeto passou por verificações de sintaxe, 80 modelos e dez por categoria, busca, ordenação, cálculos, integridade dos assets e referências dos arquivos. Os testes exigem dez imagens distintas por categoria, oitenta imagens distintas no catálogo inteiro e arquivos PNG com conteúdo diferente; não basta duplicar uma fotografia com outro nome. As interações foram verificadas em um DOM simulado: categorias, carregamento até 80 cartões, detalhes, carrinho, favoritos e preservação de registros antigos. Essa simulação não mede o layout. Os ajustes responsivos estão no CSS em 1190, 1000, 760 e 400 pixels. A conferência visual em um navegador real não esteve disponível no ambiente de criação; confira a página no seu navegador antes de publicar.

## Publicação

Hospede esta pasta como site estático, com `index.html` na raiz. Todos os caminhos de assets são relativos e o funcionamento da página não depende do servidor opcional. O código e as imagens incluídos podem ser editados diretamente.
