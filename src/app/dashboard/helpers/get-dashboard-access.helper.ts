import { User } from '../../models';

export function getDashboardAccess(dashboard: any, currentUser: User) {
  const hasAccess =
    dashboard && dashboard.user && currentUser
      ? dashboard.user.id === currentUser.id
      : false;
  return {
    delete: hasAccess,
    externalize: hasAccess,
    manage: hasAccess,
    read: hasAccess,
    update: hasAccess,
    write: hasAccess
  };
}
