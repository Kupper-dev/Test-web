"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Link from "./webflow_modules/Basic/components/Link";

export function Button({
  button = {
    href: "#",
  },

  buttonText = "Solicitar un servicio",
  buttonVisibility = true,
}) {
  return buttonVisibility ? (
    <Link block={"inline"} button={false} className={"button"} options={button}>
      <Block className={"button-lable-wrapper"} tag={"div"}>
        <Block className={"button-label is-active"} tag={"div"}>
          {buttonText}
        </Block>
        <Block className={"button-label is-next"} tag={"div"}>
          {"Solicitar un servicio"}
        </Block>
        <Block className={"button-label is-prev"} tag={"div"}>
          {"Solicitar un servicio"}
        </Block>
      </Block>
    </Link>
  ) : null;
}
