"use client";
import React from "react";
import Block from "./webflow_modules/Basic/components/Block";
import FormButton from "./webflow_modules/Form/components/FormButton";
import FormCheckboxInput from "./webflow_modules/Form/components/FormCheckboxInput";
import FormCheckboxWrapper from "./webflow_modules/Form/components/FormCheckboxWrapper";
import FormErrorMessage from "./webflow_modules/Form/components/FormErrorMessage";
import FormForm from "./webflow_modules/Form/components/FormForm";
import FormInlineLabel from "./webflow_modules/Form/components/FormInlineLabel";
import FormSuccessMessage from "./webflow_modules/Form/components/FormSuccessMessage";
import FormTextarea from "./webflow_modules/Form/components/FormTextarea";
import FormTextInput from "./webflow_modules/Form/components/FormTextInput";
import FormWrapper from "./webflow_modules/Form/components/FormWrapper";

export function RequestForm({
  checkbox = {},
  checkboxText = "Checkbox",
  checkboxVisibility = true,
  datePickerSlot = "",
  deviceSelectorSlot = "",
  deviceSelectorVisibility = true,
  moreDetailsInputField = {},
  postalCodeInputField = {},
  postalCodeVisibility = true,
  requestDetails = "Describe el problema",
  requestDetailsDescription = "Explica qué ocurrió. ¿Hubo algún incidente o el fallo ocurrió de repente?Describe qué hace (o dejó de hacer) el dispositivo.",
  requestField1 = "Title",
  requestField2 = "Title",
  requestField3 = "Title",
  requestFieldDescription1 = "Text",
  requestFieldDescription2 = "Text",
  requestFieldDescription3 = "Text",
  selectDevice = "Title",
  selectDeviceDescription = "Text",
  serviceModeSlot = "",
  serviceTypeSlot = "",
  submitRequestLoadingText = "Por favor espera...",
  submitRequestText = "Solicitar cita",
  urgencyLevelSlot = "",
  warningBoxVisibility = true,
  warningText = "Value",
}) {
  return (
    <FormWrapper className={"request-form"}>
      <FormForm
        className={"list"}
        data-name={"Email Form"}
        id={"email-form"}
        method={"get"}
        name={"email-form"}
      >
        <Block className={"form-field-wrapper"} tag={"div"}>
          <Block className={"text-small bold"} tag={"div"}>
            {requestField1}
          </Block>
          <Block className={"spacer_05_rem"} tag={"div"} />
          <Block tag={"div"}>{requestFieldDescription1}</Block>
          <Block className={"button-selector-wrapper"} tag={"div"}>
            {serviceModeSlot}
          </Block>
        </Block>
        {deviceSelectorVisibility ? (
          <Block className={"form-field-wrapper"} tag={"div"}>
            <Block className={"text-small bold"} tag={"div"}>
              {selectDevice}
            </Block>
            <Block className={"spacer_05_rem"} tag={"div"} />
            <Block tag={"div"}>{selectDeviceDescription}</Block>
            <Block className={"device-selector-slot"} tag={"div"}>
              {deviceSelectorSlot}
            </Block>
          </Block>
        ) : null}
        {postalCodeVisibility ? (
          <Block className={"form-field-wrapper postal"} tag={"div"}>
            <Block className={"wrapper-v-left"} tag={"div"}>
              <Block className={"text-small bold"} tag={"div"}>
                {"Ingresa tu codigo postal"}
              </Block>
              <Block className={"spacer_05_rem"} tag={"div"} />
              <FormTextInput
                autoFocus={false}
                className={
                  "text-field w-node-_2a3a8251-47f1-1a39-1cd3-d3f633c8935a-c3ad97ee"
                }
                data-name={"Postal code"}
                disabled={false}
                id={"Postal-code"}
                maxLength={256}
                name={"Postal-code"}
                placeholder={"Ej. 03103"}
                required={false}
                type={"text"}
                {...postalCodeInputField}
              />
            </Block>
          </Block>
        ) : null}
        <Block className={"form-field-wrapper"} tag={"div"}>
          <Block className={"text-small bold"} tag={"div"}>
            {requestField2}
          </Block>
          <Block className={"spacer_05_rem"} tag={"div"} />
          <Block tag={"div"}>{requestFieldDescription2}</Block>
          <Block className={"button-selector-wrapper"} tag={"div"}>
            {serviceTypeSlot}
          </Block>
        </Block>
        <Block className={"form-field-wrapper"} tag={"div"}>
          <Block className={"text-small bold"} tag={"div"}>
            {requestField3}
          </Block>
          <Block className={"spacer_05_rem"} tag={"div"} />
          <Block tag={"div"}>{requestFieldDescription3}</Block>
          <Block className={"button-selector-wrapper"} tag={"div"}>
            {urgencyLevelSlot}
          </Block>
        </Block>
        {warningBoxVisibility ? (
          <Block className={"warning-box"} tag={"div"}>
            <Block tag={"div"}>{warningText}</Block>
          </Block>
        ) : null}
        <Block className={"form-field-wrapper"} tag={"div"}>
          {datePickerSlot}
        </Block>
        <Block className={"form-field-wrapper _2"} tag={"div"}>
          <Block className={"text-small bold"} tag={"div"}>
            {requestDetails}
          </Block>
          <Block className={"wrapper-v-left"} tag={"div"}>
            <Block className={"spacer_05_rem"} tag={"div"} />
            <Block tag={"div"}>{requestDetailsDescription}</Block>
            <Block className={"spacer_05_rem"} tag={"div"} />
            <FormTextarea
              autoFocus={false}
              className={"text-field"}
              data-name={"More details"}
              id={"More-details"}
              maxLength={5000}
              name={"More-details"}
              placeholder={"Más de talles de tu solicitud"}
              required={false}
              {...moreDetailsInputField}
            />
          </Block>
        </Block>
        {checkboxVisibility ? (
          <FormCheckboxWrapper className={"form-field-wrapper"}>
            <FormCheckboxInput
              checked={false}
              className={"checkbox"}
              customClassName={"w-checkbox-input--inputType-custom"}
              data-name={"Checkbox"}
              form={{
                type: "checkbox-input",
                name: "Checkbox",
              }}
              id={"checkbox"}
              inputType={"custom"}
              name={"checkbox"}
              required={false}
              type={"checkbox"}
              {...checkbox}
            />
            <FormInlineLabel>{checkboxText}</FormInlineLabel>
          </FormCheckboxWrapper>
        ) : null}
        <FormButton
          className={"submit-button"}
          data-wait={submitRequestLoadingText}
          type={"submit"}
          value={submitRequestText}
        />
      </FormForm>
      <FormSuccessMessage>
        <Block tag={"div"}>
          {"Thank you! Your submission has been received!"}
        </Block>
      </FormSuccessMessage>
      <FormErrorMessage>
        <Block tag={"div"}>
          {"Oops! Something went wrong while submitting the form."}
        </Block>
      </FormErrorMessage>
    </FormWrapper>
  );
}
