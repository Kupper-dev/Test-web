import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function ExtendedDetailsHeader(props: {
  mobileBackButton?: Types.Basic.Link;
  mobileBackButtonVisibility?: Types.Visibility.VisibilityConditions;
  subtitle?: React.ReactNode;
  title?: React.ReactNode;
}): React.JSX.Element;
