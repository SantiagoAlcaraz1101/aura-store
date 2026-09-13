import { getCatalog } from './data.js';
import { filterProducts, normalizeBag, changeBag, bagTotal, stockFor } from './store.js';

const $ = (selector) => document.querySelector(selector);
const money = (amount) => new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 0,
}).format(amount);

// Escapar datos permite conservar plantillas legibles sin interpretar texto como HTML.
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

const catalog = await getCatalog();
const brandName = (id) => catalog.brands.find((brand) => brand.id === id)?.name ?? '';
const categoryName = (id) => catalog.categories.find((category) => category.id === id)?.name ?? '';

function renderProducts(products) {
  $('#product-grid').innerHTML = products.map((product) => `
    <article class="product-card">
      <button class="product-image-button" type="button" data-product="${product.id}" aria-label="Ver ${escapeHTML(brandName(product.brandId))} ${escapeHTML(product.name)} y elegir talla">
        <span class="product-badge ${product.tag === 'AURA PICK' ? 'highlight' : ''}">${escapeHTML(product.tag)}</span>
        <img src="${product.image}" alt="${escapeHTML(product.alt)}" width="700" height="500" loading="lazy" decoding="async">
        <span class="card-arrow" aria-hidden="true">↗</span>
      </button>
      <div class="product-meta">
        <p class="product-brand">${escapeHTML(brandName(product.brandId))} · ${escapeHTML(categoryName(product.categoryId))}</p>
        <div class="product-title-row"><h3><button type="button" data-product="${product.id}">${escapeHTML(product.name)}</button></h3><p class="product-price">${money(product.price)}</p></div>
        <p class="product-color">${escapeHTML(product.color)}</p>
        <div class="product-bottom"><span>${product.sizes.filter((item) => item.stock > 0).length} tallas disponibles · EU</span><button type="button" data-product="${product.id}" aria-label="Elegir talla de ${escapeHTML(product.name)}">Elegir talla +</button></div>
      </div>
    </article>`).join('');
  $('#result-count').textContent = `${products.length} ${products.length === 1 ? 'par' : 'pares'} en la selección`;
  $('#empty-state').hidden = products.length > 0;
}

const filters = { category: 'all', brand: 'all', search: '', sort: 'featured' };

function updateCatalog() {
  renderProducts(filterProducts(catalog.products, catalog.brands, filters));
  document.querySelectorAll('[data-category]').forEach((button) => {
    const active = button.dataset.category === filters.category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function resetFilters() {
  Object.assign(filters, { category: 'all', brand: 'all', search: '', sort: 'featured' });
  $('#search').value = '';
  $('#brand-filter').value = 'all';
  $('#sort').value = 'featured';
  updateCatalog();
}

$('#category-filters').insertAdjacentHTML('beforeend', catalog.categories.map((category) =>
  `<button class="chip" type="button" data-category="${category.id}" aria-pressed="false">${escapeHTML(category.name)}</button>`).join(''));
$('#brand-filter').insertAdjacentHTML('beforeend', catalog.brands.map((brand) =>
  `<option value="${brand.id}">${escapeHTML(brand.name)}</option>`).join(''));

$('#category-filters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  filters.category = button.dataset.category;
  updateCatalog();
});
$('#search').addEventListener('input', (event) => { filters.search = event.target.value; updateCatalog(); });
$('#brand-filter').addEventListener('change', (event) => { filters.brand = event.target.value; updateCatalog(); });
$('#sort').addEventListener('change', (event) => { filters.sort = event.target.value; updateCatalog(); });
$('#reset-filters').addEventListener('click', resetFilters);
$('#empty-reset').addEventListener('click', () => { resetFilters(); $('#search').focus(); });

function setMenu(open) {
  $('#main-nav').classList.toggle('is-open', open);
  $('#menu-toggle').setAttribute('aria-expanded', String(open));
  $('#menu-toggle').setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
$('#menu-toggle').addEventListener('click', () => setMenu($('#menu-toggle').getAttribute('aria-expanded') !== 'true'));
$('#main-nav').addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && $('#main-nav').classList.contains('is-open')) {
    setMenu(false);
    $('#menu-toggle').focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) setMenu(false);
});
window.matchMedia('(min-width: 621px)').addEventListener('change', (event) => { if (event.matches) setMenu(false); });

updateCatalog();

// Persistir solo preferencias y referencias de productos, nunca datos del formulario.
function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function saveStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}

let bag = normalizeBag(readStorage('aura.bag.v1', []), catalog.products);
let activeProduct = null;
let selectedSize = null;
let toastTimer;

function notify(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3800);
}

function renderBag() {
  const count = bag.reduce((total, item) => total + item.quantity, 0);
  $('#bag-count').textContent = count;
  $('#bag-toggle').setAttribute('aria-label', `Abrir bolsa, ${count} ${count === 1 ? 'par' : 'pares'}`);
  $('#bag-items').innerHTML = bag.length ? bag.map((item) => {
    const product = catalog.products.find((product) => product.id === item.productId);
    return `<article class="bag-item" data-line="${item.productId}" data-size="${item.size}">
      <img src="${product.image}" alt="${escapeHTML(product.alt)}" width="95" height="95">
      <div><h3>${escapeHTML(brandName(product.brandId))} ${escapeHTML(product.name)}</h3><p>Talla EU ${item.size} · ${money(product.price)}</p>
      <div class="quantity-row"><button type="button" data-delta="-1" aria-label="Quitar un par de ${escapeHTML(product.name)}, talla ${item.size}">−</button><span aria-label="Cantidad">${item.quantity}</span><button type="button" data-delta="1" aria-label="Añadir un par de ${escapeHTML(product.name)}, talla ${item.size}" ${item.quantity >= stockFor(catalog.products, item.productId, item.size) ? 'disabled' : ''}>+</button><button type="button" class="remove-item" data-remove aria-label="Eliminar ${escapeHTML(product.name)}, talla ${item.size}">Eliminar</button></div></div>
    </article>`;
  }).join('') : '<div class="bag-empty"><h3>Hay espacio para tu próximo favorito.</h3><p>Explora la selección y añade un par en tu talla.</p><button type="button" class="button button-dark" data-close="bag-dialog">Seguir explorando ↗</button></div>';
  $('#bag-summary').innerHTML = bag.length ? `<p class="bag-total"><span>Subtotal</span><span>${money(bagTotal(bag, catalog.products))}</span></p><p class="bag-help">Valores simulados en COP. Puedes consultar un modelo por solicitud. No se realizan pagos ni envíos.</p><button id="bag-request" class="button button-dark" type="button">Consultar el primer par <span aria-hidden="true">↗</span></button>` : '';
}

function persistBag() {
  const saved = saveStorage('aura.bag.v1', bag);
  renderBag();
  if (!saved) notify('Tu bolsa funciona en esta sesión. El navegador no permitió guardarla.');
  return saved;
}

function openProduct(id) {
  activeProduct = catalog.products.find((product) => product.id === id);
  if (!activeProduct) return;
  selectedSize = null;
  const product = activeProduct;
  $('#product-detail').innerHTML = `<div class="detail-layout"><div class="detail-image"><img src="${product.image}" alt="${escapeHTML(product.alt)}" width="700" height="500"></div><div class="detail-copy">
    <p class="eyebrow">${escapeHTML(brandName(product.brandId))} · ${escapeHTML(product.tag)}</p><h2 id="detail-title">${escapeHTML(product.name)}</h2><p>${escapeHTML(product.color)} · Ref. ${product.sku}</p><p>${escapeHTML(product.description)}</p><p class="detail-price">${money(product.price)} <small>COP</small></p>
    <fieldset class="size-options"><legend>Elige tu talla (EU)</legend><div class="size-grid">${product.sizes.map((item) => `<button class="size-button" type="button" data-size-choice="${item.size}" aria-pressed="false" aria-label="Talla ${item.size}${!item.stock ? ', agotada' : ''}" ${!item.stock ? 'disabled' : ''}>${item.size}</button>`).join('')}</div></fieldset>
    <p id="detail-stock" class="field-hint">Disponibilidad de demostración. Las tallas tachadas están agotadas.</p><p id="detail-error" class="field-error detail-error" role="status"></p>
    <button id="add-to-bag" class="button button-dark" type="button">Añadir a la bolsa <span aria-hidden="true">+</span></button>
  </div></div>`;
  $('#product-dialog').showModal();
}

$('#product-grid').addEventListener('click', (event) => {
  const button = event.target.closest('[data-product]');
  if (button) openProduct(button.dataset.product);
});
$('#product-detail').addEventListener('click', (event) => {
  const sizeButton = event.target.closest('[data-size-choice]');
  if (sizeButton) {
    selectedSize = Number(sizeButton.dataset.sizeChoice);
    document.querySelectorAll('[data-size-choice]').forEach((button) => button.setAttribute('aria-pressed', String(button === sizeButton)));
    $('#detail-error').textContent = '';
    const stock = stockFor(catalog.products, activeProduct.id, selectedSize);
    $('#detail-stock').textContent = `${stock} ${stock === 1 ? 'par disponible' : 'pares disponibles'} en talla EU ${selectedSize}. Inventario simulado.`;
  }
  if (event.target.closest('#add-to-bag')) {
    const result = changeBag(bag, catalog.products, activeProduct.id, selectedSize, 1);
    if (result.error) { $('#detail-error').textContent = result.error; return; }
    bag = result.bag;
    const saved = persistBag();
    $('#product-dialog').close();
    if (saved) notify(`${activeProduct.name}, talla ${selectedSize}, añadido a tu bolsa.`);
  }
});
$('#bag-toggle').addEventListener('click', () => { renderBag(); $('#bag-dialog').showModal(); });
document.addEventListener('click', (event) => {
  const closeButton = event.target.closest('[data-close]');
  if (closeButton) document.getElementById(closeButton.dataset.close).close();
});
document.querySelectorAll('dialog').forEach((dialog) => dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
}));
$('#bag-items').addEventListener('click', (event) => {
  const button = event.target.closest('[data-delta], [data-remove]');
  if (!button) return;
  const line = button.closest('[data-line]');
  const productId = line.dataset.line;
  const size = Number(line.dataset.size);
  if (button.hasAttribute('data-remove')) bag = bag.filter((item) => !(item.productId === productId && item.size === size));
  else {
    const result = changeBag(bag, catalog.products, productId, size, Number(button.dataset.delta));
    if (result.error) { notify(result.error); return; }
    bag = result.bag;
  }
  persistBag();
  const remaining = [...document.querySelectorAll('#bag-items [data-line]')].find((item) => item.dataset.line === productId && Number(item.dataset.size) === size);
  const nextFocus = remaining?.querySelector(`[data-delta="${button.dataset.delta}"]:not(:disabled)`) || remaining?.querySelector('button') || $('#bag-dialog [data-close]');
  nextFocus.focus();
});
renderBag();
