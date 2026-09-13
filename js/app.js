import { getCatalog } from './data.js';

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

renderProducts(catalog.products);
