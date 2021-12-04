import { Layer, Popper } from "@dhis2/ui";
import React from "react";

export default function MenuPopup({
  children,
  menuRef,
  onClose,
}: {
  children: React.ReactElement;
  menuRef: React.Ref<any>;
  onClose: () => void;
}): React.ReactElement {
  const sameWidth = {
    name: "sameWidth",
    enabled: true,
    phase: "beforeWrite",
    requires: ["computeStyles"],
    fn: ({ state }: { state: any }) => {
      state.styles.popper.width = `${state.rects.reference.width}px`;
    },
    effect: ({ state }: { state: any }) => {
      state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`;
    },
  };

  return (
    <Layer onClick={onClose}>
      <Popper
        modifiers={[sameWidth, { name: "offset", options: { offset: [0, 8] } }]}
        observePopperResize
        observeReferenceResize
        reference={menuRef}
        placement="bottom-start">
        {children}
      </Popper>
    </Layer>
  );
}
