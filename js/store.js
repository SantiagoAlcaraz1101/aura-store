// Reglas puras: no dependen del DOM ni del almacenamiento del navegador.
const normalize = (text) => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export function filterProducts(products, brands, { category = 'all', brand = 'all', search = '', sort = 'featured' } = {}) {
  const query = normalize(search);
  const result = products.filter((product) => {
    const brandName = brands.find((item) => item.id === product.brandId)?.name ?? '';
    return (category === 'all' || product.categoryId === category)
      && (brand === 'all' || product.brandId === brand)
      && normalize(`${product.name} ${product.color} ${brandName}`).includes(query);
  });
  if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name, 'es'));
  return result;
}

export function stockFor(products, productId, size) {
  return products.find((product) => product.id === productId)?.sizes.find((item) => item.size === Number(size))?.stock ?? 0;
}

// localStorage es entrada no confiable: descartar IDs/tallas inválidos y limitar cantidades.
export function normalizeBag(value, products) {
  if (!Array.isArray(value)) return [];
  const result = [];
  for (const item of value) {
    if (!item || typeof item !== 'object' || !Number.isInteger(item.quantity) || item.quantity < 1) continue;
    const stock = stockFor(products, item.productId, item.size);
    if (!stock) continue;
    const size = Number(item.size);
    const existing = result.find((line) => line.productId === item.productId && line.size === size);
    if (existing) existing.quantity = Math.min(stock, existing.quantity + item.quantity);
    else result.push({ productId: item.productId, size, quantity: Math.min(stock, item.quantity) });
  }
  return result;
}

export function changeBag(bag, products, productId, size, delta) {
  const stock = stockFor(products, productId, size);
  if (!stock || !Number.isInteger(delta)) return { bag, error: 'Elige una talla disponible.' };
  const current = bag.find((item) => item.productId === productId && item.size === Number(size));
  const quantity = (current?.quantity ?? 0) + delta;
  if (quantity > stock) return { bag, error: `Solo hay ${stock} ${stock === 1 ? 'par disponible' : 'pares disponibles'} en esta talla.` };
  const next = bag.filter((item) => item !== current);
  if (quantity > 0) next.push({ productId, size: Number(size), quantity });
  return { bag: next, error: '' };
}

export function bagTotal(bag, products) {
  return bag.reduce((total, item) => total + (products.find((product) => product.id === item.productId)?.price ?? 0) * item.quantity, 0);
}

export function validateRequest(values, products) {
  const errors = {};
  const name = String(values.name ?? '').trim();
  const email = String(values.email ?? '').trim();
  const city = String(values.city ?? '').trim();
  const message = String(values.message ?? '').trim();
  if (name.length < 3 || name.length > 80) errors.name = 'Escribe un nombre de entre 3 y 80 caracteres.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) errors.email = 'Escribe un correo válido, por ejemplo nombre@correo.com.';
  if (city.length < 3 || city.length > 80) errors.city = 'Escribe tu ciudad con entre 3 y 80 caracteres.';
  const product = products.find((item) => item.id === values.productId);
  if (!product) errors.productId = 'Selecciona un modelo del catálogo.';
  if (!values.size || !stockFor(products, values.productId, values.size)) errors.size = 'Selecciona una talla disponible para este modelo.';
  if (message.length < 20 || message.length > 600) errors.message = 'Cuéntanos un poco más: escribe entre 20 y 600 caracteres.';
  if (values.consent !== true) errors.consent = 'Confirma que entiendes que esta solicitud es una simulación.';
  return errors;
}
