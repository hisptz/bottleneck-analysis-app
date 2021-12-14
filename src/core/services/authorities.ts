import { set } from "lodash";
import { AuthoritiesEnums } from "../../constants/authorities";
import { Authorities } from "../../shared/interfaces/authorities";

const defaultAuthorities = {
  intervention: {
    delete: false,
    create: false,
    edit: false,
  },
  rootCause: {
    delete: false,
    create: false,
    edit: false,
  },
};

const allAuthorities = {
  intervention: {
    delete: true,
    create: true,
    edit: true,
  },
  rootCause: {
    delete: true,
    create: true,
    edit: true,
  },
};

export function getUserAuthorities(authorities: Array<string>): Authorities {
  const sanitizedAuthorities: Authorities = defaultAuthorities;

  if (authorities.includes("ALL")) {
    return allAuthorities;
  }

  if (authorities.includes(AuthoritiesEnums.BNA_ADD_INTERVENTION)) {
    set(sanitizedAuthorities, ["intervention", "create"], true);
  }
  if (authorities.includes(AuthoritiesEnums.BNA_EDIT_INTERVENTION)) {
    set(sanitizedAuthorities, ["intervention", "edit"], true);
  }
  if (authorities.includes(AuthoritiesEnums.BNA_DELETE_INTERVENTION)) {
    set(sanitizedAuthorities, ["intervention", "delete"], true);
  }

  if (authorities.includes(AuthoritiesEnums.BNA_ADD_ROOT_CAUSE)) {
    set(sanitizedAuthorities, ["rootCause", "create"], true);
  }
  if (authorities.includes(AuthoritiesEnums.BNA_EDIT_ROOT_CAUSE)) {
    set(sanitizedAuthorities, ["rootCause", "edit"], true);
  }
  if (authorities.includes(AuthoritiesEnums.BNA_DELETE_ROOT_CAUSE)) {
    set(sanitizedAuthorities, ["rootCause", "delete"], true);
  }

  return sanitizedAuthorities;
}
