"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Image from "./webflow_modules/Basic/components/Image";
import Link from "./webflow_modules/Basic/components/Link";

export function FloatCard1({}) {
  return (
    <Block className={"diagnostic-wrapper"} tag={"div"}>
      <Block className={"system-status-card diagnostic-card"} tag={"div"}>
        <Block className={"card-header"} tag={"div"}>
          <Block className={"diag-title-wrap"} tag={"div"}>
            <Block className={"card-title"} tag={"div"}>
              {"Tu diagnostico"}
            </Block>
          </Block>
          <Block className={"card-icon"} tag={"div"}>
            <Image
              alt={""}
              className={"ui_icon_20"}
              height={"auto"}
              loading={"lazy"}
              src={
                "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/696b1b960ed703e7710ef25f_3aa5868585f886910ca6204eb144f236_Filter.svg"
              }
              width={"auto"}
            />
          </Block>
        </Block>
        <Block className={"card-body"} tag={"div"}>
          <Block className={"ssc-overflow-wrap"} tag={"div"}>
            <Block className={"diag-skeletons"} tag={"div"}>
              <Block className={"skeleton-line sk-1"} tag={"div"} />
              <Block className={"skeleton-line sk-2"} tag={"div"} />
              <Block className={"skeleton-line sk-3"} tag={"div"} />
              <Block className={"skeleton-line sk-4"} tag={"div"} />
            </Block>
            <Block className={"diag-footer"} tag={"div"}>
              <Link
                block={""}
                button={true}
                className={"diag-btn"}
                options={{
                  href: "#",
                }}
              >
                {"Aceptar"}
              </Link>
            </Block>
          </Block>
        </Block>
      </Block>
      <Block className={"diag-approved-tag"} tag={"div"}>
        {"Aprobado"}
      </Block>
    </Block>
  );
}
