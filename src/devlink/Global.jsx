"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import Image from "./webflow_modules/Basic/components/Image";
import Link from "./webflow_modules/Basic/components/Link";
import List from "./webflow_modules/Basic/components/List";
import Span from "./webflow_modules/Basic/components/Span";
import { NavBarLinkListItem } from "./NavBarLinkListItem";
import { WhatsappNavbar } from "./WhatsappNavbar";

export function Global({ marqueeUnder = true }) {
  return (
    <Block className={"global"} tag={"div"}>
      <Block
        className={"transition"}
        data-transition-theme={"light"}
        tag={"div"}
      >
        <Block className={"loading-icon"} tag={"div"}>
          <Block className={"loading-icon__inner"} tag={"div"} />
        </Block>
      </Block>
      <Block
        className={"nav"}
        data-marketing-theme={"dark"}
        data-nav-status={"not-active"}
        data-nav-theme={"light"}
        data-scrolling-direction={"up"}
        data-scrolling-started={"false"}
        tag={"nav"}
      >
        <Block className={"nav__bg"} data-nav-toggle={"close"} tag={"div"} />
        <Block className={"nav-bar__wrap"} tag={"div"}>
          <Block className={"nav-bar__width"} tag={"div"}>
            <Block className={"nav-bar"} tag={"div"}>
              <Block className={"nav-bar__back"} tag={"div"}>
                <Block className={"nav-bar__outline"} tag={"div"} />
                <Block className={"nav-bar__bg"} tag={"div"} />
              </Block>
              <Block
                className={"nav-bar__top"}
                data-nav-bar-height={""}
                tag={"div"}
              >
                <Block className={"nav-bar__menu"} tag={"div"}>
                  <Block
                    className={"nav-menu"}
                    data-nav-toggle={"toggle"}
                    tag={"div"}
                  >
                    <Block className={"nav-menu__hamburger"} tag={"div"}>
                      <Block
                        className={"nav-menu__hamburger-bar"}
                        tag={"div"}
                      />
                      <Block
                        className={"nav-menu__hamburger-bar"}
                        tag={"div"}
                      />
                    </Block>
                    <Span className={"nav-menu__label"}>{"Menu"}</Span>
                  </Block>
                </Block>
                <Block className={"nav-bar__logo"} tag={"div"}>
                  <Link
                    aria-label={"go to homepage"}
                    block={"inline"}
                    button={false}
                    className={"nav-logo"}
                    data-barba-update={""}
                    options={{
                      href: "/index.html",
                    }}
                  >
                    <Image
                      alt={""}
                      className={"nav-logo__wordmark-svg"}
                      height={"auto"}
                      loading={"lazy"}
                      src={
                        "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/695c1a648ac6b74b9eaa5dd0_Logo%202026.svg"
                      }
                      width={"auto"}
                    />
                    <Image
                      alt={""}
                      className={"nav-logo__icon-svg"}
                      height={"auto"}
                      loading={"lazy"}
                      src={
                        "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/6986d2b4053a6db0942076f4_22aac6c0e6a8a99c423620cb4a47f832_logo%203d%20micro.png"
                      }
                      width={"auto"}
                    />
                  </Link>
                </Block>
                <Block className={"nav-bar__buttons"} tag={"div"}>
                  <Block className={"nav-buttons__default"} tag={"div"}>
                    <Link
                      block={""}
                      button={false}
                      className={"nav-button is--login"}
                      options={{
                        href: "#login",
                      }}
                    >
                      {"Login"}
                    </Link>
                    <Link
                      block={""}
                      button={false}
                      className={"nav-button is--join"}
                      options={{
                        href: "#join",
                      }}
                    >
                      {"Join"}
                    </Link>
                  </Block>
                  <Block className={"nav-buttons__scrolled"} tag={"div"}>
                    <WhatsappNavbar />
                  </Block>
                </Block>
              </Block>
              <Block className={"nav-bar__line"} tag={"div"} />
              <Block className={"nav-bar__bottom"} tag={"div"}>
                <Block className={"nav-bar__bottom-overflow"} tag={"div"}>
                  <Block className={"nav-branch-buttons"} tag={"div"}>
                    <Link
                      block={""}
                      button={true}
                      className={"nav-branch-btn is--active"}
                      data-branch-btn={"0"}
                      options={{
                        href: "#",
                      }}
                    >
                      {"Inicio"}
                    </Link>
                    <Link
                      block={""}
                      button={true}
                      className={"nav-branch-btn"}
                      data-branch-btn={"1"}
                      options={{
                        href: "#",
                      }}
                    >
                      {"Branch 2"}
                    </Link>
                    <Link
                      block={""}
                      button={true}
                      className={"nav-branch-btn"}
                      data-branch-btn={"2"}
                      options={{
                        href: "#",
                      }}
                    >
                      {"Branch 3"}
                    </Link>
                  </Block>
                  <Block className={"nav-branch-container"} tag={"div"}>
                    <Block
                      className={"nav-branch-wrapper is--active"}
                      data-branch={"0"}
                      tag={"div"}
                    >
                      <Block
                        className={"nav-bar__bottom-inner"}
                        data-lenis-prevent={""}
                        tag={"div"}
                      >
                        <Block className={"nav-bar__bottom-row"} tag={"div"}>
                          <Block
                            className={"nav-bar__bottom-col is--products"}
                            tag={"div"}
                          >
                            <Block className={"nav-bar__tag-row"} tag={"div"}>
                              {"Inicio"}
                            </Block>
                            <List
                              className={"nav-bar__ul-big"}
                              tag={"ul"}
                              unstyled={false}
                            >
                              <NavBarLinkListItem
                                number={"Desde $3500/Mes"}
                                numberVisibility={true}
                                tagVisibility={false}
                                title={"Planes y precios"}
                              />
                              <NavBarLinkListItem
                                tagVisibility={false}
                                title={"Sobre nosotros"}
                              />
                              <NavBarLinkListItem
                                tagVisibility={false}
                                title={"Agenda una Demo"}
                              />
                            </List>
                          </Block>
                          <Block className={"nav-bar__bottom-col"} tag={"div"}>
                            <Block className={"nav-bar__tag-row"} tag={"div"}>
                              {"Plataforma"}
                            </Block>
                            <List
                              className={"nav-bar__ul-big"}
                              tag={"ul"}
                              unstyled={false}
                            >
                              <NavBarLinkListItem
                                tag={"Nuevo"}
                                tagVisibility={true}
                                title={"Descubre nuestro portal"}
                              />
                              <NavBarLinkListItem
                                tag={"Nuevo"}
                                tagVisibility={true}
                                title={"Asistente Whatsapp"}
                              />
                              <NavBarLinkListItem
                                tagVisibility={false}
                                title={"Reporte mensual via Email"}
                              />
                            </List>
                            <Block className={"nav-bar__socials"} tag={"div"}>
                              <Block className={"button-row"} tag={"div"}>
                                <Link
                                  block={""}
                                  button={false}
                                  className={"social-circle"}
                                  options={{
                                    href: "#",
                                  }}
                                >
                                  {"Li"}
                                </Link>
                                <Link
                                  block={""}
                                  button={false}
                                  className={"social-circle"}
                                  options={{
                                    href: "#",
                                  }}
                                >
                                  {"Tw"}
                                </Link>
                                <Link
                                  block={""}
                                  button={false}
                                  className={"social-circle"}
                                  options={{
                                    href: "#",
                                  }}
                                >
                                  {"Yt"}
                                </Link>
                              </Block>
                            </Block>
                          </Block>
                          <Block
                            className={"nav-bar__bottom-col is--ad"}
                            tag={"div"}
                          >
                            <Link
                              block={"inline"}
                              button={false}
                              className={"nav-banner"}
                              data-hover={false}
                              options={{
                                href: "#learning",
                              }}
                            >
                              <Block
                                className={"nav-banner__content"}
                                tag={"div"}
                              >
                                <Block className={"inline-title"} tag={"div"}>
                                  <Block
                                    className={"item-title shadow"}
                                    tag={"div"}
                                  >
                                    {
                                      "¿Cuando fue la ultima vez que hicieron mantenimiento a tus computadoras?"
                                    }
                                  </Block>
                                  <Image
                                    alt={""}
                                    className={"inline-image"}
                                    height={"auto"}
                                    loading={"lazy"}
                                    src={
                                      "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/6a15cd5b1915144fddb47211_Mini%20fire.gif"
                                    }
                                    width={"auto"}
                                  />
                                </Block>
                                <Block className={"button pink"} tag={"div"}>
                                  <Block tag={"div"}>{"Cotizar ahora"}</Block>
                                </Block>
                              </Block>
                            </Link>
                          </Block>
                        </Block>
                      </Block>
                    </Block>
                    <Block
                      className={"nav-branch-wrapper"}
                      data-branch={"1"}
                      tag={"div"}
                    >
                      <Block
                        className={"nav-bar__bottom-inner"}
                        data-lenis-prevent={""}
                        tag={"div"}
                      >
                        <Block className={"nav-bar__bottom-row"} tag={"div"}>
                          <Block
                            className={"nav-bar__bottom-col is--products"}
                            tag={"div"}
                          >
                            <Block className={"nav-bar__tag-row"} tag={"div"}>
                              {"Inicio"}
                            </Block>
                            <List
                              className={"nav-bar__ul-big"}
                              tag={"ul"}
                              unstyled={false}
                            >
                              <NavBarLinkListItem
                                number={"Desde $3500/Mes"}
                                numberVisibility={true}
                                tagVisibility={false}
                                title={"Planes y precios"}
                              />
                              <NavBarLinkListItem
                                tagVisibility={false}
                                title={"Sobre nosotros"}
                              />
                              <NavBarLinkListItem
                                tagVisibility={false}
                                title={"Agenda una Demo"}
                              />
                            </List>
                          </Block>
                          <Block className={"nav-bar__bottom-col"} tag={"div"}>
                            <Block className={"nav-bar__tag-row"} tag={"div"}>
                              {"Plataforma"}
                            </Block>
                            <List
                              className={"nav-bar__ul-big"}
                              tag={"ul"}
                              unstyled={false}
                            >
                              <NavBarLinkListItem
                                tag={"Nuevo"}
                                tagVisibility={true}
                                title={"Descubre nuestro portal"}
                              />
                              <NavBarLinkListItem
                                tag={"Nuevo"}
                                tagVisibility={true}
                                title={"Asistente Whatsapp"}
                              />
                              <NavBarLinkListItem
                                tagVisibility={false}
                                title={"Reporte mensual via Email"}
                              />
                            </List>
                            <Block className={"nav-bar__socials"} tag={"div"}>
                              <Block className={"button-row"} tag={"div"}>
                                <Link
                                  block={""}
                                  button={false}
                                  className={"social-circle"}
                                  options={{
                                    href: "#",
                                  }}
                                >
                                  {"Li"}
                                </Link>
                                <Link
                                  block={""}
                                  button={false}
                                  className={"social-circle"}
                                  options={{
                                    href: "#",
                                  }}
                                >
                                  {"Tw"}
                                </Link>
                                <Link
                                  block={""}
                                  button={false}
                                  className={"social-circle"}
                                  options={{
                                    href: "#",
                                  }}
                                >
                                  {"Yt"}
                                </Link>
                              </Block>
                            </Block>
                          </Block>
                          <Block
                            className={"nav-bar__bottom-col is--ad"}
                            tag={"div"}
                          >
                            <Link
                              block={"inline"}
                              button={false}
                              className={"nav-banner"}
                              data-hover={false}
                              options={{
                                href: "#learning",
                              }}
                            >
                              <Block
                                className={"nav-banner__content"}
                                tag={"div"}
                              >
                                <Block className={"inline-title"} tag={"div"}>
                                  <Block
                                    className={"item-title shadow"}
                                    tag={"div"}
                                  >
                                    {
                                      "¿Cuando fue la ultima vez que hicieron mantenimiento a tus computadoras?"
                                    }
                                  </Block>
                                  <Image
                                    alt={""}
                                    className={"inline-image"}
                                    height={"auto"}
                                    loading={"lazy"}
                                    src={
                                      "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/6a15cd5b1915144fddb47211_Mini%20fire.gif"
                                    }
                                    width={"auto"}
                                  />
                                </Block>
                                <Block className={"button pink"} tag={"div"}>
                                  <Block tag={"div"}>{"Cotizar ahora"}</Block>
                                </Block>
                              </Block>
                            </Link>
                          </Block>
                        </Block>
                      </Block>
                    </Block>
                    <Block
                      className={"nav-branch-wrapper"}
                      data-branch={"2"}
                      tag={"div"}
                    >
                      <Block
                        className={"nav-bar__bottom-inner"}
                        data-lenis-prevent={""}
                        tag={"div"}
                      >
                        <Block className={"nav-bar__bottom-row"} tag={"div"}>
                          <Block
                            className={"nav-bar__bottom-col is--products"}
                            tag={"div"}
                          >
                            <Block className={"nav-bar__tag-row"} tag={"div"}>
                              {"Inicio"}
                            </Block>
                            <List
                              className={"nav-bar__ul-big"}
                              tag={"ul"}
                              unstyled={false}
                            >
                              <NavBarLinkListItem
                                number={"Desde $3500/Mes"}
                                numberVisibility={true}
                                tagVisibility={false}
                                title={"Planes y precios"}
                              />
                              <NavBarLinkListItem
                                tagVisibility={false}
                                title={"Sobre nosotros"}
                              />
                              <NavBarLinkListItem
                                tagVisibility={false}
                                title={"Agenda una Demo"}
                              />
                            </List>
                          </Block>
                          <Block className={"nav-bar__bottom-col"} tag={"div"}>
                            <Block className={"nav-bar__tag-row"} tag={"div"}>
                              {"Plataforma"}
                            </Block>
                            <List
                              className={"nav-bar__ul-big"}
                              tag={"ul"}
                              unstyled={false}
                            >
                              <NavBarLinkListItem
                                tag={"Nuevo"}
                                tagVisibility={true}
                                title={"Descubre nuestro portal"}
                              />
                              <NavBarLinkListItem
                                tag={"Nuevo"}
                                tagVisibility={true}
                                title={"Asistente Whatsapp"}
                              />
                              <NavBarLinkListItem
                                tagVisibility={false}
                                title={"Reporte mensual via Email"}
                              />
                            </List>
                            <Block className={"nav-bar__socials"} tag={"div"}>
                              <Block className={"button-row"} tag={"div"}>
                                <Link
                                  block={""}
                                  button={false}
                                  className={"social-circle"}
                                  options={{
                                    href: "#",
                                  }}
                                >
                                  {"Li"}
                                </Link>
                                <Link
                                  block={""}
                                  button={false}
                                  className={"social-circle"}
                                  options={{
                                    href: "#",
                                  }}
                                >
                                  {"Tw"}
                                </Link>
                                <Link
                                  block={""}
                                  button={false}
                                  className={"social-circle"}
                                  options={{
                                    href: "#",
                                  }}
                                >
                                  {"Yt"}
                                </Link>
                              </Block>
                            </Block>
                          </Block>
                          <Block
                            className={"nav-bar__bottom-col is--ad"}
                            tag={"div"}
                          >
                            <Link
                              block={"inline"}
                              button={false}
                              className={"nav-banner"}
                              data-hover={false}
                              options={{
                                href: "#learning",
                              }}
                            >
                              <Block
                                className={"nav-banner__content"}
                                tag={"div"}
                              >
                                <Block className={"inline-title"} tag={"div"}>
                                  <Block
                                    className={"item-title shadow"}
                                    tag={"div"}
                                  >
                                    {
                                      "¿Cuando fue la ultima vez que hicieron mantenimiento a tus computadoras?"
                                    }
                                  </Block>
                                  <Image
                                    alt={""}
                                    className={"inline-image"}
                                    height={"auto"}
                                    loading={"lazy"}
                                    src={
                                      "https://cdn.prod.website-files.com/695c194c86d5e76167047ce4/6a15cd5b1915144fddb47211_Mini%20fire.gif"
                                    }
                                    width={"auto"}
                                  />
                                </Block>
                                <Block className={"button pink"} tag={"div"}>
                                  <Block tag={"div"}>{"Cotizar ahora"}</Block>
                                </Block>
                              </Block>
                            </Link>
                          </Block>
                        </Block>
                      </Block>
                    </Block>
                  </Block>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
}
