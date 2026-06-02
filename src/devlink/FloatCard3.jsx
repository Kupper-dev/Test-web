"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Image from "./webflow_modules/Basic/components/Image";

export function FloatCard3({}) {
  return (
    <Block className={"ssc-overflow-wrap scale"} tag={"div"}>
      <Block className={"diag-approved-tag-1 congrats-tag"} tag={"div"}>
        {'¡FELICIDADES"'}
      </Block>
      <Block className={"congrats-card"} tag={"div"}>
        <Block className={"congrats-icon-wrap"} tag={"div"}>
          <Image
            alt={""}
            height={"auto"}
            loading={"lazy"}
            src={
              "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/6a1514236803ae588478c8e8_raising-both-hands.png"
            }
            width={"auto"}
          />
        </Block>
        <Block className={"congrats-text"} tag={"div"}>
          {"El respaldo de Mario ha finalizado"}
        </Block>
      </Block>
    </Block>
  );
}
