import { useDataQuery } from "@dhis2/app-runtime";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import AutoComplete from "../Autocomplete";

const query = {
  search: {
    resource: "sharing/search",
    params: ({ search }) => ({
      key: search,
    }),
  },
};
export default function SharingAutoComplete({ selected, onSelection }: { selected: string; onSelection: any }) {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  /**
   * NOTE:
   * HOW WE WILL FETCH DATA USING DATA QUERY TO SHARING/SEARCH AS RESOURCE
   */
  const { data, refetch, fetching } = useDataQuery(query, {
    lazy: true,
    onComplete: () => setShowResults(true),
  });

  useEffect(() => {
    if (selected) {
      setSearch(selected);
    }
  }, [selected]);

  const debouncedRefetch = useCallback(debounce(refetch, 250), [refetch]);

  useEffect(() => {
    if (search) {
      debouncedRefetch({ search });
    } else {
      onSelection(null);
      setShowResults(false);
    }
  }, [search]);

  // Concatenate all the results

  let results: any = [];

  if (data?.search?.users) {
    const mapped = data.search.users.map((user) => ({
      ...user,
      type: "user",
    }));
    results = results.concat(mapped);
  }
  return (
    <AutoComplete
      inputWidth="400px"
      label="User, group or role"
      loading={fetching}
      placeholder={"Search"}
      search1={search}
      searchResults={showResults ? results : []}
      onClose={() => setShowResults(false)}
      onSearch={setSearch}
      onSelect={(id: string) => {
        onSelection(results.find((result: any) => result.id === id));
        setShowResults(false);
      }}
    />
  );
}
