import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function RelatedServiceItem(props: {
  accesories?: React.ReactNode;
  creationDate?: React.ReactNode;
  dataBackup?: React.ReactNode;
  diagnosis?: React.ReactNode;
  diagnosisVisibility?: Types.Visibility.VisibilityConditions;
  expandColapseButton?: React.ReactNode;
  idFormatted?: React.ReactNode;
  issueReformulation?: React.ReactNode;
  powerAdapter?: React.ReactNode;
  requestOrIssue?: React.ReactNode;
  servicesRendered?: React.ReactNode;
  servicesRenderedVisibility?: Types.Visibility.VisibilityConditions;
  serviceUnder30Minutes?: Types.Visibility.VisibilityConditions;
  statusTextStatus?: React.ReactNode;
  statusTextStatusVariant?:
    | "Base"
    | "Blue"
    | "Green"
    | "Yellow"
    | "Red"
    | "Turquoise"
    | "Purple"
    | "Gray"
    | "Orange";
  technician?: React.ReactNode;
}): React.JSX.Element;
