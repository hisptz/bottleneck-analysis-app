import { createAction, props } from '@ngrx/store';
import { Intervention } from '../../models';
import { VisualizationLayer } from '../../modules/ngx-dhis2-visualization/models';
import { InterventionArchive } from '../../models/intervention-archive.model';

export enum InterventionArchiveAction {
  ArchiveIntervention = '[InterventionArchive] Archive Intervention',
  ArchiveInterventionSuccess = '[InterventionArchive] Archive Intervention success',
  ArchiveInterventionFail = '[InterventionArchive] Archive Intervention fail',
}

export const archiveIntervention = createAction(
  InterventionArchiveAction.ArchiveIntervention,
  props<{
    intervention: Intervention;
    visualizationLayers: VisualizationLayer[];
  }>()
);

export const archiveInterventionSuccess = createAction(
  InterventionArchiveAction.ArchiveInterventionSuccess,
  props<{ interventionArchive: InterventionArchive }>()
);

export const archiveInterventionFail = createAction(
  InterventionArchiveAction.ArchiveInterventionFail,
  props<{ error: Error }>()
);
