"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function TableTitle({ tableTitle = "Title" }) {
  return (
    <Block className={"text-medium-big table"} tag={"div"}>
      {tableTitle}
    </Block>
  );
}
