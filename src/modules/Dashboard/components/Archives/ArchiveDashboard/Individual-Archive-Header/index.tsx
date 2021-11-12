/* eslint-disable no-unused-vars */
import { ButtonStrip, Button } from "@dhis2/ui";
import React from "react";
import { useHistory } from "react-router-dom";
import "./index.css";

export default function IndividualArchiveHeader() {
  const history = useHistory();
  return (
    <div className="archive-header">
      <div className="column">
        <p
          style={{
            fontSize: 22,
            marginBottom: "0",
            fontWeight: "bold",
          }}>
          Focused ANC Coverage
        </p>
        <p>Animal Region - 2019</p>
      </div>
      <div
        style={{
          padding: 6,
          marginTop: "3px",
        }}>
        <ButtonStrip end>
          <Button
            onClick={(_: any, e: Event) => {
              history.goBack();
            }}>
            Back to archives
          </Button>
          <Button>Refresh</Button>
          <Button>Delete</Button>
        </ButtonStrip>
      </div>
    </div>
  );
}
