import { Divider } from "@dhis2/ui";
import React from "react";
import Header from "./components/InterventionHeader";
import InterventionList from "./components/InterventionList";
import "./intervention-header.css";

export default function InterventionHeader() {
  return (
    <div className="header-container">
      <InterventionList />
      <Divider margin={"0"} />
      <Header />
    </div>
  );
}
