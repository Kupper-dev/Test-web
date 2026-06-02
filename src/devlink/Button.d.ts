import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function Button(props: {
  button?: Types.Basic.Link;
  buttonText?: React.ReactNode;
  buttonVisibility?: Types.Boolean.Boolean;
}): React.JSX.Element;
