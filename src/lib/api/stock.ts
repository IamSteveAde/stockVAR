import { apiFetchFirstSuccess } from "./client";
import { unwrapData, PaginationMeta, type ApiEnvelope } from "./response";

export type ProductRecord = {
    uid: string;
    sku: string;
    name: string;
    unit: string;
    status?: "active" | "archived";
    inventoryUid?: string;
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
    quantity: number;
    inventoryUid: string;
    action: string;
    shiftUid: string;
};

const STOCK_PATHS = {
    createProduct: ["api/stock/product/create"],
    updateProduct: ["api/stock/product/update"],
    updateProductStatus: ["api/stock/product/status/update"],
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

export async function updateProduct(payload: { uid: string; name: string; unit: string }, token: string) {
    const res = await apiFetchFirstSuccess<any>(
        STOCK_PATHS.updateProduct,
        {
            method: "PUT",
            body: payload,
            token,
        }
    );
    return res;
}

export async function updateProductStatus(payload: { uid: string; status: "Archived" | "Active" }, token: string) {
    const res = await apiFetchFirstSuccess<any>(
        STOCK_PATHS.updateProductStatus,
        {
            method: "POST",
            body: payload,
            token,
        }
    );
    return res;
}

export async function listProducts(token: string, page = 1, limit = 10, search?: string) {
    const paths = STOCK_PATHS.listProducts.map(p => `${p}?page=${page}&limit=${limit}${search ? `&text=${encodeURIComponent(search)}` : ""}`);
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
