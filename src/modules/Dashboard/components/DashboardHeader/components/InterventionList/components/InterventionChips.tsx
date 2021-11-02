import { Chip } from "@dhis2/ui";
import { slice } from "lodash";
import React from "react";

const interventions = [
  "Focused ANC Coverage",
  "ARV for PMTCT",
  "Full Immunization",
  "ANC Services",
  "Focused ANC Coverage",
  "ARV for PMTCT",
  "Full Immunization",
  "ANC Services",
  "Focused ANC Coverage",
  "ARV for PMTCT",
  "Full Immunization",
  "ANC Services",
  "Focused ANC Coverage",
  "ARV for PMTCT",
  "Full Immunization",
  "ANC Services",
];

export default function InterventionChips({ showAll }: { showAll: boolean }) {
  return (
    <div className="column w-100" style={{ maxWidth: "100%" }}>
      <div className="row w-100">
        {slice(interventions, 0, 3)?.map((intervention) => (
          <Chip key={`${intervention}-chip`}>{intervention}</Chip>
        ))}
      </div>
      {showAll && (
        <div className="row wrap w-100">
          {slice(interventions, 3, interventions.length)?.map((intervention) => (
            <Chip key={`${intervention}-chip`}>{intervention}</Chip>
          ))}
        </div>
      )}
    </div>
  );
}
