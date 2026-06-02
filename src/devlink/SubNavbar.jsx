"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import DOM from "./webflow_modules/Builtin/components/DOM";
import Link from "./webflow_modules/Basic/components/Link";
import Paragraph from "./webflow_modules/Basic/components/Paragraph";

export function SubNavbar({
  layoutShowMarquee = true,
  layoutShowTags = false,
  marqueeContentMarqueeText = "New: Osmo Button Pack",
  tagsContentCategoryTag = "Product",
  tagsContentNameTag = "Button Pack",
  tagsContentStatusTag = "✓ Included in Membership",
}) {
  return (
    <Block tag={"div"}>
      <Block className={"under-nav-bar"} tag={"div"}>
        <Block className={"under-nav-bar__inner"} tag={"div"}>
          <Block className={"nav-tags-row"} tag={"div"}>
            <Block className={"tags-left"} tag={"div"}>
              <Block className={"tag is--category"} tag={"div"}>
                <Paragraph className={"eyebrow is--relative"}>
                  {tagsContentCategoryTag}
                </Paragraph>
              </Block>
              <Block className={"tag is--name"} tag={"div"}>
                <Paragraph className={"eyebrow is--relative"}>
                  {tagsContentNameTag}
                </Paragraph>
              </Block>
            </Block>
            <Block className={"tags-right"} tag={"div"}>
              <Block className={"tag is--status"} tag={"div"}>
                <Paragraph className={"eyebrow is--relative"}>
                  {tagsContentStatusTag}
                </Paragraph>
              </Block>
            </Block>
          </Block>
          <Link
            block={"inline"}
            button={false}
            className={"nav-marquee"}
            options={{
              href: "/",
            }}
          >
            <Block className={"marquee-css"} tag={"div"}>
              <Block className={"marquee-css__list"} tag={"div"}>
                <Block className={"marquee-css__item"} tag={"div"}>
                  <Paragraph className={"eyebrow is--nav-marquee"}>
                    {marqueeContentMarqueeText}
                  </Paragraph>
                  <Block tag={"div"}>
                    <DOM
                      className={"inline-svg-0"}
                      fill={"none"}
                      style={
                        "display:block;width:0.4375em;height:0.4375em;color:inherit;flex-shrink:0"
                      }
                      tag={"svg"}
                      viewBox={"0 0 187 187"}
                      xmlns={"http://www.w3.org/2000/svg"}
                    >
                      <DOM
                        d={
                          "M126.049 76.7471L167.276 35.5197L150.805 19.0486L109.577 60.276C107.82 62.0398 104.808 60.7915 104.808 58.3009V0H81.517V70.3375C81.517 76.511 76.511 81.517 70.3375 81.517H0V104.808H58.3009C60.7915 104.808 62.0398 107.82 60.276 109.577L19.0548 150.805L35.5259 167.276L76.7533 126.049C78.5109 124.291 81.5232 125.533 81.5232 128.024V186.324H104.814V115.987C104.814 109.813 109.82 104.808 115.993 104.808H186.331V81.517H128.03C125.539 81.517 124.291 78.5047 126.055 76.7471H126.049Z"
                        }
                        fill={"currentColor"}
                        tag={"path"}
                      />
                    </DOM>
                  </Block>
                </Block>
                <Block className={"marquee-css__item"} tag={"div"}>
                  <Paragraph className={"eyebrow is--nav-marquee"}>
                    {"New: Osmo Button Pack"}
                  </Paragraph>
                  <Block tag={"div"}>
                    <DOM
                      className={"inline-svg-0"}
                      fill={"none"}
                      style={
                        "display:block;width:0.4375em;height:0.4375em;color:inherit;flex-shrink:0"
                      }
                      tag={"svg"}
                      viewBox={"0 0 187 187"}
                      xmlns={"http://www.w3.org/2000/svg"}
                    >
                      <DOM
                        d={
                          "M126.049 76.7471L167.276 35.5197L150.805 19.0486L109.577 60.276C107.82 62.0398 104.808 60.7915 104.808 58.3009V0H81.517V70.3375C81.517 76.511 76.511 81.517 70.3375 81.517H0V104.808H58.3009C60.7915 104.808 62.0398 107.82 60.276 109.577L19.0548 150.805L35.5259 167.276L76.7533 126.049C78.5109 124.291 81.5232 125.533 81.5232 128.024V186.324H104.814V115.987C104.814 109.813 109.82 104.808 115.993 104.808H186.331V81.517H128.03C125.539 81.517 124.291 78.5047 126.055 76.7471H126.049Z"
                        }
                        fill={"currentColor"}
                        tag={"path"}
                      />
                    </DOM>
                  </Block>
                </Block>
                <Block className={"marquee-css__item"} tag={"div"}>
                  <Paragraph className={"eyebrow is--nav-marquee"}>
                    {"New: Osmo Button Pack"}
                  </Paragraph>
                  <Block tag={"div"}>
                    <DOM
                      className={"inline-svg-0"}
                      fill={"none"}
                      style={
                        "display:block;width:0.4375em;height:0.4375em;color:inherit;flex-shrink:0"
                      }
                      tag={"svg"}
                      viewBox={"0 0 187 187"}
                      xmlns={"http://www.w3.org/2000/svg"}
                    >
                      <DOM
                        d={
                          "M126.049 76.7471L167.276 35.5197L150.805 19.0486L109.577 60.276C107.82 62.0398 104.808 60.7915 104.808 58.3009V0H81.517V70.3375C81.517 76.511 76.511 81.517 70.3375 81.517H0V104.808H58.3009C60.7915 104.808 62.0398 107.82 60.276 109.577L19.0548 150.805L35.5259 167.276L76.7533 126.049C78.5109 124.291 81.5232 125.533 81.5232 128.024V186.324H104.814V115.987C104.814 109.813 109.82 104.808 115.993 104.808H186.331V81.517H128.03C125.539 81.517 124.291 78.5047 126.055 76.7471H126.049Z"
                        }
                        fill={"currentColor"}
                        tag={"path"}
                      />
                    </DOM>
                  </Block>
                </Block>
                <Block className={"marquee-css__item"} tag={"div"}>
                  <Paragraph className={"eyebrow is--nav-marquee"}>
                    {"New: Osmo Button Pack"}
                  </Paragraph>
                  <Block tag={"div"}>
                    <DOM
                      className={"inline-svg-0"}
                      fill={"none"}
                      style={
                        "display:block;width:0.4375em;height:0.4375em;color:inherit;flex-shrink:0"
                      }
                      tag={"svg"}
                      viewBox={"0 0 187 187"}
                      xmlns={"http://www.w3.org/2000/svg"}
                    >
                      <DOM
                        d={
                          "M126.049 76.7471L167.276 35.5197L150.805 19.0486L109.577 60.276C107.82 62.0398 104.808 60.7915 104.808 58.3009V0H81.517V70.3375C81.517 76.511 76.511 81.517 70.3375 81.517H0V104.808H58.3009C60.7915 104.808 62.0398 107.82 60.276 109.577L19.0548 150.805L35.5259 167.276L76.7533 126.049C78.5109 124.291 81.5232 125.533 81.5232 128.024V186.324H104.814V115.987C104.814 109.813 109.82 104.808 115.993 104.808H186.331V81.517H128.03C125.539 81.517 124.291 78.5047 126.055 76.7471H126.049Z"
                        }
                        fill={"currentColor"}
                        tag={"path"}
                      />
                    </DOM>
                  </Block>
                </Block>
              </Block>
              <Block className={"marquee-css__list"} tag={"div"}>
                <Block className={"marquee-css__item"} tag={"div"}>
                  <Paragraph className={"eyebrow is--nav-marquee"}>
                    {marqueeContentMarqueeText}
                  </Paragraph>
                  <Block tag={"div"}>
                    <DOM
                      className={"inline-svg-0"}
                      fill={"none"}
                      style={
                        "display:block;width:0.4375em;height:0.4375em;color:inherit;flex-shrink:0"
                      }
                      tag={"svg"}
                      viewBox={"0 0 187 187"}
                      xmlns={"http://www.w3.org/2000/svg"}
                    >
                      <DOM
                        d={
                          "M126.049 76.7471L167.276 35.5197L150.805 19.0486L109.577 60.276C107.82 62.0398 104.808 60.7915 104.808 58.3009V0H81.517V70.3375C81.517 76.511 76.511 81.517 70.3375 81.517H0V104.808H58.3009C60.7915 104.808 62.0398 107.82 60.276 109.577L19.0548 150.805L35.5259 167.276L76.7533 126.049C78.5109 124.291 81.5232 125.533 81.5232 128.024V186.324H104.814V115.987C104.814 109.813 109.82 104.808 115.993 104.808H186.331V81.517H128.03C125.539 81.517 124.291 78.5047 126.055 76.7471H126.049Z"
                        }
                        fill={"currentColor"}
                        tag={"path"}
                      />
                    </DOM>
                  </Block>
                </Block>
                <Block className={"marquee-css__item"} tag={"div"}>
                  <Paragraph className={"eyebrow is--nav-marquee"}>
                    {"New: Osmo Button Pack"}
                  </Paragraph>
                  <Block tag={"div"}>
                    <DOM
                      className={"inline-svg-0"}
                      fill={"none"}
                      style={
                        "display:block;width:0.4375em;height:0.4375em;color:inherit;flex-shrink:0"
                      }
                      tag={"svg"}
                      viewBox={"0 0 187 187"}
                      xmlns={"http://www.w3.org/2000/svg"}
                    >
                      <DOM
                        d={
                          "M126.049 76.7471L167.276 35.5197L150.805 19.0486L109.577 60.276C107.82 62.0398 104.808 60.7915 104.808 58.3009V0H81.517V70.3375C81.517 76.511 76.511 81.517 70.3375 81.517H0V104.808H58.3009C60.7915 104.808 62.0398 107.82 60.276 109.577L19.0548 150.805L35.5259 167.276L76.7533 126.049C78.5109 124.291 81.5232 125.533 81.5232 128.024V186.324H104.814V115.987C104.814 109.813 109.82 104.808 115.993 104.808H186.331V81.517H128.03C125.539 81.517 124.291 78.5047 126.055 76.7471H126.049Z"
                        }
                        fill={"currentColor"}
                        tag={"path"}
                      />
                    </DOM>
                  </Block>
                </Block>
                <Block className={"marquee-css__item"} tag={"div"}>
                  <Paragraph className={"eyebrow is--nav-marquee"}>
                    {"New: Osmo Button Pack"}
                  </Paragraph>
                  <Block tag={"div"}>
                    <DOM
                      className={"inline-svg-0"}
                      fill={"none"}
                      style={
                        "display:block;width:0.4375em;height:0.4375em;color:inherit;flex-shrink:0"
                      }
                      tag={"svg"}
                      viewBox={"0 0 187 187"}
                      xmlns={"http://www.w3.org/2000/svg"}
                    >
                      <DOM
                        d={
                          "M126.049 76.7471L167.276 35.5197L150.805 19.0486L109.577 60.276C107.82 62.0398 104.808 60.7915 104.808 58.3009V0H81.517V70.3375C81.517 76.511 76.511 81.517 70.3375 81.517H0V104.808H58.3009C60.7915 104.808 62.0398 107.82 60.276 109.577L19.0548 150.805L35.5259 167.276L76.7533 126.049C78.5109 124.291 81.5232 125.533 81.5232 128.024V186.324H104.814V115.987C104.814 109.813 109.82 104.808 115.993 104.808H186.331V81.517H128.03C125.539 81.517 124.291 78.5047 126.055 76.7471H126.049Z"
                        }
                        fill={"currentColor"}
                        tag={"path"}
                      />
                    </DOM>
                  </Block>
                </Block>
                <Block className={"marquee-css__item"} tag={"div"}>
                  <Paragraph className={"eyebrow is--nav-marquee"}>
                    {"New: Osmo Button Pack"}
                  </Paragraph>
                  <Block tag={"div"}>
                    <DOM
                      className={"inline-svg-0"}
                      fill={"none"}
                      style={
                        "display:block;width:0.4375em;height:0.4375em;color:inherit;flex-shrink:0"
                      }
                      tag={"svg"}
                      viewBox={"0 0 187 187"}
                      xmlns={"http://www.w3.org/2000/svg"}
                    >
                      <DOM
                        d={
                          "M126.049 76.7471L167.276 35.5197L150.805 19.0486L109.577 60.276C107.82 62.0398 104.808 60.7915 104.808 58.3009V0H81.517V70.3375C81.517 76.511 76.511 81.517 70.3375 81.517H0V104.808H58.3009C60.7915 104.808 62.0398 107.82 60.276 109.577L19.0548 150.805L35.5259 167.276L76.7533 126.049C78.5109 124.291 81.5232 125.533 81.5232 128.024V186.324H104.814V115.987C104.814 109.813 109.82 104.808 115.993 104.808H186.331V81.517H128.03C125.539 81.517 124.291 78.5047 126.055 76.7471H126.049Z"
                        }
                        fill={"currentColor"}
                        tag={"path"}
                      />
                    </DOM>
                  </Block>
                </Block>
              </Block>
            </Block>
          </Link>
        </Block>
      </Block>
    </Block>
  );
}
