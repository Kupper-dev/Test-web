"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Image from "./webflow_modules/Basic/components/Image";
import Link from "./webflow_modules/Basic/components/Link";
import { StatusText } from "./StatusText";

export function RelatedServiceItem({
  accesories = "Accesorios",
  creationDate = "Fecha",
  dataBackup = "Respaldo:",
  diagnosis = "Diagnostico",
  diagnosisVisibility = true,
  expandColapseButton,
  idFormatted = "ID000",
  issueReformulation = "Titulo",
  powerAdapter = "Cargador:",
  requestOrIssue = "Falla o solicitud",
  servicesRendered = "Realizado",
  servicesRenderedVisibility = true,
  serviceUnder30Minutes = true,
  statusTextStatus = "Status",
  statusTextStatusVariant = "Base",
  technician = "Technician",
}) {
  return (
    <Block
      className={"related-item"}
      id={"w-node-_2c589bab-b4ab-4827-c856-cc603a7512ed-3a7512ed"}
      tag={"div"}
    >
      <Block className={"related-item-header"} tag={"div"}>
        <Block className={"list"} tag={"div"}>
          <Block className={"wrapper-h-space-between"} tag={"div"}>
            <Block className={"reveal-wrapper"} tag={"div"}>
              <Block className={"text-hover-mask"} tag={"div"}>
                <Block className={"text-hover-mask-inner"} tag={"div"}>
                  <Block className={"text-medium"} tag={"div"}>
                    {issueReformulation}
                  </Block>
                </Block>
              </Block>
            </Block>
            {expandColapseButton}
          </Block>
          <Block className={"reveal-wrapper"} tag={"div"}>
            <Block className={"text-small blue"} tag={"div"}>
              {idFormatted}
            </Block>
          </Block>
          <Block className={"reveal-wrapper"} tag={"div"}>
            <StatusText
              status={statusTextStatus}
              variant={statusTextStatusVariant}
            />
          </Block>
        </Block>
      </Block>
      <Block className={"related-item-content"} tag={"div"}>
        <Block className={"stagger-group"} tag={"div"}>
          <Block className={"reveal-wrapper is-curtain"} tag={"div"}>
            <Block className={"reveal-curtain"} tag={"div"} />
            <Block className={"reveal-content"} tag={"div"}>
              <Block className={"wrapper-h-left"} tag={"div"}>
                <Image
                  alt={""}
                  className={"profile_image"}
                  height={"auto"}
                  loading={"lazy"}
                  src={
                    "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/69601f6219cf0d3e9e2d6d63_imgi_1_store-chat-specialist-icon-202506.jpg"
                  }
                  width={"auto"}
                />
                <Block className={"wrapper-v-left"} tag={"div"}>
                  <Block className={"text-micro gray"} tag={"div"}>
                    {"Tecnico a cargo:"}
                  </Block>
                  <Block className={"reveal-wrapper"} tag={"div"}>
                    <Block className={"text-small black"} tag={"div"}>
                      {technician}
                    </Block>
                  </Block>
                </Block>
                <Block className={"spacer-1-rem"} tag={"div"} />
              </Block>
            </Block>
          </Block>
          {serviceUnder30Minutes ? (
            <Block className={"reveal-wrapper is-curtain"} tag={"div"}>
              <Block className={"reveal-curtain blue"} tag={"div"} />
              <Block className={"reveal-content"} tag={"div"}>
                <Block className={"wrapper-h-left"} tag={"div"}>
                  <Image
                    alt={""}
                    className={"ui_icon_20"}
                    height={"auto"}
                    loading={"lazy"}
                    src={
                      "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/695c7603b5dc2f96c47f1ada_time%20response.svg"
                    }
                    width={"auto"}
                  />
                  <Block className={"text-small blue"} tag={"div"}>
                    {"Servicio en menos de 30 min"}
                  </Block>
                </Block>
              </Block>
            </Block>
          ) : null}
          <Block className={"reveal-wrapper is-curtain"} tag={"div"}>
            <Block className={"reveal-curtain"} tag={"div"} />
            <Block className={"reveal-content"} tag={"div"}>
              <Block tag={"div"}>{creationDate}</Block>
            </Block>
          </Block>
          <Block className={"reveal-wrapper is-curtain"} tag={"div"}>
            <Block className={"reveal-curtain"} tag={"div"} />
            <Block className={"reveal-content"} tag={"div"}>
              <Block tag={"div"}>{powerAdapter}</Block>
            </Block>
          </Block>
          <Block className={"reveal-wrapper is-curtain"} tag={"div"}>
            <Block className={"reveal-curtain"} tag={"div"} />
            <Block className={"reveal-content"} tag={"div"}>
              <Block tag={"div"}>{dataBackup}</Block>
            </Block>
          </Block>
          <Block className={"reveal-wrapper is-curtain"} tag={"div"}>
            <Block className={"reveal-curtain"} tag={"div"} />
            <Block className={"reveal-content"} tag={"div"}>
              <Block tag={"div"}>{accesories}</Block>
            </Block>
          </Block>
          <Block className={"reveal-wrapper is-multiline"} tag={"div"}>
            <Block className={"reveal-curtain"} tag={"div"} />
            <Block className={"reveal-content is-multiline"} tag={"div"}>
              <Block tag={"div"}>{requestOrIssue}</Block>
            </Block>
          </Block>
          {diagnosisVisibility ? (
            <Block className={"reveal-wrapper is-multiline"} tag={"div"}>
              <Block className={"reveal-curtain"} tag={"div"} />
              <Block className={"reveal-content is-multiline"} tag={"div"}>
                <Block tag={"div"}>{diagnosis}</Block>
              </Block>
            </Block>
          ) : null}
          {servicesRenderedVisibility ? (
            <Block className={"reveal-wrapper is-multiline"} tag={"div"}>
              <Block className={"reveal-curtain"} tag={"div"} />
              <Block className={"reveal-content is-multiline"} tag={"div"}>
                <Block tag={"div"}>{servicesRendered}</Block>
              </Block>
            </Block>
          ) : null}
          <Block className={"spacer-1-rem"} tag={"div"} />
        </Block>
      </Block>
    </Block>
  );
}
