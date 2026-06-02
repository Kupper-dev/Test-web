import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function MicroTableRow(props: {
  itemPrice?: React.ReactNode;
  itemQuantity?: React.ReactNode;
  itemTitle?: React.ReactNode;
  itemTotal?: React.ReactNode;
  itemWarranty?: React.ReactNode;
  microTableHeaderSlot?: React.ReactNode;
  microTableTotal?: React.ReactNode;
  variant?: "Base" | "Item" | "Item end blue";
}): React.JSX.Element;
