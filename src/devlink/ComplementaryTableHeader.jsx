"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function ComplementaryTableHeader({ dateSort, statusSort }) {
  return (
    <Block
      className={"table-row complementary header"}
      id={"w-node-deb6fd34-62df-b80d-b41e-25dfc780ccd3-c780ccd3"}
      tag={"div"}
    >
      <Block className={"table-cell"} tag={"div"}>
        <Block tag={"div"}>{"Item title"}</Block>
      </Block>
      <Block className={"table-cell hr header m"} tag={"div"}>
        <Block tag={"div"}>{"Ver mas detalles"}</Block>
      </Block>
      <Block className={"table-cell hr header m"} tag={"div"}>
        <Block tag={"div"}>{"Fecha"}</Block>
        {dateSort}
      </Block>
      <Block className={"table-cell hr header"} tag={"div"}>
        <Block tag={"div"}>{"Status"}</Block>
        {statusSort}
      </Block>
    </Block>
  );
}
