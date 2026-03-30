export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiErrorShape = {
  message: string;
  code?: string | number;
  errors?: unknown;
};

export class ApiError extends Error {
  status: number;
  data: ApiErrorShape | null;

  constructor(status: number, data: ApiErrorShape | null, message?: string) {
    super(message ?? data?.message ?? "Unexpected API error");
    this.status = status;
    this.data = data;
  }
}

export type RequestOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  token?: string | null;
};

function getBaseUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_API_BASE_URL environment variable. Please set it in your .env.local file."
    );
  }
  return apiUrl;
}

export async function apiFetch<TResponse>(
  path: string,
  options: RequestOptions = {}
): Promise<TResponse> {
  const baseUrl = getBaseUrl().replace(/\/+$/, "");
  const url = `${baseUrl}/${path.replace(/^\/+/, "")}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body:
      options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data,
      (data as ApiErrorShape | null)?.message
    );
  }

  return data as TResponse;
}

export async function apiFetchFirstSuccess<TResponse>(
  paths: string[],
  options: RequestOptions = {}
): Promise<TResponse> {
  if (!paths.length) {
    throw new Error("No API paths were provided.");
  }

  let lastError: unknown;

  for (const path of paths) {
    try {
      return await apiFetch<TResponse>(path, options);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 404 || error.status === 405) {
          lastError = error;
          continue;
        }
      }

      throw error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error("All API path attempts failed.");
}

