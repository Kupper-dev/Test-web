"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import { StatusBadge } from "./StatusBadge";

export function TechniciansTableRow({
  approxCompletionDate = "Entrega: DD/MM/YY 00:00",
  creationDate = "Entrada: DD/MM/YY 00:00",
  idFormatted = "D003",
  lastMessageIcon = "",
  lastMessageSlot = "",
  slaSlot = "",
  statusBadgeStatusText = "Status",
  statusBadgeVariant = "Purple",
  text5 = "Ultimo mensaje de cliente",
  title = "Brand and model",
  variant = "Base",
}) {
  const _styleVariantMap = {
    Base: "",
    Positive: "w-variant-0d233d0b-4b79-4f2f-bbbb-94a2f9e7543b",
    Warning: "w-variant-ead9da93-3594-444f-1509-b26ed8ca820e",
    Negative: "w-variant-50fec255-e6ef-3207-8f81-3aa472903d80",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <Block
      className={`table-row technicians ${_activeStyleVariant}`}
      id={"w-node-_61f12b24-895f-84ea-f4ba-48039e155c94-9e155c94"}
      tag={"div"}
    >
      <Block className={`table-cell image ${_activeStyleVariant}`} tag={"div"}>
        <Block tag={"div"}>{slaSlot}</Block>
      </Block>
      <Block className={`table-cell v ${_activeStyleVariant}`} tag={"div"}>
        <Block
          className={`text-medium bold ${_activeStyleVariant}`}
          tag={"div"}
        >
          {title}
        </Block>
        <Block
          className={`text-medium blue ${_activeStyleVariant}`}
          tag={"div"}
        >
          {idFormatted}
        </Block>
        <Block className={`text-micro gray ${_activeStyleVariant}`} tag={"div"}>
          {creationDate}
        </Block>
        <Block className={`text-micro gray ${_activeStyleVariant}`} tag={"div"}>
          {approxCompletionDate}
        </Block>
      </Block>
      <Block className={`table-cell ${_activeStyleVariant}`} tag={"div"}>
        <Block tag={"div"}>
          <StatusBadge
            statusText={statusBadgeStatusText}
            variant={statusBadgeVariant}
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
              <Block
                className={`ui_icon_25 ${_activeStyleVariant}`}
                tag={"div"}
              >
                {lastMessageIcon}
              </Block>
              <Block tag={"div"}>{"Ultimo mensaje de cliente"}</Block>
            </Block>
            <Block
              className={`last-message ${_activeStyleVariant}`}
              tag={"div"}
            >
              {lastMessageSlot}
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
