"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function WarrantiesTableHeader({ remainingWarrantySort, statusSort }) {
  return (
    <Block
      className={"table-row warranties header"}
      id={"w-node-_5a0944ef-3a7e-aff1-93c1-5ea83240c4f6-3240c4f6"}
      tag={"div"}
    >
      <Block className={"table-cell"} tag={"div"}>
        <Block tag={"div"}>{"Servicio o producto"}</Block>
      </Block>
      <Block className={"table-cell header md"} tag={"div"}>
        <Block tag={"div"}>{"Detalles"}</Block>
      </Block>
      <Block className={"table-cell hr header m"} tag={"div"}>
        <Block tag={"div"}>{"Cant."}</Block>
      </Block>
      <Block className={"table-cell hr header m"} tag={"div"}>
        <Block tag={"div"}>{"Garant."}</Block>
      </Block>
      <Block className={"table-cell hr header"} tag={"div"}>
        {statusSort}
        <Block tag={"div"}>{"Status"}</Block>
      </Block>
      <Block className={"table-cell hr header m"} tag={"div"}>
        {remainingWarrantySort}
        <Block tag={"div"}>{"Protección"}</Block>
      </Block>
    </Block>
  );
}
