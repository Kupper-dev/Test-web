import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function PriorityMetricsTableRow(props: {
  activeTickets?: React.ReactNode;
  resolutionGoal?: React.ReactNode;
  responseGoal?: React.ReactNode;
  statusBadgeText?: React.ReactNode;
  statusBadgeVariant?:
    | "Base"
    | "Green"
    | "Yellow"
    | "Red"
    | "Turquoise"
    | "Purple"
    | "Gray"
    | "Orange";
  statusInGeneralVariant?:
    | "Base"
    | "Blue"
    | "Green"
    | "Yellow"
    | "Red"
    | "Turquoise"
    | "Purple"
    | "Gray"
    | "Orange";
  statusTextStatusInGeneralText?: React.ReactNode;
}): React.JSX.Element;
