import { User } from '@iapps/ngx-dhis2-http-client';
import { AppAuthorities } from '../dashboard/models/app-authority.model';

export function getAppAuthorities(currentUser: User): AppAuthorities {
  const authorities = currentUser ? currentUser.authorities : [];

  const isSuperUser = authorities.includes('ALL');

  if (isSuperUser) {
    return { All: true };
  }

  return {
    All: authorities.includes('ALL'),
    ViewDefaultIntervention: authorities.includes(
      'BNA_VIEW_DEFAULT_INTERVENTIONS'
    ),
    CreateDefaultIntervention: authorities.includes(
      'BNA_CREATE_DEFAULT_INTERVENTION'
    ),
    EditDefaultIntervention: authorities.includes(
      'BNA_EDIT_DEFAULT_INTERVENTION'
    ),
    DeletedDefaultIntervention: authorities.includes(
      'BNA_DELETE_DEFAULT_INTERVENTION'
    ),
    AddIntervention: authorities.includes('BNA_ADD_INTERVENTION'),
  };
}
