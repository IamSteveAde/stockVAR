import { apiFetchFirstSuccess } from "./client";
import { unwrapData, type ApiEnvelope } from "./response";

export type ProductRecord = {
    id: string;
    sku: string;
    name: string;
    unit: string;
    status?: "active" | "archived";
    [key: string]: unknown;
};

export type InventoryRecord = {
    sku: string;
    quantity: number;
    updatedAt?: string;
    [key: string]: unknown;
};

export type CreateProductPayload = {
    name: string;
    unit: string;
};

export type PaginationMeta = {
    isFirstPage: boolean;
    isLastPage: boolean;
    currentPage: number;
    previousPage: number | null;
    nextPage: number | null;
    pageCount: number;
    totalCount: number;
};

export type ListProductsResponse = {
    products: ProductRecord[];
    meta: PaginationMeta;
};

export type AdjustInventoryPayload = {
    productUid: string;
    quantity: number;
    action: "add" | "reduce";
    note?: string;
};

export type AddEntryPayload = {
    shiftId?: string;
    sku: string;
    quantity: number;
    entryType: "stock-in" | "stock-out" | "waste" | "adjustment";
    note?: string;
    actorStaffId?: string;
    actorEmail?: string;
    actorRole?: "owner" | "manager" | "staff";
    requireStaffAuthorization?: boolean;
    authorizedRole?: "staff";
};

const STOCK_PATHS = {
    createProduct: ["api/stock/product/create"],
    listProducts: ["api/stock/product/list"],
    listInventory: ["api/stock/inventory/list"],
    adjustInventory: [
        "api/stock/inventory/adjust"
    ],
    addEntry: ["api/stock/logEntry"],
};

export async function createProduct(payload: CreateProductPayload, token: string) {
    const res = await apiFetchFirstSuccess<ApiEnvelope<ProductRecord> | ProductRecord>(
        STOCK_PATHS.createProduct,
        {
            method: "POST",
            body: payload,
            token,
        }
    );
    return unwrapData(res);
}

export async function listProducts(token: string, page = 1, limit = 10) {
    const paths = STOCK_PATHS.listProducts.map(p => `${p}?page=${page}&limit=${limit}`);
    const res = await apiFetchFirstSuccess<ApiEnvelope<ListProductsResponse> | ListProductsResponse>(
        paths,
        { token }
    );
    return unwrapData(res);
}

export async function listInventory(token: string, page = 1, limit = 10) {
    const paths = STOCK_PATHS.listInventory.map(p => `${p}?page=${page}&limit=${limit}`);
    const res = await apiFetchFirstSuccess<ApiEnvelope<ListProductsResponse> | ListProductsResponse>(
        paths,
        { token }
    );
    return unwrapData(res);
}

export async function adjustInventory(payload: AdjustInventoryPayload, token: string) {
    const res = await apiFetchFirstSuccess<ApiEnvelope<InventoryRecord> | InventoryRecord>(
        STOCK_PATHS.adjustInventory,
        {
            method: "POST",
            body: payload,
            token,
        }
    );
    return unwrapData(res);
}

export async function addEntry(payload: AddEntryPayload, token: string) {
    const res = await apiFetchFirstSuccess<ApiEnvelope<unknown> | unknown>(
        STOCK_PATHS.addEntry,
        {
            method: "POST",
            body: payload,
            token,
        }
    );
    return unwrapData(res);
}
