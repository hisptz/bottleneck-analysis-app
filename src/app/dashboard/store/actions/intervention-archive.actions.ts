import { createAction, props } from '@ngrx/store';
import { Intervention } from '../../models';
import { VisualizationLayer } from '../../modules/ngx-dhis2-visualization/models';
import { InterventionArchive } from '../../models/intervention-archive.model';
import { ErrorMessage } from '@iapps/ngx-dhis2-http-client';

export enum InterventionArchiveAction {
  ArchiveIntervention = '[InterventionArchive] Archive Intervention',
  UpsertInterventionArchive = '[InterventionArchive] Upsert Intervention archive',
  UpsertInterventionArchives = '[InterventionArchive] Upsert Intervention archives',
  ArchiveInterventionFail = '[InterventionArchive] Archive Intervention fail',
  LoadInterventionArchives = '[InterventionArchive] Load Intervention archives',
}

export const archiveIntervention = createAction(
  InterventionArchiveAction.ArchiveIntervention,
  props<{
    intervention: Intervention;
    visualizationLayers: VisualizationLayer[];
  }>()
);

export const upsertInterventionArchive = createAction(
  InterventionArchiveAction.UpsertInterventionArchive,
  props<{ interventionArchive: InterventionArchive }>()
);

export const upsertInterventionArchives = createAction(
  InterventionArchiveAction.UpsertInterventionArchives,
  props<{ interventionArchives: InterventionArchive[] }>()
);

export const archiveInterventionFail = createAction(
  InterventionArchiveAction.ArchiveInterventionFail,
  props<{ error: ErrorMessage }>()
);

export const loadInterventionArchive = createAction(
  InterventionArchiveAction.LoadInterventionArchives,
  props<{ interventionId: string }>()
);
