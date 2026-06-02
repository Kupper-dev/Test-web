"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Image from "./webflow_modules/Basic/components/Image";
import Section from "./webflow_modules/Layout/components/Section";
import { FloatCard1 } from "./FloatCard1";
import { FloatCard2 } from "./FloatCard2";
import { FloatCard3 } from "./FloatCard3";
import { FloatCard4 } from "./FloatCard4";
import { FloatCard5 } from "./FloatCard5";

export function HeroSpin({}) {
  return (
    <Section
      className={"hero-section hero-3d-scene"}
      grid={{
        type: "section",
      }}
      tag={"section"}
    >
      <Block className={"scene-3d"} tag={"div"}>
        <Block className={"rotor-3d"} tag={"div"}>
          <Block className={"face front-face"} tag={"div"}>
            <Block className={"face back-face"} tag={"div"}>
              <Block className={"face-center-bounds"} tag={"div"}>
                <Block className={"bg-card"} tag={"div"} />
                <Block className={"image-mask"} tag={"div"}>
                  <Image
                    alt={""}
                    className={"main-image"}
                    height={"auto"}
                    loading={"lazy"}
                    src={
                      "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/6a15083dfa85e886a545b499_Main%20image%201.png"
                    }
                    width={"auto"}
                  />
                </Block>
              </Block>
            </Block>
            <Block className={"face-center-bounds"} tag={"div"}>
              <Block className={"bg-card"} tag={"div"} />
              <Block className={"image-mask"} tag={"div"}>
                <Image
                  alt={""}
                  className={"main-image"}
                  height={"auto"}
                  loading={"lazy"}
                  src={
                    "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/6a15083dfa85e886a545b499_Main%20image%201.png"
                  }
                  width={"auto"}
                />
              </Block>
            </Block>
            <Block className={"float-cards-layout"} tag={"div"}>
              <Block className={"float-layout-left"} tag={"div"}>
                <Block className={"float-section top-left"} tag={"div"}>
                  <FloatCard3 />
                </Block>
                <Block className={"float-section center-left"} tag={"div"}>
                  <FloatCard2 />
                </Block>
                <Block className={"float-section bottom-left"} tag={"div"}>
                  <FloatCard4 />
                </Block>
              </Block>
              <Block className={"float-layout-right"} tag={"div"}>
                <Block className={"float-section top-right"} tag={"div"}>
                  <FloatCard1 />
                </Block>
                <Block className={"float-section bottom-right"} tag={"div"}>
                  <FloatCard5 />
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    </Section>
  );
}
