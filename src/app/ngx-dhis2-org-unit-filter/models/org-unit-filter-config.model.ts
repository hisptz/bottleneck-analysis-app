export interface OrgUnitFilterConfig {
  // Tells whether user organisation unit section should be shown or hidden
  showUserOrgUnitSection?: boolean;

  // Tells whether organisation unit group section should be shown or hidden
  showOrgUnitGroupSection?: boolean;

  // Tells whether organisation unit level section should be shown or hidden
  showOrgUnitLevelSection?: boolean;

  // Tells whether whole of organisation unit level and group section should be shown or hidden
  showOrgUnitLevelGroupSection?: boolean;

  // Tells whether org units should be used for reports or data entry
  reportUse?: boolean;

  // Specify minimum level for org units
  minLevel?: number;

  // Specify whether to update on select or unselect or on button click
  updateOnSelect?: boolean;

  // Specify whether org unit selection is single or multiple
  singleSelection: boolean;

  // Tells whether close event should be fired when destroying organisation unit component
  closeOnDestroy?: boolean;

  // Specify size when loading organisation units
  batchSize?: number;

  // Specify additional organisation unit query fields
  additionalQueryFields?: string[];
}
