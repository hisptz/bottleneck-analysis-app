import { User } from '@iapps/ngx-dhis2-http-client';

export function isSuperUser(currentUser: User) {
  return currentUser && currentUser.authorities
    ? currentUser.authorities.includes('ALL')
    : false;
}
