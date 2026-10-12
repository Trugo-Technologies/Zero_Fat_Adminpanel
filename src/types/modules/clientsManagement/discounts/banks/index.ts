/** @format */

import type {
  IBaseResponseDetailsDto,
  IBaseResponseListDto,
} from "src/types/baseEntity";

export interface IPromoBank {
  id: string;
  nameEn: string;
  nameAr: string;
  cardBinPrefixes: string[];
  logoUrl?: string | null;
  isActive: boolean;
  createdOn?: string;
  lastModifiedOn?: string;
  createdByName?: string;
  lastModifiedByName?: string;
  /** Legacy mock field — prefer cardBinPrefixes */
  code?: string;
}

export interface IPromoBankFormValues {
  nameEn: string;
  nameAr: string;
  cardBinPrefixes: string[];
  logo: string | File | null;
  logoUrl: string;
  isActive: boolean;
}

export interface IPromoBanksListDto extends IBaseResponseListDto<IPromoBank> {}
export interface IPromoBankDetailsDto
  extends IBaseResponseDetailsDto<IPromoBank> {}

export const buildBankFormData = (
  values: IPromoBankFormValues,
  options?: { id?: string }
): FormData => {
  const formData = new FormData();
  if (options?.id) {
    formData.append("Id", options.id);
  }
  formData.append("NameEn", values.nameEn.trim());
  formData.append("NameAr", values.nameAr.trim());
  formData.append("IsActive", String(!!values.isActive));

  const prefixes = (values.cardBinPrefixes || [])
    .map((p) => p.trim())
    .filter(Boolean);
  prefixes.forEach((prefix) => {
    formData.append("CardBinPrefixes", prefix);
  });

  if (values.logo instanceof File) {
    formData.append("Logo", values.logo);
  }

  return formData;
};
