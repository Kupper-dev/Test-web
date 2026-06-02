"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function MetricWrapper({
  metrics3CardSlot1 = "",
  metrics3CardSlot2 = "",
  metrics3CardSlot3 = "",
  metricTitle = "Metric title",
}) {
  return (
    <Block className={"metric-wrapper"} tag={"div"}>
      <Block className={"text-medium-big"} tag={"div"}>
        {metricTitle}
      </Block>
      <Block className={"card-wrapper"} tag={"div"}>
        <Block tag={"div"}>{metrics3CardSlot1}</Block>
        <Block tag={"div"}>{metrics3CardSlot2}</Block>
        <Block tag={"div"}>{metrics3CardSlot3}</Block>
      </Block>
    </Block>
  );
}
