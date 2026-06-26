export enum privilegeKeys {
  //all
  all = "all",
  //role management
  createRole = "createRole",
  viewRole = "viewRole",
  updateRole = "updateRole",
  deleteRole = "deleteRole",
  //operator management
  createOperator = "createOperator",
  viewOperator = "viewOperator",
  updateOperator = "updateOperator",
  deleteOperator = "deleteOperator",
  ///Registration Request Management
  updateRegistrationRequestManagement = "updateRegistrationRequestManagement",
  viewRegistrationRequestManagement = "viewRegistrationRequestManagement",

  // university
  createUniversity = "createUniversity",
  viewUniversity = "viewUniversity",
  updateUniversity = "updateUniversity",
  deleteUniversity = "deleteUniversity",

  //specialty
  createSpecialty = "createSpecialty",
  viewSpecialty = "viewSpecialty",
  updateSpecialty = "updateSpecialty",
  deleteSpecialty = "deleteSpecialty",

  // doctors
  viewDoctor = "viewDoctor",
  updateDoctor = "updateDoctor",

  // student
  viewStudent = "viewStudent",
  updateStudent = "updateStudent",

  // patient
  viewPatient = "viewPatient",
  updatePatient = "updatePatient",

  //product
  createProduct = "createProduct",
  viewProduct = "viewProduct",
  updateProduct = "updateProduct",
  deleteProduct = "deleteProduct",

  //company
  createCompany = "createCompany",
  viewCompany = "viewCompany",
  updateCompany = "updateCompany",
  deleteCompany = "deleteCompany",
  // section & category
  createCategory = "createCategory",
  viewCategory = "viewCategory",
  updateCategory = "updateCategory",
  deleteCategory = "deleteCategory",
  // coupon
  createCoupon = "createCoupon",
  viewCoupon = "viewCoupon",
  updateCoupon = "updateCoupon",
  deleteCoupon = "deleteCoupon",
  // Maintenance
  viewMaintenance = "viewMaintenance",
  // Orders
  viewOrder = "viewOrder",
  updateOrder = "updateOrder",
  //offer
  createOffer = "createOffer",
  viewOffer = "viewOffer",
  updateOffer = "updateOffer",
  deleteOffer = "deleteOffer",
  //ads
  createAd = "createAd",
  viewAd = "viewAd",
  updateAd = "updateAd",
  deleteAd = "deleteAd",

  //content
  viewContent = "viewContent",
  updateContent = "updateContent",

  //city
  viewCity = "viewCity",
  createCity = "createCity",
  updateCity = "updateCity",
  deleteCity = "deleteCity",

  //deliveryCost
  viewDeliveryCost = "viewDeliveryCost",
  updateDeliveryCost = "updateDeliveryCost",

  //statistics
  viewStatistics = "viewStatistics",

  //profit
  viewProfit = "viewProfit",
  updateProfit = "updateProfit",
}

export const privilegesArray = [
  //role management
  "createRole",
  "viewRole",
  "updateRole",
  "deleteRole",
  //operator management
  "createOperator",
  "viewOperator",
  "updateOperator",
  "deleteOperator",
  ///Registration Request Management
  "updateRegistrationRequestManagement",
  "viewRegistrationRequestManagement",

  // university
  "createUniversity",
  "viewUniversity",
  "updateUniversity",
  "deleteUniversity",
  //specialty
  "createSpecialty",
  "viewSpecialty",
  "updateSpecialty",
  "deleteSpecialty",
  // doctors
  "viewDoctor",
  "updateDoctor",
  // student
  "viewStudent",
  "updateStudent",

  // patient
  "viewPatient",
  "updatePatient",

  //product
  "createProduct",
  "viewProduct",
  "updateProduct",
  "deleteProduct",
  //company
  "createCompany",
  "viewCompany",
  "updateCompany",
  "deleteCompany",
  // section & category
  "createCategory",
  "viewCategory",
  "updateCategory",
  "deleteCategory",
  // coupon
  "createCoupon",
  "viewCoupon",
  "updateCoupon",
  "deleteCoupon",
  // Maintenance
  "viewMaintenance",
  // Order
  "viewOrder",
  "updateOrder",
  //offer
  "createOffer",
  "viewOffer",
  "updateOffer",
  "deleteOffer",
  //ads
  "createAd",
  "viewAd",
  "updateAd",
  "deleteAd",

  ///content
  "viewContent",
  "updateContent",

  //city
  "viewCity",
  "createCity",
  "updateCity",
  "deleteCity",

  //deliveryCost
  "viewDeliveryCost",
  "updateDeliveryCost",

  //statistics
  "viewStatistics",

  //profit
  "viewProfit",
  "updateProfit",
] as const;

export enum privilegeFeature {
  role = "Role",
  operator = "Operator",
  category = "Category",
  registrationRequestManagement = "RegistrationRequestManagement",
  university = "University",
  specialty = "Specialty",
  doctor = "Doctor",
  student = "Student",
  product = "Product",
  company = "Company",
  coupon = "Coupon",
  maintenance = "Maintenance",
  order = "Order",
  Offer = "Offer",
  Ad = "Ad",
  content = "Content",
  city = "City",
  deliveryCost = "DeliveryCost",
  patient = "Patient",
  Statistics = "Statistics",
  Profit = "Profit",
  all = "all",
}
const privilegeFeatures = [
  "Role",
  "Operator",
  "Category",
  "University",
  "Specialty",
  "Product",
  "Company",
  "University",
  "Specialty",
  "Coupon",
  "Offer",
  "Ad",
  "City",
] as const;

const createPrivilegeFeatures = [...privilegeFeatures] as const;

const updatePrivilegeFeatures = [
  ...privilegeFeatures,
  "RegistrationRequestManagement",
  "Doctor",
  "Student",
  "Order",
  "Content",
  "DeliveryCost",
  "Patient",
  "Profit",
] as const;

const deletePrivilegeFeatures = [...privilegeFeatures] as const;

const viewPrivilegeFeatures = [
  ...privilegeFeatures,
  "RegistrationRequestManagement",
  "Doctor",
  "Student",
  "Maintenance",
  "Order",
  "Content",
  "DeliveryCost",
  "Patient",
  "Statistics",
  "Profit",
  "all",
] as const;

export type privilegesType = (typeof privilegesArray)[number];

export type CreatePrivilegeFeatureType =
  (typeof createPrivilegeFeatures)[number];

export type UpdatePrivilegeFeatureType =
  (typeof updatePrivilegeFeatures)[number];

export type DeletePrivilegeFeatureType =
  (typeof deletePrivilegeFeatures)[number];

export type ViewPrivilegeFeatureType = (typeof viewPrivilegeFeatures)[number];
