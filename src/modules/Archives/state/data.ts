import { filter, orderBy } from "lodash";
import { selector, selectorFamily } from "recoil";
import { getUserAuthority } from "../../../core/services/user";
import { EngineState } from "../../../core/state/dataEngine";
import { UserState } from "../../../core/state/user";
import { Archive as ArchiveType } from "../../../shared/interfaces/archive";
import { createInterventionSummary } from "../../../shared/services/interventionSummary";
import { getArchive, getArchives } from "../services/data";

export const Archives = selector<Array<ArchiveType>>({
  key: "archives-state",
  get: async ({ get }) => {
    const engine = get(EngineState);
    const user = get(UserState);
    const archives = (await getArchives(engine)) as unknown as Array<ArchiveType>;
    const filteredArchives: Array<ArchiveType> = filter(archives, (archive) => {
      const { read } = getUserAuthority(user, createInterventionSummary(archive?.config));
      return read;
    }) as Array<ArchiveType>;
    return orderBy(filteredArchives, [(archive) => new Date(archive.dateCreated), "config.name"], "desc");
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
