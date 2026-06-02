import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function CardMetric(props: {
  metricBadge?:
    | "Base"
    | "Blue"
    | "Green"
    | "Yellow"
    | "Red"
    | "Turquoise"
    | "Purple"
    | "Gray"
    | "Orange";
  metricValue?: React.ReactNode;
  title?: React.ReactNode;
}): React.JSX.Element;
