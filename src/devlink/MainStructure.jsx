"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Heading from "./webflow_modules/Basic/components/Heading";
import Image from "./webflow_modules/Basic/components/Image";
import Link from "./webflow_modules/Basic/components/Link";
import NotSupported from "./webflow_modules/Builtin/components/NotSupported";
import { Button } from "./Button";

export function MainStructure({
  aiIcon = "",
  aiSlot = "",

  buttonButton = {
    href: "#",
  },

  buttonButtonText = "Solicitar un servicio",
  complementaryBox,
  globalSearchSlot = "",
  imageHero1 = "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/695d48065aa88b8ec7598e18_1338755d39e40738244056bed0d9067f_DH1.png",
  imageHero2 = "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/695d480dc2b80a120e869530_e23eac12d1a0a451f35467abcd9d57bf_DH2.png",

  mainTabButtonMainTabButton = {
    href: "#",
  },

  mainTabButtonMainTabTitle = "Tab title",
  navBarLinkNavbarIconSlot = "",
  navbarSlot = "",
  notificationIcon = "",
  pageTitle = "Dashboard",
  tableWrapper,
  userImageProfile = "",
  userName = "User",
  userSettingsSlot = "",
}) {
  return (
    <Block className={"main-wrapper"} tag={"div"}>
      <Block className={"navbar"} tag={"div"}>
        <Block className={"nav-header"} tag={"div"}>
          <Block className={"navbar-top"} tag={"div"}>
            <Link
              block={"inline"}
              button={false}
              className={"square is-logo"}
              options={{
                href: "#",
              }}
            >
              <Image
                alt={""}
                className={"navbar-icon is--2"}
                height={"auto"}
                loading={"lazy"}
                src={
                  "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/6986bf7fdc4a14407741fa71_x.svg"
                }
                width={"auto"}
              />
            </Link>
          </Block>
        </Block>
        <Block className={"nav-links"} tag={"div"}>
          {navbarSlot ?? (
            <NotSupported
              _atom={"415 Af 538 740 D Ae 7 C 4818 Ddfe 31 E 41 E 08"}
            />
          )}
        </Block>
      </Block>
      <Block className={"content"} tag={"div"}>
        <Block className={"header-top"} tag={"div"}>
          <Block className={"header-inner"} tag={"div"}>
            <Block className={"wrapper-v-left"} tag={"div"}>
              <Image
                alt={""}
                className={"logo"}
                height={"auto"}
                loading={"lazy"}
                src={
                  "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/695c25f31b5665a9e4c5e3a2_2e69c7d700e0c10e78d3c620ad7a60f7_Logo%20Blue%20Gradient%20.svg"
                }
                width={"auto"}
              />
              <Heading className={"page-title"} tag={"h1"}>
                {pageTitle}
              </Heading>
            </Block>
            <Block className={"main-search"} tag={"div"}>
              {globalSearchSlot}
            </Block>
          </Block>
          <Block className={"header-inner end"} tag={"div"}>
            <Block className={"header-button"} tag={"div"}>
              {aiSlot ?? (
                <Block className={"navbar-icon"} tag={"div"}>
                  {aiIcon}
                </Block>
              )}
            </Block>
            <Block className={"header-button"} tag={"div"}>
              <Block className={"navbar-icon"} tag={"div"}>
                {notificationIcon}
              </Block>
            </Block>
            <Block className={"header-button"} tag={"div"}>
              {userSettingsSlot ?? (
                <Image
                  alt={""}
                  height={"auto"}
                  loading={"lazy"}
                  src={userImageProfile}
                  width={"auto"}
                />
              )}
            </Block>
          </Block>
        </Block>
        <Block className={"module flex-v"} tag={"div"}>
          <Block className={"title-wrapper-mask"} tag={"div"}>
            <Block className={"inner-mask-hero-title"} tag={"div"}>
              <Heading className={"hero-title"} tag={"h1"}>
                {"Hola "}
              </Heading>
              <Block className={"spacer_05_rem"} tag={"div"} />
              <Heading className={"hero-title gradient"} tag={"h1"}>
                {userName}
              </Heading>
            </Block>
          </Block>
          <Block className={"spacer-1-rem"} tag={"div"} />
          <Button button={buttonButton} buttonText={buttonButtonText} />
        </Block>
        <Block className={"hero-image-wrapper"} tag={"div"}>
          <Image
            alt={""}
            className={"dh2"}
            height={"auto"}
            loading={"lazy"}
            src={imageHero2}
            width={"auto"}
          />
          <Image
            alt={""}
            className={"dh1"}
            height={"auto"}
            loading={"lazy"}
            src={imageHero1}
            width={"auto"}
          />
        </Block>
        <Block className={"page-tab-system"} tag={"div"}>
          <Block className={"page-table"} tag={"div"}>
            {tableWrapper}
          </Block>
          <Block className={"complementary-box"} tag={"div"}>
            {complementaryBox}
          </Block>
        </Block>
      </Block>
    </Block>
  );
}
