import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function EmployeesTableRow(props: {
  activeTicketsCount?: React.ReactNode;
  employeeDevices?: React.ReactNode;
  employeeName?: React.ReactNode;
  employeeTicketsFullCount?: React.ReactNode;
  lastTicketOfEmployee?: Types.Basic.Link;
  statusBadgeStatusBadge?:
    | "Base"
    | "Green"
    | "Yellow"
    | "Red"
    | "Turquoise"
    | "Purple"
    | "Gray"
    | "Orange";
  statusBadgeStatusBadgeText?: React.ReactNode;
}): React.JSX.Element;
