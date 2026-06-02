"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import DOM from "./webflow_modules/Builtin/components/DOM";
import Paragraph from "./webflow_modules/Basic/components/Paragraph";

export function MarqueeCssItem({ text = "New: Osmo Button Pack" }) {
  return (
    <Block className={"marquee-css__item"} tag={"div"}>
      <Paragraph className={"eyebrow is--nav-marquee"}>
        {"Obten 1 més gratis en tu nuevo plan"}
      </Paragraph>
      <DOM
        class={"marquee-css__item-svg"}
        className={"marquee-css__item-svg"}
        fill={"none"}
        tag={"svg"}
        viewBox={"0 0 187 187"}
        xmlns={"http://www.w3.org/2000/svg"}
      >
        <DOM
          d={
            "M126.049 76.7471L167.276 35.5197L150.805 19.0486L109.577 60.276C107.82 62.0398 104.808 60.7915 104.808 58.3009V0H81.517V70.3375C81.517 76.511 76.511 81.517 70.3375 81.517H0V104.808H58.3009C60.7915 104.808 62.0398 107.82 60.276 109.577L19.0548 150.805L35.5259 167.276L76.7533 126.049C78.5109 124.291 81.5232 125.533 81.5232 128.024V186.324H104.814V115.987C104.814 109.813 109.82 104.808 115.993 104.808H186.331V81.517H128.03C125.539 81.517 124.291 78.5047 126.055 76.7471H126.049Z"
          }
          fill={"currentColor"}
          tag={"path"}
        />
      </DOM>
    </Block>
  );
}
