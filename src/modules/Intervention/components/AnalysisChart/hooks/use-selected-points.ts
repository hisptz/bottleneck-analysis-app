import { isEmpty } from "lodash";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isArchiveId } from "../../../../../shared/utils/archives";
import { Archive } from "../../../../Archives/state/data";
import { ChartRef } from "../state/chart";

export default function useSelectedPoints(): void {
  const { id: archiveId } = useParams<{ id: string }>();
  const { selectedIndicators } = useRecoilValue(Archive(archiveId)) ?? { selectedIndicators: [] };
  const chartRef = useRecoilValue(ChartRef(archiveId));

  useEffect(() => {
    if (selectedIndicators) {
      if (isArchiveId(archiveId) && chartRef && !isEmpty(selectedIndicators)) {
        for (const indicator of selectedIndicators) {
          const indicatorIndex = chartRef?.chart?.get(indicator)?.index;
          chartRef.chart.series[0].data[indicatorIndex].select(true, true);
        }
      }
    }
  }, [archiveId, chartRef, selectedIndicators]);
}
