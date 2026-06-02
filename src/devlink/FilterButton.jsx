"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Link from "./webflow_modules/Basic/components/Link";

export function FilterButton({ filterIconSlot = "" }) {
  return (
    <Link
      block={"inline"}
      button={false}
      className={"navbar-link"}
      options={{
        href: "#",
      }}
    >
      <Block className={"square is--filter"} tag={"div"}>
        <Block className={"navbar-icon"} tag={"div"}>
          {filterIconSlot}
        </Block>
      </Block>
    </Link>
  );
}
