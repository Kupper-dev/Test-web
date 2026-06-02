import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function DevicesTableRow(props: {
  brandAndModel?: React.ReactNode;
  departmentOrContact?: React.ReactNode;
  idFormatted?: React.ReactNode;
  progressBar?: Types.Devlink.RuntimeProps;
  progressText1?: React.ReactNode;
  progressText2?: React.ReactNode;
  progressValue1?: React.ReactNode;
  progressValue2?: React.ReactNode;
  statusBadgeStatusBadge?:
    | "Base"
    | "Green"
    | "Yellow"
    | "Red"
    | "Turquoise"
    | "Purple"
    | "Gray"
    | "Orange";
  statusBadgeStatusText?: React.ReactNode;
  typeIcon?: Types.Asset.Image;
  variant?: "Base" | "Positive" | "Warning" | "Negative" | "Inactive";
}): React.JSX.Element;
