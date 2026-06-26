import defaultConfig from "src/@crema/constants/defaultConfig";
import { LanguageProps } from "src/@crema/types/models/Apps";

let currentLanguage: LanguageProps = (JSON.parse(
  localStorage.getItem("lan") as string
) as LanguageProps) || {
  languageId: "english",
  locale: "en",
  name: "English",
};

export const getCurrentLanguage = () => {
  if (currentLanguage) {
    let language: LanguageProps = {
      languageId: currentLanguage?.languageId,
      locale: currentLanguage?.locale,
      name: currentLanguage?.name,
    };
    return language;
  }
  return defaultConfig.locale;
};

export const getValueBasedOnCurrentLanguage = (
  nameAr: string,
  nameEn: string
) => {
  if (
    currentLanguage &&
    typeof currentLanguage === "object" &&
    currentLanguage?.locale === "en"
  ) {
    return nameEn;
  } else if (
    currentLanguage &&
    typeof currentLanguage === "object" &&
    currentLanguage?.locale === "ar"
  )
    return nameAr;
  return "";
};

export const removeHTMLTags = (text: string) => {
  return text.replace(/<\/?[^>]+(>|$)/g, "");
};

export const initialDataGridState = {
  columns: {
    columnVisibilityModel: {
      createdByName: false, // Set to false to hide the column
      createdOn: false,
      lastModifiedByName: false,
      lastModifiedOn: false,
    },
  },
};
