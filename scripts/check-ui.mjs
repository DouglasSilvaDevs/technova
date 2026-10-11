/* Teste das interações em um DOM mínimo simulado; não verifica layout visual. */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const C = createRequire(import.meta.url)(resolve(root, 'js/catalog.js'));
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const app = await readFile(resolve(root, 'js/app.js'), 'utf8');
const listeners = new Map();
let activeElement = null;

class Element {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.innerHTML = ''; this.textContent = ''; this.value = ''; this.hidden = false;
    this.open = false; this.isConnected = true; this.handlers = new Map(); this.attrs = new Map();
    const classes = new Set();
    this.classList = {
      add: (...names) => names.forEach(name => classes.add(name)),
      remove: (...names) => names.forEach(name => classes.delete(name)),
      toggle: (name, force) => { const on = force ?? !classes.has(name); on ? classes.add(name) : classes.delete(name); return on; }
    };
  }
  addEventListener(name, fn) { this.handlers.set(name, fn); }
  setAttribute(name, value) { this.attrs.set(name, String(value)); }
  removeAttribute(name) { this.attrs.delete(name); }
  focus() { activeElement = this; }
  closest(selector) { return selector === 'button' ? this : null; }
  scrollIntoView() {}
  showModal() { this.open = true; }
  close() { this.open = false; this.handlers.get('close')?.(); }
  querySelectorAll(selector) {
    if (selector === '.product-image-button') return [...this.innerHTML.matchAll(/class="product-image-button"[^>]*data-product="([^"]+)"/g)].map(match => new Element({ product: match[1] }));
    return [];
  }
  querySelector() { return null; }
}

const elements = new Map([...html.matchAll(/\bid="([^"]+)"/g)].map(match => [match[1], new Element()]));
const account = new Element(); const recommended = new Element(); const promotions = new Element();
const cartCounter = new Element(); const favoritesCounter = new Element();
const categoryButtons = Object.keys(C.categories).filter(key => key !== 'all').map(key => {
  const element = new Element({ filter: key }); element.lastElementChild = new Element(); return element;
});
const document = {
  get activeElement() { return activeElement; },
  addEventListener: (name, fn) => listeners.set(name, fn),
  querySelector(selector) {
    if (selector.startsWith('#')) { const found = elements.get(selector.slice(1)); assert.ok(found, `Elemento ${selector} existe no HTML`); return found; }
    return ({ '.account-action > span': account, '.recommended-section': recommended, '.promotions': promotions })[selector] ?? null;
  },
  querySelectorAll(selector) {
    return ({ '.cart-count': [cartCounter], '.favorites-count': [favoritesCounter], '.category[data-filter]': categoryButtons, '[data-filter]': categoryButtons })[selector] ?? [];
  }
};
const stored = new Map([['technova.cart.v1', JSON.stringify({ watch: 1, phone: 1 })]]);
const localStorage = { getItem: key => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value), removeItem: key => stored.delete(key) };
const window = { TechNovaCatalog: C, location: { search: '' }, matchMedia: () => ({ matches: true }), setTimeout: () => 1, clearTimeout() {}, setInterval() {} };
vm.runInNewContext(app, { window, document, localStorage, URLSearchParams, FormData }, { filename: 'app.js' });
const el = id => elements.get(id);
const click = dataset => listeners.get('click')({ target: new Element(dataset) });
const cards = id => [...el(id).innerHTML.matchAll(/data-product-id="([^"]+)"/g)].map(match => match[1]);

assert.equal(cartCounter.textContent, 2, 'Carrinho anterior preservado');
assert.equal(cards('trending-grid').length, 5);
assert.equal(cards('recommended-grid').length, 5);
assert.ok(categoryButtons.every(button => button.lastElementChild.innerHTML.includes('10 modelos')));
for (const category of Object.keys(C.categories).filter(key => key !== 'all')) {
  click({ filter: category });
  assert.deepEqual(cards('trending-grid'), C.filterProducts({ category, mode: 'all' }).map(p => p.id), `Dez cartões acessíveis em ${category}`);
  const imagePaths = [...el('trending-grid').innerHTML.matchAll(/<img src="assets\/images\/([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(imagePaths).size, 10, `Dez imagens diferentes nos cartões de ${category}`);
  assert.equal(el('catalog-more').hidden, true);
}

for (const product of C.products) {
  click({ product: product.id });
  assert.equal(el('dialog-title').textContent, product.name);
  assert.ok(el('dialog-content').innerHTML.includes(`src="assets/images/${product.image}"`), `Imagem própria nos detalhes de ${product.id}`);
}

click({ action: 'view-all' });
assert.equal(cards('trending-grid').length, 20);
for (const count of [40, 60, 80]) { click({ action: 'load-more' }); assert.equal(cards('trending-grid').length, count); }
assert.equal(new Set(cards('trending-grid')).size, 80, 'Todos os modelos sem repetição');
assert.equal(el('catalog-more').hidden, true);
assert.equal(el('catalog-progress').textContent, 'Exibindo 80 de 80 produtos');

el('catalog-sort').handlers.get('change')({ target: { value: 'price-desc' } });
assert.equal(cards('trending-grid').length, 20, 'Ordenar reinicia a quantidade visível');
assert.deepEqual(cards('trending-grid'), C.filterProducts({ mode: 'all', sort: 'price-desc' }).slice(0, 20).map(p => p.id));
el('search-input').value = 'GPS';
el('search-form').handlers.get('submit')({ preventDefault() {} });
assert.deepEqual(new Set(cards('trending-grid')), new Set(['fitnova-ultra', 'fitnova-trek']));

click({ product: 'fitnova-kids' });
assert.equal(el('dialog-title').textContent, 'FitNova Kids');
assert.ok(el('dialog-content').innerHTML.includes('watch-kids-blue-hd.png'));
click({ action: 'add-detail' });
assert.equal(JSON.parse(stored.get('technova.cart.v1'))['fitnova-kids'], 1);
assert.equal(cartCounter.textContent, 3);
click({ favorite: 'fitnova-kids' });
assert.ok(JSON.parse(stored.get('technova.favorites.v1')).includes('fitnova-kids'));
click({ action: 'favorites' });
assert.ok(el('dialog-content').innerHTML.includes('data-product-id="fitnova-kids"'));
click({ action: 'cart' });
assert.ok(el('dialog-content').innerHTML.includes('FitNova Kids'));
el('clear-filter').handlers.get('click')();
assert.equal(cards('trending-grid').length, 5);
assert.equal(el('catalog-sort').value, 'relevance');
assert.equal(el('filter-bar').hidden, true);

console.log('DOM simulado: oito categorias, 80 cartões, carregamento, ordenação, busca, detalhes, carrinho e favoritos: OK.');
