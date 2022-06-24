import { useSetting } from "@dhis2/app-service-datastore";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { DATA_MIGRATION_CHECK } from "../../../constants/dataStore";

export function useAutoMigration(): void {
  const [skipMigration] = useSetting(DATA_MIGRATION_CHECK, { global: true });
  const history = useHistory();

  useEffect(() => {
    if (!skipMigration) {
      history.replace("/migrate");
    }
  }, [history, skipMigration]);
}
