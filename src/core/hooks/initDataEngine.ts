import { useDataEngine } from "@dhis2/app-runtime";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { EngineState } from "../state/dataEngine";

export default function useDataEngineInit() {
  const engine = useDataEngine();
  const setEngine = useSetRecoilState(EngineState);

  useEffect(() => {
    setEngine(engine);
  }, [engine, setEngine]);
}
