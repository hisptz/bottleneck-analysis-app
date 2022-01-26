import { Chip, IconStarFilled24 } from "@dhis2/ui";
import React, { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { UserState } from "../../../../../../../core/state/user";
import { InterventionSummary } from "../../../../../../../shared/interfaces/interventionConfig";

type InterventionChipsProps = {
  interventions: Array<InterventionSummary>;
  showAll: boolean;
};

export default function InterventionChips({ showAll, interventions }: InterventionChipsProps) {
  const user = useRecoilValue(UserState);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const onChipClick = useCallback(
    (selectedId: string) => () => {
      if (id !== selectedId) {
        history.replace(`/interventions/${selectedId}`);
      }
    },
    [history, id]
  );

  return (
    <div className="column w-100" style={{ maxWidth: "100%" }}>
      <div
        className="row w-100"
        id="check-wrap"
        style={{ maxWidth: "100%", overflowX: "hidden", flexWrap: "wrap", height: showAll ? 120 : 38, overflowY: showAll ? "auto" : "hidden" }}>
        {interventions?.map((intervention) => (
          <Chip
            dataTest={"intervention-chip"}
            icon={intervention?.bookmarks?.includes(user?.id) ? <IconStarFilled24 /> : null}
            selected={id === intervention?.id}
            onClick={onChipClick(intervention?.id)}
            key={`${intervention?.id}-chip`}>
            {intervention?.name}
          </Chip>
        ))}
      </div>
    </div>
  );
}
