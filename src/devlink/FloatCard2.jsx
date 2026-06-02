"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import DOM from "./webflow_modules/Builtin/components/DOM";

export function FloatCard2({}) {
  return (
    <Block className={"system-status-card"} tag={"div"}>
      <Block className={"ssc-overflow-wrap"} tag={"div"}>
        <Block className={"card-header"} tag={"div"}>
          <Block className={"ssc-title-wrap"} tag={"div"}>
            <Block className={"card-title"} tag={"div"}>
              {"45 dispositivos"}
            </Block>
          </Block>
          <Block className={"card-icon"} tag={"div"}>
            <DOM
              fill={"none"}
              height={"24"}
              tag={"svg"}
              viewBox={"0 0 24 24"}
              width={"24"}
              xmlns={"http://www.w3.org/2000/svg"}
            >
              <DOM
                cx={"12"}
                cy={"12"}
                fill={"#4CAF50"}
                r={"10"}
                tag={"circle"}
              />
              <DOM
                d={"M7 12.5L10.5 16L17 8"}
                stroke={"white"}
                stroke-linecap={"round"}
                stroke-linejoin={"round"}
                stroke-width={"2.5"}
                tag={"path"}
              />
            </DOM>
          </Block>
        </Block>
        <Block className={"ssc-subtitle-wrap"} tag={"div"}>
          <Block className={"card-subtitle"} tag={"div"}>
            {"Todos los dispositivos con antivirus"}
          </Block>
        </Block>
      </Block>
      <Block className={"card-body"} tag={"div"}>
        <Block className={"ssc-overflow-wrap"} tag={"div"}>
          <Block className={"ssc-progress-wrapper"} tag={"div"}>
            <Block className={"progress-track"} tag={"div"}>
              <Block className={"progress-fill"} tag={"div"} />
            </Block>
            <Block className={"ssc-progress-text"} tag={"div"}>
              {"75/75"}
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
}
