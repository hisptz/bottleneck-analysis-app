import { useDataEngine } from "@dhis2/app-runtime";
import { useEffect } from "react";
import { migrateIntervention } from "../services/migrate";

export default function useMigrate() {
  const engine = useDataEngine();
  useEffect(() => {
    migrateIntervention(engine);
  }, []);
}
