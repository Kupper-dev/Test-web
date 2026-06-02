"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import { StatusBadge } from "./StatusBadge";
import { StatusText } from "./StatusText";

export function PriorityMetricsTableRow({
  activeTickets = "0",
  resolutionGoal = "0",
  responseGoal = "o",
  statusBadgeText = "Status",
  statusBadgeVariant = "Base",
  statusInGeneralVariant = "Base",
  statusTextStatusInGeneralText = "Status",
}) {
  return (
    <Block
      className={"table-row priority-metrics"}
      id={"w-node-_8628b0e1-2f5b-5b85-5bd6-ebf6b17b420d-b17b420d"}
      tag={"div"}
    >
      <Block className={"table-cell"} tag={"div"}>
        <StatusBadge
          statusText={statusBadgeText}
          variant={statusBadgeVariant}
        />
      </Block>
      <Block className={"table-cell m center"} tag={"div"}>
        <Block className={"text-small"} tag={"div"}>
          {activeTickets}
        </Block>
      </Block>
      <Block className={"table-cell hr mid m"} tag={"div"}>
        <Block className={"text-small"} tag={"div"}>
          {responseGoal}
        </Block>
      </Block>
      <Block className={"table-cell hr m center"} tag={"div"}>
        <Block className={"text-small"} tag={"div"}>
          {resolutionGoal}
        </Block>
      </Block>
      <Block className={"table-cell hr"} tag={"div"}>
        <StatusText
          status={statusTextStatusInGeneralText}
          variant={statusInGeneralVariant}
        />
      </Block>
      <Block className={"row-highlight-layer"} tag={"div"} />
    </Block>
  );
}
