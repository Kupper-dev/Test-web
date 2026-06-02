"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function ProgressBox({
  progressBar = {},
  progressText1 = "Progress text 1:",
  progressText2 = "Progress text 2:",
  progressValue1 = "0000",
  progressValue2 = "0000",
  variant = "Base",
}) {
  const _styleVariantMap = {
    Base: "",
    Positive: "w-variant-def9a604-3ba7-3c9b-ce18-892ea485a8d6",
    Warning: "w-variant-e022d917-eece-361f-6ea9-89c9dd03e4f4",
    Negative: "w-variant-753d5596-24a1-d75c-7bce-0ff161c53dee",
    Inactive: "w-variant-c712724b-ebe3-b0b6-85ed-067391adc032",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <Block className={`status-box ${_activeStyleVariant}`} tag={"div"}>
      <Block className={`list ${_activeStyleVariant}`} tag={"div"}>
        <Block className={`wrapper-h-left ${_activeStyleVariant}`} tag={"div"}>
          <Block tag={"div"}>{progressText1}</Block>
          <Block
            className={`spacer-025-rem ${_activeStyleVariant}`}
            tag={"div"}
          />
          <Block tag={"div"}>{progressValue1}</Block>
        </Block>
        <Block className={`wrapper-h-left ${_activeStyleVariant}`} tag={"div"}>
          <Block tag={"div"}>{progressText2}</Block>
          <Block
            className={`spacer-025-rem ${_activeStyleVariant}`}
            tag={"div"}
          />
          <Block tag={"div"}>{progressValue2}</Block>
        </Block>
        <Block
          className={`progress-wrapper full ${_activeStyleVariant}`}
          tag={"div"}
        >
          <Block
            className={`progress-bar ${_activeStyleVariant}`}
            tag={"div"}
            {...progressBar}
          />
        </Block>
      </Block>
    </Block>
  );
}
