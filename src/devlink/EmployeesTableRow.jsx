"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Link from "./webflow_modules/Basic/components/Link";
import { StatusBadge } from "./StatusBadge";

export function EmployeesTableRow({
  activeTicketsCount = "Activos",
  employeeDevices = "Titulo",
  employeeName = "Name",
  employeeTicketsFullCount = "Total de servicios",

  lastTicketOfEmployee = {
    href: "#",
  },

  statusBadgeStatusBadge = "Purple",
  statusBadgeStatusBadgeText = "Status",
}) {
  return (
    <Block
      className={"table-row employees1"}
      id={"w-node-_60f61f01-5d1b-18c6-1f19-255e097f9317-097f9317"}
      tag={"div"}
    >
      <Block className={"table-cell v"} tag={"div"}>
        <Block className={"text-medium bold"} tag={"div"}>
          {employeeName}
        </Block>
        <Block className={"text-hover-mask"} tag={"div"}>
          <Block className={"text-hover-mask-inner"} tag={"div"}>
            <Block className={"text-small gray"} tag={"div"}>
              {employeeDevices}
            </Block>
          </Block>
        </Block>
        <Block className={"text-medium blue"} tag={"div"}>
          {employeeTicketsFullCount}
        </Block>
      </Block>
      <Block className={"table-cell hr center"} tag={"div"}>
        <StatusBadge
          statusText={statusBadgeStatusBadgeText}
          variant={statusBadgeStatusBadge}
        />
      </Block>
      <Block className={"table-cell hr m center"} tag={"div"}>
        <Block className={"text-micro"} tag={"div"}>
          {activeTicketsCount}
        </Block>
      </Block>
      <Block className={"table-cell hr mobile"} tag={"div"}>
        <Block className={"wrapper-h-right"} tag={"div"}>
          <Link
            block={""}
            button={false}
            className={"text-micro blue"}
            options={lastTicketOfEmployee}
          >
            {"Ultimo ticket"}
          </Link>
        </Block>
      </Block>
      <Block className={"row-highlight-layer"} tag={"div"} />
    </Block>
  );
}
