import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function ServicesTableRow(props: {
  creationDate?: React.ReactNode;
  deviceBrandAndModel?: React.ReactNode;
  idFormatted?: React.ReactNode;
  issueReformulation?: React.ReactNode;
  resolutionTime?: React.ReactNode;
  statusBadgeStatus?:
    | "Base"
    | "Green"
    | "Yellow"
    | "Red"
    | "Turquoise"
    | "Purple"
    | "Gray"
    | "Orange";
  statusBadgeStatusText?: React.ReactNode;
  variant?: "Base" | "Positive" | "Warning" | "Negative" | "Inactive";
}): React.JSX.Element;
