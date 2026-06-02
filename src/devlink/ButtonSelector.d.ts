import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function ButtonSelector(props: {
  buttonSelectorRuntimeProp?: Types.Devlink.RuntimeProps;
  buttonSelectorText?: React.ReactNode;
  variant?: "Base" | "Active" | "Positive" | "Warning" | "Negative" | "Purple";
}): React.JSX.Element;
