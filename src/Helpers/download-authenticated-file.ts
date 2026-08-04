/** @format */

import { authAxios } from "src/config/axios";
import { baseUrl } from "src/env/base-url";

const parseContentDispositionFilename = (disposition: string | null) => {
  if (!disposition) return null;

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;\n]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1].trim());
  }

  const asciiMatch = disposition.match(/filename=([^;\n]+)/i);
  if (asciiMatch?.[1]) {
    return asciiMatch[1].replace(/['"]/g, "").trim();
  }

  return null;
};

const isCsvPayload = (buffer: ArrayBuffer, contentType: string) => {
  if (contentType.includes("csv")) {
    return true;
  }

  const bytes = new Uint8Array(buffer.slice(0, 4));
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) {
    return false;
  }

  const preview = new TextDecoder()
    .decode(buffer.slice(0, Math.min(500, buffer.byteLength)))
    .trimStart();

  return preview.includes(",") && !preview.startsWith("{");
};

const resolveDownloadFilename = (
  disposition: string | null,
  defaultFilename: string,
  buffer: ArrayBuffer,
  contentType: string,
  forceExtension?: string
) => {
  const rawFilename =
    parseContentDispositionFilename(disposition) || defaultFilename;
  const extension = forceExtension || (isCsvPayload(buffer, contentType) ? "csv" : "");
  const baseName = rawFilename.replace(/\.[^/.]+$/, "").trim() || "activity-logs";

  if (extension) {
    return `${baseName}.${extension}`;
  }

  return rawFilename;
};

const extractErrorMessage = async (
  buffer: ArrayBuffer,
  contentType: string
) => {
  try {
    const text = new TextDecoder().decode(buffer);
    const payload = JSON.parse(text) as {
      errors?: string[];
      messages?: string[];
      title?: string;
      detail?: string;
    };

    return (
      payload.errors?.join(", ") ??
      payload.messages?.join(", ") ??
      payload.title ??
      payload.detail ??
      text
    );
  } catch {
    if (contentType.includes("text")) {
      return new TextDecoder().decode(buffer);
    }
    return "Download failed";
  }
};

const isInvalidDownloadPayload = (buffer: ArrayBuffer) => {
  if (buffer.byteLength === 0) {
    return "Export file is empty";
  }

  const preview = new TextDecoder()
    .decode(buffer.slice(0, Math.min(200, buffer.byteLength)))
    .trimStart();

  if (preview.startsWith("{") || preview.startsWith("[")) {
    return "Invalid export response";
  }

  if (preview.startsWith("<!DOCTYPE") || preview.startsWith("<html")) {
    return "Invalid export response";
  }

  return null;
};

const prepareCsvBlob = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  const hasBom =
    bytes.length >= 3 &&
    bytes[0] === 0xef &&
    bytes[1] === 0xbb &&
    bytes[2] === 0xbf;

  return new Blob(hasBom ? [buffer] : ["\ufeff", buffer], {
    type: "application/octet-stream",
  });
};

const triggerBrowserDownload = (blob: Blob, filename: string) => {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
};

export const downloadAuthenticatedFile = async ({
  path,
  params = {},
  defaultFilename,
  forceExtension,
}: {
  path: string;
  params?: Record<string, string | number>;
  defaultFilename: string;
  forceExtension?: string;
}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    const stringValue = String(value);
    if (stringValue === "undefined" || stringValue === "null") {
      return;
    }

    searchParams.append(key, stringValue);
  });

  const query = searchParams.toString();
  const url = `${baseUrl}/api${path}${query ? `?${query}` : ""}`;

  const headers: Record<string, string> = {
    Accept: "text/csv, application/octet-stream, */*",
  };

  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const language = authAxios.defaults.headers.common["Accept-Language"];
  if (language) {
    headers["Accept-Language"] = String(language);
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const buffer = await response.arrayBuffer();

  if (
    !response.ok ||
    contentType.includes("application/json") ||
    contentType.includes("application/problem+json")
  ) {
    throw new Error(
      await extractErrorMessage(buffer, contentType || "application/json")
    );
  }

  const invalidPayloadMessage = isInvalidDownloadPayload(buffer);
  if (invalidPayloadMessage) {
    throw new Error(await extractErrorMessage(buffer, "application/json"));
  }

  const filename = resolveDownloadFilename(
    response.headers.get("content-disposition"),
    defaultFilename,
    buffer,
    contentType,
    forceExtension
  );

  const blob = isCsvPayload(buffer, contentType)
    ? prepareCsvBlob(buffer)
    : new Blob([buffer], {
        type: contentType.split(";")[0] || "application/octet-stream",
      });

  triggerBrowserDownload(blob, filename);
};
