"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function ServicesTableHeader({
  dateSort,
  resolutionTimeSort,
  statusSort,
}) {
  return (
    <Block
      className={"table-row services header"}
      id={"w-node-_5d3ff6aa-f098-8507-f4b4-5da871d1c18d-71d1c18d"}
      tag={"div"}
    >
      <Block className={"table-cell"} tag={"div"}>
        <Block tag={"div"}>{"Falla y/o solicitud"}</Block>
      </Block>
      <Block className={"table-cell hr header"} tag={"div"}>
        <Block tag={"div"}>{"Status"}</Block>
        {statusSort}
      </Block>
      <Block className={"table-cell hr header m"} tag={"div"}>
        <Block tag={"div"}>{"Fecha"}</Block>
        {dateSort}
      </Block>
      <Block className={"table-cell hr header m"} tag={"div"}>
        {resolutionTimeSort}
        <Block tag={"div"}>{"Tiempo deresolución"}</Block>
      </Block>
    </Block>
  );
}
