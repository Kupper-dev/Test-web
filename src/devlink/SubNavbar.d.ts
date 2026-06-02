import * as React from "react";
import * as Types from "./webflow_modules/types";

declare function SubNavbar(props: {
  layoutShowMarquee?: Types.Boolean.Boolean;
  layoutShowTags?: Types.Boolean.Boolean;
  marqueeContentMarqueeText?: React.ReactNode;
  tagsContentCategoryTag?: React.ReactNode;
  tagsContentNameTag?: React.ReactNode;
  tagsContentStatusTag?: React.ReactNode;
}): React.JSX.Element;
