import { Chip, IconStarFilled24 } from "@dhis2/ui";
import { slice } from "lodash";
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
    [id]
  );

  return (
    <div className="column w-100" style={{ maxWidth: "100%" }}>
      <div className="row w-100">
        {slice(interventions, 0, 5)?.map((intervention) => (
          <Chip
            icon={intervention?.bookmarks?.includes(user.id) ? <IconStarFilled24 /> : null}
            selected={id === intervention.id}
            onClick={onChipClick(intervention?.id)}
            key={`${intervention?.id}-chip`}>
            {intervention?.name}
          </Chip>
        ))}
      </div>
      {showAll && (
        <div className="row wrap w-100">
          {slice(interventions, 5, interventions.length)?.map((intervention) => (
            <Chip selected={id === intervention.id} onClick={onChipClick(intervention?.id)} key={`${intervention?.id}-chip`}>
              {intervention?.name}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
