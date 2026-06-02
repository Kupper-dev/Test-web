import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function SidepanelLogic(props: {
  layerBaseSlot?: React.ReactNode;
  layerExtendedSlot?: React.ReactNode;
  variant?: "Base" | "One layer" | "Extended Mobile";
}): React.JSX.Element;
