import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function ProgressBox(props: {
  progressBar?: Types.Devlink.RuntimeProps;
  progressText1?: React.ReactNode;
  progressText2?: React.ReactNode;
  progressValue1?: React.ReactNode;
  progressValue2?: React.ReactNode;
  variant?: "Base" | "Positive" | "Warning" | "Negative" | "Inactive";
}): React.JSX.Element;
