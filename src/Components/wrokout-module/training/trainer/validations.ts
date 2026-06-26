import { MessageFormatElement } from 'react-intl';
import * as yup from 'yup';

const createValidationSchemas = (messages: Record<string, string> | Record<string, MessageFormatElement[]>) => {
  const validationSchemaStep1 = yup.object({
    nameEn: yup.string().required(String(messages['validation.required'])),
    nameAr: yup.string().required(String(messages['validation.required'])),
    type: yup.string().required(String(messages['validation.required'])),
    avatarImage: yup.string().required(String(messages['validation.required'])),
    specialisesIn: yup.array().min(1, String(messages['validation.required'])).required(String(messages['validation.required'])).typeError(String(messages['validation.required'])),
    profileMedia: yup.string().required(String(messages['validation.required'])),
  });

  const validationSchemaStep2 = yup.object({
    descriptionAr: yup.string().required(String(messages['validation.required'])),
    descriptionEn: yup.string().required(String(messages['validation.required'])),
    briefAr: yup.string().required(String(messages['validation.required'])),
    briefEn: yup.string().required(String(messages['validation.required'])),
  });
  const validationSchemaStep3 = yup.object({});

  return [validationSchemaStep1, validationSchemaStep2, validationSchemaStep3];
};

export default createValidationSchemas;
