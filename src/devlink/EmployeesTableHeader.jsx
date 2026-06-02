"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function EmployeesTableHeader({
  activeTicketsSorting = "",
  employeeStatusSortSlot = "",
  lastTicketSortSlot = "",
  text1 = "Empleado y sus dispositivos",
  text2 = "Status",
  text3 = "TKT activos",
  text4 = "Ultimo ticket",
}) {
  return (
    <Block
      className={"table-row employees1 header"}
      id={"w-node-e3d7306c-e982-b5b2-b311-da93fd19d48c-fd19d48c"}
      tag={"div"}
    >
      <Block className={"table-cell"} tag={"div"}>
        <Block tag={"div"}>{text1}</Block>
      </Block>
      <Block className={"table-cell hr header m"} tag={"div"}>
        <Block tag={"div"}>{text2}</Block>
        <Block className={"ui_icon_20"} tag={"div"}>
          {employeeStatusSortSlot}
        </Block>
      </Block>
      <Block className={"table-cell hr header center"} tag={"div"}>
        <Block tag={"div"}>{text3}</Block>
        <Block className={"ui_icon_20"} tag={"div"}>
          {activeTicketsSorting}
        </Block>
      </Block>
      <Block className={"table-cell hr header l"} tag={"div"}>
        <Block className={"ui_icon_20"} tag={"div"}>
          {lastTicketSortSlot}
        </Block>
        <Block tag={"div"}>{text4}</Block>
      </Block>
    </Block>
  );
}
