import { filter } from "lodash";
import { atom, selector } from "recoil";
import { InterventionSummary as InterventionSummaryState } from "../../../../../../../core/state/intervention";
import { InterventionSummary } from "../../../../../../../shared/interfaces/interventionConfig";

export const SearchState = atom<string>({ key: "search-state", default: "" });

export const FilteredInterventions = selector({
  key: "filtered-intervention",
  get: ({ get }) => {
    const interventions = get(InterventionSummaryState);
    const searchKeyword = get(SearchState);

    const filteredInterventions = filter(interventions, (intervention: InterventionSummary) => {
      return intervention.name.toLowerCase().indexOf((searchKeyword || "").toLowerCase()) != -1;
    });

    return filteredInterventions;
  },
});
