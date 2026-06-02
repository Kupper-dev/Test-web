import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function WarrantiesTableRow(props: {
  itemDetails?: React.ReactNode;
  itemQuantity?: React.ReactNode;
  itemRemainingWDays?: React.ReactNode;
  itemTitle?: React.ReactNode;
  itemWarranty?: React.ReactNode;
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
