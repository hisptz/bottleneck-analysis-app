import { Chip } from "@dhis2/ui";
import { flattenDeep, head } from "lodash";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import CardLoader from "../../../../../../shared/components/loaders/CardLoader";
import { DataSelection } from "../../../../../../shared/interfaces/interventionConfig";
import { InterventionStateSelector } from "../../../../state/intervention";
import SingleDictionary from "./components/SingleDictionary";

export default function Dictionary() {
  const { id } = useParams<{ id: string }>();
  const dataSelection = useRecoilValue<DataSelection>(InterventionStateSelector({ id, path: ["dataSelection"] }));
  const indicators = useMemo(() => {
    return flattenDeep(
      dataSelection?.groups?.map((group) => {
        return group?.items?.map(({ id, name }) => {
          return {
            id,
            name,
          };
        });
      })
    );
  }, [id]);
  const [selectedIndicator, setSelectedIndicator] = useState<string | undefined>(head(indicators)?.id);

  useEffect(() => {
    setSelectedIndicator(head(indicators)?.id);
  }, [id]);

  return (
    <div className="column h-100 w-100">
      <div className="row gap">
        {indicators?.map(({ id, name }) => (
          <Chip onClick={() => setSelectedIndicator(id)} selected={id === selectedIndicator} key={`${id}-chip`}>
            {name}
          </Chip>
        ))}
      </div>
      <div style={{ overflow: "auto" }} className="w-100 h-100 flex center align-center ">
        {selectedIndicator && (
          <Suspense fallback={<CardLoader />}>
            <SingleDictionary id={selectedIndicator} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
