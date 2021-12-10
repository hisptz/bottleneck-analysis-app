import { TableBody } from "@dhis2/ui";
import React, { Suspense } from "react";
import { useRecoilValue } from "recoil";
import { PaginatedArchives } from "../../state/pagination";
import ArchiveRow from "../ArchiveRow";

export default function ArchiveListTableBodyComponent() {
  const archives = useRecoilValue(PaginatedArchives);

  return (
    <Suspense fallback={<TableBody loading />}>
      <TableBody>
        {archives?.map((archive: any) => (
          <ArchiveRow key={`${archive?.id}-row`} archive={archive} />
        ))}
      </TableBody>
    </Suspense>
  );
}
