import { useAlert, useDataEngine } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { BNA_NAMESPACE } from "../../../../../../../../../../../constants/dataStore";
import { InterventionSummary } from "../../../../../../../../../../../core/state/intervention";
import { UserState } from "../../../../../../../../../../../core/state/user";
import { InterventionConfig, InterventionSummary as InterventionSummaryType } from "../../../../../../../../../../../shared/interfaces/interventionConfig";
import { uid } from "../../../../../../../../../../../shared/utils/generators";
import { createIntervention } from "../../../../../../../../../../InterventionConfiguration/services/save";

const cloneQuery = {
  intervention: {
    resource: `dataStore/${BNA_NAMESPACE}`,
    id: ({ id }: any) => id,
  },
};
export default function useClone(): { cloning: boolean; onClone: (interventionId: string, name: string) => void } {
  const history = useHistory();
  const summaries: Array<InterventionSummaryType> | undefined = useRecoilValue(InterventionSummary);
  const user = useRecoilValue(UserState);
  const engine = useDataEngine();
  const [cloning, setCloning] = useState(false);
  const { show } = useAlert(
    ({ message }) => message,
    ({ type }) => ({ ...type, duration: 3000 })
  );

  const onClone = useCallback(
    async (interventionId: string, name: string) => {
      setCloning(true);
      try {
        const { intervention } = (await engine.query(cloneQuery, { variables: { id: interventionId } })) ?? {};

        if (!intervention) {
          throw new Error(i18n.t("Intervention not found"));
        }

        const newIntervention = {
          ...(intervention as unknown as InterventionConfig),
          id: uid(),
          user: {
            id: user.id,
          },
          name,
        };
        await createIntervention(engine, newIntervention, summaries);
        show({
          message: "Intervention cloned successfully",
          type: { success: true },
        });
        history.replace(`/${newIntervention.id}/configuration`);
      } catch (e: any) {
        show({
          message: e?.message ?? i18n.t("Failed to Clone Intervention"),
          type: { info: true },
        });
      }
      setCloning(false);
    },
    [engine, history, show, summaries, user.id]
  );

  return {
    cloning,
    onClone,
  };
}
