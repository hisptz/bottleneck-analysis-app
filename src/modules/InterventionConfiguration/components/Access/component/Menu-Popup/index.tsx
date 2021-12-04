import { Card, Layer, Popper } from "@dhis2/ui";
import React from "react";

export default function MenuPopup({
  children,
  maxHeight,
  menuWidth,
  onClick,
  menuRef,
}: {
  children: React.ReactElement;
  menuWidth?: string;
  maxHeight?: string;
  onClick: () => void;
  menuRef: React.Ref<any>;
}): React.ReactElement {
  return (
    <Layer onClick={onClick} transparent>
      <Popper reference={menuRef} placement="bottom" observeReferencesize>
        <div style={{ width: "100%" }}>
          <Card>{children}</Card>
        </div>
      </Popper>
      <style>{`
        .card {
          width: ${menuWidth};
          max-height: ${maxHeight};
        }
      `}</style>
    </Layer>
  );
}
