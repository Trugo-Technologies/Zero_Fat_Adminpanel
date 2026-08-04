/** @format */

import { useEffect, useState } from "react";
import { getApiErrorMessage } from "src/Helpers/get-api-error-message";
import { IDeliveryCalendarActionPreview } from "src/types/modules/clientsManagement/clientAccountAccess";

type PreviewMutation<TData extends Record<string, unknown>> = (args: {
  clientId: string;
  data: TData;
}) => {
  unwrap: () => Promise<{ data?: IDeliveryCalendarActionPreview | null }>;
};

type Options<TData extends Record<string, unknown>> = {
  enabled: boolean;
  clientId?: string | null;
  data?: TData | null;
  previewMutation: PreviewMutation<TData>;
  debounceMs?: number;
};

export const useDeliveryActionPreview = <TData extends Record<string, unknown>>({
  enabled,
  clientId,
  data,
  previewMutation,
  debounceMs = 450,
}: Options<TData>) => {
  const [preview, setPreview] = useState<IDeliveryCalendarActionPreview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const serializedData = data ? JSON.stringify(data) : null;

  useEffect(() => {
    if (!enabled || !clientId || !serializedData) {
      setPreview(null);
      setPreviewError(null);
      setIsPreviewLoading(false);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsPreviewLoading(true);
      setPreviewError(null);

      try {
        const result = await previewMutation({
          clientId,
          data: JSON.parse(serializedData) as TData,
        }).unwrap();

        if (!cancelled) {
          setPreview(result?.data ?? null);
        }
      } catch (error) {
        if (!cancelled) {
          setPreview(null);
          setPreviewError(getApiErrorMessage(error));
        }
      } finally {
        if (!cancelled) {
          setIsPreviewLoading(false);
        }
      }
    }, debounceMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [enabled, clientId, serializedData, previewMutation, debounceMs]);

  return { preview, previewError, isPreviewLoading };
};
