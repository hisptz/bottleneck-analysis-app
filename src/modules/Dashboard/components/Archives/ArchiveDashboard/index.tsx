/* eslint-disable no-unused-vars */
import { ButtonStrip, Button, IconInfo24 } from "@dhis2/ui";
import React from "react";
import { useHistory } from "react-router-dom";
import AnalysisChart from "../../AnalysisChart";
import RootCauseAnalysis from "../../RootCauseAnalysis";
import SubLevelAnalysis from "../../SubLevelAnalysis";
import "./ArchiveDashboard.css";
export default function DashboardArchive() {
  const history = useHistory();
  return (
    <div className="main-container">
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
      <div className="archive-intervention-info">
        <IconInfo24 />
        <div className="archive-info-summary">
          <p
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              marginTop: "0.8%",
            }}>
            You are current viewing archived intervention
          </p>
          <p>
            Data shown is based on archive of 04 Aug 2020 for Focused ANC Coverage from Animal Region on 2019 . You can still view latest snapshot of this
            intervention
          </p>
          <p
            style={{
              fontSize: "13px",
              textDecoration: "underline",
            }}>
            Go to live Focus ANC Coverage Intervention
          </p>
        </div>
      </div>
      <div className="cards">
        <AnalysisChart />
        {/* <SubLevelAnalysis /> */}
        <RootCauseAnalysis />
      </div>
    </div>
  );
}
