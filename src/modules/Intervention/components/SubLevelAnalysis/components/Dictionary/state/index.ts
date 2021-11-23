import { get as _get } from "lodash";
import { atom, atomFamily, selectorFamily } from "recoil";
import { EngineState } from "../../../../../../../core/state/dataEngine";
import { Indicator as IndicatorInterface } from "../interfaces";

export const DataElementsStateDictionary = atom({
  key: "dataElementsStoreDictionary", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const ProgramIndicatorStateDictionary = atom({
  key: "programIndicatorStateDictionary",
  default: [],
});

export const DataSetReportingRatesStateDictionary = atom({
  key: "dataSetReportingRatesStateDictionary",
  default: [],
});

export const DataSourceStateDictionary = atom({
  key: "dataSourceStateDictionary",
  default: { id: undefined, type: undefined },
});

export const DataSetDataElementCountState = atom({
  key: "dataSetDataElementsCountState",
  default: 0,
});

export const ProgramDataElementCountState = atom({
  key: "programDataElementCountState",
  default: 0,
});

const query = {
  indicator: {
    resource: "indicators",
    id: ({ id }: any) => id,
    params: {
      fields: [
        "id",
        "name",
        "displayDescription",
        "href",
        "numeratorDescription",
        "denominatorDescription",
        "indicatorType[displayName,id]",
        "dataSets[id,displayName,timelyDays,periodType]",
        "indicatorGroups[id,displayName,indicators[id,displayName]]",
        "legendSets[id,displayName,legends[id,displayName,startValue,endValue,color]]",
        "numerator",
        "denominator",
      ],
    },
  },
};

export const DictionaryIndicator = atomFamily<undefined | IndicatorInterface, string>({
  key: "dictionary-indicator",
  default: selectorFamily({
    key: "dictionary-indicator-selector",
    get:
      (id: string) =>
      async ({ get }) => {
        const engine = get(EngineState);
        const { indicator } = await engine.query(query, { variables: { id } });
        return indicator;
      },
  }),
});

export const DictionaryIndicatorSelector = selectorFamily({
  key: "dictionary-indicator-selector",
  get:
    ({ id, path }: { id: string; path: Array<string> }) =>
    ({ get }) => {
      const indicator = get(DictionaryIndicator(id));
      return _get(indicator, path);
    },
});
