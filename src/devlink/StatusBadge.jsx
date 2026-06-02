"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function StatusBadge({ statusText = "Status", variant = "Base" }) {
  const _styleVariantMap = {
    Base: "",
    Green: "w-variant-f291e5b6-54f3-d075-dfce-295539dbb302",
    Yellow: "w-variant-58a97a79-8e51-bab0-e59b-1f35b48f023e",
    Red: "w-variant-1d462eb3-9758-c00f-68f1-a9a99da6722a",
    Turquoise: "w-variant-deccde64-8a6f-d58b-7444-7952d3990a94",
    Purple: "w-variant-2dd8b80c-e73a-bbcf-eea8-d628c797e4d3",
    Gray: "w-variant-bc0ee7cf-fb0f-b30a-be6e-abf6322159ac",
    Orange: "w-variant-49b6704e-f255-6fbe-7c8c-8b4ab803ecda",
  };

  const _activeStyleVariant = _styleVariantMap[variant];
  return (
    <Block className={`status-badge ${_activeStyleVariant}`} tag={"div"}>
      <Block
        className={`text-hover-mask mid ${_activeStyleVariant}`}
        tag={"div"}
      >
        <Block
          className={`text-hover-mask-inner ${_activeStyleVariant}`}
          tag={"div"}
        >
          <Block tag={"div"}>{statusText}</Block>
        </Block>
      </Block>
    </Block>
  );
}
