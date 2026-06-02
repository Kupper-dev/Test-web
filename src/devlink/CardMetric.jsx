"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import { StatusText } from "./StatusText";

export function CardMetric({
  metricBadge = "Base",
  metricValue = "0.0 Value",
  title = "Metric title",
}) {
  return (
    <Block
      className={"card"}
      id={"w-node-_1b345183-3906-9ab9-1af1-0f717a91e32e-7a91e32e"}
      tag={"div"}
    >
      <Block className={"text-micro"} tag={"div"}>
        {title}
      </Block>
      <Block className={"spacer-1-rem"} tag={"div"} />
      <Block className={"text-big bold"} tag={"div"}>
        {metricValue}
      </Block>
      <Block className={"spacer-1-rem"} tag={"div"} />
      <StatusText status={"+ Objetivos cumplidos"} variant={metricBadge} />
    </Block>
  );
}
