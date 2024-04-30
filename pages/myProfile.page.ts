import Page from './page';
import * as profileData from '../data/myProfileData/data.json';
import path from 'path';

const profilePhoto: string = 'div[data-testid="OwnerProfileForm"] img[data-testid="photo"]';
const profilePhotoInput: string = 'input[class*="OwnerProfileForm_input"]';
const legalTypeDropdown: string = 'div[class*="OwnerProfileLegalType_typeWrapper"] div[data-testid="div_CustomSelect"]';
const legalTypeDropdownItems: string = 'li[data-testid="item-customSelect"] span';
const individualTaxpayerNumberInput: string = '//*[text()="РНОКПП (ІПН)"]/following-sibling::div/input';
const individualTaxpayerNumberInputErrorMsg: string = '//*[text()="РНОКПП (ІПН)"]/following-sibling::div/div[@data-testid="descriptionError"]';
const enterpreneurTaxpayerNumberInput: string = '//*[text()="РНОКПП (ІПН) для ФОП"]/following-sibling::div/input';
const enterpreneurTaxpayerNumberInputErrorMsg: string = '//*[text()="РНОКПП (ІПН) для ФОП"]/following-sibling::div/div[@data-testid="descriptionError"]';
const edrpouInput: string = '//*[text()="ЄДРПОУ для юридичних осіб"]/following-sibling::div/input';
const edrpouInputErrorMsg: string = '//*[text()="ЄДРПОУ для юридичних осіб"]/following-sibling::div/div[@data-testid="descriptionError"]';
const legalEntityNameInput: string = '//*[text()="Назва юридичної особи"]/following-sibling::div/input';
const legalEntityNameInputErrorMsg: string = '//*[text()="Назва юридичної особи"]/following-sibling::div/div[@data-testid="descriptionError"]';
const surnameInput: string = '//*[text()="Прізвище"]/following-sibling::div/input';
const surnameInputErrorMsg: string = '//*[text()="Прізвище"]/following-sibling::div/div[@data-testid="descriptionError"]';
const nameInput: string = '//*[text()="Ім\'я"]/following-sibling::div/input';
const nameInputErrorMsg: string = '//*[text()="Ім\'я"]/following-sibling::div/div[@data-testid="descriptionError"]';
const patronymicInput: string = '//*[text()="По-батькові"]/following-sibling::div/input';
const patronymicInputErrorMsg: string = '//*[text()="По-батькові"]/following-sibling::div/div[@data-testid="descriptionError"]';
const cityInput: string = '//*[text()="Місто"]/following-sibling::div/input';
const cityInputErrorMsg: string = '//*[text()="Місто"]/following-sibling::div/div[@data-testid="descriptionError"]';
const phoneNumberInput: string = 'input[data-testid="input_OwnerProfileNumber"]';
const phoneNumberInputErrorMsg: string = 'div[data-testid="phoneError_OwnerProfileNumber"]';
//const viber
const viberInput: string = 'input[id="mobile"][class*="OwnerProfileAdditionalInfo_input"]';
const telegramInput: string = '//*[text()="Telegram"]/following-sibling::div/input';
const saveChangesBtn: string = 'button[data-testid="nextButton"]';

const invalidPhotoPopUp: string = 'div[class*="PopupLayout_content"]';
const invalidPhotoPopUpTitle: string = 'div[class*="PopupLayout_label"]';
const invalidPhotoPopUpErrorMsg: string = 'div[data-testid="errorPopup"]';
const invalidPhotoPopUpConfirmBtn: string = 'div[class*="PopupLayout_content"] button';
const invalidPhotoPopUpCrossIcon: string = 'div[class*="PopupLayout_content"] div[data-testid="closeIcon"]';

export class MyProfile extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async getProfilePhotoSrc() {
        return await super.getElementAttribute(profilePhoto, 'src');
    }

    async getLegalEntityDropdown() {
        return await super.getElementByIndex(legalTypeDropdown, 1);
    }

    async reload() {
        await Promise.all([
            super.waitForSelector(profilePhoto),
            super.refresh()
        ])
    }

    async selectAndFillLegalTypeExcept(legalType: string, fieldName?: string) {
        await super.clickElementByIndex(legalTypeDropdown, 0);
        await super.clickElementByLocatorAndText(legalTypeDropdownItems, legalType);

        for (const key in profileData.legalTypeValidData[legalType]) {
            if (key === "legalEntityType") {
                await super.clickElementByIndex(legalTypeDropdown, 1);
                await super.clickElementByLocatorAndText(legalTypeDropdownItems, profileData.legalTypeValidData[legalType][key]);
            } else {
                if (key === fieldName) {
                    await this.clearInput(key);
                } else {
                    await this.fillInput(key, profileData.legalTypeValidData[legalType][key]);
                }
            }
        }
    }

    async fillMyProfileInfoExcept(fieldName?: string) {
        for (const key in profileData.myProfileValidData) {
            if (fieldName === key) {
                await this.clearInput(key);
            } else {
                await this.fillInput(key, profileData.myProfileValidData[key]);
            }
        }
    }

    async uploadProfilePhoto(dirName: string, filePath: string) {
        await super.uploadFiles(profilePhotoInput, [path.join(dirName, filePath)])
    }

    async getInput(inputName: string) {
        try {
            return await super.getElement(eval(inputName + 'Input'));
        } catch (error) {
            throw new Error("Invalid field name: " + error);
        }
    }

    async getInputErrorMsg(inputName: string) {
        try {
            return await super.getElement(eval(inputName + 'InputErrorMsg'));
        } catch (error) {
            throw new Error("Invalid field name: " + error);
        }
    }

    async fillInput(inputName: string, data: string) {
        try {
            await this.clearInput(inputName);
            await super.type(eval(inputName + 'Input'), data);
        } catch (error) {
            throw new Error("Invalid field name: " + error);
        }
    }

    async clearInput(inputName: string) {
        try {
            await super.clearElement(eval(inputName + 'Input'));
        } catch (error) {
            throw new Error("Invalid field name: " + error);
        }
    }

    async clickSaveChangesBtn() {
        await super.clickElement(saveChangesBtn);
    }

    async getInvalidPhotoPopUp() {
        return await super.getElement(invalidPhotoPopUp);
    }

    async getInvalidPhotoPopUpTitle() {
        return await super.getElement(invalidPhotoPopUpTitle);
    }

    async getInvalidPhotoPopUpErrorMsg() {
        return await super.getElement(invalidPhotoPopUpErrorMsg);
    }

    async clickConfirmInvalidPhotoPopUpBtn() {
        await super.clickElement(invalidPhotoPopUpConfirmBtn);
    }

    async clickCrossIconInvalidPhotoPopUp() {
        await super.clickElement(invalidPhotoPopUpCrossIcon);
    }

    async clickOutsideInvalidPhotoPopUp() {
        await super.clickElement('body');
    }
}