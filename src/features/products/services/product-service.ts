import { http } from '../../common/http';
import type { Page } from '../../common/types';
import type { CatalogOptions, Product, ProductInput } from '../domain/types';
export const getProducts = (query: string, signal?: AbortSignal) => http<Page<Product>>(`/api/products?${query}`, { signal });
export const getProduct = (id: string) => http<Product>(`/api/products/${encodeURIComponent(id)}`);
export const getCatalogOptions = () => http<CatalogOptions>('/api/catalog-options');
export const createProduct = (input: ProductInput) => http<Product>('/api/products', { method: 'POST', body: JSON.stringify(input) });
export const updateProduct = (id: string, input: ProductInput) => http<Product>(`/api/products/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(input) });
export const deleteProduct = (id: string) => http<void>(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
