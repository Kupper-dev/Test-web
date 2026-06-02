"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Image from "./webflow_modules/Basic/components/Image";
import { StatusBadge } from "./StatusBadge";

export function ServicesTableRow({
  creationDate = "00/00/00",
  deviceBrandAndModel = "Device brand and model",
  idFormatted = "S000",
  issueReformulation = "Issue reformulation",
  resolutionTime = "00 ene 00, 00:00",
  statusBadgeStatus = "Purple",
  statusBadgeStatusText = "Status",
  variant = "Base",
}) {
  const _styleVariantMap = {
    Base: "",
    Positive: "w-variant-71197ede-7e5a-b9d1-ce1d-ea21cabe3026",
    Warning: "w-variant-b71dfd70-5681-0700-e332-8c578e860db4",
    Negative: "w-variant-2889c179-6d1b-073b-0fae-20ca482ffc2f",
    Inactive: "w-variant-5fff7fe8-ce43-ce01-6cb6-0909935542dd",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <Block
      className={`table-row services ${_activeStyleVariant}`}
      id={"w-node-e8e9860b-2d46-5525-92bd-c429c75d0630-c75d0630"}
      tag={"div"}
    >
      <Block className={`table-cell v ${_activeStyleVariant}`} tag={"div"}>
        <Block
          className={`text-medium bold ${_activeStyleVariant}`}
          tag={"div"}
        >
          {issueReformulation}
        </Block>
        <Block className={`text-small gray ${_activeStyleVariant}`} tag={"div"}>
          {deviceBrandAndModel}
        </Block>
        <Block
          className={`text-medium blue ${_activeStyleVariant}`}
          tag={"div"}
        >
          {idFormatted}
        </Block>
      </Block>
      <Block className={`table-cell hr ${_activeStyleVariant}`} tag={"div"}>
        <StatusBadge
          statusText={statusBadgeStatusText}
          variant={statusBadgeStatus}
        />
      </Block>
      <Block className={`table-cell hr m ${_activeStyleVariant}`} tag={"div"}>
        <Block className={`text-micro ${_activeStyleVariant}`} tag={"div"}>
          {creationDate}
        </Block>
      </Block>
      <Block
        className={`table-cell hr mobile ${_activeStyleVariant}`}
        tag={"div"}
      >
        <Block className={`wrapper-h-right ${_activeStyleVariant}`} tag={"div"}>
          <Image
            alt={""}
            className={`ui_icon_20 m ${_activeStyleVariant}`}
            height={"auto"}
            loading={"lazy"}
            src={
              "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/695c7603b5dc2f96c47f1ada_time%20response.svg"
            }
            width={"auto"}
          />
          <Block
            className={`text-micro blue ${_activeStyleVariant}`}
            tag={"div"}
          >
            {resolutionTime}
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
