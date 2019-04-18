export function isSuperUser(userAuthorities: string[]) {
  return (userAuthorities || [])
    .map((authority: string) => {
      return { authority };
    })
    .some((authorityObject: any) => authorityObject.authority === 'ALL');
}
