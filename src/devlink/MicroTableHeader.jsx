"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function MicroTableHeader({}) {
  return (
    <Block className={"table-row items-micro header"} tag={"div"}>
      <Block className={"table-cell"} tag={"div"}>
        <Block tag={"div"}>{"Item"}</Block>
      </Block>
      <Block className={"table-cell mid"} tag={"div"}>
        <Block tag={"div"}>{"Cant."}</Block>
      </Block>
      <Block className={"table-cell hr"} tag={"div"}>
        <Block tag={"div"}>{"Precio"}</Block>
      </Block>
      <Block className={"table-cell hr"} tag={"div"}>
        <Block tag={"div"}>{"Subt."}</Block>
      </Block>
    </Block>
  );
}
