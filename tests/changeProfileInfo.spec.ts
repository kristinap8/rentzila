import { test, expect } from '../fixtures/fixture';
import * as endpoints from '../data/endpoints.data.json';
import * as myProfileData from '../data/myProfileData/data.json';
import getImageNameFromSrc from '../helper/helper';

const photosDirName: string = 'data/myProfileData';

async function verifyProfilePhotosName(myProfile: any, leftSideMenu: any, navBar: any, image: string) {
    const imageName = image.split('.')[0];
    await myProfile.reload();
    expect(await myProfile.getProfilePhotoSrc()).toContain(imageName);
    expect(await leftSideMenu.getProfilePhotoSrc()).toContain(imageName);
    expect(await navBar.getAvatarPhotoSrc()).toContain(imageName);
}

async function fillAndVerifyFieldError(myProfile: any, fieldName: string, data: string, errorMsg: string) {
    await myProfile.fillInput(fieldName, data);
    await expect(await myProfile.getInput(fieldName)).toHaveValue(data);
    await myProfile.clickSaveChangesBtn();
    await expect(await myProfile.getInput(fieldName)).toBeInViewport();
    await expect(await myProfile.getInput(fieldName)).toHaveClass(RegExp(myProfileData.fieldsErrorClasses[fieldName]));
    await expect(await myProfile.getInputErrorMsg(fieldName)).toHaveText(myProfileData.fieldsErrorMsgs[fieldName][errorMsg]);
}
async function fillFieldAndCheckIfEmpty(myProfile: any, fieldName: string, data: string) {
    await myProfile.fillInput(fieldName, data);
    await expect(await myProfile.getInput(fieldName)).toHaveValue('');
}

async function fillInputAndCheckMaxLength(myProfile: any, fieldName: string, data: string, maxLength: number) {
    await myProfile.fillInput(fieldName, data);
    const inputValue = await myProfile.getInput(fieldName);
    await expect(inputValue).toHaveValue(data.slice(0, maxLength));
}

test.describe('My profile functionality check', async () => {
    test.beforeEach(async ({ page, baseURL, loginPopUp, telegramPopUp }) => {
        await page.goto(`${baseURL}${endpoints.myProfile}`);
        await loginPopUp.login(String(process.env.USER_EMAIL), String(process.env.USER_PASSWORD));
        await page.addLocatorHandler(await telegramPopUp.getTelegramPopUp(), async () => {
            await telegramPopUp.closeTelegramPopUp();
        });
    })

    test("Change profile photo with invalid image", async ({ myProfile, navBar, leftSideMenu }) => {

        async function verifyAndCloseInvalidPhotoPopUp(errorMsg: string, click: string = "confirmBtn") {
            await expect(await myProfile.getInvalidPhotoPopUp()).toBeVisible();
            await expect(await myProfile.getInvalidPhotoPopUpTitle()).toHaveText(myProfileData.invalidPhotoPopUpTitle);
            await expect(await myProfile.getInvalidPhotoPopUpErrorMsg()).toHaveText(errorMsg);

            switch (click) {
                case "confirmBtn":
                    await myProfile.clickConfirmInvalidPhotoPopUpBtn();
                    break;
                case "crossIcon":
                    await myProfile.clickCrossIconInvalidPhotoPopUp();
                    break;
                case "outside":
                    await myProfile.clickOutsideInvalidPhotoPopUp();
                    break;
                default:
                    throw new Error("Invalid click value");
            }
            await expect(await myProfile.getInvalidPhotoPopUp()).toHaveCount(0);
        }

        const originalProfilePhotoName: string = getImageNameFromSrc((await myProfile.getProfilePhotoSrc())!);

        await myProfile.uploadProfilePhoto(photosDirName, myProfileData.invalidProfilePhotos["invalidFormat"]);
        await verifyAndCloseInvalidPhotoPopUp(myProfileData.invalidPhotoPopUpErrorMsgs["invalidFormat"]);
        await verifyProfilePhotosName(myProfile, leftSideMenu, navBar, originalProfilePhotoName);

        for (const click of ["confirmBtn", "crossIcon", "outside"]) {
            await myProfile.uploadProfilePhoto(photosDirName, myProfileData.invalidProfilePhotos["largeSize"]);
            await verifyAndCloseInvalidPhotoPopUp(myProfileData.invalidPhotoPopUpErrorMsgs["largeSize"], click);
            await verifyProfilePhotosName(myProfile, leftSideMenu, navBar, originalProfilePhotoName);
        }
    })

    test("Change profile photo with valid image", async ({ myProfile, leftSideMenu, navBar }) => {
        await myProfile.uploadProfilePhoto(photosDirName, myProfileData.validProfilePhoto);
        await verifyProfilePhotosName(myProfile, leftSideMenu, navBar, myProfileData.validProfilePhoto);

        // Postcondition: Change profile image back to default
        await myProfile.uploadProfilePhoto(photosDirName, myProfileData.defaultProfilePhoto);
    })

    test("Change profile information with invalid private individual information", async ({ myProfile }) => {
        await myProfile.selectAndFillLegalTypeExcept('Приватна особа', "individualTaxpayerNumber");
        await myProfile.fillMyProfileInfoExcept();
        await expect(await myProfile.getInput("individualTaxpayerNumber")).toBeVisible();

        for (const individualTaxpayerNumber of myProfileData.invalidIndividualTaxpayerNumber.notAccepted) {
            await fillFieldAndCheckIfEmpty(myProfile, "individualTaxpayerNumber", individualTaxpayerNumber);
        }
        await fillInputAndCheckMaxLength(myProfile, "individualTaxpayerNumber", myProfileData.invalidIndividualTaxpayerNumber.exceeding, 10);
        await myProfile.clearInput("individualTaxpayerNumber");
        await fillAndVerifyFieldError(myProfile, "individualTaxpayerNumber", myProfileData.invalidIndividualTaxpayerNumber.less, 'less');
    })

    test("Change profile information with invalid private entrepreneur information", async ({ myProfile }) => {
        await myProfile.selectAndFillLegalTypeExcept('ФОП', "enterpreneurTaxpayerNumber");
        await myProfile.fillMyProfileInfoExcept();
        await expect(await myProfile.getInput("enterpreneurTaxpayerNumber")).toBeVisible();

        await myProfile.clearInput("enterpreneurTaxpayerNumber");
        for (const enterpreneurTaxpayerNumber of myProfileData.enterpreneurTaxpayerNumber.notAccepted) {
            await fillFieldAndCheckIfEmpty(myProfile, "enterpreneurTaxpayerNumber", enterpreneurTaxpayerNumber);
        }
        await fillInputAndCheckMaxLength(myProfile, "enterpreneurTaxpayerNumber", myProfileData.enterpreneurTaxpayerNumber.exceeding, 10);
        await myProfile.clearInput("enterpreneurTaxpayerNumber");
        await fillAndVerifyFieldError(myProfile, "enterpreneurTaxpayerNumber", myProfileData.enterpreneurTaxpayerNumber.less, 'less');
        await myProfile.clearInput("enterpreneurTaxpayerNumber");
        await fillAndVerifyFieldError(myProfile, "enterpreneurTaxpayerNumber", '', 'empty');
    })

    test("Change profile information with invalid legal entity information", async ({ myProfile }) => {
        await myProfile.selectAndFillLegalTypeExcept('Юридична особа', 'edrpou');
        await myProfile.fillMyProfileInfoExcept();
        await expect(await myProfile.getLegalEntityDropdown()).toBeVisible();
        await expect(await myProfile.getInput("edrpou")).toBeVisible();
        await expect(await myProfile.getInput("legalEntityName")).toBeVisible();

        await fillAndVerifyFieldError(myProfile, "edrpou", '', 'empty');
        for (const edrpou of myProfileData.edrpou.notAccepted) {
            await fillFieldAndCheckIfEmpty(myProfile, "edrpou", edrpou);
        }
        await fillInputAndCheckMaxLength(myProfile, "edrpou", myProfileData.edrpou.exceeding, 8);
        await fillAndVerifyFieldError(myProfile, "edrpou", myProfileData.edrpou.less, 'less');

        await myProfile.selectAndFillLegalTypeExcept('Юридична особа', 'legalEntityName');
        await fillAndVerifyFieldError(myProfile, "legalEntityName", '', 'empty');
        for (const legalEntityName of myProfileData.legalEntityName.notAccepted) {
            await fillFieldAndCheckIfEmpty(myProfile, "legalEntityName", legalEntityName);
        }
        await fillInputAndCheckMaxLength(myProfile, "legalEntityName", myProfileData.legalEntityName.exceeding, 25);
    })

    test("Change profile information with invalid surname", async ({ myProfile }) => {
        await myProfile.selectAndFillLegalTypeExcept('Приватна особа');
        await myProfile.fillMyProfileInfoExcept('surname');

        await fillAndVerifyFieldError(myProfile, 'surname', '', 'empty');
        for (const surname of myProfileData.surname.notAccepted) {
            await fillFieldAndCheckIfEmpty(myProfile, 'surname', surname);
        }
        for (const surname of myProfileData.surname.invalid) {
            await fillAndVerifyFieldError(myProfile, 'surname', surname, 'invalid');
        }
        await fillAndVerifyFieldError(myProfile, 'surname', myProfileData.surname.less, 'less');
        await fillInputAndCheckMaxLength(myProfile, 'surname', myProfileData.surname.exceeding, 25);
    })

    test("Change profile information with invalid name", async ({ myProfile }) => {
        await myProfile.selectAndFillLegalTypeExcept('Приватна особа');
        await myProfile.fillMyProfileInfoExcept('name');

        await fillAndVerifyFieldError(myProfile, 'name', '', 'empty');
        for (const name of myProfileData.name.notAccepted) {
            await fillFieldAndCheckIfEmpty(myProfile, 'name', name);
        }
        for (const name of myProfileData.name.invalid) {
            await fillAndVerifyFieldError(myProfile, 'name', name, 'invalid');
        }
        await fillAndVerifyFieldError(myProfile, 'name', myProfileData.name.less, 'less');
        await fillInputAndCheckMaxLength(myProfile, 'name', myProfileData.name.exceeding, 25);
    })

    test("Change profile information with invalid patronymic", async ({ myProfile }) => {
        await myProfile.selectAndFillLegalTypeExcept('Приватна особа');
        await myProfile.fillMyProfileInfoExcept('patronymic');

        for (const patronymic of myProfileData.patronymic.notAccepted) {
            await fillFieldAndCheckIfEmpty(myProfile, 'patronymic', patronymic);
        }
        for (const patronymic of myProfileData.patronymic.invalid) {
            await fillAndVerifyFieldError(myProfile, 'patronymic', patronymic, 'invalid');
        }
        await fillAndVerifyFieldError(myProfile, 'patronymic', myProfileData.patronymic.less, 'less');
        await fillInputAndCheckMaxLength(myProfile, 'patronymic', myProfileData.patronymic.exceeding, 25);
    })

    test("Change profile information with invalid city name", async ({ myProfile }) => {
        await myProfile.selectAndFillLegalTypeExcept('Приватна особа');
        await myProfile.fillMyProfileInfoExcept('city');

        for (const city of myProfileData.city.notAccepted) {
            await fillFieldAndCheckIfEmpty(myProfile, 'city', city);
        }
        for (const city of myProfileData.city.invalid) {
            await fillAndVerifyFieldError(myProfile, 'city', city, 'invalid');
        }
        await fillInputAndCheckMaxLength(myProfile, 'city', myProfileData.city.exceeding, 30);
    })

    test("Change profile information with invalid phone number", async ({ myProfile }) => {
        async function fillPhoneNumberAndVerifyError() {
            await myProfile.fillInput('phoneNumber', myProfileData.phoneNumber.less);
            await expect(await myProfile.getInput('phoneNumber')).toHaveClass(RegExp(myProfileData.fieldsErrorClasses['phoneNumber']));
            await expect(await myProfile.getInputErrorMsg('phoneNumber')).toHaveText(myProfileData.fieldsErrorMsgs['phoneNumber']['invalid']);
        }
        await myProfile.selectAndFillLegalTypeExcept('Приватна особа');
        await myProfile.fillMyProfileInfoExcept();

        await fillPhoneNumberAndVerifyError();
        
        
    })
})

