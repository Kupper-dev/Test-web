"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Link from "./webflow_modules/Basic/components/Link";
import { StatusBadge } from "./StatusBadge";

export function ComplementaryTableRow({
  actionButton = {
    href: "#",
  },

  actionButtonText = "Action",
  creationDate = "00/00/00",
  idFormatted = "R0000",
  statusBadgeStatusText = "Status",
  statusBadgeVariantStatusBadge = "Base",
  title = "Title",
  total = "$ MXN",
  variant = "Base",
}) {
  const _styleVariantMap = {
    Base: "",
    Positive: "w-variant-6ef7dc39-5354-b410-995c-ca150c9970fe",
    Warning: "w-variant-78bf3dbf-fa96-0736-4180-d535fca259bf",
    Negative: "w-variant-0adc841d-ec27-353f-8f3c-7ebcbd1b1c08",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <Block
      className={`table-row complementary ${_activeStyleVariant}`}
      id={"w-node-_823f5afb-e192-1d6a-f541-16a2682e1741-682e1741"}
      tag={"div"}
    >
      <Block className={`table-cell v ${_activeStyleVariant}`} tag={"div"}>
        <Block
          className={`text-medium bold ${_activeStyleVariant}`}
          tag={"div"}
        >
          {title}
        </Block>
        <Block className={`text-small ${_activeStyleVariant}`} tag={"div"}>
          {total}
        </Block>
        <Block
          className={`text-medium blue ${_activeStyleVariant}`}
          tag={"div"}
        >
          {idFormatted}
        </Block>
      </Block>
      <Block className={`table-cell hr m ${_activeStyleVariant}`} tag={"div"}>
        <Link
          block={""}
          button={false}
          className={`text-small blue ${_activeStyleVariant}`}
          options={{
            href: "#",
          }}
        >
          {"Ver item ↗"}
        </Link>
      </Block>
      <Block className={`table-cell hr m ${_activeStyleVariant}`} tag={"div"}>
        <Block className={`text-small ${_activeStyleVariant}`} tag={"div"}>
          {creationDate}
        </Block>
      </Block>
      <Block className={`table-cell hr ${_activeStyleVariant}`} tag={"div"}>
        <StatusBadge
          statusText={statusBadgeStatusText}
          variant={statusBadgeVariantStatusBadge}
        />
      </Block>
      <Block
        className={`row-highlight-layer ${_activeStyleVariant}`}
        tag={"div"}
      />
    </Block>
  );
}
