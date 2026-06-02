import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function ItemDetails(props: {
  actionButton?: Types.Basic.Link;
  actionButtonText?: React.ReactNode;
  actionButtonVisibility?: Types.Visibility.VisibilityConditions;
  detail1?: React.ReactNode;
  detail10?: React.ReactNode;
  detail2?: React.ReactNode;
  detail3?: React.ReactNode;
  detail4?: React.ReactNode;
  detail5?: React.ReactNode;
  detail6?: React.ReactNode;
  detail7?: React.ReactNode;
  detail8?: React.ReactNode;
  detail9?: React.ReactNode;
  detailVisibility1?: Types.Boolean.Boolean;
  detailVisibility10?: Types.Boolean.Boolean;
  detailVisibility2?: Types.Boolean.Boolean;
  detailVisibility3?: Types.Boolean.Boolean;
  detailVisibility4?: Types.Boolean.Boolean;
  detailVisibility5?: Types.Boolean.Boolean;
  detailVisibility6?: Types.Boolean.Boolean;
  detailVisibility7?: Types.Boolean.Boolean;
  detailVisibility8?: Types.Boolean.Boolean;
  detailVisibility9?: Types.Boolean.Boolean;
  formattedId?: React.ReactNode;
  idFormattedVisibility?: Types.Visibility.VisibilityConditions;
  linkToPanelLayerExtended?: Types.Basic.Link;
  mobileLinkPanelLayerExtended?: Types.Boolean.Boolean;
  statusTextVariantProperty?:
    | "Base"
    | "Blue"
    | "Green"
    | "Yellow"
    | "Red"
    | "Turquoise"
    | "Purple"
    | "Gray"
    | "Orange";
  textToPanelLayerExtended?: React.ReactNode;
  title?: React.ReactNode;
  variant?: "Base" | "Positive" | "Warning" | "Negative" | "Inactive";
}): React.JSX.Element;
