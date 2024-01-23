import { useAlert, useDataEngine } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { CurrentInterventionSummary, AuthorizedInterventionSummary } from "../../../../../../../core/state/intervention";
import { UserState } from "../../../../../../../core/state/user";
import { addBookmark, removeBookmark } from "../services/bookmark";

export default function useBookmark(): {
  bookmarked: boolean;
  toggleBookmark: () => void;
} {
  const engine = useDataEngine();
  const { id: userId } = useRecoilValue(UserState) ?? {};
  const { id } = useParams<{ id: string }>();
  const intervention = useRecoilValue(CurrentInterventionSummary(id));
  const { bookmarks } = intervention ?? {};
  const [interventionSummaries, updateSummaries] = useRecoilState(AuthorizedInterventionSummary);
  const { show } = useAlert(
    ({ message }) => message,
    ({ type }) => ({ ...type, duration: 3000 })
  );
  const bookmarked: boolean | undefined = bookmarks?.includes(userId ?? "") ?? false;

  const toggleBookmark = () => {
    try {
      if (bookmarked) {
        removeBookmark(engine, {
          userId,
          interventionId: intervention?.id,
          interventionSummaries: interventionSummaries ?? [],
          updateSummary: updateSummaries,
        });
      } else {
        addBookmark(engine, {
          userId,
          interventionId: intervention?.id,
          interventionSummaries: interventionSummaries ?? [],
          updateSummary: updateSummaries,
        });
      }
    } catch (e: any) {
      show({
        message: e?.message ?? i18n.t("An error occurred while adding/removing bookmark"),
        type: { info: true },
      });
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  return {
    bookmarked,
    toggleBookmark,
  };
}
