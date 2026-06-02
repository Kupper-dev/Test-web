"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Link from "./webflow_modules/Basic/components/Link";
import { MarqueeCssItem } from "./MarqueeCssItem";

export function Main({ mainContent }) {
  return (
    <Block
      className={"main"}
      data-barba={"container"}
      data-barba-namespace={"home"}
      data-page-theme={"light"}
      tag={"main"}
    >
      {mainContent}
      <Block
        className={"under-nav-bar"}
        data-wf--under-nav-bar--variant={"lightning"}
        tag={"div"}
      >
        <Block className={"under-nav-bar__inner"} tag={"div"}>
          <Link
            block={"inline"}
            button={false}
            className={"nav-marquee"}
            options={{
              href: "#marquee-click",
            }}
          >
            <Block
              className={"marquee-css inline-div-0"}
              data-css-marquee={""}
              tag={"div"}
            >
              <Block
                className={"marquee-css__list"}
                data-css-marquee-list={"nav"}
                tag={"div"}
              >
                <MarqueeCssItem />
                <MarqueeCssItem />
                <MarqueeCssItem />
                <MarqueeCssItem />
                <MarqueeCssItem />
                <MarqueeCssItem />
              </Block>
              <Block
                className={"marquee-css__list"}
                data-css-marquee-list={"nav"}
                tag={"div"}
              >
                <MarqueeCssItem />
                <MarqueeCssItem />
                <MarqueeCssItem />
                <MarqueeCssItem />
                <MarqueeCssItem />
                <MarqueeCssItem />
              </Block>
            </Block>
          </Link>
        </Block>
      </Block>
    </Block>
  );
}
