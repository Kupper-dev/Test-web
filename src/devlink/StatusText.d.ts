import * as React from "react";

declare function StatusText(props: {
  status?: React.ReactNode;
  variant?:
    | "Base"
    | "Blue"
    | "Green"
    | "Yellow"
    | "Red"
    | "Turquoise"
    | "Purple"
    | "Gray"
    | "Orange";
}): React.JSX.Element;
