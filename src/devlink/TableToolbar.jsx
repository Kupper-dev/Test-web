"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Image from "./webflow_modules/Basic/components/Image";

export function TableToolbar({
  filterButton = {
    href: "#",
  },

  filterSlot = "",
  itemCount = "23",
  itemTypeTitle = "Dispositivos",
  searchImput,
}) {
  return (
    <Block
      className={"table-info-settings"}
      id={"w-node-db8aa87e-632e-d1f3-ab11-d5143b89461e-3b89461e"}
      tag={"div"}
    >
      <Block className={"wrapper-h-left bottom m"} tag={"div"}>
        <Block className={"text-big"} tag={"div"}>
          {itemCount}
        </Block>
        <Block className={"spacer_05_rem m1"} tag={"div"} />
        <Block tag={"div"}>{itemTypeTitle}</Block>
      </Block>
      <Block className={"wrapper-h-space-between"} tag={"div"}>
        <Block className={"search-bar"} tag={"div"}>
          <Image
            alt={""}
            className={"ui_icon_20 med"}
            height={"auto"}
            loading={"lazy"}
            src={
              "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/696b015bb9f35449c9a04ee7_Search.svg"
            }
            width={"auto"}
          />
          {searchImput}
        </Block>
      </Block>
      <Block className={"wrapper-h-right _100"} tag={"div"}>
        <Block className={"square-button"} tag={"div"}>
          {filterSlot}
        </Block>
      </Block>
    </Block>
  );
}
