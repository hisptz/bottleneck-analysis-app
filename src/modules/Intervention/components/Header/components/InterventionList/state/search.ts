import { filter, sortBy } from "lodash";
import { atom, selectorFamily } from "recoil";
import { AuthorizedInterventionSummary as InterventionSummaryState } from "../../../../../../../core/state/intervention";
import { UserState } from "../../../../../../../core/state/user";
import { InterventionSummary } from "../../../../../../../shared/interfaces/interventionConfig";

export const SearchState = atom<string>({ key: "search-state", default: "" });

export const FilteredInterventions = selectorFamily({
  key: "filtered-intervention",
  get:
    (id: string) =>
    ({ get }) => {
      const interventions = get(InterventionSummaryState);
      const searchKeyword = get(SearchState);
      const user = get(UserState);
      return sortBy(
        filter(interventions, (intervention: InterventionSummary) => {
          return intervention.name.toLowerCase().indexOf((searchKeyword || "").toLowerCase()) != -1;
        })
      );
    },
});
