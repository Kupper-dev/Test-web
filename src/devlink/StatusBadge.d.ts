import * as React from "react";

declare function StatusBadge(props: {
  statusText?: React.ReactNode;
  variant?:
    | "Base"
    | "Green"
    | "Yellow"
    | "Red"
    | "Turquoise"
    | "Purple"
    | "Gray"
    | "Orange";
}): React.JSX.Element;
