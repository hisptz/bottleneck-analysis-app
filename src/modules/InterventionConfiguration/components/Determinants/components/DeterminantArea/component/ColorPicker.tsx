import { Button, colors, Popover } from "@dhis2/ui";
import React, { useCallback, useState } from "react";
import { SketchPicker } from "react-color";
import { Group } from "../../../../../../../shared/interfaces/interventionConfig";
import { find, get } from "lodash";
import { DEFAULT_INTERVENTION_CONFIG } from "../../../../../../../constants/defaults";

type ColorPickerProps = {
  reference: EventTarget;
  value: any;
  onClose: () => void;
  onReset: () => void;
  onChange: (value: any) => void;
};

function ColorPickerPopper({ reference, value, onClose, onChange, onReset }: ColorPickerProps) {
  return (
    <Popover reference={reference} placement="auto" strategy="fixed" className="popper" onClickOutside={onClose}>
      <div className="column gap p-8">
        <SketchPicker
          color={
            // @ts-ignore
            { hex: value }
          }
          onChange={(color: { hex: any }) => {
            onChange(color.hex);
            onClose();
          }}
        />
        <Button
          onClick={(value: any, e: { stopPropagation: () => void }) => {
            e.stopPropagation();
            onReset();
          }}>
          Reset
        </Button>
      </div>
    </Popover>
  );
}

function getDefaultColor(group: Group) {
  const defaultGroups = get(DEFAULT_INTERVENTION_CONFIG, `dataSelection.groups`);
  const defaultGroup = find(defaultGroups, (g: Group) => {
    if (group.code) {
      return g.code === group.code;
    }
    return g.sortOrder === group.sortOrder;
  });
  if (defaultGroup) {
    return defaultGroup?.style?.color;
  }
  return colors.grey600;
}

export default function ColorPicker({ onChange, group }: { color?: string; onChange: (color: string) => void; group: Group }): React.ReactElement {
  const [reference, setReference] = useState<EventTarget | undefined>(undefined);
  const color = group?.style?.color ?? getDefaultColor(group);
  const onReset = useCallback(() => {
    onChange(getDefaultColor(group));
  }, [group]);

  return (
    <>
      <div
        id={`color-selector-btn-${color}`}
        onClick={(e) => {
          e.stopPropagation();
          setReference(e.currentTarget);
        }}
        style={{ background: color, borderColor: colors.grey500, width: 80 }}
        className={"legend-color"}
      />
      {reference && <ColorPickerPopper onReset={onReset} onClose={() => setReference(undefined)} reference={reference} value={color} onChange={onChange} />}
    </>
  );
}
