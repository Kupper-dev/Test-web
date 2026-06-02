"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Link from "./webflow_modules/Basic/components/Link";

export function SecondTab({
  tabLabel = "Tab title",

  tabLink = {
    href: "#",
  },
}) {
  return (
    <Link
      block={"inline"}
      button={false}
      className={"second-tab"}
      options={tabLink}
    >
      <Block className={"tab-label"} tag={"div"}>
        {tabLabel}
      </Block>
    </Link>
  );
}
