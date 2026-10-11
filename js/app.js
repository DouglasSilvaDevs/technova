/* TechNova: interações do protótipo, sem bibliotecas e sem serviços externos. */
(() => {
  'use strict';
  const C = window.TechNovaCatalog;
  if (!C) return;
  const $ = selector => document.querySelector(selector);
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const productById = id => C.products.find(p => p.id === id);
  const storagePrefix = 'technova.';
  let canPersist = true;
  function readStorage(key, fallback) {
    try { return JSON.parse(localStorage.getItem(storagePrefix + key)) ?? fallback; }
    catch { return fallback; }
  }
  function saveStorage(key, value) {
    try { localStorage.setItem(storagePrefix + key, JSON.stringify(value)); return true; }
    catch { canPersist = false; return false; }
  }
  try { localStorage.setItem(storagePrefix + 'test', '1'); localStorage.removeItem(storagePrefix + 'test'); }
  catch { canPersist = false; }

  const rawProfile = readStorage('profile.v1', null);
  const rawOrders = readStorage('orders.v1', []);
  const state = {
    cart: C.sanitizeCart(readStorage('cart.v1', {})),
    favorites: C.sanitizeFavorites(readStorage('favorites.v1', [])),
    profile: rawProfile && typeof rawProfile.name === 'string' && typeof rawProfile.email === 'string' ? { name: rawProfile.name.slice(0, 80), email: rawProfile.email.slice(0, 160) } : null,
    orders: Array.isArray(rawOrders) ? rawOrders.filter(o => o && typeof o.id === 'string' && /^TN-[A-Z0-9-]{4,50}$/.test(o.id) && typeof o.date === 'string' && Number.isSafeInteger(o.total) && o.total >= 0).slice(0, 20) : [],
    category: 'all', query: '', mode: 'featured', sort: 'relevance', visibleLimit: 20, slide: 0,
    dialogType: '', detailId: null, detailQuantity: 1
  };
  const dialog = $('#main-dialog');
  let previousFocus = null;
  let toastTimeout;
  const slides = [
    { eyebrow: 'TECNOLOGIA DO FUTURO', title: 'Um amanhã<br>mais inteligente<br><span>começa aqui.</span>', description: 'Explore novas possibilidades. Evolua seu dia a dia.', cta: 'Explore o futuro', category: 'all', mode: 'all' },
    { eyebrow: 'CONECTE-SE A MAIS', title: 'Novas ideias.<br>Novas conexões.<br><span>Seu próximo passo.</span>', description: 'Encontre o smartphone que combina com você.', cta: 'Ver smartphones', category: 'smartphones', mode: 'all' },
    { eyebrow: 'A PRÓXIMA FASE', title: 'Jogue mais.<br>Vá mais longe.<br><span>Supere limites.</span>', description: 'Tecnologia para suas melhores partidas.', cta: 'Explore os games', category: 'gaming', mode: 'all' },
    { eyebrow: 'ACABOU DE CHEGAR', title: 'O novo chegou.<br>Seu futuro<br><span>também.</span>', description: 'Conheça as novidades da nossa seleção.', cta: 'Ver novidades', category: 'all', mode: 'new' }
  ];

  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => el.classList.remove('show'), 3500);
  }
  function updateCounters() {
    const quantity = C.totals(state.cart).quantity;
    document.querySelectorAll('.cart-count').forEach(el => { el.textContent = quantity; });
    document.querySelectorAll('.favorites-count').forEach(el => { el.textContent = state.favorites.length; el.hidden = !state.favorites.length; });
    const account = $('.account-action > span');
    account.innerHTML = state.profile ? `<small>Olá, ${escapeHTML(state.profile.name.split(' ')[0])}</small>Minha conta⌄` : '<small>Olá! Entre</small>Minha conta⌄';
  }
  function card(p, badges = false) {
    const favorite = state.favorites.includes(p.id);
    const discount = p.previousPrice ? Math.round(100 * (1 - p.price / p.previousPrice)) : 0;
    const tag = badges && state.mode === 'offers' && discount ? `<span class="product-tag">−${discount}%</span>` : badges && state.mode === 'new' ? '<span class="product-tag">NOVO</span>' : '';
    return `<article class="product-card" data-product-id="${p.id}">
      <button class="favorite-button ${favorite ? 'is-favorite' : ''}" type="button" data-favorite="${p.id}" aria-pressed="${favorite}" aria-label="${favorite ? 'Remover dos' : 'Adicionar aos'} favoritos: ${escapeHTML(p.name)}">${icon('heart')}</button>${tag}
      <button class="product-image-button" type="button" data-product="${p.id}" aria-label="Ver detalhes de ${escapeHTML(p.name)}"><img src="assets/images/${p.image}" alt="${escapeHTML(p.name)}" width="1280" height="1280" loading="lazy" decoding="async"></button>
      <h3><button class="product-name" type="button" data-product="${p.id}">${escapeHTML(p.name)}</button></h3>
      <p class="product-subtitle">${escapeHTML(p.subtitle)}</p>
      <p class="product-price">${badges && state.mode === 'offers' && p.previousPrice ? `<del>${C.money(p.previousPrice)}</del>` : ''}${C.money(p.price)}</p>
      <div class="product-bottom"><div class="product-rating"><span class="stars" aria-label="Avaliação ilustrativa: 5 estrelas">★★★★★</span><span>(${p.rating})</span></div><button class="quick-add" type="button" data-add="${p.id}" aria-label="Adicionar ${escapeHTML(p.name)} ao carrinho">${icon('plus')}</button></div>
    </article>`;
  }
  function emptyState(title, text, kind = 'search', action = 'view-all', label = 'Ver todos os produtos') {
    return `<div class="empty-state">${icon(kind)}<h3>${escapeHTML(title)}</h3><p>${escapeHTML(text)}</p><button class="button dark-button" type="button" data-action="${action}">${escapeHTML(label)} ${icon('arrow')}</button></div>`;
  }
  function renderCatalog() {
    const filtered = state.mode !== 'featured' || state.category !== 'all' || !!state.query;
    const products = C.filterProducts(state);
    const visible = products.slice(0, state.visibleLimit);
    let title = state.category !== 'all' ? C.categories[state.category] : ({ featured: 'Produtos em alta', all: 'Todos os produtos', offers: 'Ofertas especiais', new: 'Novidades' })[state.mode];
    if (state.query) title = 'Resultados da busca';
    $('#catalog-title').textContent = title;
    $('#trending-grid').innerHTML = visible.length ? visible.map(p => card(p, filtered)).join('') : emptyState('Nenhum produto encontrado', 'Tente outra busca ou explore as categorias.');
    $('#filter-bar').hidden = !filtered;
    $('#filter-description').textContent = `${products.length} ${products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}${state.query ? ` para “${state.query}”` : ''}`;
    $('#catalog-sort').value = state.sort;
    $('#catalog-more').hidden = visible.length >= products.length;
    $('#catalog-progress').textContent = `Exibindo ${visible.length} de ${products.length} produtos`;
    $('.recommended-section').hidden = filtered;
    if (!filtered) $('#recommended-grid').innerHTML = C.products.filter(p => p.group === 'recommended').map(p => card(p)).join('');
    $('.promotions').hidden = !!state.query;
    document.querySelectorAll('[data-filter]').forEach(button => {
      const active = state.category !== 'all' && button.dataset.filter === state.category;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  function selectCatalog({ category = 'all', query = '', mode = 'all' } = {}, scroll = true) {
    state.category = Object.hasOwn(C.categories, category) ? category : 'all';
    state.query = String(query).trim().slice(0, 150);
    state.mode = ['featured', 'all', 'offers', 'new'].includes(mode) ? mode : 'all';
    state.visibleLimit = 20;
    $('#search-input').value = state.query;
    renderCatalog();
    if (dialog.open) closeDialog();
    $('#category-nav').classList.remove('is-open');
    $('#menu-toggle').setAttribute('aria-expanded', 'false');
    $('#menu-toggle').setAttribute('aria-label', 'Abrir categorias');
    if (scroll) $('#catalogo').scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  function toggleFavorite(id) {
    const p = productById(id);
    if (!p) return;
    const wasFavorite = state.favorites.includes(id);
    state.favorites = wasFavorite ? state.favorites.filter(value => value !== id) : [...state.favorites, id];
    saveStorage('favorites.v1', state.favorites);
    updateCounters();
    document.querySelectorAll('[data-favorite]').forEach(button => {
      if (button.dataset.favorite === id) {
        button.classList.toggle('is-favorite', !wasFavorite);
        button.setAttribute('aria-pressed', String(!wasFavorite));
        button.setAttribute('aria-label', `${wasFavorite ? 'Adicionar aos' : 'Remover dos'} favoritos: ${p.name}`);
      }
    });
    if (state.dialogType === 'favorites') renderFavorites(true);
    toast(wasFavorite ? 'Produto removido dos favoritos.' : 'Produto salvo nos favoritos.');
  }
  function addToCart(id, quantity = 1) {
    if (!productById(id)) return;
    const before = state.cart[id] || 0;
    state.cart = C.addItem(state.cart, id, quantity);
    saveStorage('cart.v1', state.cart);
    updateCounters();
    toast(state.cart[id] === before ? 'Limite de 99 unidades por produto.' : 'Produto adicionado ao carrinho.');
  }
  function openDialog(title, content, type, drawer = false) {
    if (!dialog.open) previousFocus = document.activeElement;
    state.dialogType = type;
    dialog.classList.toggle('drawer', drawer);
    $('#dialog-title').textContent = title;
    $('#dialog-content').innerHTML = content;
    if (!dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else { dialog.setAttribute('open', ''); dialog.setAttribute('role', 'dialog'); dialog.setAttribute('aria-modal', 'true'); }
    }
  }
  function closeDialog() {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    state.dialogType = '';
    if (previousFocus?.isConnected) previousFocus.focus();
  }
  function renderProduct(id) {
    const p = productById(id);
    if (!p) return;
    state.detailId = id;
    state.detailQuantity = 1;
    openDialog(p.name, `<div class="product-detail"><img class="detail-image" src="assets/images/${p.image}" alt="${escapeHTML(p.name)}" width="350" height="300"><div><p class="detail-category">${C.categories[p.category]}</p><p class="product-rating"><span class="stars" aria-label="Avaliação ilustrativa: 5 estrelas">★★★★★</span>(${p.rating})</p><p class="detail-description">${p.description}</p><p class="detail-price">${C.money(p.price)}</p><ul class="detail-specs">${p.specs.map(spec => `<li>${icon('check')}${spec}</li>`).join('')}</ul><div class="detail-actions"><div class="quantity-control"><button type="button" data-detail-quantity="-1" aria-label="Diminuir quantidade">${icon('minus')}</button><span id="detail-quantity" aria-live="polite">1</span><button type="button" data-detail-quantity="1" aria-label="Aumentar quantidade">${icon('plus')}</button></div><button type="button" class="button" data-action="add-detail">${icon('cart')}Adicionar</button></div><p class="demo-note">Produto, preço, avaliações e especificações ilustrativos. Esta vitrine não processa pagamentos.</p></div></div>`, 'product');
  }
  function renderFavorites(refresh = false) {
    const products = C.products.filter(p => state.favorites.includes(p.id));
    openDialog('Seus favoritos', products.length ? `<div class="favorite-list">${products.map(p => card(p)).join('')}</div>` : emptyState('Sua seleção começa aqui', 'Toque no coração de um produto para salvá-lo.', 'heart'), 'favorites');
    if (refresh) $('#dialog-close').focus();
  }
  function renderCart(focusId) {
    const total = C.totals(state.cart);
    if (!total.quantity) {
      openDialog('Seu carrinho', emptyState('Seu carrinho está vazio', 'Encontre sua próxima novidade no catálogo.', 'cart'), 'cart', true);
      return;
    }
    const items = C.products.filter(p => state.cart[p.id]);
    const remaining = Math.max(0, 29900 - total.subtotal);
    openDialog('Seu carrinho', `<div class="cart-items">${items.map(p => `<article class="cart-item"><img src="assets/images/${p.image}" alt="${p.name}" width="78" height="75"><div><h3>${p.name}</h3><p>${C.money(p.price)}</p><div class="quantity-control"><button type="button" data-cart-quantity="${p.id}" data-step="-1" aria-label="Diminuir quantidade de ${p.name}">${icon('minus')}</button><span aria-label="Quantidade">${state.cart[p.id]}</span><button type="button" data-cart-quantity="${p.id}" data-step="1" aria-label="Aumentar quantidade de ${p.name}">${icon('plus')}</button></div></div><button class="remove-item" type="button" data-remove="${p.id}" aria-label="Remover ${p.name}">${icon('trash')}</button></article>`).join('')}</div><div class="shipping-progress">${remaining ? `Faltam ${C.money(remaining)} para ganhar frete grátis.` : 'Você ganhou frete grátis nesta simulação!'}<progress max="29900" value="${Math.min(total.subtotal, 29900)}" aria-label="Progresso para frete grátis"></progress></div><div class="cart-summary"><p class="summary-line"><span>Subtotal (${total.quantity} ${total.quantity === 1 ? 'item' : 'itens'})</span><b>${C.money(total.subtotal)}</b></p><p class="summary-line"><span>Entrega simulada</span><b>${total.shipping ? C.money(total.shipping) : 'Grátis'}</b></p><p class="summary-line total"><span>Total</span><span>${C.money(total.total)}</span></p></div><button class="button checkout-button full-width" type="button" data-action="checkout">Continuar ${icon('arrow')}</button><p class="demo-note">Carrinho demonstrativo. Nenhuma cobrança ou entrega real é realizada.</p>`, 'cart', true);
    if (focusId) dialog.querySelector(`[data-cart-quantity="${focusId}"][data-step="1"]`)?.focus();
  }
  function changeCart(id, step) {
    state.cart = C.setQuantity(state.cart, id, (state.cart[id] || 0) + step);
    saveStorage('cart.v1', state.cart);
    updateCounters();
    renderCart(id);
  }
  function renderCheckout() {
    const total = C.totals(state.cart);
    if (!total.quantity) { renderCart(); return; }
    openDialog('Finalizar pedido de teste', `<form id="checkout-form" class="checkout-form"><p class="demo-note">Use dados fictícios. Este formulário apenas cria um pedido de teste neste navegador; não há cobrança, envio de dados ou entrega.</p><label class="form-field">Nome de teste<input name="name" autocomplete="off" required minlength="2" maxlength="80" placeholder="Ex.: Cliente de teste" value="${escapeHTML(state.profile?.name || '')}"></label><label class="form-field">E-mail de teste<input name="email" type="email" autocomplete="off" required maxlength="160" placeholder="Ex.: cliente@example.com" value="${escapeHTML(state.profile?.email || '')}"></label><fieldset><legend>Forma de pagamento ilustrativa</legend><label><input type="radio" name="payment" value="Pix" checked>Pix</label><label><input type="radio" name="payment" value="Cartão">Cartão</label><label><input type="radio" name="payment" value="Boleto">Boleto</label></fieldset><p class="summary-line total"><span>Total simulado</span><span>${C.money(total.total)}</span></p><button class="button" type="submit">Criar pedido de teste ${icon('check')}</button><button class="text-link" type="button" data-action="cart">Voltar ao carrinho</button></form>`, 'checkout');
  }
  function renderAccount() {
    if (state.profile) {
      openDialog('Minha conta', `<div class="account-welcome">${icon('user')}<h3>Olá, ${escapeHTML(state.profile.name)}!</h3><p>${escapeHTML(state.profile.email)}</p><button class="button" type="button" data-action="track">Ver meus pedidos de teste</button><p class="demo-note">Perfil demonstrativo salvo somente neste navegador. Este acesso não possui autenticação ou senha.</p><button type="button" class="text-link" data-action="logout">Sair deste perfil</button></div>`, 'account');
    } else {
      openDialog('Minha conta', `<form id="account-form" class="account-form"><p class="demo-note">Crie um perfil demonstrativo com dados fictícios. Não há senha, autenticação ou envio a um servidor.</p><label class="form-field">Nome de teste<input name="name" required minlength="2" maxlength="80" autocomplete="off" placeholder="Seu nome de teste"></label><label class="form-field">E-mail de teste<input name="email" required type="email" maxlength="160" autocomplete="off" placeholder="cliente@example.com"></label><button type="submit" class="button">Criar perfil local ${icon('arrow')}</button></form>`, 'account');
    }
  }
  function renderTrack() {
    const latest = state.orders[0];
    openDialog('Acompanhar pedido', `<form id="tracking-form" class="tracking-form"><p class="demo-note">Consulte os pedidos de teste criados neste navegador. O código aparece ao concluir a simulação.</p><label class="form-field">Número do pedido<input name="order" required maxlength="60" autocomplete="off" placeholder="TN-..." value="${escapeHTML(latest?.id || '')}"></label><button class="button" type="submit">Consultar pedido ${icon('search')}</button><div id="tracking-result" role="status"></div></form>`, 'track');
  }
  const infos = {
    help: ['Central de ajuda', '<h3>Como podemos ajudar?</h3><p>Encontre produtos pela busca ou pelas categorias. Use o coração para salvar favoritos e o botão + para montar seu carrinho.</p><p>O carrinho calcula o subtotal e uma entrega ilustrativa. Ao continuar, você pode criar um pedido de teste e consultar o código em “Acompanhar pedido”.</p><p>Este site é uma demonstração. Nenhuma compra, pagamento ou atendimento real é realizado.</p>'],
    shipping: ['Frete e entrega', '<h3>Mais perto da sua próxima novidade</h3><p>Nesta simulação, compras a partir de R$ 299 em produtos têm frete grátis. Abaixo desse valor, a entrega ilustrativa custa R$ 19,90.</p><p>O site não consulta CEP, transportadoras ou prazos reais. Nenhum produto será enviado.</p>'],
    returns: ['Trocas e devoluções', '<h3>Escolha com tranquilidade</h3><p>Uma política de trocas facilita a compra e mantém tudo claro para você.</p><p>Este é um projeto demonstrativo. As condições comerciais, os prazos e o canal de devolução deverão ser informados pela loja antes de receber pedidos reais.</p>'],
    products: ['Nossa seleção', '<h3>Tecnologia para o seu dia a dia</h3><p>Notebooks, smartphones, áudio, games e acessórios em uma vitrine inspirada na referência TechNova.</p><p>Os nomes, valores, avaliações e especificações apresentados são exemplos de demonstração.</p>'],
    contact: ['Fale conosco', '<h3>Vamos conversar?</h3><p>Este projeto ainda não possui um canal oficial de atendimento. Os formulários e pedidos são demonstrações locais.</p><p>Você pode explorar a central de ajuda para entender a navegação e o funcionamento do carrinho.</p>'],
    guide: ['Guia de compra', '<h3>Encontre sua próxima escolha</h3><p>Selecione uma categoria, busque pelo nome ou abra um produto para ver detalhes. Salve suas opções no coração para comparar depois.</p><p>Os valores do carrinho são calculados em reais. A compra desta versão é apenas uma simulação, sem pagamento real.</p>'],
    about: ['Sobre a TechNova', '<h3>Um amanhã mais inteligente começa aqui.</h3><p>Uma experiência de tecnologia com visual limpo, detalhes em azul e roxo e produtos em destaque.</p><p>Esta é uma recriação demonstrativa da referência enviada, desenvolvida em HTML, CSS e JavaScript.</p>'],
    sustainability: ['Sustentabilidade', '<h3>Um futuro com escolhas conscientes</h3><p>Cuide dos seus eletrônicos, evite substituições desnecessárias e procure canais apropriados de descarte.</p><p>A TechNova desta demonstração não apresenta certificações ou programas ambientais de uma empresa real.</p>'],
    careers: ['Carreiras', '<h3>Tecnologia se constrói com pessoas</h3><p>Esta é uma vitrine demonstrativa. Nenhuma vaga ou processo seletivo está disponível neste projeto.</p>'],
    blog: ['Blog TechNova', '<h3>Uma mesa mais organizada</h3><p>Um teclado compacto, um monitor na altura adequada e os acessórios por perto ajudam a criar um espaço confortável para o dia a dia.</p><h3>Comece pela sua rotina</h3><p>Antes de escolher um novo eletrônico, pense em como você pretende usá-lo e quais recursos realmente fazem diferença para você.</p>'],
    press: ['Imprensa', '<h3>Identidade TechNova</h3><p>Esta versão é um projeto demonstrativo baseado na imagem de referência fornecida. Não representa um canal oficial de imprensa.</p>'],
    gift: ['Vale-presente', '<h3>Uma ideia para surpreender</h3><p>O vale-presente aparece como possibilidade nesta vitrine. Sua compra e utilização ainda não estão disponíveis na demonstração.</p>'],
    app: ['TechNova no celular', '<h3>Sua vitrine acompanha você</h3><p>O site se adapta a celulares, tablets e computadores.</p><p>Os selos das lojas de aplicativos fazem parte da referência visual. Nenhum aplicativo TechNova foi publicado por este projeto.</p>']
  };
  function renderInfo(key) {
    const [title, content] = infos[key] || infos.help;
    openDialog(title, `<div class="info-content">${content}</div>`, 'info');
  }
  function showSlide(index) {
    state.slide = (index + slides.length) % slides.length;
    const slide = slides[state.slide];
    $('#hero-eyebrow').textContent = slide.eyebrow;
    $('#hero-title').innerHTML = slide.title;
    $('#hero-description').textContent = slide.description;
    $('#hero-cta').innerHTML = `${slide.cta} ${icon('arrow')}`;
    document.querySelectorAll('[data-slide]').forEach(button => {
      const active = Number(button.dataset.slide) === state.slide;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.favorite) return toggleFavorite(button.dataset.favorite);
    if (button.dataset.product) return renderProduct(button.dataset.product);
    if (button.dataset.add) return addToCart(button.dataset.add);
    if (button.dataset.filter) return selectCatalog({ category: button.dataset.filter, mode: button.dataset.filter === 'all' ? 'featured' : 'all' });
    if (button.dataset.info) return renderInfo(button.dataset.info);
    if (button.dataset.slide !== undefined) return showSlide(Number(button.dataset.slide));
    if (button.dataset.detailQuantity) {
      state.detailQuantity = Math.max(1, Math.min(99, state.detailQuantity + Number(button.dataset.detailQuantity)));
      $('#detail-quantity').textContent = state.detailQuantity;
      return;
    }
    if (button.dataset.cartQuantity) return changeCart(button.dataset.cartQuantity, Number(button.dataset.step));
    if (button.dataset.remove) {
      state.cart = C.setQuantity(state.cart, button.dataset.remove, 0);
      saveStorage('cart.v1', state.cart);
      updateCounters();
      renderCart();
      return;
    }
    switch (button.dataset.action) {
      case 'view-all': selectCatalog({ mode: 'all' }); break;
      case 'load-more': {
        const firstNew = state.visibleLimit;
        state.visibleLimit += 20;
        renderCatalog();
        $('#trending-grid').querySelectorAll('.product-image-button')[firstNew]?.focus({ preventScroll: true });
        break;
      }
      case 'offers': selectCatalog({ mode: 'offers' }); break;
      case 'new-arrivals': selectCatalog({ mode: 'new' }); break;
      case 'favorites': renderFavorites(); break;
      case 'cart': renderCart(); break;
      case 'checkout': renderCheckout(); break;
      case 'account': renderAccount(); break;
      case 'track': renderTrack(); break;
      case 'add-detail': addToCart(state.detailId, state.detailQuantity); break;
      case 'logout': state.profile = null; saveStorage('profile.v1', null); updateCounters(); renderAccount(); break;
    }
  });
  $('#search-form').addEventListener('submit', event => { event.preventDefault(); selectCatalog({ query: $('#search-input').value, mode: 'all' }); });
  $('#clear-filter').addEventListener('click', () => { state.sort = 'relevance'; selectCatalog({ mode: 'featured' }); });
  $('#menu-toggle').addEventListener('click', () => {
    const open = $('#category-nav').classList.toggle('is-open');
    $('#menu-toggle').setAttribute('aria-expanded', String(open));
    $('#menu-toggle').setAttribute('aria-label', open ? 'Fechar categorias' : 'Abrir categorias');
  });
  $('#hero-prev').addEventListener('click', () => showSlide(state.slide - 1));
  $('#hero-next').addEventListener('click', () => showSlide(state.slide + 1));
  $('#hero-cta').addEventListener('click', () => selectCatalog(slides[state.slide]));
  $('#dialog-close').addEventListener('click', closeDialog);
  dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
  dialog.addEventListener('close', () => { state.dialogType = ''; });
  dialog.addEventListener('cancel', () => { state.dialogType = ''; });

  document.addEventListener('submit', event => {
    const form = event.target;
    if (!['checkout-form', 'account-form', 'tracking-form', 'newsletter-form'].includes(form.id)) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (form.id === 'newsletter-form') {
      openDialog('Bem-vindo à TechNova+', `<div class="info-content"><div class="success-icon">${icon('check')}</div><h3>Seu e-mail passou pela validação.</h3><p>${escapeHTML(data.get('email'))}</p><p>Este cadastro é demonstrativo. Nenhuma inscrição ou mensagem foi enviada a um serviço externo.</p></div>`, 'newsletter');
      form.reset();
    }
    if (form.id === 'account-form') {
      const name = String(data.get('name')).trim();
      if (name.length < 2) { toast('Informe um nome com pelo menos dois caracteres.'); return; }
      state.profile = { name: name.slice(0, 80), email: String(data.get('email')).trim().slice(0, 160) };
      saveStorage('profile.v1', state.profile);
      updateCounters();
      renderAccount();
    }
    if (form.id === 'checkout-form') {
      const total = C.totals(state.cart);
      const name = String(data.get('name')).trim();
      if (name.length < 2) { toast('Informe um nome com pelo menos dois caracteres.'); return; }
      if (!total.quantity) { renderCart(); return; }
      const random = window.crypto?.getRandomValues ? window.crypto.getRandomValues(new Uint32Array(1))[0].toString(36).slice(0, 5) : Math.random().toString(36).slice(2, 7);
      const order = { id: `TN-${Date.now().toString(36).toUpperCase()}-${random.toUpperCase()}`, date: new Date().toISOString(), total: total.total, quantity: total.quantity, payment: String(data.get('payment')), items: { ...state.cart } };
      state.orders = [order, ...state.orders].slice(0, 20);
      const saved = saveStorage('orders.v1', state.orders);
      state.cart = {};
      saveStorage('cart.v1', state.cart);
      updateCounters();
      openDialog('Pedido de teste criado', `<div class="info-content"><div class="success-icon">${icon('check')}</div><h3 style="text-align:center">Tudo pronto para sua simulação!</h3><p class="order-number">${order.id}</p><p class="summary-line"><span>Total ilustrativo</span><b>${C.money(order.total)}</b></p><p>${saved ? 'O pedido ficou salvo neste navegador.' : 'O pedido está disponível nesta página, mas o navegador não permitiu salvá-lo.'} Você pode consultar esse código em “Acompanhar pedido”.</p><p class="demo-note">Nenhum pagamento foi processado, dado foi enviado ou produto será entregue.</p><button class="button dark-button" type="button" data-action="track">Consultar pedido ${icon('arrow')}</button></div>`, 'confirmation');
    }
    if (form.id === 'tracking-form') {
      const requested = String(data.get('order')).trim().toUpperCase();
      const order = state.orders.find(o => o.id === requested);
      const result = $('#tracking-result');
      if (!order) { result.innerHTML = '<p class="demo-note">Pedido não encontrado. Consulte o código de um pedido de teste criado neste navegador.</p>'; return; }
      const date = new Date(order.date);
      result.innerHTML = `<div class="info-content"><p class="order-number">${escapeHTML(order.id)}</p><p><b>Status:</b> simulação concluída</p><p><b>Total:</b> ${C.money(order.total)}</p><p><b>Criado em:</b> ${Number.isNaN(date.getTime()) ? 'Data indisponível' : escapeHTML(date.toLocaleString('pt-BR'))}</p><p class="demo-note">Esse pedido é de teste. Não há envio, cobrança ou acompanhamento logístico real.</p></div>`;
    }
  });

  const countdownStart = Date.now();
  const offerLength = (12 * 3600 + 36 * 60 + 18) * 1000;
  function updateCountdown() {
    const seconds = Math.max(0, Math.floor((countdownStart + offerLength - Date.now()) / 1000));
    $('#hours').textContent = String(Math.floor(seconds / 3600)).padStart(2, '0');
    $('#minutes').textContent = String(Math.floor(seconds / 60) % 60).padStart(2, '0');
    $('#seconds').textContent = String(seconds % 60).padStart(2, '0');
  }
  const params = new URLSearchParams(window.location.search);
  document.querySelectorAll('.category[data-filter]').forEach(button => {
    const category = button.dataset.filter;
    const label = button.lastElementChild;
    label.classList.add('category-label');
    label.innerHTML = `<span>${escapeHTML(C.categories[category])}</span><small class="category-count">${C.categoryCounts[category]} modelos</small>`;
    button.setAttribute('aria-label', `${C.categories[category]}: ${C.categoryCounts[category]} modelos`);
  });
  $('#catalog-sort').addEventListener('change', event => {
    state.sort = event.target.value;
    state.visibleLimit = 20;
    renderCatalog();
  });
  updateCounters();
  renderCatalog();
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
  if (params.get('q') || params.get('categoria')) selectCatalog({ query: params.get('q') || '', category: params.get('categoria') || 'all', mode: 'all' }, false);
  if (params.get('produto')) renderProduct(params.get('produto'));
  if (!canPersist) toast('O navegador não permitiu salvar. Seus dados ficam ativos nesta página.');
})();
