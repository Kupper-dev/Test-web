import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function TrackerCell(props: {
  actionButton?: Types.Basic.Link;
  actionButtonText?: React.ReactNode;
  date?: React.ReactNode;
  hour?: React.ReactNode;
  link1?: Types.Basic.Link;
  linkText1?: React.ReactNode;
  statusMessage?: React.ReactNode;
  statusTitle?: React.ReactNode;
  variant?:
    | "Base"
    | "Active"
    | "Checked"
    | "Awaiting"
    | "Active Warning"
    | "Active action"
    | "Active warning action";
  warningText?: React.ReactNode;
}): React.JSX.Element;
