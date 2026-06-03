"use client";
import React from "react";
import BackgroundVideoWrapper from "./webflow_modules/BackgroundVideo/components/BackgroundVideoWrapper";
import Block from "./webflow_modules/Basic/components/Block";
import DOM from "./webflow_modules/Builtin/components/DOM";
import Heading from "./webflow_modules/Basic/components/Heading";
import Link from "./webflow_modules/Basic/components/Link";
import Section from "./webflow_modules/Layout/components/Section";
import Span from "./webflow_modules/Basic/components/Span";

export function HomeReel({}) {
  return (
    <Section
      className={"home-reel"}
      grid={{
        type: "section",
      }}
      id={"home-reel"}
      tag={"section"}
    >
      <Block className={"container"} tag={"div"}>
        <Block className={"container-x"} tag={"div"}>
          <Block
            className={"home-reel-thumb-wrapper"}
            id={"home-reel-thumb-wrapper"}
            tag={"div"}
          >
            <BackgroundVideoWrapper
              autoPlay={true}
              className={"home-reel-thumb"}
              loop={true}
              posterImage={
                "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4%2F6a1e5b99bf22800753f0bc56_IT%20chaos%20web%20FHD_poster.0000000.jpg"
              }
              sources={[
                "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4%2F6a1e5b99bf22800753f0bc56_IT%20chaos%20web%20FHD_webm.webm",
                "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4%2F6a1e5b99bf22800753f0bc56_IT%20chaos%20web%20FHD_mp4.mp4",
              ]}
              tag={"div"}
            />
          </Block>
          <Block
            className={
              "home-reel-content w-node-d9c8aaea-55e8-39fb-3210-2f9a70ed869d-70ed8693"
            }
            id={"home-reel-content"}
            tag={"div"}
          >
            <Heading
              className={"home-reel-title"}
              id={"home-reel-title"}
              tag={"h4"}
            >
              <Block
                className={"home-reel-title-inner"}
                id={"home-reel-title-inner"}
                tag={"div"}
              >
                <Block
                  className={"home-reel-title-line-1"}
                  id={"home-reel-title-line-1"}
                  tag={"div"}
                >
                  {"Soporte urgente"}
                </Block>
                <Block
                  className={"home-reel-title-line-2"}
                  id={"home-reel-title-line-2"}
                  tag={"div"}
                >
                  {"polizas mensuales CDMX"}
                </Block>
              </Block>
            </Heading>
            <Block id={"home-reel-content-reveal"} tag={"div"}>
              <Block id={"home-reel-content-inner"} tag={"div"}>
                <Heading
                  className={"home-reel-desc"}
                  id={"home-reel-desc"}
                  tag={"h2"}
                >
                  {
                    "Una oficina que funciona no es casualidad — es soporte bien hecho. Kupper atiende empresas en la CDMX con pólizas mensuales, respuesta garantizada y tecnología que te da visibilidad total de tu infraestructura en tiempo real."
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
                    {"Solicita una prueba"}
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
                        strokeLinecap={"round"}
                        strokeLinejoin={"round"}
                        strokeWidth={"2"}
                        tag={"path"}
                      />
                    </DOM>
                  </Span>
                </Link>
              </Block>
            </Block>
          </Block>
        </Block>
        <Block
          className={"home-reel-container"}
          id={"home-reel-container"}
          tag={"div"}
        >
          <Block
            className={"home-reel-container-inner"}
            id={"home-reel-container-inner"}
            tag={"div"}
          >
            <Block
              className={"home-reel-video-container"}
              id={"home-reel-video-container"}
              tag={"div"}
            >
              <Block
                className={"home-reel-video-container-decoration"}
                id={"home-reel-video-container-decoration"}
                tag={"div"}
              />
              <Block
                className={"home-reel-video-placeholder"}
                id={"home-reel-video-placeholder"}
                tag={"div"}
              >
                <Block
                  className={"home-reel-video-title-container"}
                  id={"home-reel-video-title-container"}
                  tag={"div"}
                >
                  <Span className={"home-reel-video-title-word"}>{"Ver "}</Span>
                  <Link
                    aria-label={"Watch reel button"}
                    block={""}
                    button={true}
                    className={"home-reel-video-watch-btn"}
                    id={"home-reel-video-watch-btn"}
                    options={{
                      href: "#",
                    }}
                  >
                    <DOM
                      className={"home-reel-video-watch-btn-svg"}
                      fill={"none"}
                      height={"36"}
                      id={"home-reel-video-watch-btn-svg"}
                      tag={"svg"}
                      viewBox={"0 0 36 36"}
                      width={"36"}
                      xmlns={"http://www.w3.org/2000/svg"}
                    >
                      <DOM
                        d={
                          "M7 7.29c0-1.5 1.59-2.466 2.92-1.776l20.656 10.71c1.439.747 1.439 2.805 0 3.552L9.92 30.486C8.589 31.176 7 30.21 7 28.71V7.29Z"
                        }
                        fill={"currentColor"}
                        tag={"path"}
                      />
                    </DOM>
                  </Link>
                  <Span className={"home-reel-video-title-word"}>{"now"}</Span>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    </Section>
  );
}
