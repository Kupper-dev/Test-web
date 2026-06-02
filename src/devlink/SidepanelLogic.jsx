"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function SidepanelLogic({
  layerBaseSlot,
  layerExtendedSlot,
  variant = "Base",
}) {
  const _styleVariantMap = {
    Base: "",
    "One layer": "w-variant-6d29d111-faf1-a832-4f7e-bbb0bb39aef2",
    "Extended Mobile": "w-variant-fc96238e-7095-6fe0-fab9-cacf3787d697",
  };

  const _activeStyleVariant = _styleVariantMap[variant];
  return (
    <Block className={`sidepanel-wrapper ${_activeStyleVariant}`} tag={"div"}>
      <Block
        className={`sidepanel is-expanded ${_activeStyleVariant}`}
        tag={"div"}
      >
        <Block
          className={`sidepanel-content ${_activeStyleVariant}`}
          tag={"div"}
        >
          <Block
            className={`panel-layer-base ${_activeStyleVariant}`}
            tag={"div"}
          >
            {layerBaseSlot}
          </Block>
          <Block
            className={`panel-layer-extended ${_activeStyleVariant}`}
            tag={"div"}
          >
            {layerExtendedSlot}
          </Block>
        </Block>
      </Block>
      <Block
        className={`sidepanel-overlay ${_activeStyleVariant}`}
        tag={"div"}
      />
    </Block>
  );
}
