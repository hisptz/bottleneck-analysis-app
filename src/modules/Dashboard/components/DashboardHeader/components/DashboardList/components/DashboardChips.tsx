import { Chip, IconStarFilled24 } from "@dhis2/ui";
import { slice } from "lodash";
import React, { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { DashboardConfig } from "../../../../../../../shared/types/dashboardConfig";

type InterventionChipsProps = {
  dashboards: Array<DashboardConfig>;
  showAll: boolean;
};

export default function DashboardChips({ showAll, dashboards }: InterventionChipsProps) {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const onChipClick = useCallback(
    (selectedId: string) => () => {
      if (id !== selectedId) {
        history.replace(`/dashboards/${selectedId}`);
      }
    },
    [id]
  );

  return (
    <div className="column w-100" style={{ maxWidth: "100%" }}>
      <div className="row w-100">
        {slice(dashboards, 0, 5)?.map((dashboard) => (
          <Chip
            icon={dashboard.bookmarked ? <IconStarFilled24 /> : null}
            selected={id === dashboard.id}
            onClick={onChipClick(dashboard?.id)}
            key={`${dashboard?.id}-chip`}>
            {dashboard?.name}
          </Chip>
        ))}
      </div>
      {showAll && (
        <div className="row wrap w-100">
          {slice(dashboards, 5, dashboards.length)?.map((dashboard) => (
            <Chip selected={id === dashboard.id} onClick={onChipClick(dashboard?.id)} key={`${dashboard?.id}-chip`}>
              {dashboard?.name}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
