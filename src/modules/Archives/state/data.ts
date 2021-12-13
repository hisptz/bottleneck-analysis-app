import { filter, find, orderBy } from "lodash";
import { selector, selectorFamily } from "recoil";
import { getUserAuthority } from "../../../core/services/user";
import { EngineState } from "../../../core/state/dataEngine";
import { UserState } from "../../../core/state/user";
import { InterventionAccess } from "../../../shared/interfaces/access";
import { Archive as ArchiveType } from "../../../shared/interfaces/archive";
import { createInterventionSummary } from "../../../shared/services/interventionSummary";
import { getArchive, getArchives } from "../services/data";

export const Archives = selector<Array<ArchiveType>>({
  key: "archives-state",
  get: async ({ get }) => {
    const engine = get(EngineState);
    const user = get(UserState);
    const archives = (await getArchives(engine)) as unknown as Array<ArchiveType>;
    return orderBy(
      filter(archives, (archive) => {
        const { read } = getUserAuthority(user, archive.config);
        return read;
      }) as Array<ArchiveType>,
      [(archive) => new Date(archive.dateCreated), "config.name"],
      "desc"
    );
  },
});

export const Archive = selectorFamily<ArchiveType, string>({
  key: "archive-state",
  get:
    (id: string) =>
    async ({ get }) => {
      const engine = get(EngineState);
      return await getArchive(engine, id);
    },
});

export const ArchiveAccess = selectorFamily<InterventionAccess | undefined, string>({
  key: "archive-access",
  get:
    (archiveId: string) =>
    ({ get }) => {
      const user = get(UserState);
      const archives = get(Archives);
      const archive = find(archives, ["id", archiveId]);

      if (archive) {
        return getUserAuthority(user, createInterventionSummary(archive?.config));
      }
    },
});
