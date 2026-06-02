import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function ComplementaryTableRow(props: {
  actionButton?: Types.Basic.Link;
  actionButtonText?: React.ReactNode;
  creationDate?: React.ReactNode;
  idFormatted?: React.ReactNode;
  statusBadgeStatusText?: React.ReactNode;
  statusBadgeVariantStatusBadge?:
    | "Base"
    | "Green"
    | "Yellow"
    | "Red"
    | "Turquoise"
    | "Purple"
    | "Gray"
    | "Orange";
  title?: React.ReactNode;
  total?: React.ReactNode;
  variant?: "Base" | "Positive" | "Warning" | "Negative";
}): React.JSX.Element;
