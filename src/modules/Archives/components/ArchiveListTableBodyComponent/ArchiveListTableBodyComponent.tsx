/* eslint-disable no-unused-vars */
import { Button, IconMore16, TableBody, Menu, MenuItem, Popover, DataTableRow, DataTableCell } from "@dhis2/ui";
import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
export default function ArchiveListTableBodyComponent() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [stateActionRef, setStateActionRef] = useState<any>();
  const history = useHistory();
  return (
    <>
      <TableBody>
        <DataTableRow>
          <DataTableCell align={"start"}>Focused ANC Coverage</DataTableCell>
          <DataTableCell align={"center"}>Animal Region</DataTableCell>
          <DataTableCell align={"center"}>2019</DataTableCell>
          <DataTableCell align={"center"}>04 Oct 2020</DataTableCell>
          <DataTableCell align={"center"}>
            <div ref={ref}>
              <Button
                onClick={(_: any, e: MouseEvent) => setStateActionRef(e.target)}
                icon={<IconMore16 color="#212529" />}
                name="Icon Large Button"
                small
                value="default"
              />
              {stateActionRef && (
                <Popover onClickOutside={() => setStateActionRef(undefined)} placement="bottom-start" reference={ref}>
                  <Menu>
                    <MenuItem
                      onClick={(_: any, _e: Event) => {
                        history.push("/UyVdbo21UJs/archives/UyVdbo21UJs");
                      }}
                      label="View"
                    />
                    <MenuItem label="Remove" />
                    <MenuItem label="Refresh" />
                  </Menu>
                </Popover>
              )}
            </div>
          </DataTableCell>
        </DataTableRow>
        <DataTableRow>
          <DataTableCell align={"start"}>Full Immunization</DataTableCell>
          <DataTableCell align={"center"}>Animal Region</DataTableCell>
          <DataTableCell align={"center"}>2019</DataTableCell>
          <DataTableCell align={"center"}>12 Nov 2020</DataTableCell>
          <DataTableCell align={"center"}>
            <Button icon={<IconMore16 color="#212529" />} name="Icon large button" small value="default" />
          </DataTableCell>
        </DataTableRow>
        <DataTableRow>
          <DataTableCell align={"start"}>ANC Services</DataTableCell>
          <DataTableCell align={"center"}>Animal Region</DataTableCell>
          <DataTableCell align={"center"}>2019</DataTableCell>
          <DataTableCell align={"center"}>04 Oct 2020</DataTableCell>
          <DataTableCell align={"center"}>
            <Button icon={<IconMore16 color="#212529" />} name="Icon large button" small value="default" />
          </DataTableCell>
        </DataTableRow>
        <DataTableRow>
          <DataTableCell align={"start"}>ARVs for PMTCT</DataTableCell>
          <DataTableCell align={"center"}>Animal Region</DataTableCell>
          <DataTableCell align={"center"}>2019</DataTableCell>
          <DataTableCell align={"center"}>04 Sept 2020</DataTableCell>
          <DataTableCell align={"center"}>
            <Button icon={<IconMore16 color="#212529" />} name="Icon large button" small value="default" />
          </DataTableCell>
        </DataTableRow>
      </TableBody>
    </>
  );
}
