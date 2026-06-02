import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function TableToolbar(props: {
  filterButton?: Types.Basic.Link;
  filterSlot?: Types.Devlink.Slot;
  itemCount?: React.ReactNode;
  /** e.g. Dispositivos, Servicios, Etc*/
  itemTypeTitle?: React.ReactNode;
  searchImput?: React.ReactNode;
}): React.JSX.Element;
