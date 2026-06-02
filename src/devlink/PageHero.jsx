"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Heading from "./webflow_modules/Basic/components/Heading";
import Image from "./webflow_modules/Basic/components/Image";

export function PageHero({
  heroTitle = "Dispositivos",
  imageHero1 = "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/695d48065aa88b8ec7598e18_1338755d39e40738244056bed0d9067f_DH1.png",
  imageHero2 = "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/695d480dc2b80a120e869530_e23eac12d1a0a451f35467abcd9d57bf_DH2.png",
}) {
  return (
    <Block className={"page-header"} tag={"div"}>
      <Block className={"hero-image-wrapper"} tag={"div"}>
        <Image
          alt={""}
          className={"dh2"}
          height={"auto"}
          loading={"lazy"}
          src={imageHero2}
          width={"auto"}
        />
        <Image
          alt={""}
          className={"dh1"}
          height={"auto"}
          loading={"lazy"}
          src={imageHero1}
          width={"auto"}
        />
      </Block>
      <Block className={"module flex-v"} tag={"div"}>
        <Image
          alt={""}
          className={"logo"}
          height={"auto"}
          loading={"lazy"}
          src={
            "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/695c25f31b5665a9e4c5e3a2_2e69c7d700e0c10e78d3c620ad7a60f7_Logo%20Blue%20Gradient%20.svg"
          }
          width={"auto"}
        />
        <Block className={"title-wrapper-mask"} tag={"div"}>
          <Heading className={"hero-title"} tag={"h1"}>
            {heroTitle}
          </Heading>
        </Block>
        <Block className={"spacer-1-rem"} tag={"div"} />
        <Block className={"button"} tag={"div"}>
          <Block className={"button-lable-wrapper"} tag={"div"}>
            <Block className={"button-label is-active"} tag={"div"}>
              {"Solicitar un servicio"}
            </Block>
            <Block className={"button-label is-next"} tag={"div"}>
              {"Solicitar un servicio"}
            </Block>
            <Block className={"button-label is-prev"} tag={"div"}>
              {"Solicitar un servicio"}
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
}
