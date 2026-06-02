import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function TechniciansTableRow(props: {
  approxCompletionDate?: React.ReactNode;
  creationDate?: React.ReactNode;
  idFormatted?: React.ReactNode;
  lastMessageIcon?: Types.Devlink.Slot;
  lastMessageSlot?: Types.Devlink.Slot;
  slaSlot?: Types.Devlink.Slot;
  statusBadgeStatusText?: React.ReactNode;
  statusBadgeVariant?:
    | "Base"
    | "Green"
    | "Yellow"
    | "Red"
    | "Turquoise"
    | "Purple"
    | "Gray"
    | "Orange";
  text5?: React.ReactNode;
  title?: React.ReactNode;
  variant?: "Base" | "Positive" | "Warning" | "Negative";
}): React.JSX.Element;
