"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function NoItemsFound({
  addItem,
  notFound,
  subtitle = "Solicita tu primer {Item}",
  title = "No se encontraron {Item}",
}) {
  return (
    <Block
      className={"no-items-found"}
      id={"w-node-_1de8781c-513a-3f22-527d-a2352b7debef-2b7debef"}
      tag={"div"}
    >
      {notFound}
      <Block className={"text-medium bold black"} tag={"div"}>
        {title}
      </Block>
      <Block tag={"div"}>{subtitle}</Block>
      {addItem}
    </Block>
  );
}
