"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Link from "./webflow_modules/Basic/components/Link";
import { StatusText } from "./StatusText";

export function ItemDetails({
  actionButton = {
    href: "#",
  },

  actionButtonText = "Action",
  actionButtonVisibility = true,
  detail1 = "Detail 1",
  detail10 = "Detail 4",
  detail2 = "Detail 2",
  detail3 = "Detail 3",
  detail4 = "Detail 4",
  detail5 = "Detail 4",
  detail6 = "Detail 4",
  detail7 = "Detail 4",
  detail8 = "Detail 4",
  detail9 = "Detail 4",
  detailVisibility1 = true,
  detailVisibility10 = true,
  detailVisibility2 = true,
  detailVisibility3 = true,
  detailVisibility4 = true,
  detailVisibility5 = true,
  detailVisibility6 = true,
  detailVisibility7 = true,
  detailVisibility8 = true,
  detailVisibility9 = true,
  formattedId = "ID000",
  idFormattedVisibility = true,

  linkToPanelLayerExtended = {
    href: "#",
  },

  mobileLinkPanelLayerExtended = false,
  statusTextVariantProperty = "Base",
  textToPanelLayerExtended = "Link",
  title = "Item Title",
  variant = "Base",
}) {
  const _styleVariantMap = {
    Base: "",
    Positive: "w-variant-16e2f4d1-4c24-9d75-fed7-fb7ec0b44296",
    Warning: "w-variant-22320f02-c809-e5ce-0bb7-04b35c6b6cbc",
    Negative: "w-variant-98267fb0-6137-f15a-1556-34e0ec02e1f9",
    Inactive: "w-variant-2ca7c256-3b52-5e00-9072-94fa2ea1b783",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <Block className={`list ${_activeStyleVariant}`} tag={"div"}>
      <Block className={`item-title ${_activeStyleVariant}`} tag={"div"}>
        <Block className={_activeStyleVariant} tag={"div"}>
          {title}
        </Block>
      </Block>
      <Block className={`stagger-group ${_activeStyleVariant}`} tag={"div"}>
        {idFormattedVisibility ? (
          <Block
            className={`reveal-wrapper is-curtain ${_activeStyleVariant}`}
            tag={"div"}
          >
            <Block
              className={`reveal-curtain blue ${_activeStyleVariant}`}
              tag={"div"}
            />
            <Block
              className={`reveal-content blue ${_activeStyleVariant}`}
              tag={"div"}
            >
              <Block
                className={`item-text-detail blue ${_activeStyleVariant}`}
                tag={"div"}
              >
                {formattedId}
              </Block>
            </Block>
          </Block>
        ) : null}
        {detailVisibility1 ? (
          <Block
            className={`reveal-wrapper is-curtain ${_activeStyleVariant}`}
            tag={"div"}
          >
            <Block
              className={`reveal-curtain ${_activeStyleVariant}`}
              tag={"div"}
            />
            <Block
              className={`reveal-content is-multiline ${_activeStyleVariant}`}
              tag={"div"}
            >
              <StatusText
                status={detail1}
                variant={statusTextVariantProperty}
              />
            </Block>
          </Block>
        ) : null}
        {detailVisibility2 ? (
          <Block
            className={`reveal-wrapper is-curtain ${_activeStyleVariant}`}
            tag={"div"}
          >
            <Block
              className={`reveal-curtain ${_activeStyleVariant}`}
              tag={"div"}
            />
            <Block
              className={`reveal-content is-multiline ${_activeStyleVariant}`}
              tag={"div"}
            >
              <Block
                className={`item-text-detail ${_activeStyleVariant}`}
                tag={"div"}
              >
                {detail2}
              </Block>
            </Block>
          </Block>
        ) : null}
        {detailVisibility3 ? (
          <Block
            className={`reveal-wrapper is-curtain ${_activeStyleVariant}`}
            tag={"div"}
          >
            <Block
              className={`reveal-curtain ${_activeStyleVariant}`}
              tag={"div"}
            />
            <Block
              className={`reveal-content is-multiline ${_activeStyleVariant}`}
              tag={"div"}
            >
              <Block
                className={`item-text-detail ${_activeStyleVariant}`}
                tag={"div"}
              >
                {detail3}
              </Block>
            </Block>
          </Block>
        ) : null}
        {detailVisibility4 ? (
          <Block
            className={`reveal-wrapper is-curtain ${_activeStyleVariant}`}
            tag={"div"}
          >
            <Block
              className={`reveal-curtain ${_activeStyleVariant}`}
              tag={"div"}
            />
            <Block
              className={`reveal-content is-multiline ${_activeStyleVariant}`}
              tag={"div"}
            >
              <Block
                className={`item-text-detail ${_activeStyleVariant}`}
                tag={"div"}
              >
                {detail4}
              </Block>
            </Block>
          </Block>
        ) : null}
        {detailVisibility5 ? (
          <Block
            className={`reveal-wrapper is-curtain ${_activeStyleVariant}`}
            tag={"div"}
          >
            <Block
              className={`reveal-curtain ${_activeStyleVariant}`}
              tag={"div"}
            />
            <Block
              className={`reveal-content is-multiline ${_activeStyleVariant}`}
              tag={"div"}
            >
              <Block
                className={`item-text-detail ${_activeStyleVariant}`}
                tag={"div"}
              >
                {detail5}
              </Block>
            </Block>
          </Block>
        ) : null}
        {detailVisibility6 ? (
          <Block
            className={`reveal-wrapper is-curtain ${_activeStyleVariant}`}
            tag={"div"}
          >
            <Block
              className={`reveal-curtain ${_activeStyleVariant}`}
              tag={"div"}
            />
            <Block
              className={`reveal-content is-multiline ${_activeStyleVariant}`}
              tag={"div"}
            >
              <Block
                className={`item-text-detail ${_activeStyleVariant}`}
                tag={"div"}
              >
                {detail6}
              </Block>
            </Block>
          </Block>
        ) : null}
        {detailVisibility7 ? (
          <Block
            className={`reveal-wrapper is-curtain ${_activeStyleVariant}`}
            tag={"div"}
          >
            <Block
              className={`reveal-curtain ${_activeStyleVariant}`}
              tag={"div"}
            />
            <Block
              className={`reveal-content is-multiline ${_activeStyleVariant}`}
              tag={"div"}
            >
              <Block
                className={`item-text-detail ${_activeStyleVariant}`}
                tag={"div"}
              >
                {detail7}
              </Block>
            </Block>
          </Block>
        ) : null}
        {detailVisibility8 ? (
          <Block
            className={`reveal-wrapper is-curtain ${_activeStyleVariant}`}
            tag={"div"}
          >
            <Block
              className={`reveal-curtain ${_activeStyleVariant}`}
              tag={"div"}
            />
            <Block
              className={`reveal-content is-multiline ${_activeStyleVariant}`}
              tag={"div"}
            >
              <Block
                className={`item-text-detail ${_activeStyleVariant}`}
                tag={"div"}
              >
                {detail8}
              </Block>
            </Block>
          </Block>
        ) : null}
        {detailVisibility9 ? (
          <Block
            className={`reveal-wrapper is-curtain ${_activeStyleVariant}`}
            tag={"div"}
          >
            <Block
              className={`reveal-curtain ${_activeStyleVariant}`}
              tag={"div"}
            />
            <Block
              className={`reveal-content is-multiline ${_activeStyleVariant}`}
              tag={"div"}
            >
              <Block
                className={`item-text-detail ${_activeStyleVariant}`}
                tag={"div"}
              >
                {detail9}
              </Block>
            </Block>
          </Block>
        ) : null}
        {detailVisibility10 ? (
          <Block
            className={`reveal-wrapper is-curtain ${_activeStyleVariant}`}
            tag={"div"}
          >
            <Block
              className={`reveal-curtain ${_activeStyleVariant}`}
              tag={"div"}
            />
            <Block
              className={`reveal-content is-multiline ${_activeStyleVariant}`}
              tag={"div"}
            >
              <Block
                className={`item-text-detail ${_activeStyleVariant}`}
                tag={"div"}
              >
                {detail10}
              </Block>
            </Block>
          </Block>
        ) : null}
        <Block className={`spacer-1-rem ${_activeStyleVariant}`} tag={"div"} />
        {mobileLinkPanelLayerExtended ? (
          <Block
            className={`reveal-wrapper is-curtain ${_activeStyleVariant}`}
            tag={"div"}
          >
            <Block
              className={`reveal-curtain ${_activeStyleVariant}`}
              tag={"div"}
            />
            <Block
              className={`reveal-content is-multiline ${_activeStyleVariant}`}
              tag={"div"}
            >
              <Link
                block={""}
                button={false}
                className={`item-text-detail link ${_activeStyleVariant}`}
                options={linkToPanelLayerExtended}
              >
                {textToPanelLayerExtended}
              </Link>
            </Block>
          </Block>
        ) : null}
        <Block className={`spacer-1-rem ${_activeStyleVariant}`} tag={"div"} />
        {actionButtonVisibility ? (
          <Block
            className={`wrapper-button-right ${_activeStyleVariant}`}
            tag={"div"}
          >
            <Block
              className={`reveal-wrapper is-curtain ${_activeStyleVariant}`}
              tag={"div"}
            >
              <Block
                className={`reveal-curtain blue ${_activeStyleVariant}`}
                tag={"div"}
              />
              <Block
                className={`reveal-content is-multiline ${_activeStyleVariant}`}
                tag={"div"}
              >
                <Link
                  block={""}
                  button={true}
                  className={`button-action ${_activeStyleVariant}`}
                  options={actionButton}
                >
                  {actionButtonText}
                </Link>
              </Block>
            </Block>
          </Block>
        ) : null}
      </Block>
    </Block>
  );
}
