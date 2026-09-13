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
