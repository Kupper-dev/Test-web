"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function FloatCard4({}) {
  return (
    <Block className={"tickets-card"} tag={"div"}>
      <Block className={"tickets-text"} tag={"div"}>
        <Block className={"card-title"} tag={"div"}>
          {"5 Tickets atendidos"}
        </Block>
        <Block className={"card-subtitle"} tag={"div"}>
          {"Resolución promedio 1 hora"}
        </Block>
      </Block>
      <Block className={"tickets-avatars"} tag={"div"}>
        <Block className={"tk-avatar tk-av-1 tk-first"} tag={"div"} />
        <Block className={"tk-avatar tk-av-2 tk-second"} tag={"div"} />
        <Block className={"tk-avatar tk-av-3 tk-third"} tag={"div"}>
          {"+3"}
        </Block>
      </Block>
    </Block>
  );
}
