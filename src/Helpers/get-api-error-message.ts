/** @format */

import { IErrorResponse } from "src/types/baseEntity";

const pickMessageFromData = (data?: Partial<IErrorResponse> | null) => {
  if (!data) return "";

  const errors = data.errors
    ?.filter((item): item is string => Boolean(item?.trim()))
    .join(", ");
  if (errors) return errors;

  const messages = data.messages
    ?.filter((item): item is string => Boolean(item?.trim()))
    .join(", ");
  if (messages) return messages;

  if (data.title?.trim()) return data.title.trim();

  const detail = (data as { detail?: string }).detail?.trim();
  if (detail) return detail;

  return "";
};

const extractFromAxiosLikeError = (error: unknown): string => {
  if (!error || typeof error !== "object") return "";

  const candidate = error as {
    isAxiosError?: boolean;
    response?: { data?: Partial<IErrorResponse> };
    data?: Partial<IErrorResponse>;
    message?: string;
  };

  const responseData = candidate.response?.data ?? candidate.data;
  const messageFromData = pickMessageFromData(responseData);
  if (messageFromData) return messageFromData;

  if (candidate.message?.trim() && candidate.message !== "Request failed with status code 400") {
    return candidate.message.trim();
  }

  return "";
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string => {
  if (!error) return fallback;

  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }

  if (error instanceof Error) {
    const fromAxios = extractFromAxiosLikeError(error);
    if (fromAxios) return fromAxios;
    if (error.message.trim()) return error.message.trim();
  }

  const directMessage = extractFromAxiosLikeError(error);
  if (directMessage) return directMessage;

  const wrappedError = (error as { error?: unknown }).error;
  if (wrappedError) {
    const nestedMessage = extractFromAxiosLikeError(wrappedError);
    if (nestedMessage) return nestedMessage;
  }

  return fallback;
};
