"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import { StatusBadge } from "./StatusBadge";

export function WarrantiesTableRow({
  itemDetails = "Serial Number",
  itemQuantity = "1",
  itemRemainingWDays = "000 días",
  itemTitle = "Title sanitized",
  itemWarranty = "1 Año",
  statusBadgeStatus = "Base",
  statusBadgeStatusText = "Status",
  variant = "Base",
}) {
  const _styleVariantMap = {
    Base: "",
    Positive: "w-variant-31f79cbd-c8b7-d248-5295-a81977834130",
    Warning: "w-variant-1f048733-df62-5391-67f8-164fa79f31e8",
    Negative: "w-variant-19d418fe-3aa7-a604-5883-7276e83d691e",
    Inactive: "w-variant-47c81b2b-c9e2-8b83-704e-6cb2a037d2d7",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <Block
      className={`table-row warranties ${_activeStyleVariant}`}
      id={"w-node-_0f309ff6-9804-2799-176b-0a33c0c9b92d-c0c9b92d"}
      tag={"div"}
    >
      <Block className={`table-cell ${_activeStyleVariant}`} tag={"div"}>
        <Block
          className={`text-medium bold ${_activeStyleVariant}`}
          tag={"div"}
        >
          {itemTitle}
        </Block>
      </Block>
      <Block className={`table-cell m ${_activeStyleVariant}`} tag={"div"}>
        <Block className={`text-small ${_activeStyleVariant}`} tag={"div"}>
          {itemDetails}
        </Block>
      </Block>
      <Block
        className={`table-cell hr mid m ${_activeStyleVariant}`}
        tag={"div"}
      >
        <Block className={`text-small ${_activeStyleVariant}`} tag={"div"}>
          {itemQuantity}
        </Block>
      </Block>
      <Block className={`table-cell hr m ${_activeStyleVariant}`} tag={"div"}>
        <Block className={`text-small ${_activeStyleVariant}`} tag={"div"}>
          {itemWarranty}
        </Block>
      </Block>
      <Block className={`table-cell hr ${_activeStyleVariant}`} tag={"div"}>
        <StatusBadge
          statusText={statusBadgeStatusText}
          variant={statusBadgeStatus}
        />
      </Block>
      <Block className={`table-cell hr m ${_activeStyleVariant}`} tag={"div"}>
        <Block className={`text-small blue ${_activeStyleVariant}`} tag={"div"}>
          {itemRemainingWDays}
        </Block>
      </Block>
      <Block
        className={`row-highlight-layer ${_activeStyleVariant}`}
        tag={"div"}
      />
    </Block>
  );
}
