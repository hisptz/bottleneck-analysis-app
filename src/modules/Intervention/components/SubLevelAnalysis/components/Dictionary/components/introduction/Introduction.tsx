import i18n from "@dhis2/d2-i18n";
import PropTypes from "prop-types";
import React from "react";
import { useRecoilValue } from "recoil";
import { DictionaryIndicator } from "../../state";
import classes from "./introduction.module.css";

export default function Introduction({ id }: { id: string }) {
  const indicatorDetails = useRecoilValue(DictionaryIndicator(id));
  return (
    <div>
      <h2 id={"test-indicator-details"}>{indicatorDetails?.name} </h2>

      <h3>{i18n.t("Introduction")}</h3>

      <p>
        <b id={"test-indicator-details"}>{indicatorDetails?.name} </b>
        {i18n.t("is a")}
        <b> {indicatorDetails?.indicatorType?.displayName} </b>
        {i18n.t("indicator, measured by")}
        <b id={"test-indicator-details"}> {indicatorDetails?.numeratorDescription} </b>
        {i18n.t("to")}
        <b id={"test-indicator-details"}> {indicatorDetails?.denominatorDescription} </b>
      </p>

      <p id={"test-indicator-details"}>
        {i18n.t("Its described as {{variable}}", {
          variable: indicatorDetails?.displayDescription,
        })}
      </p>
      <p>
        <span>
          {i18n.t("Identified by:")}{" "}
          <span id={"test-indicator-details"} className={classes.identifylink}>
            {" "}
            {indicatorDetails?.id}{" "}
          </span>{" "}
        </span>
      </p>
    </div>
  );
}

Introduction.propTypes = {
  id: PropTypes.string.isRequired,
};
