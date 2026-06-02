"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function ButtonSelector({
  buttonSelectorRuntimeProp = {},
  buttonSelectorText = "Solicitar fecha específica",
  variant = "Base",
}) {
  const _styleVariantMap = {
    Base: "",
    Active: "w-variant-7c286ef0-b19c-721f-6e9b-662237cc8acb",
    Positive: "w-variant-2f305835-075f-26e0-e44c-d23a6c7e4316",
    Warning: "w-variant-43056046-f121-535e-9cae-dda524b2cc63",
    Negative: "w-variant-8d76f57c-c986-fb47-037b-50b93c29632d",
    Purple: "w-variant-9cc9365e-0bf2-327c-162f-286154ff833c",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <Block
      className={`button-selector ${_activeStyleVariant}`}
      tag={"div"}
      {...buttonSelectorRuntimeProp}
    >
      <Block tag={"div"}>{buttonSelectorText}</Block>
    </Block>
  );
}
