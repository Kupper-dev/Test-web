"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Link from "./webflow_modules/Basic/components/Link";

export function TrackerCell({
  actionButton = {
    href: "#",
  },

  actionButtonText = "Action",
  date = "DD/MM/YY",
  hour = "00:00",

  link1 = {
    href: "#",
  },

  linkText1 = "Text Link",
  statusMessage = "Status message",
  statusTitle = "Status title",
  variant = "Base",
  warningText = "Warning",
}) {
  const _styleVariantMap = {
    Base: "",
    Active: "w-variant-4f18e801-4147-2d5d-5bec-f247344349bf",
    Checked: "w-variant-6a7f2971-144e-aa38-3e0b-ae90a53924bb",
    Awaiting: "w-variant-3b3952b2-7c46-d030-2a15-c144f7e69b00",
    "Active Warning": "w-variant-d47b62f0-17f2-907e-a7ce-d170f0bc7d67",
    "Active action": "w-variant-9c696851-abd5-a353-e3c7-d77d39c0a744",
    "Active warning action": "w-variant-5842edef-0fc8-35bd-5744-d121607bd1ae",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <Block
      className={`tracker-row ${_activeStyleVariant}`}
      id={"w-node-eac47d47-363b-73c1-7cf6-bd734d55b3fa-4d55b3fa"}
      tag={"div"}
    >
      <Block
        className={`wrapper-h-space-between ${_activeStyleVariant}`}
        tag={"div"}
      >
        <Block
          className={`status-check-icon ${_activeStyleVariant}`}
          tag={"div"}
        />
        <Block
          className={`status_time_wrapper top ${_activeStyleVariant}`}
          tag={"div"}
        >
          <Block className={`small-text ${_activeStyleVariant}`} tag={"div"}>
            {hour}
          </Block>
          <Block className={`small-text ${_activeStyleVariant}`} tag={"div"}>
            {date}
          </Block>
        </Block>
      </Block>
      <Block className={`tracking-cell ${_activeStyleVariant}`} tag={"div"}>
        <Block
          className={`status_time_wrapper down ${_activeStyleVariant}`}
          tag={"div"}
        >
          <Block className={`small-text ${_activeStyleVariant}`} tag={"div"}>
            {hour}
          </Block>
          <Block className={`small-text ${_activeStyleVariant}`} tag={"div"}>
            {date}
          </Block>
        </Block>
        <Block className={`list ${_activeStyleVariant}`} tag={"div"}>
          <Block className={`text-medium ${_activeStyleVariant}`} tag={"div"}>
            {statusTitle}
          </Block>
          <Block className={`text-micro ${_activeStyleVariant}`} tag={"div"}>
            {statusMessage}
          </Block>
          <Block className={`tracker-alert ${_activeStyleVariant}`} tag={"div"}>
            <Block tag={"div"}>{warningText}</Block>
          </Block>
        </Block>
      </Block>
      <Block
        className={`tracking-cell-action ${_activeStyleVariant}`}
        tag={"div"}
      >
        <Block
          className={`wrapper-h-space-between ${_activeStyleVariant}`}
          tag={"div"}
        >
          <Link
            block={""}
            button={false}
            className={`text-link black micro ${_activeStyleVariant}`}
            options={link1}
          >
            {linkText1}
          </Link>
          <Link
            block={""}
            button={true}
            className={`button-action blue-1 micro ${_activeStyleVariant}`}
            options={actionButton}
          >
            {actionButtonText}
          </Link>
        </Block>
      </Block>
    </Block>
  );
}
