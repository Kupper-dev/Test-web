"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Link from "./webflow_modules/Basic/components/Link";
import ListItem from "./webflow_modules/Basic/components/ListItem";

export function NavBarLinkListItem({
  number = "###",
  numberVisibility = false,
  tag = "Tag",
  tagVisibility = true,
  title = "Title",
}) {
  return (
    <ListItem className={"nav-bar__big-li"}>
      <Link
        block={"inline"}
        button={false}
        className={"nav-bar__big-a"}
        data-hover={false}
        options={{
          href: "#buttons",
        }}
      >
        <Block
          className={"nav-bar__big-span"}
          data-hover={""}
          data-underline-link={""}
          tag={"div"}
        >
          {title}
        </Block>
        {numberVisibility ? (
          <Block className={"nav-bar__big-span-number"} tag={"div"}>
            {number}
          </Block>
        ) : null}
        {tagVisibility ? (
          <Block className={"nav-bar__a-tag"} tag={"div"}>
            <Block className={"tag"} tag={"div"}>
              <Block
                className={"button-bg blue"}
                data-wf--button-theme--variant={"purple"}
                tag={"div"}
              />
              <Block className={"eyebrow is--relative"} tag={"div"}>
                {tag}
              </Block>
            </Block>
          </Block>
        ) : null}
      </Link>
      <Block className={"line"} tag={"div"} />
    </ListItem>
  );
}
