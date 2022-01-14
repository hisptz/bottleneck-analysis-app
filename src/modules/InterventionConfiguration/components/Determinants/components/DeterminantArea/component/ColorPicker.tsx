import { colors, Popover } from "@dhis2/ui";
import React, { useState } from "react";
import { SketchPicker } from "react-color";

type ColorPickerProps = {
  reference: EventTarget;
  value: any;
  onClose: () => void;
  onChange: (value: any) => void;
};

function ColorPickerPopper({ reference, value, onClose, onChange }: ColorPickerProps) {
  return (
    <Popover reference={reference} placement="auto" strategy="fixed" className="popper" onClickOutside={onClose}>
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
    </Popover>
  );
}

export default function ColorPicker({ color, onChange }: { color?: string; onChange: (color: string) => void }): React.ReactElement {
  const [reference, setReference] = useState<EventTarget | undefined>(undefined);

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
      {reference && <ColorPickerPopper onClose={() => setReference(undefined)} reference={reference} value={color} onChange={onChange} />}
    </>
  );
}
