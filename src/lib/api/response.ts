export type ApiEnvelope<TData> = {
  status?: string;
  message?: string;
  data?: TData;
};

export function unwrapData<TData>(payload: ApiEnvelope<TData> | TData): TData {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in (payload as Record<string, unknown>)
  ) {
    return (payload as ApiEnvelope<TData>).data as TData;
  }

  return payload as TData;
}
