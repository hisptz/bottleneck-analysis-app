import { useDataEngine } from "@dhis2/app-runtime";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { AuthorizedInterventionSummary } from "../../../core/state/intervention";
import deleteIntervention from "../services/delete";

export default function useDelete(): { onDelete: () => void; openDeleteConfirm: boolean; onConfirmDelete: () => Promise<void>; onDeleteCancel: () => void } {
  const { id } = useParams<{ id: string }>();
  const summaries = useRecoilValue(AuthorizedInterventionSummary);
  const engine = useDataEngine();
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);

  const onConfirmDelete = async () => {
    if (id) {
      await deleteIntervention(engine, id, summaries);
      setOpenDeleteConfirm(false);
    }
  };

  return {
    onDelete: () => setOpenDeleteConfirm(true),
    onDeleteCancel: () => setOpenDeleteConfirm(false),
    openDeleteConfirm,
    onConfirmDelete,
  };
}
