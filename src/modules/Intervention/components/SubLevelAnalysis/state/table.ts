import { atomFamily } from "recoil";

export const SubLevelTableRef = atomFamily<any | null, string>({
	key: "sub-level-table-ref",
	default: null,
});

export const SubLevelAverageColumnVisible = atomFamily<
	boolean,
	string | undefined
>({
	default: false,
	key: "sub-level-average-column-visible",
});
