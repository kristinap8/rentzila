import Page from './page';
import path from 'path';
import { helpers } from "../fixtures/fixture";

const personTypeDropdown = '//*[contains(text(), "Тип особи, до якої належите")]/../*[contains(@class,"CustomSelect_select")]';
const personTypeDropdownItems = '//*[contains(text(), "Тип особи, до якої належите")]/../*[contains(@class,"CustomSelect_select")]/ul/li';
const individualTaxpayerNumberInput = '//*[text()="РНОКПП (ІПН)"]/following-sibling::*/input';
const individualTaxpayerNumberInputErrorMsg = '//*[text()="РНОКПП (ІПН)"]/following-sibling::*/*[@data-testid="descriptionError"]';
const enterpreneurTaxpayerNumberInput = '//*[text()="РНОКПП (ІПН) для ФОП"]/following-sibling::*/input';
const enterpreneurTaxpayerNumberInputErrorMsg = '//*[text()="РНОКПП (ІПН) для ФОП"]/following-sibling::*/*[@data-testid="descriptionError"]';
const legalTypeDropdown = '//*[contains(text(), "Тип юридичної особи")]/../*[contains(@class,"CustomSelect_select")]';
const legalTypeDropdownItems = '//*[contains(text(), "Тип юридичної особи")]/../*[contains(@class,"CustomSelect_select")]/ul/li';
const edrpouInput = '//*[text()="ЄДРПОУ для юридичних осіб"]/following-sibling::*/input';
const edrpouInputErrorMsg = '//*[text()="ЄДРПОУ для юридичних осіб"]/following-sibling::*/*[@data-testid="descriptionError"]';
const legalEntityNameInput = '//*[text()="Назва юридичної особи"]/following-sibling::*/input';
const legalEntityNameInputErrorMsg = '//*[text()="Назва юридичної особи"]/following-sibling::*/*[@data-testid="descriptionError"]';

const profilePhotoInput = 'input[data-testid="leftsideFile"]';
const profilePhoto = '*[data-testid="OwnerProfileForm"] img[data-testid="photo"]';
const invalidPhotoPopUp = '*[class*="PopupLayout_content"]';
const invalidPhotoPopUpTitle = '*[class*="PopupLayout_label"]';
const invalidPhotoPopUpErrorMsg = '*[class*="NotValidImagePopup_content"]';
const invalidPhotoPopUpConfirmBtn = '*[class*="NotValidImagePopup_buttonContainer"] button';
const invalidPhotoPopUpCrossIcon = '*[class*="PopupLayout_content"] *[data-testid="closeIcon"]';

const surnameInput = '//*[text()="Прізвище"]/following-sibling::*/input';
const surnameInputErrorMsg = '//*[text()="Прізвище"]/following-sibling::*/*[@data-testid="descriptionError"]';

const nameInput = '//*[text()="Ім\'я"]/following-sibling::*/input';
const nameInputErrorMsg = '//*[text()="Ім\'я"]/following-sibling::*/*[@data-testid="descriptionError"]';

const patronymicInput = '//*[text()="По-батькові"]/following-sibling::*/input';
const patronymicInputErrorMsg = '//*[text()="По-батькові"]/following-sibling::*/*[@data-testid="descriptionError"]';

const cityInput = '//*[text()="Місто"]/following-sibling::*/input';
const cityInputErrorMsg = '//*[text()="Місто"]/following-sibling::*/*[@data-testid="descriptionError"]';

const phoneNumberInput = 'input[data-testid="input_OwnerProfileNumber"]';
const phoneNumberVerificationMsg = '*[data-testid="verification_OwnerProfileNumber"]';
const phoneNumberInputErrorMsg = '*[data-testid="phoneError_OwnerProfileNumber"]';
const verifyPhoneLabel = '*[class*="OwnerProfileNumber_verification_wrapper"] *[class*="OwnerProfileNumber_propose_title"]';
const telegramBtn = 'button[data-testid="telegramButton_OwnerProfileNumber"]';
const smsBtn = 'button[data-testid="smsButton_OwnerProfileNumber"]';
const telegramBotPopUpContainer = '*[class*="QrCodeTelegramPopup_content"]';
const telegramBotPopUpCrossIcon = '*[data-testid="closeIcon"]';
const telegramBotPopUpBtn = '*[class*="QrCodeTelegramPopup_content"] *[class*="QrCodeTelegramPopup_link"]';

const viberInput = 'input[id="mobile"][class*="OwnerProfileAdditionalInfo_input"]';
const viberInputErrorMsg = '*[class*="OwnerProfileAdditionalInfo_input_wrapper"] *[class*="OwnerProfileAdditionalInfo_errorDescr"]';

const telegramInput = '//*[text()="Telegram"]/following-sibling::*/input';
const telegramInputErrorMsg = '//*[text()="Telegram"]/following-sibling::*/*[@data-testid="descriptionError"]';

const emailInput = '*[data-testid="OwnerProfileEmail"] input';

const saveChangesBtn = 'button[data-testid="nextButton"]';


export class MyProfile extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async getProfilePhotoSrc() {
        return await super.getElementAttribute(profilePhoto, 'src');
    }

    async getMyProfileInputValue(inputName: string) {
        let input: string;
        switch (inputName) {
            case 'individualTaxpayerNumber':
                input = individualTaxpayerNumberInput;
                break;
            case 'enterpreneurTaxpayerNumber':
                input = enterpreneurTaxpayerNumberInput;
                break;
            case 'legalTypeDropdown':
                input = legalTypeDropdown;
                break;
            case 'edrpou':
                input = edrpouInput;
                break;
            case 'legalEntityName':
                input = legalEntityNameInput;
                break;
            case 'surname':
                input = surnameInput;
                break;
            case 'name':
                input = nameInput;
                break;
            case 'patronymic':
                input = patronymicInput;
                break;
            case 'city':
                input = cityInput;
                break;
            case 'phoneNumber':
                input = phoneNumberInput;
                break;
            case 'viber':
                input = viberInput;
                break;
            case 'telegram':
                input = telegramInput;
                break;
            case 'email':
                input = emailInput;
                break;
            default:
                throw new Error(`Invalid input name: ${inputName}`);
        }
        return await super.getElementValue(input);
    }

    getMyProfileInput(inputName: 'individualTaxpayerNumber' | 'enterpreneurTaxpayerNumber' | 'legalTypeDropdown' | 'edrpou' | 'legalEntityName' | 'surname' | 'name' | 'patronymic' | 'city' | 'phoneNumber' | 'viber' | 'telegram' | 'email') {
        let input: string;
        switch (inputName) {
            case 'individualTaxpayerNumber':
                input = individualTaxpayerNumberInput;
                break;
            case 'enterpreneurTaxpayerNumber':
                input = enterpreneurTaxpayerNumberInput;
                break;
            case 'legalTypeDropdown':
                input = legalTypeDropdown;
                break;
            case 'edrpou':
                input = edrpouInput;
                break;
            case 'legalEntityName':
                input = legalEntityNameInput;
                break;
            case 'surname':
                input = surnameInput;
                break;
            case 'name':
                input = nameInput;
                break;
            case 'patronymic':
                input = patronymicInput;
                break;
            case 'city':
                input = cityInput;
                break;
            case 'phoneNumber':
                input = phoneNumberInput;
                break;
            case 'viber':
                input = viberInput;
                break;
            case 'telegram':
                input = telegramInput;
                break;
            case 'email':
                input = emailInput;
                break;
            default:
                throw new Error(`Invalid input name: ${inputName}`);
        }
        return super.getElement(input);
    }

    getVerifyPhoneElements(element: 'verifyPhoneLabel' | 'telegramBtn' | 'smsBtn') {
        switch (element) {
            case 'verifyPhoneLabel':
                return super.getElement(verifyPhoneLabel);
            case 'telegramBtn':
                return super.getElement(telegramBtn);
            case 'smsBtn':
                return super.getElement(smsBtn);
            default:
                throw new Error(`Unsupported verify phone element: ${element}`);
        }
    }

    getMyProfileFieldErrorMsg(inputName: 'individualTaxpayerNumber' | 'enterpreneurTaxpayerNumber' | 'edrpou' | 'legalEntityName' | 'surname' | 'name' | 'patronymic' | 'city' | 'phoneNumber' | 'viber' | 'telegram') {
        let errorMsg: string;
        switch (inputName) {
            case 'individualTaxpayerNumber':
                errorMsg = individualTaxpayerNumberInputErrorMsg;
                break;
            case 'enterpreneurTaxpayerNumber':
                errorMsg = enterpreneurTaxpayerNumberInputErrorMsg;
                break;
            case 'edrpou':
                errorMsg = edrpouInputErrorMsg;
                break;
            case 'legalEntityName':
                errorMsg = legalEntityNameInputErrorMsg;
                break;
            case 'surname':
                errorMsg = surnameInputErrorMsg;
                break;
            case 'name':
                errorMsg = nameInputErrorMsg;
                break;
            case 'patronymic':
                errorMsg = patronymicInputErrorMsg;
                break;
            case 'city':
                errorMsg = cityInputErrorMsg;
                break;
            case 'phoneNumber':
                errorMsg = phoneNumberInputErrorMsg;
                break;
            case 'viber':
                errorMsg = viberInputErrorMsg;
                break;
            case 'telegram':
                errorMsg = telegramInputErrorMsg;
                break;
            default:
                throw new Error(`Invalid input name: ${inputName}`);
        }
        return super.getElement(errorMsg);
    }

    getInvalidPhotoPopUpElement(elementName: 'popUpContainer' | 'title' | 'errorMsg') {
        let element: string;
        switch (elementName) {
            case 'popUpContainer':
                element = invalidPhotoPopUp;
                break;
            case 'title':
                element = invalidPhotoPopUpTitle;
                break;
            case 'errorMsg':
                element = invalidPhotoPopUpErrorMsg;
                break;
            default:
                throw new Error(`Unsupported invalid photo pop up element name: ${elementName}`);
        }
        return super.getElement(element);
    }

    getPhoneVerificationMsg() {
        return super.getElement(phoneNumberVerificationMsg);
    }

    getTelegramBotPopUpElement(elementName: 'popUpContainer' | 'goToTelegramBotBtn') {
        switch (elementName) {
            case 'popUpContainer':
                return super.getElement(telegramBotPopUpContainer);
            case 'goToTelegramBotBtn':
                return super.getElement(telegramBotPopUpBtn);
            default:
                throw new Error(`Unsupported telegram bot pop up element name: ${elementName}`);
        }
    }

    async closeTelegramPopUp() {
        await super.clickElement(telegramBotPopUpCrossIcon);
    }

    async closeInvalidPhotoPopUp(click: 'confirmBtn' | 'crossIcon' | 'outside') {
        switch (click) {
            case 'confirmBtn':
                await super.clickElement(invalidPhotoPopUpConfirmBtn);
                break;
            case 'crossIcon':
                await super.clickElement(invalidPhotoPopUpCrossIcon);
                break;
            case 'outside':
                await super.clickElement('body');
                break;
            default:
                throw new Error(`Unsupported location to click: ${click}`);
        }
    }

    async clickSaveChangesBtn() {
        await super.clickElement(saveChangesBtn);
    }

    async clickTelegramBtn() {
        await super.clickElement(telegramBtn);
    }

    async uploadProfilePhoto(dirName: string, filePath: string) {
        await super.uploadFiles(profilePhotoInput, [path.join(dirName, filePath)])
    }

    async reload() {
        await Promise.all([
            super.waitForSelector(profilePhoto, 'attached'),
            super.refresh()
        ])
    }

    async fillMyProfileFormField(fieldName: 'individualTaxpayerNumber' | 'enterpreneurTaxpayerNumber' | 'edrpou' | 'legalEntityName' | 'surname' | 'name' | 'patronymic' | 'city' | 'phoneNumber' | 'viber' | 'telegram', value?: string, dataGenerator?: helpers["dataGenerator"]) {
        let inputName: string;
        let inputValue: string;
        switch (fieldName) {
            case 'individualTaxpayerNumber':
                inputName = individualTaxpayerNumberInput;
                inputValue = value ?? dataGenerator!.generateTaxpayerNumber();
                break;
            case 'enterpreneurTaxpayerNumber':
                inputName = enterpreneurTaxpayerNumberInput;
                inputValue = value ?? dataGenerator!.generateTaxpayerNumber();
                break;
            case 'edrpou':
                inputName = edrpouInput;
                inputValue = value ?? dataGenerator!.generateEdrpou();
                break;
            case 'legalEntityName':
                inputName = legalEntityNameInput;
                inputValue = value ?? dataGenerator!.generateLegalEntityName();
                break;
            case 'surname':
                inputName = surnameInput;
                inputValue = value ?? dataGenerator!.generateLastName();
                break;
            case 'name':
                inputName = nameInput;
                inputValue = value ?? dataGenerator!.generateFirstName();
                break;
            case 'patronymic':
                inputName = patronymicInput;
                inputValue = value ?? dataGenerator!.generateMiddleName();
                break;
            case 'city':
                inputName = cityInput;
                inputValue = value ?? dataGenerator!.generateCity();
                break;
            case 'phoneNumber':
                inputName = phoneNumberInput;
                inputValue = value ?? dataGenerator!.generatePhoneNumber();
                break;
            case 'viber':
                inputName = viberInput;
                inputValue = value ?? dataGenerator!.generatePhoneNumber();
                break;
            case 'telegram':
                inputName = telegramInput;
                inputValue = value ?? dataGenerator!.generateTelegramUsername();
                break;
            default:
                throw new Error(`Unsupported field name: ${fieldName}`);
        }
        await super.type(inputName, inputValue);
        return { fieldName, inputValue };
    }

    /**
     * Fills the My Profile fields except for the specified field and person type fields with the random data.
     * Clears the specified field to skip.
     * 
     * @param {string} [fieldToSkip] - The name of the field to skip (optional).
     */
    async fillMyProfileFormWithRndData(dataGenerator: helpers["dataGenerator"], fieldToSkip?: 'surname' | 'name' | 'patronymic' | 'city' | 'viber' | 'telegram') {
        const profileFields: ('surname' | 'name' | 'patronymic' | 'city' | 'viber' | 'telegram')[] = ['surname', 'name', 'patronymic', 'city', 'viber', 'telegram'];
        let newProfileData: { fieldName: string; inputValue: string; }[] = [];
        for (let profileField of profileFields) {
            if (profileField !== fieldToSkip) {
                await this.clearMyProfileFormField(profileField);
                newProfileData.push(await this.fillMyProfileFormField(profileField, undefined, dataGenerator));
            }
            else {
                await this.clearMyProfileFormField(fieldToSkip);
            }
        }
        return newProfileData;
    }

    async fillPersonTypeInfoWithRndData(dataGenerator: helpers["dataGenerator"], personType: "private individual" | "individual entrepreneur" | "legal entity", fieldToSkip?: 'individualTaxpayerNumber' | 'enterpreneurTaxpayerNumber' | 'edrpou' | 'legalEntityName') {
        let newProfileData: { fieldName: string; inputValue: string; }[] = [];
        switch (personType) {
            case "private individual":
                const individualTaxNumb = "individualTaxpayerNumber";
                await this.clearMyProfileFormField(individualTaxNumb);
                if (fieldToSkip !== individualTaxNumb) {
                    newProfileData.push(await this.fillMyProfileFormField(individualTaxNumb, undefined, dataGenerator));
                }
                break;
            case "individual entrepreneur":
                const enterpreneurTaxNumb = "enterpreneurTaxpayerNumber";
                await this.clearMyProfileFormField(enterpreneurTaxNumb);
                if (fieldToSkip !== enterpreneurTaxNumb) {
                    newProfileData.push(await this.fillMyProfileFormField(enterpreneurTaxNumb, undefined, dataGenerator));
                }
                break;
            case "legal entity":
                const edrpou = 'edrpou';
                const legalEntity = 'legalEntityName';
                await this.selectLegalType(dataGenerator.generateLegalType());
                await this.clearMyProfileFormField(edrpou);
                if (fieldToSkip !== edrpou) {
                    newProfileData.push(await this.fillMyProfileFormField(edrpou, undefined, dataGenerator));
                }
                await this.clearMyProfileFormField(legalEntity);
                if (fieldToSkip !== legalEntity) {
                    newProfileData.push(await this.fillMyProfileFormField(legalEntity, undefined, dataGenerator));
                }
                break;
            default:
                throw new Error(`Unsupported legal type: ${personType}`);
        }
        return newProfileData;
    }

    async clearMyProfileFormField(fieldName: 'individualTaxpayerNumber' | 'enterpreneurTaxpayerNumber' | 'edrpou' | 'legalEntityName' | 'surname' | 'name' | 'patronymic' | 'city' | 'phoneNumber' | 'viber' | 'telegram') {
        switch (fieldName) {
            case 'individualTaxpayerNumber':
                await super.clearElement(individualTaxpayerNumberInput);
                break;
            case 'enterpreneurTaxpayerNumber':
                await super.clearElement(enterpreneurTaxpayerNumberInput);
                break;
            case 'edrpou':
                await super.clearElement(edrpouInput);
                break;
            case 'legalEntityName':
                await super.clearElement(legalEntityNameInput);
                break;
            case 'surname':
                await super.clearElement(surnameInput);
                break;
            case 'name':
                await super.clearElement(nameInput);
                break;
            case 'patronymic':
                await super.clearElement(patronymicInput);
                break;
            case 'city':
                await super.clearElement(cityInput);
                break;
            case 'phoneNumber':
                await super.clearElementByCharacter(phoneNumberInput);
                break;
            case 'viber':
                await super.clearElement(viberInput);
                break;
            case 'telegram':
                await super.clearElement(telegramInput);
                break;
            default:
                throw new Error(`Unsupported field name: ${fieldName}`);
        }
    }

    async focusOnViberField() {
        await super.unfocus(viberInput);
        await super.focus(viberInput);
    }

    async selectPersonType(personType: string) {
        await super.clickElement(personTypeDropdown);
        await super.clickElementByLocatorAndText(personTypeDropdownItems, personType);
    }

    async selectLegalType(legalType: string) {
        await super.clickElement(legalTypeDropdown);
        await super.clickElementByLocatorAndText(legalTypeDropdownItems, legalType);
    }

    async scrollToEmail() {
        await super.scrollToElement(emailInput);
    }
}