import { orderBy } from "lodash";
import { selector, selectorFamily } from "recoil";
import { EngineState } from "../../../core/state/dataEngine";
import { Archive as ArchiveType } from "../../../shared/interfaces/archive";
import { getArchive, getArchives } from "../services/data";

export const Archives = selector<Array<ArchiveType>>({
  key: "archives-state",
  get: async ({ get }) => {
    const engine = get(EngineState);
    const archives = (await getArchives(engine)) as unknown as Array<ArchiveType>;
    return orderBy(archives, [(archive) => new Date(archive.dateCreated), "config.name"], "desc");
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
