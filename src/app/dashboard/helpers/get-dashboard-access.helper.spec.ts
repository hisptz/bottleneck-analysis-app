import { getDashboardAccess } from './get-dashboard-access.helper';
import { User } from '@iapps/ngx-dhis2-http-client';

const dashboard = {
  id: 'Xg8L14BRydy',
  name: 'ARVs for PMTCT',
  user: {
    id: 'M5zQapPyTZI',
    name: 'admin admin',
  },
  publicAccess: '--------',
  userAccesses: [
    {
      id: 'YXz40ijLGJr',
      name: 'Bottleneck User',
      type: 'user',
      access: 'r-------',
    },
  ],
  externalAccess: false,
  userGroupAccesses: [
    {
      id: 'GCI348yKvGT',
      name: 'Cause of death admin',
      type: 'userGroup',
      access: '--------',
    },
    {
      id: 'KrlFAbMi6JI',
      name: 'Program Managers',
      type: 'userGroup',
      access: 'r-------',
    },
    {
      id: 'lFSq9HYuNoA',
      name: 'Dashboard Admin',
      type: 'userGroup',
      access: 'rw------',
      displayName: 'Dashboard Admin',
    },
  ],
};

describe('Given a dashboard and user who created the dashboard and not superuser', () => {
  const user: User = {
    lastUpdated: '2020-04-20T11:52:33.684',
    created: '2018-12-03T11:25:51.014',
    name: 'admin admin',
    id: 'M5zQapPyTZI',
    displayName: 'admin admin',
    email: 'admin@dhis2.org',
    userCredentials: {
      username: 'admin',
    },
    userGroups: [],
    organisationUnits: [{ level: 1, name: 'Trainingland', id: 'GD7TowwI46c' }],
    dataViewOrganisationUnits: [
      { level: 1, name: 'Trainingland', id: 'GD7TowwI46c' },
    ],
    authorities: [],
  };
  const dashboardAccess = getDashboardAccess(dashboard, user);
  it('should enable read access', () => {
    expect(dashboardAccess.read).toBeTruthy();
  });
  it('should enable write access', () => {
    expect(dashboardAccess.write).toBeTruthy();
  });
  it('should enable update access', () => {
    expect(dashboardAccess.update).toBeTruthy();
  });
  it('should enable delete access', () => {
    expect(dashboardAccess.delete).toBeTruthy();
  });
  it('should enable manage sharing access', () => {
    expect(dashboardAccess.manageSharing).toBeTruthy();
  });
});

describe('Given a dashboard and a superuser', () => {
  const user: User = {
    lastUpdated: '2020-04-20T11:52:33.684',
    created: '2018-12-03T11:25:51.014',
    name: 'superuser superuser',
    id: 'M5zQapryTZI',
    displayName: 'superuser superuser',
    email: 'superuser@dhis2.org',
    userCredentials: {
      username: 'superuser',
    },
    userGroups: [],
    organisationUnits: [{ level: 1, name: 'Trainingland', id: 'GD7TowwI46c' }],
    dataViewOrganisationUnits: [
      { level: 1, name: 'Trainingland', id: 'GD7TowwI46c' },
    ],
    authorities: ['ALL'],
  };
  const dashboardAccess = getDashboardAccess(dashboard, user);
  it('should enable read access', () => {
    expect(dashboardAccess.read).toBeTruthy();
  });
  it('should enable write access', () => {
    expect(dashboardAccess.write).toBeTruthy();
  });
  it('should enable update access', () => {
    expect(dashboardAccess.update).toBeTruthy();
  });
  it('should enable delete access', () => {
    expect(dashboardAccess.delete).toBeTruthy();
  });
  it('should enable manage sharing access', () => {
    expect(dashboardAccess.manageSharing).toBeTruthy();
  });
});

describe('Given a dashboard and non-superuser or not dashboard creator but shared with a dashboard with only read access', () => {
  const user: User = {
    lastUpdated: '2020-04-20T11:52:33.684',
    created: '2018-12-03T11:25:51.014',
    name: 'Bottleneck User',
    id: 'YXz40ijLGJr',
    displayName: 'Bottleneck User',
    email: 'admin@example.com',
    userCredentials: {
      username: 'bottleneck',
    },
    userGroups: [],
    organisationUnits: [{ level: 1, name: 'Trainingland', id: 'GD7TowwI46c' }],
    dataViewOrganisationUnits: [
      { level: 1, name: 'Trainingland', id: 'GD7TowwI46c' },
    ],
    authorities: [
      'F_PROGRAM_INDICATOR_PUBLIC_ADD',
      'F_SQLVIEW_EXECUTE',
      'F_ORGUNITGROUP_PRIVATE_ADD',
      'F_LOCALE_DELETE',
      'F_DATAELEMENT_DELETE',
      'F_VALIDATIONRULE_PUBLIC_ADD',
      'F_OPTIONGROUP_DELETE',
    ],
  };
  const dashboardAccess = getDashboardAccess(dashboard, user);
  it('should enable read access', () => {
    expect(dashboardAccess.read).toBeTruthy();
  });
  it('should disable write access', () => {
    expect(dashboardAccess.write).toBeFalsy();
  });
  it('should disable update access', () => {
    expect(dashboardAccess.update).toBeFalsy();
  });
  it('should disable delete access', () => {
    expect(dashboardAccess.delete).toBeFalsy();
  });
  it('should disable manage sharing access', () => {
    expect(dashboardAccess.manageSharing).toBeFalsy();
  });
});

describe('Given a dashboard and non-superuser or not dashboard creator but shared with a dashboard with read and write access', () => {
  const newDashboard = {
    ...dashboard,
    userAccesses: [
      {
        id: 'YXz40ijLGJr',
        name: 'Bottleneck User',
        type: 'user',
        access: 'rw------',
      },
    ],
  };

  const user: User = {
    lastUpdated: '2020-04-20T11:52:33.684',
    created: '2018-12-03T11:25:51.014',
    name: 'Bottleneck User',
    id: 'YXz40ijLGJr',
    displayName: 'Bottleneck User',
    email: 'admin@example.com',
    userCredentials: {
      username: 'bottleneck',
    },
    userGroups: [],
    organisationUnits: [{ level: 1, name: 'Trainingland', id: 'GD7TowwI46c' }],
    dataViewOrganisationUnits: [
      { level: 1, name: 'Trainingland', id: 'GD7TowwI46c' },
    ],
    authorities: [
      'F_PROGRAM_INDICATOR_PUBLIC_ADD',
      'F_SQLVIEW_EXECUTE',
      'F_ORGUNITGROUP_PRIVATE_ADD',
      'F_LOCALE_DELETE',
      'F_DATAELEMENT_DELETE',
      'F_VALIDATIONRULE_PUBLIC_ADD',
      'F_OPTIONGROUP_DELETE',
    ],
  };
  const dashboardAccess = getDashboardAccess(newDashboard, user);
  it('should enable read access', () => {
    expect(dashboardAccess.read).toBeTruthy();
  });
  it('should enable write access', () => {
    expect(dashboardAccess.write).toBeTruthy();
  });
  it('should enable update access', () => {
    expect(dashboardAccess.update).toBeTruthy();
  });
  it('should enable delete access', () => {
    expect(dashboardAccess.delete).toBeTruthy();
  });
  it('should enable manage sharing access', () => {
    expect(dashboardAccess.manageSharing).toBeTruthy();
  });
});
