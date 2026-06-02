import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function NavBarLink(props: {
  number?: React.ReactNode;
  numberVisibility?: Types.Boolean.Boolean;
  tag?: React.ReactNode;
  tagVisibility?: Types.Boolean.Boolean;
  title?: React.ReactNode;
}): React.JSX.Element;
