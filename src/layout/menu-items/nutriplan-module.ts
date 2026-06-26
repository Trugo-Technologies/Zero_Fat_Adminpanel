import { menuItemsType } from '.';

export const nutriplanModule: menuItemsType = {
  id: 'nutriplan-module',
  messageId: 'sidebar.nutriplanManagement.title',
  title: 'nutriplan-module',
  type: 'group',
  permittedRole: [],
  children: [
    {
      id: 'nutriplan-module-setting',
      messageId: 'sidebar.setting.title',
      title: 'nutriplan-module-setting',
      type: 'collapse',
      permittedRole: [],
      children: [
        {
          id: 'measurementUnits',
          messageId: 'sidebar.measurementUnits',
          title: 'measurementUnits',
          type: 'item',
          url: '/nutriplan/setting/measurementUnits',
          permittedRole: [],
        },
        {
          id: 'nutrientsAttributes',
          messageId: 'sidebar.nutrientsAttributes',
          title: 'nutrientsAttributes',
          type: 'item',
          url: '/nutriplan/setting/nutrientsAttributes',
          permittedRole: [],
        },
      ],
    },
    {
      id: 'nutriplan-module-catalog',
      messageId: 'sidebar.catalog.title',
      title: 'nutriplan-module-catalog',
      type: 'collapse',
      permittedRole: [],
      children: [
        {
          id: 'categories',
          messageId: 'sidebar.categories',
          title: 'categories',
          type: 'item',
          url: '/nutriplan/catalog/categories',
          permittedRole: [],
        },
        {
          id: 'mealTypes',
          messageId: 'sidebar.mealTypes',
          title: 'mealPlans',
          type: 'item',
          url: '/nutriplan/setting/mealTypes',
          permittedRole: [],
        },
        {
          id: 'ingredients',
          messageId: 'sidebar.ingredients',
          title: 'ingredients',
          type: 'item',
          url: '/nutriplan/catalog/ingredients',
          permittedRole: [],
        },
      ],
    },
  ],
};
