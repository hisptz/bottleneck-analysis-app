import { Divider } from "@dhis2/ui";
import { head, last, sortBy } from "lodash";
import React, { forwardRef, useMemo } from "react";
import { ThematicMapLayer } from "../../../../../../../../../../../../../../shared/interfaces/interventionConfig";
import "../../../../../../styles/legends.css";
import Bubbles from "./components/Bubbles";

function getRadius(legends: Array<any>) {
  return {
    radiusHigh: head(legends)?.endValue / 25,
    radiusLow: last(legends)?.startValue / 25,
  };
}

function BubbleLegend({ indicator, data, config }: { indicator: any; data: any; config: ThematicMapLayer }, ref: React.LegacyRef<HTMLDivElement> | undefined) {
  const legends = useMemo(() => {
    return sortBy(head(indicator.legendSets)?.legends ?? [], "startValue").reverse();
  }, [indicator]);

  const { radiusHigh, radiusLow } = getRadius(legends);

  return (
    <div className="legend-card" ref={ref}>
      <h4 className="legend-header">{indicator?.displayName}</h4>
      <Divider margin={"0"} />
      <div className="legend-list pt-8">
        <Bubbles classes={legends?.reverse()} radiusHigh={radiusHigh} radiusLow={radiusLow} color={"#FF0000"} />
      </div>
    </div>
  );
}

export default forwardRef(BubbleLegend);
