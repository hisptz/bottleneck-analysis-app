export interface OrgUnitFilterConfig {
  /**
   * Tells whether org units should be used for reports or data entry
   */
  reportUse?: boolean;

  /**
   * Specify minimum level for org units
   */
  minLevel?: number;

  /**
   * Specify whether to update on select or unselect or on button click
   */
  updateOnSelect?: boolean;

  /**
   * Specify whether org unit selection is single or multiple
   */
  singleSelection: boolean;

  closeOnDestroy: boolean;
}
