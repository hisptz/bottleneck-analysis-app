import { Card, Layer, Popper } from "@dhis2/ui";
import React from "react";
import { Node } from "typescript";

export default function MenuPopup(children: Node, maxHeight: string = "280px", menuWidth: string, onClick: Function, menuRef: object) {
  return (
    <Layer onClick={onClick} transparent>
      <Popper reference={menuRef} placement="bottom" observeReferencesize>
        <div className="card">
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
