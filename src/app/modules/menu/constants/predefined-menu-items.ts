export const PREDEFINED_MENU_ITEMS = [
  {
    name: 'Data element',
    namespace: 'data-element',
    defaultAction: 'dhis-web-maintenance/#/list/dataElementSection',
    displayName: 'Data element',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'A unit of analysis and member of datasets',
    onlyShowOnSearch: true
  },
  {
    name: 'Data element group',
    namespace: 'data-element-group',
    defaultAction:
      'dhis-web-maintenance/#/list/dataElementSection/dataElementGroup',
    displayName: 'Data element group',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Groups of data elements for analysis and cross tabulation',
    onlyShowOnSearch: true
  },
  {
    name: 'Data element group set',
    namespace: 'data-element-group-set',
    defaultAction:
      'dhis-web-maintenance/#/list/dataElementSection/dataElementGroupSet',
    displayName: 'Data element group set',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'A set of groups of data elements used for analysis and cross tabulation',
    onlyShowOnSearch: true
  },
  {
    name: 'Indicator',
    namespace: 'indicator',
    defaultAction: 'dhis-web-maintenance/#/list/indicatorSection/indicator',
    displayName: 'Indicator',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'A computed value from data elements used for data analysis',
    onlyShowOnSearch: true
  },
  {
    name: 'Indicator type',
    namespace: 'indicator-type',
    defaultAction: 'dhis-web-maintenance/#/list/indicatorSection/indicatorType',
    displayName: 'Indicator type',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Type of indicator used as a factor, such as percentages, rates and ratios',
    onlyShowOnSearch: true
  },
  {
    name: 'Indicator group',
    namespace: 'indicator-type',
    defaultAction:
      'dhis-web-maintenance/#/list/indicatorSection/indicatorGroup',
    displayName: 'Indicator group',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'A group of indicators used for analysis and cross tabulation',
    onlyShowOnSearch: true
  },
  {
    name: 'Settings',
    displayName: 'Settings',
    namespace: '/dhis-web-user-profile',
    defaultAction: '/dhis-web-user-profile/#/settings',
    icon: '/icons/usersettings.png',
    description: 'User settings for updating language, theme and notification settings',
    onlyShowOnSearch: true
  },
  {
    name: 'Profile',
    displayName: 'Profile',
    namespace: '/dhis-web-user-profile',
    defaultAction: '/dhis-web-user-profile/#/profile',
    icon: '/icons/function-profile.png',
    description: 'User settings for updating names, email, phone number and other profile details',
    onlyShowOnSearch: true
  },
  {
    name: 'Account',
    displayName: 'Account',
    namespace: '/dhis-web-user-profile',
    defaultAction: '/dhis-web-user-profile/#/account',
    icon: '/icons/function-account.png',
    description: 'User settings for updating account passwords',
    onlyShowOnSearch: true
  },
  {
    name: 'Help',
    displayName: 'Help',
    namespace: '/dhis-web-commons-about',
    defaultAction:
      'https://dhis2.github.io/dhis2-docs/master/en/user/html/dhis2_user_manual_en.html',
    icon: '/icons/function-account.png',
    description: 'Help and documentation page on using DHIS2',
    onlyShowOnSearch: true
  },
  {
    name: 'About DHIS2',
    displayName: 'About DHIS2',
    namespace: '/dhis-web-commons-about',
    defaultAction: '/dhis-web-commons-about/about.action',
    icon: '/icons/function-about-dhis2.png',
    description: 'Details about running dhis2 versions, database and other setup information',
    onlyShowOnSearch: true
  },
  {
    name: 'Category option',
    displayName: 'Category option',
    namespace: '/dhis-web-category-option',
    defaultAction: '/dhis-web-maintenance/#/list/categorySection/categoryOption',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Disagregation of data elements and data set for cross tabulation on data entry and analysis',
    onlyShowOnSearch: true
  },
  {
    name: 'Category',
    displayName: 'Category',
    namespace: '/dhis-web-category',
    defaultAction: '/dhis-web-maintenance/#/list/categorySection/category',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Combination of options used as disaggregation of data elements and datasets for cross tabulation',
    onlyShowOnSearch: true
  },
  {
    name: 'Category combination',
    displayName: 'Category combination',
    namespace: '/dhis-web-category-combo',
    defaultAction: '/dhis-web-maintenance/#/list/categorySection/categoryCombo',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Set of combinations of options used as disaggregation of data elements and datasets for cross tabulation',
    onlyShowOnSearch: true
  },
  {
    name: 'Category option combination',
    displayName: 'Category option combination',
    namespace: '/dhis-web-category-option-combination',
    defaultAction: '/dhis-web-maintenance/#/list/categorySection/categoryOptionCombo',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Generated individual disaggregation/cross-tabulations based on category combination',
    onlyShowOnSearch: true
  },
  {
    name: 'Category option group',
    displayName: 'Category option group',
    namespace: '/dhis-web-category-option-group',
    defaultAction: ' /dhis-web-maintenance/#/list/categorySection/categoryOptionGroup',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Group of options used for cross tabulation during data analysis',
    onlyShowOnSearch: true
  },
  {
    name: 'Category option groupset',
    displayName: 'Category option groupset',
    namespace: '/dhis-web-category-option-groupset',
    defaultAction: '/dhis-web-maintenance/#/list/categorySection/categoryOptionGroupSet',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'A set of groups of options used for cross tabulation during data analysis',
    onlyShowOnSearch: true
  },
  {
    name: 'Data set',
    displayName: 'Data set',
    namespace: '/dhis-web-data-set',
    defaultAction: '/dhis-web-maintenance/#/list/dataSetSection/dataSet',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'A set of data elements used for data collection and reporting rates/data submission',
    onlyShowOnSearch: true
  },
  {
    name: 'Indicator group set',
    displayName: 'Indicator group set',
    namespace: '/dhis-web-indicator-group-set',
    defaultAction: '/dhis-web-maintenance/#/list/indicatorSection/indicatorGroupSet',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'A set of groups of indicators used for analysis and cross tabulation',
    onlyShowOnSearch: true
  },
  {
    name: 'Program indicator',
    displayName: 'Program indicator',
    namespace: '/dhis-web-program-indicator',
    defaultAction: '/dhis-web-maintenance/#/list/indicatorSection/programIndicator',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Computed values based on formula of data from events and tracker data used for analysis',
    onlyShowOnSearch: true
  },
  {
    name: 'Program indicator group',
    displayName: 'Program indicator group',
    namespace: '/dhis-web-program-indicator-group',
    defaultAction: '/dhis-web-maintenance/#/list/indicatorSection/programIndicatorGroup',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Group of computed values based on formula of data from events and tracker data used of analysis',
    onlyShowOnSearch: true
  },
  {
    name: 'Organisation unit',
    displayName: 'Organisation unit',
    namespace: '/dhis-web-organisation-unit',
    defaultAction: '/dhis-web-maintenance/#/list/organisationUnitSection/organisationUnit',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Unit of data collection in reporting hierarchy, "WHERE" data is collected',
    onlyShowOnSearch: true
  },
  {
    name: 'Organisation unit group',
    displayName: 'Organisation unit group',
    namespace: '/dhis-web-organisation-unit-group',
    defaultAction: '/dhis-web-maintenance/#/list/organisationUnitSection/organisationUnitGroup',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Group of units of data collection in reporting hierarchy used for analysis and cross tabulation',
    onlyShowOnSearch: true
  },
  {
    name: 'Organisation unit group set',
    displayName: 'Organisation unit group set',
    namespace: '/dhis-web-organisation-unit-group-set',
    defaultAction: '/dhis-web-maintenance/#/list/organisationUnitSection/organisationUnitGroupSet',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'A set of groups of organisation units used for analysis and cross tabulation',
    onlyShowOnSearch: true
  },
  {
    name: 'Organisation unit level',
    displayName: 'Organisation unit level',
    namespace: '/dhis-web-organisation-unit-level',
    defaultAction: '/dhis-web-maintenance/#/list/organisationUnitSection/organisationUnitLevel',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Levels of organisaion units in a hierarchy of reporting',
    onlyShowOnSearch: true
  },
  {
    name: 'Hierarchy operations',
    displayName: 'Hierarchy operations',
    namespace: '/dhis-web-hierarchy-operations',
    defaultAction: '/dhis-web-maintenance/#/organisationUnitSection/hierarchy',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Operations for moving organisation units within between parents within the hierarchy',
    onlyShowOnSearch: true
  },
  {
    name: 'Program',
    displayName: 'Program',
    namespace: '/dhis-web-program',
    defaultAction: '/dhis-web-maintenance/#/list/programSection/program',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'A set of data collection configurations for capturing events and tracker data',
    onlyShowOnSearch: true
  },
  {
    name: 'Tracked entity attribute',
    displayName: 'Tracked entity attribute',
    namespace: '/dhis-web-tracked-entity-attribute',
    defaultAction: '/dhis-web-maintenance/#/list/programSection/trackedEntityAttribute',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Properties/details of an entity/person/sample/case being tracked in tracker program',
    onlyShowOnSearch: true
  },
  {
    name: 'Relationship type',
    displayName: 'Relationship type',
    namespace: '/dhis-web-relationship-type',
    defaultAction: '/dhis-web-maintenance/#/list/programSection/relationshipType',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Types or nature of relationship between entities/person/sample/cases being tracked in tracker program',
    onlyShowOnSearch: true
  },
  {
    name: 'Tracked entity',
    displayName: 'Tracked entity',
    namespace: '/dhis-web-',
    defaultAction: '/dhis-web-maintenance/#/list/programSection/trackedEntity',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Entity/person/sample/case being tracked in a tracker program',
    onlyShowOnSearch: true
  },
  {
    name: 'Program rule',
    displayName: 'Program rule',
    namespace: '/dhis-web-program-rule',
    defaultAction: '/dhis-web-maintenance/#/list/programSection/programRule',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Rules/Criterials for enforcing validations or expected behaviors in tracker program',
    onlyShowOnSearch: true
  },
  {
    name: 'Program rule variable',
    displayName: 'Program rule variable',
    namespace: '/dhis-web-program-rule-variable',
    defaultAction: '/dhis-web-maintenance/#/list/programSection/programRuleVariable',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Variables/expressions in rules used to evaluate conditions and creatirias in validation',
    onlyShowOnSearch: true
  },
  {
    name: 'Validation rule',
    displayName: 'Validation rule',
    namespace: '/dhis-web-validation-rule',
    defaultAction: '/dhis-web-maintenance/#/list/validationSection/validationRule',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Rules used for data validation in data entry',
    onlyShowOnSearch: true
  },
  {
    name: 'Validation notification',
    displayName: 'Validation notification',
    namespace: '/dhis-web-validation-notification',
    defaultAction: '/dhis-web-maintenance/#/list/validationSection/validationNotificationTemplate',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Notification templates for messages on fullfilment of a validation rule',
    onlyShowOnSearch: true
  },
  {
    name: 'Constant',
    displayName: 'Constant',
    namespace: '/dhis-web-constant',
    defaultAction: '/dhis-web-maintenance/#/list/otherSection/constant',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'A fixed value used accross indicators and data sets',
    onlyShowOnSearch: true
  },
  {
    name: 'Attribute',
    displayName: 'Attribute',
    namespace: '/dhis-web-attribute',
    defaultAction: '/dhis-web-maintenance/#/list/otherSection/attribute',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Fields for extending additional properties for capturing information related to data captured in DHIS2',
    onlyShowOnSearch: true
  },
  {
    name: 'Option set',
    displayName: 'Option set',
    namespace: '/dhis-web-option-set',
    defaultAction: '/dhis-web-maintenance/#/list/otherSection/optionSet',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'A set of choices to be offered as drop down selection menu for data entry and analysis',
    onlyShowOnSearch: true
  },
  {
    name: 'Legend',
    displayName: 'Legend',
    namespace: '/dhis-web-legend',
    defaultAction: '/dhis-web-maintenance/#/list/otherSection/legendSet',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'A predefined range of colors used and key of colors for data analysis',
    onlyShowOnSearch: true
  },
  {
    name: 'Predicator',
    displayName: 'Predictor',
    namespace: '/dhis-web-predictor',
    defaultAction: '/dhis-web-maintenance/#/list/otherSection/predictor',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Rule for calculation of predicted value based on prediction formula',
    onlyShowOnSearch: true
  },
  {
    name: 'Push analysis',
    displayName: 'Push analysis',
    namespace: '/dhis-web-push-analysis',
    defaultAction: '/dhis-web-maintenance/#/list/otherSection/pushAnalysis',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Settings for pushing list of analysis dashboards to users mails and defined schedule',
    onlyShowOnSearch: true
  },
  {
    name: 'External map layer',
    displayName: 'External map layer',
    namespace: '/dhis-web-',
    defaultAction: '/dhis-web-maintenance/#/list/otherSection/externalMapLayer',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Configuration of external rastor imagery layers for map overalys',
    onlyShowOnSearch: true
  },
  {
    name: 'Group editor',
    displayName: 'Group editor',
    namespace: '/dhis-web-group-editor',
    defaultAction: '/dhis-web-maintenance/#/group-editor',
    icon: 'icons/dhis-web-maintenance.png',
    description: 'Editing tool for management of group assignments',
    onlyShowOnSearch: true
  },
  {
    name: 'Resource table',
    displayName: 'Resource table',
    namespace: '/dhis-web-resource-table',
    defaultAction: '/dhis-web-maintenance-dataadmin/displayResourceTableForm.action',
    icon: '/icons/dhis-web-maintenance-dataadmin.png',
    description: 'Table for holding auto generated resources needed for reports and analytics tools',
    onlyShowOnSearch: true
  },
  {
    name: 'Cache administration',
    displayName: 'Cache administration',
    namespace: '/dhis-web-cache-administration',
    defaultAction: '/dhis-web-maintenance-dataadmin/displayMaintenanceForm.action',
    icon: '/icons/dhis-web-maintenance-dataadmin.png',
    description: 'Clearing of server cache, update changes made and for reloading apps',
    onlyShowOnSearch: true
  },
  {
    name: 'Schedule management',
    displayName: 'Schedule management',
    namespace: '/dhis-web-schedule-management',
    defaultAction: '/dhis-web-maintenance-dataadmin/viewScheduledTasks.action',
    icon: '/icons/dhis-web-maintenance-dataadmin.png',
    description: 'Management of schedule for running analytics and resource tables creation',
    onlyShowOnSearch: true
  },
  {
    name: 'Analytics management',
    displayName: 'Analytics management',
    namespace: '/dhis-web-schedule-management',
    defaultAction: '/dhis-web-reporting/displayDataMartForm.action',
    icon: '/icons/dhis-web-maintenance-dataadmin.png',
    description: 'Running analytics on demand and configuration of analytics before running',
    onlyShowOnSearch: true
  },
  {
    name: 'Standard reports',
    displayName: 'Standard reports',
    namespace: '/dhis-web-standard-reports',
    defaultAction: '/dhis-web-reporting/displayViewReportForm.action',
    icon: '/icons/dhis-web-reporting.png',
    description: 'Customized single page reports for personalized/customized report outputs',
    onlyShowOnSearch: true
  },
  {
    name: 'Dataset reports',
    displayName: 'Dataset reports',
    namespace: '/dhis-web-dataset-reports',
    defaultAction: '/dhis-web-reporting/showDataSetReportForm.action',
    icon: '/icons/dhis-web-reporting.png',
    description: 'Routine reports based on data entry forms layouts aggregated accross hierarchy and periods',
    onlyShowOnSearch: true
  },
  {
    name: 'Reporting rates',
    displayName: 'Reporting rates',
    namespace: '/dhis-web-reporting rates',
    defaultAction: '/dhis-web-reporting/displayViewDataCompletenessForm.action',
    icon: '/icons/dhis-web-reporting.png',
    description: 'Reports showing completeness and timelineness of submissions of datasets',
    onlyShowOnSearch: true
  },
  {
    name: 'Organisation unit report',
    displayName: 'Organisation unit report',
    namespace: '/dhis-web-organisation-unit-report',
    defaultAction: '/dhis-web-reporting/displayOrgUnitDistribution.action',
    icon: '/icons/dhis-web-reporting.png',
    description: 'Reports showing distribution of organisation units by groups and groupsets, e.g. ownership and types',
    onlyShowOnSearch: true
  },
  {
    name: 'Resources',
    displayName: 'Resources',
    namespace: '/dhis-web-resources',
    defaultAction: '/dhis-web-reporting/displayViewDocumentForm.action',
    icon: '/icons/dhis-web-reporting.png',
    description: 'Archive of files and other resources uploaded for reference purposes',
    onlyShowOnSearch: true
  },
  {
    name: 'Data approval',
    displayName: 'Data approval',
    namespace: '/dhis-web-data-approval',
    defaultAction: '/dhis-web-reporting/showDataApprovalForm.action',
    icon: '/icons/dhis-web-reporting.png',
    description: 'Approval and analysis of trend and rate of data approval',
    onlyShowOnSearch: true
  },
  {
    name: 'SQL Views',
    displayName: 'SQL Views',
    namespace: '/dhis-web-sql-views',
    defaultAction: '/dhis-web-maintenance-dataadmin/sqlView.action',
    icon: '/icons/dhis-web-maintenance-dataadmin.png',
    description: 'Management, generation and use of SQL views for csv data analysis',
    onlyShowOnSearch: true
  },
  {
    name: 'Data statistics',
    displayName: 'Data statistics',
    namespace: '/dhis-web-data-statistics',
    defaultAction: '/dhis-web-maintenance-dataadmin/viewStatistics.action',
    icon: '/icons/dhis-web-maintenance-dataadmin.png',
    description: 'Statistics on creation of metadata and datavalues in the database',
    onlyShowOnSearch: true
  }
];
