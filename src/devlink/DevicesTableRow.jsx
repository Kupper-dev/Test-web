"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Image from "./webflow_modules/Basic/components/Image";
import { StatusBadge } from "./StatusBadge";

export function DevicesTableRow({
  brandAndModel = "Brand and model",
  departmentOrContact = "Departamento o persona",
  idFormatted = "D003",
  progressBar = {},
  progressText1 = "Progress text 1",
  progressText2 = "Progress text 1:",
  progressValue1 = "0000",
  progressValue2 = "0000",
  statusBadgeStatusBadge = "Purple",
  statusBadgeStatusText = "Status",
  typeIcon = "",
  variant = "Base",
}) {
  const _styleVariantMap = {
    Base: "",
    Positive: "w-variant-d76441f6-1ce2-6929-55c5-939baed1f8f2",
    Warning: "w-variant-52d898a5-f98d-c97a-0b3d-ef00fc9bda86",
    Negative: "w-variant-3e61efa0-dbd9-a8f7-b483-8e7b595b4e27",
    Inactive: "w-variant-be4f602d-2202-f2bd-070b-aaf134b1e492",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <Block
      className={`table-row devices ${_activeStyleVariant}`}
      id={"w-node-_672e266c-826c-c427-5176-4e36ec815102-ec815102"}
      tag={"div"}
    >
      <Block className={`table-cell image ${_activeStyleVariant}`} tag={"div"}>
        <Image
          alt={""}
          height={"auto"}
          loading={"lazy"}
          src={typeIcon}
          width={"auto"}
        />
      </Block>
      <Block className={`table-cell v ${_activeStyleVariant}`} tag={"div"}>
        <Block
          className={`text-medium bold ${_activeStyleVariant}`}
          tag={"div"}
        >
          {brandAndModel}
        </Block>
        <Block className={`text-small gray ${_activeStyleVariant}`} tag={"div"}>
          {departmentOrContact}
        </Block>
        <Block
          className={`text-medium blue ${_activeStyleVariant}`}
          tag={"div"}
        >
          {idFormatted}
        </Block>
      </Block>
      <Block className={`table-cell ${_activeStyleVariant}`} tag={"div"}>
        <Block tag={"div"}>
          <StatusBadge
            statusText={statusBadgeStatusText}
            variant={statusBadgeStatusBadge}
          />
        </Block>
      </Block>
      <Block
        className={`table-cell hr mobile ${_activeStyleVariant}`}
        tag={"div"}
      >
        <Block
          className={`status-box small ${_activeStyleVariant}`}
          tag={"div"}
        >
          <Block className={`list ${_activeStyleVariant}`} tag={"div"}>
            <Block
              className={`wrapper-h-left ${_activeStyleVariant}`}
              tag={"div"}
            >
              <Block tag={"div"}>{progressText1}</Block>
              <Block
                className={`spacer-025-rem ${_activeStyleVariant}`}
                tag={"div"}
              />
              <Block tag={"div"}>{progressValue1}</Block>
            </Block>
            <Block
              className={`wrapper-h-left ${_activeStyleVariant}`}
              tag={"div"}
            >
              <Block tag={"div"}>{progressText2}</Block>
              <Block
                className={`spacer-025-rem ${_activeStyleVariant}`}
                tag={"div"}
              />
              <Block tag={"div"}>{progressValue2}</Block>
            </Block>
            <Block
              className={`progress-wrapper ${_activeStyleVariant}`}
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
      </Block>
      <Block
        className={`row-highlight-layer ${_activeStyleVariant}`}
        tag={"div"}
      />
    </Block>
  );
}
