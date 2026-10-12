/** @format */

import { IPromoBank } from "src/types/modules/clientsManagement/discounts/banks";

/**
 * Fallback bank list for Promo Codes UI until that screen also uses Banks API.
 * Banks CRUD now uses the live API.
 */
export let MOCK_PROMO_BANKS: IPromoBank[] = [
  {
    id: "bank-emirates-nbd",
    nameEn: "Emirates NBD",
    nameAr: "بنك الإمارات دبي الوطني",
    cardBinPrefixes: ["4030", "4213"],
    code: "ENBD",
    logoUrl: null,
    isActive: true,
    createdOn: "2026-07-01T10:00:00Z",
    lastModifiedOn: "2026-07-01T10:00:00Z",
    createdByName: "Admin",
    lastModifiedByName: "Admin",
  },
  {
    id: "bank-mashreq",
    nameEn: "Mashreq",
    nameAr: "المشرق",
    cardBinPrefixes: ["5210"],
    code: "MASHREQ",
    logoUrl: null,
    isActive: true,
    createdOn: "2026-07-01T10:00:00Z",
    lastModifiedOn: "2026-07-01T10:00:00Z",
    createdByName: "Admin",
    lastModifiedByName: "Admin",
  },
  {
    id: "bank-adcb",
    nameEn: "ADCB",
    nameAr: "بنك أبوظبي التجاري",
    cardBinPrefixes: ["4550"],
    code: "ADCB",
    logoUrl: null,
    isActive: true,
    createdOn: "2026-07-02T10:00:00Z",
    lastModifiedOn: "2026-07-02T10:00:00Z",
    createdByName: "Admin",
    lastModifiedByName: "Admin",
  },
  {
    id: "bank-fab",
    nameEn: "FAB",
    nameAr: "بنك أبوظبي الأول",
    cardBinPrefixes: ["4405"],
    code: "FAB",
    logoUrl: null,
    isActive: true,
    createdOn: "2026-07-02T10:00:00Z",
    lastModifiedOn: "2026-07-02T10:00:00Z",
    createdByName: "Admin",
    lastModifiedByName: "Admin",
  },
];

export const getActivePromoBanks = () =>
  MOCK_PROMO_BANKS.filter((bank) => bank.isActive);

export const getBankNames = (bankIds: string[], locale = "en-US") =>
  bankIds
    .map((id) => MOCK_PROMO_BANKS.find((b) => b.id === id))
    .filter(Boolean)
    .map((b) => (locale === "en-US" ? b!.nameEn : b!.nameAr))
    .join(", ") || "—";

export const upsertMockPromoBank = (item: IPromoBank) => {
  const index = MOCK_PROMO_BANKS.findIndex((row) => row.id === item.id);
  if (index >= 0) {
    MOCK_PROMO_BANKS[index] = item;
  } else {
    MOCK_PROMO_BANKS = [item, ...MOCK_PROMO_BANKS];
  }
};

export const removeMockPromoBank = (id: string) => {
  MOCK_PROMO_BANKS = MOCK_PROMO_BANKS.filter((row) => row.id !== id);
};
