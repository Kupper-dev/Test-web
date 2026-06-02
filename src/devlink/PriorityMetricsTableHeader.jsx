"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function PriorityMetricsTableHeader({}) {
  return (
    <Block
      className={"table-row priority-metrics header"}
      id={"w-node-_99cc1c93-b8c0-46d4-a4f8-a33944819342-44819342"}
      tag={"div"}
    >
      <Block className={"table-cell"} tag={"div"}>
        <Block className={"text-small"} tag={"div"}>
          {"Prioridad"}
        </Block>
      </Block>
      <Block className={"table-cell m center"} tag={"div"}>
        <Block className={"text-small"} tag={"div"}>
          {"Tickets Activos"}
        </Block>
      </Block>
      <Block className={"table-cell hr mid m"} tag={"div"}>
        <Block className={"text-small"} tag={"div"}>
          {"Objetivo de espuesta\t"}
        </Block>
      </Block>
      <Block className={"table-cell hr m center"} tag={"div"}>
        <Block className={"text-small"} tag={"div"}>
          {"Objetivo Resolución"}
        </Block>
      </Block>
      <Block className={"table-cell hr"} tag={"div"}>
        <Block className={"text-small"} tag={"div"}>
          {"Estado General"}
        </Block>
      </Block>
      <Block className={"row-highlight-layer"} tag={"div"} />
    </Block>
  );
}
