interface GenericAuthorities {
  create: boolean;
  view?: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Authorities {
  intervention: GenericAuthorities;
  rootCause: GenericAuthorities;
}
