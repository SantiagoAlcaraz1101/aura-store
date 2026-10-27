import { http } from '../../common/http';
import type { Page } from '../../common/types';
import type { Order, OrderRequest } from '../domain/types';
export const createOrder = (input: OrderRequest) => http<Order>('/api/orders', { method: 'POST', body: JSON.stringify(input) });
export const getOrders = (page: number, all = false, signal?: AbortSignal) => http<Page<Order>>(`/api/orders${all ? '' : '/mias'}?page=${page}&limit=10`, { signal });
