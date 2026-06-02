"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function TechniciansTableHeader({ statusSlot = "", urgencySlot = "" }) {
  return (
    <Block
      className={"table-row technicians header"}
      id={"w-node-d06b7f29-493b-0021-22e1-1b4c4e4de0fe-4e4de0fe"}
      tag={"div"}
    >
      <Block className={"table-cell"} tag={"div"}>
        <Block tag={"div"}>{"Urgencía"}</Block>
        <Block className={"ui_icon_20"} tag={"div"}>
          {urgencySlot}
        </Block>
      </Block>
      <Block className={"table-cell header"} tag={"div"}>
        <Block tag={"div"}>{"Detalles"}</Block>
      </Block>
      <Block className={"table-cell header right"} tag={"div"}>
        <Block tag={"div"}>{"Status"}</Block>
        <Block className={"ui_icon_20"} tag={"div"}>
          {statusSlot}
        </Block>
      </Block>
      <Block className={"table-cell header mobile right"} tag={"div"}>
        <Block tag={"div"}>{"Ultima comunicación"}</Block>
      </Block>
    </Block>
  );
}
