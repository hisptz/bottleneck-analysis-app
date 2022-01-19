import { set } from "lodash";
import { AuthoritiesEnums } from "../../constants/authorities";
import { Authorities } from "../../shared/interfaces/authorities";

const defaultAuthorities = {
  intervention: {
    view: false,
    delete: false,
    create: false,
    edit: false,
  },
  rootCause: {
    delete: false,
    create: false,
    edit: false,
  },
  archive: {
    delete: false,
    create: false,
  },
};

const allAuthorities = {
  intervention: {
    view: true,
    delete: true,
    create: true,
    edit: true,
  },
  rootCause: {
    delete: true,
    create: true,
    edit: true,
  },
  archive: {
    delete: true,
    create: true,
  },
};

export function getUserAuthorities(authorities: Array<string>): Authorities {
  const sanitizedAuthorities: Authorities = defaultAuthorities;

  if (authorities.includes("ALL")) {
    return allAuthorities;
  }
  //Intervention
  if (authorities.includes(AuthoritiesEnums.BNA_ADD_INTERVENTION)) {
    set(sanitizedAuthorities, ["intervention", "create"], true);
  }
  if (authorities.includes(AuthoritiesEnums.BNA_VIEW_INTERVENTIONS)) {
    set(sanitizedAuthorities, ["intervention", "view"], true);
  }
  if (authorities.includes(AuthoritiesEnums.BNA_EDIT_INTERVENTION)) {
    set(sanitizedAuthorities, ["intervention", "edit"], true);
  }
  if (authorities.includes(AuthoritiesEnums.BNA_DELETE_INTERVENTION)) {
    set(sanitizedAuthorities, ["intervention", "delete"], true);
  }
  //RootCause
  if (authorities.includes(AuthoritiesEnums.BNA_ADD_ROOT_CAUSE)) {
    set(sanitizedAuthorities, ["rootCause", "create"], true);
  }
  if (authorities.includes(AuthoritiesEnums.BNA_EDIT_ROOT_CAUSE)) {
    set(sanitizedAuthorities, ["rootCause", "edit"], true);
  }
  if (authorities.includes(AuthoritiesEnums.BNA_DELETE_ROOT_CAUSE)) {
    set(sanitizedAuthorities, ["rootCause", "delete"], true);
  }
  //Archive
  if (authorities.includes(AuthoritiesEnums.BNA_DELETE_ARCHIVE)) {
    set(sanitizedAuthorities, ["archive", "delete"], true);
  }
  if (authorities.includes(AuthoritiesEnums.BNA_ADD_ARCHIVE)) {
    set(sanitizedAuthorities, ["archive", "create"], true);
  }
  return sanitizedAuthorities;
}
