import i18n from "@dhis2/d2-i18n";
import { Chip, Input } from "@dhis2/ui";
import { filter, flattenDeep, head } from "lodash";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import CardLoader from "../../../../../../shared/components/loaders/CardLoader";
import { DataSelection } from "../../../../../../shared/interfaces/interventionConfig";
import { InterventionStateSelector } from "../../../../state/intervention";
import SingleDictionary from "./components/SingleDictionary";

export default function Dictionary(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [searchKeyword, setSearchKeyword] = useState<string | undefined>();
  const dataSelection = useRecoilValue<DataSelection>(InterventionStateSelector({ id, path: ["dataSelection"] }));
  const indicators = useMemo(() => {
    const indicators = flattenDeep(
      dataSelection?.groups?.map((group) => {
        return group?.items?.map(({ id, name }) => {
          return {
            id,
            name,
          };
        });
      })
    );
    if (searchKeyword) {
      return filter(indicators, ({ name, id }) => {
        return name.match(RegExp(searchKeyword)) || id.match(RegExp(searchKeyword));
      }) as Array<{ name: string; id: string }>;
    }
    return indicators;
  }, [dataSelection?.groups, searchKeyword]);
  const [selectedIndicator, setSelectedIndicator] = useState<string | undefined>(head(indicators)?.id);

  useEffect(() => {
    setSelectedIndicator(head(indicators)?.id);
  }, [id, indicators, searchKeyword]);

  return (
    <div className="column h-100 w-100 p-8">
      <div className="row gap pb-8 w-100 ">
        <div style={{ minWidth: 200 }}>
          <Input fullWidth value={searchKeyword} onChange={({ value }: { value: string }) => setSearchKeyword(value)} placeholder={i18n.t("Search")} />
        </div>
        <div className="row gap w-100" style={{ overflow: "auto" }}>
          {indicators?.map(({ id, name }) => (
            <Chip onClick={() => setSelectedIndicator(id)} selected={id === selectedIndicator} key={`${id}-chip`}>
              {name}
            </Chip>
          ))}
        </div>
      </div>
      <div style={{ overflow: "auto" }} className="w-100 h-100 flex-1 center align-center ">
        {selectedIndicator && (
          <Suspense fallback={<CardLoader />}>
            <SingleDictionary id={selectedIndicator} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
