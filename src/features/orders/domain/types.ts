import type { User } from '../../auth/domain/types';
import type { Product } from '../../products/domain/types';
export interface OrderRequest { productId: string; size: number; city: string; message: string; consent: true }
export interface Order { id: string; userId: string; productId: string; size: number; city: string; message: string; unitPrice: number; status: string; createdAt: string; product: Pick<Product, 'id' | 'name' | 'image' | 'color'>; user: Pick<User, 'id' | 'name' | 'email'> }
