"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function DevicesTableHeader({
  brandSort,
  nextMaintenanceSort,
  statusSort,
  typeSort,
}) {
  return (
    <Block
      className={"table-row devices header"}
      id={"w-node-d3264dc2-3b3f-327a-43e5-4d4990bc8823-90bc8823"}
      tag={"div"}
    >
      <Block className={"table-cell ml"} tag={"div"}>
        <Block tag={"div"}>{"Tipo"}</Block>
        {typeSort}
      </Block>
      <Block className={"table-cell header"} tag={"div"}>
        <Block tag={"div"}>{"Marca y modelo"}</Block>
        {brandSort}
      </Block>
      <Block className={"table-cell header right"} tag={"div"}>
        <Block tag={"div"}>{"Status"}</Block>
        {statusSort}
      </Block>
      <Block className={"table-cell header mobile right"} tag={"div"}>
        <Block tag={"div"}>{"Proximo mantenimiento"}</Block>
        {nextMaintenanceSort}
      </Block>
    </Block>
  );
}
