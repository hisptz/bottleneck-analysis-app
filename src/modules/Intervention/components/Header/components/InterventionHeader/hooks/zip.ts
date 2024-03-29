import { useAlert } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilCallback } from "recoil";
import { CHART_EXPORT_URL } from "../../../../../../../constants/chart";
import useInterventionConfig from "../../../../../../../shared/hooks/useInterventionConfig";
import { isArchiveId } from "../../../../../../../shared/utils/archives";
import { getExcelFromAnalytics, getExcelFromTable } from "../../../../../../../shared/utils/download";
import { InterventionStateSelector } from "../../../../../state/intervention";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../../../../state/selections";
import { ChartRef } from "../../../../AnalysisChart/state/chart";
import { ChartData } from "../../../../AnalysisChart/state/data";
import { RootCauseTableRef } from "../../../../RootCauseAnalysis/state/table";
import { SubLevelTableRef } from "../../../../SubLevelAnalysis/state/table";

export default function useZip(): { onZipDownload: () => void; disabled: boolean; downloading: boolean } {
  const [downloading, setDownloading] = useState(false);
  const { id: interventionId } = useParams<{ id: string }>();
  const intervention = useInterventionConfig();
  const { show } = useAlert(
    ({ message }) => message,
    ({ type }) => ({ ...type, duration: 3000 })
  );
  const disabled = false;

  const onZipDownload = useRecoilCallback(({ snapshot }) => async () => {
    try {
      if (interventionId) {
        setDownloading(true);
        const orgUnit = await snapshot.getPromise(InterventionOrgUnitState(interventionId));
        const period = await snapshot.getPromise(InterventionPeriodState(interventionId));
        const groups = await snapshot.getPromise(InterventionStateSelector({ id: interventionId, path: ["dataSelection", "groups"] }));
        const chartData = await snapshot.getPromise(ChartData(interventionId));

        const zipName = `${intervention.name} (${orgUnit.displayName} - ${period.name}) ${isArchiveId(interventionId) ? ", - Archive" : ""}`;
        const zip = new JSZip();
        const files = zip.folder(`${intervention.name}`);

        const rootCauseRef = await snapshot.getPromise(RootCauseTableRef(interventionId));
        const subLevelRef = await snapshot.getPromise(SubLevelTableRef(interventionId));
        const chartRef = await snapshot.getPromise(ChartRef(interventionId));

        if (chartRef.chart) {
          const chartSVG = chartRef.chart.getSVG();
          const chartImage = await fetch(CHART_EXPORT_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              svg: chartSVG,
              type: "image/png",
              scale: 2,
            }),
          }).then((res) => res.blob());
          files?.file(`Bottleneck Analysis Chart.png`, chartImage);
        }

        if (rootCauseRef) {
          files?.file(`Root Cause Data.xlsx`, await getExcelFromTable(rootCauseRef, "Root Cause Data"), {
            base64: true,
          });
        }

        if (subLevelRef) {
          files?.file(`Sub Level Data.xlsx`, await getExcelFromTable(subLevelRef, "Sub Level Data"), {
            base64: true,
          });
        }

        files?.file(`Chart Analysis Data.xlsx`, await getExcelFromAnalytics({ analytics: chartData, orgUnit, groups }, `Analysis Data`), {
          base64: true,
        });
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `${zipName}.zip`);
      }
    } catch (e) {
      console.error(e);
      show({ message: i18n.t("Failed to download zip file"), type: { info: true } });
    } finally {
      setDownloading(false);
    }
    setDownloading(false);
  });
  return {
    onZipDownload,
    disabled,
    downloading,
  };
}
