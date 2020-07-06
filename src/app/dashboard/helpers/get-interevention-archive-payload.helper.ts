import { InterventionArchive } from '../models/intervention-archive.model';

export function getInterventionArchivePayload(): InterventionArchive {
  return { id: '', intervention: null, favorites: [], analysticsList: [] };
}
