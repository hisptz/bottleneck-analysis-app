import i18n from "@dhis2/d2-i18n";
import { cloneDeep, find, findIndex, has, set } from "lodash";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ACCESS_TYPES } from "../../../../../../../constants/constants";
import { InterventionDirtySelector } from "../../../../../state/data";

export default function useManageAccess(): {
  publicAccess: string;
  allUsersAccess?: { label: string; value: string };
  userGroupAccess: Array<any>;
  userAccess: Array<any>;
  onChangeAccess: (type: string, access: string | { id: string; access: string }) => void;
  onRemove: (value: { type: string; id: any }) => void;
} {
  const { id } = useParams<{ id: string }>();
  const publicAccess = useRecoilValue(InterventionDirtySelector({ id, path: ["publicAccess"] }));
  const allUsersAccess = useMemo(() => find(ACCESS_TYPES, ["value", publicAccess]), [publicAccess]);
  const [userGroupAccess, setUserGroupAccess] = useRecoilState(InterventionDirtySelector({ id, path: ["userGroupAccess"] }));
  const setPublicAccess = useSetRecoilState(InterventionDirtySelector({ id, path: ["publicAccess"] }));
  const [userAccess, setUserAccess] = useRecoilState(InterventionDirtySelector({ id, path: ["userAccess"] }));
  const onChangeAccess = (type: string, access: string | { id: string; access: string }) => {
    if (type === "publicAccess") {
      setPublicAccess(access);
      return;
    }
    if (type === "userAccess") {
      if (typeof access !== "string" && has(access, "id")) {
        setUserAccess((prevState: any) => {
          const newState = cloneDeep(prevState);
          const updatedUserGroupIndex = findIndex(newState, ["id", access.id]);
          if (newState[updatedUserGroupIndex]) {
            set(newState[updatedUserGroupIndex], "access", access.access);
          }
          return newState;
        });
      }
      return;
    }
    if (type === "userGroupAccess") {
      if (typeof access !== "string" && has(access, "id")) {
        setUserGroupAccess((prevState: any) => {
          const newState = cloneDeep(prevState);
          const updatedUserGroupIndex = findIndex(newState, ["id", access.id]);
          if (newState[updatedUserGroupIndex]) {
            set(newState[updatedUserGroupIndex], "access", access.access);
          }
          return newState;
        });
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
        setUserAccess((prevState: any) => {
          const newState = cloneDeep(prevState);
          const updatedUserGroupIndex = findIndex(newState, ["id", value.id]);
          if (newState[updatedUserGroupIndex]) {
            newState.splice(updatedUserGroupIndex, 1);
          }
          return newState;
        });
      }

      if (value.type === "userGroupAccess") {
        setUserGroupAccess((prevState: any) => {
          const newState = cloneDeep(prevState);
          const updatedUserGroupIndex = findIndex(newState, ["id", value.id]);
          if (newState[updatedUserGroupIndex]) {
            newState.splice(updatedUserGroupIndex, 1);
          }
          return newState;
        });
      }
    }
  };

  return {
    publicAccess,
    allUsersAccess,
    userGroupAccess,
    userAccess,
    onChangeAccess,
    onRemove,
  };
}
