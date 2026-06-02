"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Link from "./webflow_modules/Basic/components/Link";

export function WhatsappNavbar({}) {
  return (
    <Link
      block={"inline"}
      button={false}
      className={"whatsapp_menu"}
      id={"w-node-efbf297f-6b14-628b-0195-5c770da7c6de-0da7c6de"}
      options={{
        href: "#",
      }}
    >
      <Block className={"button_text_gradient"} tag={"div"}>
        {"WHATSAPP"}
      </Block>
    </Link>
  );
}
