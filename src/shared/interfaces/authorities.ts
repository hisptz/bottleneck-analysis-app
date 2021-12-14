interface GenericAuthorities {
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Authorities {
  intervention: GenericAuthorities;
  rootCause: GenericAuthorities;
}
