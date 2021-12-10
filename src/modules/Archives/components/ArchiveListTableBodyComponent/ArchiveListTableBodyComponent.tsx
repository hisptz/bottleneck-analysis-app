import { TableBody } from "@dhis2/ui";
import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { PaginatedArchives } from "../../state/pagination";
import ArchiveRow from "../ArchiveRow";

export default function ArchiveListTableBodyComponent() {
  const ref = useRef<HTMLDivElement | null>(null);
  const archives = useRecoilValue(PaginatedArchives);
  const [stateActionRef, setStateActionRef] = useState<any>();
  const history = useHistory();

  return (
    <TableBody>
      {archives?.map((archive: any) => (
        <ArchiveRow key={`${archive?.id}-row`} archive={archive} />
      ))}
    </TableBody>
  );
}
