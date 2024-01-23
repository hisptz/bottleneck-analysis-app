import i18n from "@dhis2/d2-i18n";
import { cloneDeep, find, findIndex, has, set } from "lodash";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ACCESS_TYPES } from "../../../../../../../constants/constants";
import { InterventionDirtySelector } from "../../../../../state/data";
import { useController, useWatch } from "react-hook-form";

export default function useManageAccess(): {
  publicAccess: string;
  allUsersAccess?: { label: string; value: string };
  userGroupAccess: Array<any>;
  userAccess: Array<any>;
  onChangeAccess: (type: string, access: string | { id: string; access: string }) => void;
  onRemove: (value: { type: string; id: any }) => void;
} {
  const { id } = useParams<{ id: string }>();
  const { field: publicAccessField } = useController({ name: "publicAccess" });
  const { field: userGroupAccessField } = useController({ name: "userGroupAccess" });
  const { field: userAccessField } = useController({ name: "userAccess" });

  const allUsersAccess = useMemo(() => find(ACCESS_TYPES, ["value", publicAccessField.value]), [publicAccessField]);

  const onChangeAccess = (type: string, access: string | { id: string; access: string }) => {
    if (type === "publicAccess") {
      publicAccessField.onChange(access);
      return;
    }
    if (type === "userAccess") {
      if (typeof access !== "string" && has(access, "id")) {
        const newState = cloneDeep(userAccessField.value);
        const updatedUserGroupIndex = findIndex(newState, ["id", access.id]);
        if (newState[updatedUserGroupIndex]) {
          set(newState[updatedUserGroupIndex], "access", access.access);
        }
        userAccessField.onChange(newState);
      }
      return;
    }
    if (type === "userGroupAccess") {
      if (typeof access !== "string" && has(access, "id")) {
        const newState = cloneDeep(userGroupAccessField.value);
        const updatedUserGroupIndex = findIndex(newState, ["id", access.id]);
        if (newState[updatedUserGroupIndex]) {
          set(newState[updatedUserGroupIndex], "access", access.access);
        }
        userGroupAccessField.onChange(newState);
      }
      return;
    }
  };

  const onRemove = (value: { type: string; id: any }) => {
    if (window.confirm(i18n.t("Are you sure you want to delete this access?"))) {
      if (value.type === "publicAccess") {
        return;
      }
      if (value.type === "userAccess") {
        const newState = cloneDeep(userAccessField.value);
        const updatedUserGroupIndex = findIndex(newState, ["id", value.id]);
        if (newState[updatedUserGroupIndex]) {
          newState.splice(updatedUserGroupIndex, 1);
        }
        userAccessField.onChange(newState);
      }

      if (value.type === "userGroupAccess") {
        const newState = cloneDeep(userGroupAccessField.value);
        const updatedUserGroupIndex = findIndex(newState, ["id", value.id]);
        if (newState[updatedUserGroupIndex]) {
          newState.splice(updatedUserGroupIndex, 1);
        }
        userGroupAccessField.onChange(newState);
      }
    }
  };

  return {
    publicAccess: publicAccessField.value,
    allUsersAccess,
    userGroupAccess: userGroupAccessField.value,
    userAccess: userAccessField.value,
    onChangeAccess,
    onRemove,
  };
}
