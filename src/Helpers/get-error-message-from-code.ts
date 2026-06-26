const errorCode: any = {
  error: 'networkError',
  '11000email': 'duplicate email',
  '11000username': 'duplicate username',
  '11000phoneNumber': 'duplicatePhoneNumber',
  '11000digitalId': 'duplicateID',
  '1000': "youDon'tHaveManagementToThisAccount",
  '1001': 'notSuperAdmin',
  '1002': 'oldPassword',
  '1003': 'canNotDeleteYourSelf',
  '2000': 'operatorNotFound',
  '4000': 'emailOrPasswordNotCorrect',
  '4001': 'userWithoutType',
  '4002': 'missingData',
  '4003': 'userWithoutRole',
  '4004': 'wrongUser ',
  '6001': 'university used by student',
  '11000name': 'duplicate name',
  '11002': 'Section has category',
  '110010': 'section has product',
  '50007': 'access token expired',
  '50005': 'access token expired',
  '10002': 'specialty used by doctor',
  '13001': 'company used in product',
  '110011': 'subcategory has offer',
};

export const getErrorMessageFromCode = (code: number | string) => {
  // const message: string = errorCode[code];
  // return message ? message : errorCode["error"];
  return code;
};
