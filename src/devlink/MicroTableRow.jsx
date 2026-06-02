"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function MicroTableRow({
  itemPrice = "$",
  itemQuantity = "1",
  itemTitle = "Teclado Lenovo Ideapad SL14HV1",
  itemTotal = "$",
  itemWarranty = "Garantía 1 Año",
  microTableHeaderSlot,
  microTableTotal = "$.MXN",
  variant = "Base",
}) {
  const _styleVariantMap = {
    Base: "",
    Item: "w-variant-b3aee1fe-2efe-7e51-f764-3416c78a0663",
    "Item end blue": "w-variant-b4402ec9-ae86-1781-1bb5-a8fa80fcbef8",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <Block className={`sidepanel-table ${_activeStyleVariant}`} tag={"div"}>
      {microTableHeaderSlot}
      <Block
        className={`table-row items-micro ${_activeStyleVariant}`}
        tag={"div"}
      >
        <Block className={`table-cell ${_activeStyleVariant}`} tag={"div"}>
          <Block
            className={`wrapper-v-left ${_activeStyleVariant}`}
            tag={"div"}
          >
            <Block
              className={`text-hover-mask micro ${_activeStyleVariant}`}
              tag={"div"}
            >
              <Block
                className={`text-hover-mask-inner ${_activeStyleVariant}`}
                tag={"div"}
              >
                <Block tag={"div"}>{itemTitle}</Block>
              </Block>
            </Block>
            <Block
              className={`text-micro gray ${_activeStyleVariant}`}
              tag={"div"}
            >
              {itemWarranty}
            </Block>
          </Block>
        </Block>
        <Block className={`table-cell mid ${_activeStyleVariant}`} tag={"div"}>
          <Block tag={"div"}>{itemQuantity}</Block>
        </Block>
        <Block className={`table-cell ${_activeStyleVariant}`} tag={"div"}>
          <Block tag={"div"}>{itemPrice}</Block>
        </Block>
        <Block className={`table-cell hr ${_activeStyleVariant}`} tag={"div"}>
          <Block tag={"div"}>{itemTotal}</Block>
        </Block>
      </Block>
      <Block
        className={`table-row items-micro footer ${_activeStyleVariant}`}
        tag={"div"}
      >
        <Block className={`table-cell ${_activeStyleVariant}`} tag={"div"}>
          <Block tag={"div"}>{"Total:"}</Block>
        </Block>
        <Block className={`table-cell hr ${_activeStyleVariant}`} tag={"div"}>
          <Block
            className={`text-medium-big ${_activeStyleVariant}`}
            tag={"div"}
          >
            {microTableTotal}
          </Block>
        </Block>
      </Block>
    </Block>
  );
}
