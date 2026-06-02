"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import BlockContainer from "./webflow_modules/Layout/components/BlockContainer";
import DOM from "./webflow_modules/Builtin/components/DOM";
import Heading from "./webflow_modules/Basic/components/Heading";
import Link from "./webflow_modules/Basic/components/Link";
import Section from "./webflow_modules/Layout/components/Section";
import Span from "./webflow_modules/Basic/components/Span";
import { HeroSpin } from "./HeroSpin";

export function HeroSection({}) {
  return (
    <Section
      className={"section is_hero"}
      grid={{
        type: "section",
      }}
      tag={"section"}
    >
      <BlockContainer
        className={"container"}
        grid={{
          type: "container",
        }}
        tag={"div"}
      >
        <Block className={"grid_two_blocks"} tag={"div"}>
          <Block className={"column_vertical"} tag={"div"}>
            <Heading className={"h1"} tag={"h1"}>
              {"Soporte urgente"}
              <br />
              <Span className={"dynamic-text"} dynamic-text={""}>
                {"dynamic-text"}
                <br />
              </Span>
              {"cuando lo necesitas"}
            </Heading>
            <Block className={"spacer_two_rem"} tag={"div"} />
            <Block
              className={
                "home-reel-content hero w-node-_8fbe3eac-8b93-aec8-d6dc-0b106aa45821-76feb159"
              }
              id={"home-reel-content"}
              tag={"div"}
            >
              <Block id={"home-reel-content-reveal"} tag={"div"}>
                <Block id={"home-reel-content-inner"} tag={"div"}>
                  <Heading
                    className={"home-reel-desc"}
                    id={"home-reel-desc"}
                    tag={"h2"}
                  >
                    {
                      "We combine design, motion, 3D, and development to create digital experiences that feel visually striking and technically seamless"
                    }
                  </Heading>
                  <Link
                    block={""}
                    button={false}
                    className={"home-reel-cta"}
                    id={"home-reel-cta"}
                    options={{
                      href: "/about",
                      target: "_blank",
                    }}
                  >
                    <Span
                      className={"home-reel-cta-dot"}
                      id={"home-reel-cta-dot"}
                    />{" "}
                    <Span
                      className={"home-reel-cta-text"}
                      id={"home-reel-cta-text"}
                    >
                      {"Our Approach"}
                    </Span>{" "}
                    <Span
                      className={"home-reel-cta-arrow"}
                      id={"home-reel-cta-arrow"}
                    >
                      <DOM
                        fill={"none"}
                        height={"16"}
                        tag={"svg"}
                        viewBox={"0 0 16 16"}
                        width={"16"}
                        xmlns={"http://www.w3.org/2000/svg"}
                      >
                        <DOM
                          d={
                            "M2.343 8h11.314m0 0L8.673 3.016M13.657 8l-4.984 4.984"
                          }
                          stroke={"#0e0e11"}
                          stroke-linecap={"round"}
                          stroke-linejoin={"round"}
                          stroke-width={"2"}
                          tag={"path"}
                        />
                      </DOM>
                    </Span>
                  </Link>
                </Block>
              </Block>
            </Block>
          </Block>
          <Block className={"column_vertical right"} tag={"div"}>
            <HeroSpin />
          </Block>
        </Block>
      </BlockContainer>
    </Section>
  );
}
