import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, InputField } from "@dhis2/ui";
import { OrgUnitSelectorModal } from "@hisptz/react-ui";
import { isEmpty } from "lodash";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useRecoilValueLoadable } from "recoil";
import { OrgUnit } from "../../../../../../core/state/orgUnit";

export default function OrgUnitField(): React.ReactElement {
  const [orgUnitOpen, setOrgUnitOpen] = useState(false);
  const { watch } = useFormContext();
  const orgUnitId = watch("orgUnitSelection.orgUnit.id");
  const orgUnit = useRecoilValueLoadable(OrgUnit(orgUnitId));

  return (
    <div className="column orgUnit-subLevelAnalysis-config" style={{ gap: 16 }}>
      <Controller
        name={"orgUnitSelection.orgUnit.id"}
        render={({ field }) => {
          return (
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "end", gap: 8 }}>
              <div className="flex-1">
                <InputField
                  value={field.value === "USER_ORGUNIT" ? i18n.t("User's organisation unit") : orgUnit.contents?.displayName ?? ""}
                  label={i18n.t("Organisation Unit")}
                  disabled
                />
              </div>
              <ButtonStrip>
                <Button disabled={orgUnit.state !== "hasValue"} onClick={() => setOrgUnitOpen(true)}>
                  {`${!field.value ? i18n.t("Select") : i18n.t("Change")} ${i18n.t("Organisation Unit")}`}
                </Button>
                {!field.value || field.value !== "USER_ORGUNIT" ? (
                  <Button disabled={orgUnit.state !== "hasValue"} onClick={() => field.onChange("USER_ORGUNIT")}>
                    {i18n.t("Clear")}
                  </Button>
                ) : null}
              </ButtonStrip>
              {orgUnitOpen && (
                <OrgUnitSelectorModal
                  singleSelection
                  value={field.value !== "USER_ORGUNIT" ? { orgUnits: [orgUnit.contents] } : undefined}
                  onClose={() => setOrgUnitOpen(false)}
                  hide={!orgUnitOpen}
                  onUpdate={({ orgUnits }) => {
                    if (!isEmpty(orgUnits)) {
                      field.onChange(orgUnits[0]?.id);
                    }
                    setOrgUnitOpen(false);
                  }}
                />
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
