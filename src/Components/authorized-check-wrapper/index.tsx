import React from "react";
import UnauthorizedError from "../error/unauthorized-error";
import { store } from "src/redux-config/store";
import {
  CreatePrivilegeFeatureType,
  DeletePrivilegeFeatureType,
  UpdatePrivilegeFeatureType,
  ViewPrivilegeFeatureType,
  privilegeKeys,
} from "src/shared/privileges";
import { useLocation } from "react-router-dom";
type pagePrivilegesType = {
  type: "add" | "view" | "edit";
  feature:
    | CreatePrivilegeFeatureType
    | DeletePrivilegeFeatureType
    | UpdatePrivilegeFeatureType
    | ViewPrivilegeFeatureType;
};
export type ComponentPropsType = {
  canDelete: boolean;
  canEdit: boolean;
};
const AuthorizedCheckWrapper =
  (pagePrivileges: pagePrivilegesType) =>
  (Component: ({ canDelete, canEdit }: ComponentPropsType) => JSX.Element) =>
  () => {
    const canEdit = true;
    const canDelete = true;
    // const { account } = store.getState().auth;
    // const { privileges } = account ?? {};
    // const location = useLocation();
    // const canView = privileges?.includes(
    //   privilegeKeys[`view${pagePrivileges.feature as ViewPrivilegeFeatureType}`]
    // );

    // const canEdit = privileges?.includes(
    //   privilegeKeys[
    //     `update${pagePrivileges.feature as UpdatePrivilegeFeatureType}`
    //   ]
    // );

    // const canDelete = privileges?.includes(
    //   privilegeKeys[
    //     `delete${pagePrivileges.feature as DeletePrivilegeFeatureType}`
    //   ]
    // );

    // const canAdd = privileges?.includes(
    //   privilegeKeys[
    //     `create${pagePrivileges.feature as CreatePrivilegeFeatureType}`
    //   ]
    // );

    // if (
    //   (!canView && pagePrivileges.type === "view") ||
    //   (!canEdit && pagePrivileges.type === "edit") ||
    //   (!canAdd && pagePrivileges.type === "add")
    // ) {
    //   if (location.pathname === "/") return <></>;
    //   return <UnauthorizedError />;
    // } else
    return (
      <Component canEdit={canEdit ?? false} canDelete={canDelete ?? false} />
    );
  };

export default AuthorizedCheckWrapper;
