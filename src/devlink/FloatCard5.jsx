"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Span from "./webflow_modules/Basic/components/Span";

export function FloatCard5({}) {
  return (
    <Block className={"system-status-card service-card"} tag={"div"}>
      <Block className={"service-header-wrap"} tag={"div"}>
        <Block className={"card-title"} tag={"div"}>
          {"Tickets activos"}
        </Block>
      </Block>
      <Block className={"card-body"} tag={"div"}>
        <Block className={"ssc-overflow-wrap"} tag={"div"}>
          <Block className={"service-tabs"} tag={"div"}>
            <Block
              className={"service-tab-item tab-active-tickets"}
              tag={"div"}
            >
              <Block className={"service-badge badge-active"} tag={"div"}>
                <Span>{"3"}</Span>
              </Block>
              <Span>{"Active"}</Span>
            </Block>
            <Block className={"service-tab-item tab-resolved"} tag={"div"}>
              <Block className={"service-badge badge-resolved"} tag={"div"}>
                <Span>{"12"}</Span>
              </Block>
              <Span>{"Resolved"}</Span>
            </Block>
          </Block>
          <Block className={"progress-track"} tag={"div"}>
            <Block className={"progress-fill service-progress"} tag={"div"} />
          </Block>
          <Block className={"service-footer-wrap"} tag={"div"}>
            <Block className={"card-subtitle"} tag={"div"}>
              {"Ticket de Wendy en progreso"}
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
}
