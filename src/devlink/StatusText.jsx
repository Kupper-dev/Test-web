"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";

export function StatusText({ status = "Status", variant = "Base" }) {
  const _styleVariantMap = {
    Base: "",
    Blue: "w-variant-cad24737-21d4-1b91-21c6-d439808a23d7",
    Green: "w-variant-217e9c05-632f-8851-2964-c6fbfad18da3",
    Yellow: "w-variant-df791d7e-7e02-fc54-ffda-b2ef1258506a",
    Red: "w-variant-902f0a8c-66e1-4017-9399-827fab793c3f",
    Turquoise: "w-variant-53529dbc-a65c-c289-7c3c-32a5e8e5c0e2",
    Purple: "w-variant-53ba2eb6-6f4b-164e-9932-5353d9ce93f2",
    Gray: "w-variant-00d8a114-8a13-630c-94e2-64b7dbf5955a",
    Orange: "w-variant-4a7db865-9db5-9c39-9187-dee20a89ffcd",
  };

  const _activeStyleVariant = _styleVariantMap[variant];

  return (
    <Block
      className={`text-block ${_activeStyleVariant}`}
      id={"w-node-_9d30b28a-459d-74dc-6872-014504779bd2-04779bd2"}
      tag={"div"}
    >
      {status}
    </Block>
  );
}
