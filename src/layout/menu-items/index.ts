import { ReactNode } from "react";
import { workoutModule } from "./workout-module";
import { nutriplanModule } from "./nutriplan-module";

export type menuItemsType = {
  id: string;
  title: string;
  messageId: string;
  icon?: string | ReactNode;
  type: "item" | "group" | "collapse" | "divider";
  children?: menuItemsType[];
  permittedRole?: string | string[];
  color?: string;
  url?: string;
  exact?: boolean;
  count?: number;
};

export const menuItems: menuItemsType[] = [workoutModule,nutriplanModule];
