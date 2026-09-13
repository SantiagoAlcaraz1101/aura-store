import { getCatalog } from './data.js';
import { filterProducts } from './store.js';

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
