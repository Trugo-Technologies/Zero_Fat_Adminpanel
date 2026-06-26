import { menuItemsType } from ".";

export const workoutModule: menuItemsType = {
  id: "workout-module",
  messageId: "sidebar.workoutManagement.title",
  title: "workout-module",
  type: "group",
  permittedRole: [],

  children: [
    {
      id: "catalog",
      messageId: "sidebar.catalog.title",
      title: "catalog",
      type: "collapse",
      permittedRole: [],
      children: [
        {
          id: "plans",
          messageId: "plans",
          title: "plans",
          type: "item",
          url: "/workout/catalog/plan",
          permittedRole: [],
        },

        {
          id: "workoutBodyParts",
          messageId: "sidebar.workoutBodyParts",
          title: "workoutBodyParts",
          type: "item",
          url: "/workout/catalog/bodyParts",
          permittedRole: [],
        },
        {
          id: "plans",
          messageId: "equipment-category",
          title: "plans",
          type: "item",
          url: "/equipment-category",
          permittedRole: [],
        },
      ],
    },
  ],
};
