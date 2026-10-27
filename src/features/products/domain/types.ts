export interface Brand { id: string; name: string }
export interface Category extends Brand { description: string }
export interface SizeStock { size: number; stock: number }
export interface ProductInput { name: string; brandId: string; categoryId: string; description: string; color: string; price: number; sku: string; image: string; alt: string; tag: string; sizes: SizeStock[] }
export interface Product extends ProductInput { id: string; brand: Brand; category: Category }
export interface CatalogOptions { brands: Brand[]; categories: Category[] }
export interface BagLine { productId: string; size: number; quantity: number }
