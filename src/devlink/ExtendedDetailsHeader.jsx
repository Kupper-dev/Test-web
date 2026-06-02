"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function ExtendedDetailsHeader({
  mobileBackButton = {
    href: "#",
  },

  mobileBackButtonVisibility = false,
  subtitle = "Subtitle",
  title = "Title",
}) {
  return (
    <Block className={"list"} tag={"div"}>
      <Block className={"item-text-detail black"} tag={"div"}>
        {title}
      </Block>
      <Block className={"item-text-detail"} tag={"div"}>
        {subtitle}
      </Block>
      <Block className={"spacer-1-rem"} tag={"div"} />
    </Block>
  );
}
