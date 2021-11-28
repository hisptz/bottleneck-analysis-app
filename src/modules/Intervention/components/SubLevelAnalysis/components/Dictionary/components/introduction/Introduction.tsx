import { useConfig } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { colors, IconLaunch16, Tooltip } from "@dhis2/ui";
import { IconButton } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import { useRecoilValue } from "recoil";
import { DictionaryIndicator } from "../../state";

export default function Introduction({ id }: { id: string }) {
  const { baseUrl, apiVersion } = useConfig();
  const indicatorDetails = useRecoilValue(DictionaryIndicator(id));
  return (
    <div>
      <div className="row gap align-center">
        <h2 id={"test-indicator-details"}>{indicatorDetails?.name} </h2>
        <Tooltip content={i18n.t("View in maintenance")}>
          <IconButton
            onClick={() => window.open(`${baseUrl}/dhis-web-maintenance/index.html#/edit/indicatorSection/indicator/${id}`, "_blank")}
            style={{ padding: 2, color: "#000000" }}>
            <IconLaunch16 color={colors.grey600} />
          </IconButton>
        </Tooltip>
      </div>
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
          {i18n.t("Identified by:")}
          <a target="_blank" href={`${baseUrl}/api/${apiVersion}/indicators/${id}.json`} rel="noreferrer">
            {indicatorDetails?.id}
          </a>
        </span>
      </p>
    </div>
  );
}

Introduction.propTypes = {
  id: PropTypes.string.isRequired,
};
