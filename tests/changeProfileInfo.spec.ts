import { test, expect, pages, helpers, testData } from '../fixtures/fixture';

const photosDirName: string = 'data/myProfileData';
const userLoginCredentials = {
    "email": String(process.env.USER_EMAIL),
    "phoneNumber": String(process.env.USER_PHONE_NUMBER),
    "password": String(process.env.USER_PASSWORD)
}

async function verifyProfilePhotos(myProfile: pages['myProfile'], ownCabinetLeftSideMenu: pages["ownCabinetLeftSideMenu"], navBar: pages["navBar"], helper: helpers["helper"], image: string) {
    await myProfile.reload();
    const imagesSrc = [await myProfile.getProfilePhotoSrc(), await ownCabinetLeftSideMenu.getProfilePhotoSrc(), await navBar.getAvatarPhotoSrc()];
    for (let imageSrc of imagesSrc) {
        expect(helper.getImageNameFromSrc((imageSrc)!)).toEqual(image);
    }
}

async function fillAndCheckIfEmpty(myProfile: pages["myProfile"], fieldName: 'individualTaxpayerNumber' | 'enterpreneurTaxpayerNumber' | 'edrpou' | 'legalEntityName' | 'surname' | 'name' | 'patronymic' | 'city', data: string) {
    await myProfile.clearMyProfileFormField(fieldName);
    await myProfile.fillMyProfileFormField(fieldName, data);
    await expect(myProfile.getMyProfileInput(fieldName)).toHaveValue('');
}


async function fillAndVerifyFieldError(myProfile: pages["myProfile"], myProfileData: testData["myProfileData"], fieldName: 'individualTaxpayerNumber' | 'enterpreneurTaxpayerNumber' | 'edrpou' | 'legalEntityName' | 'surname' | 'name' | 'patronymic' | 'city' | 'phoneNumber', data: string, errorMsg: string, clickSaveChanngesBtn: boolean = true) {
    await myProfile.clearMyProfileFormField(fieldName);
    await myProfile.fillMyProfileFormField(fieldName, data);
    await expect(myProfile.getMyProfileInput(fieldName)).toHaveValue(data);
    if (clickSaveChanngesBtn) {
        await myProfile.clickSaveChangesBtn();
        await expect(myProfile.getMyProfileInput(fieldName)).toBeInViewport();
    }
    await expect(myProfile.getMyProfileInput(fieldName)).toHaveClass(RegExp(myProfileData.fieldsErrorClasses[fieldName]));
    await expect(myProfile.getMyProfileFieldErrorMsg(fieldName)).toHaveText(myProfileData.fieldsMsgs[fieldName][errorMsg]);
}

async function fillAndCheckEnteredLength(myProfile: pages["myProfile"], fieldName: 'individualTaxpayerNumber' | 'enterpreneurTaxpayerNumber' | 'edrpou' | 'legalEntityName' | 'surname' | 'name' | 'patronymic' | 'city' | 'phoneNumber', data: string, maxLength: number) {
    await myProfile.clearMyProfileFormField(fieldName);
    await myProfile.fillMyProfileFormField(fieldName, data);
    await expect(myProfile.getMyProfileInput(fieldName)).toHaveValue(data.slice(0, maxLength));
}

test.describe('My profile functionality check', async () => {
    test.beforeEach(async ({ loginPopUp, telegramPopUp, endpointsData }) => {
        await loginPopUp.openUrl(endpointsData["myProfile"]);
        await loginPopUp.login({ emailPhone: userLoginCredentials.email, password: userLoginCredentials.password });
        await telegramPopUp.closeTelegramPopUp();
    })

    test("TC001 - Change profile photo with invalid image", async ({ myProfile, ownCabinetLeftSideMenu, navBar, myProfileData, helper }) => {
        async function verifyAndCloseInvalidPhotoPopUp(errorType: "invalidFormat" | "largeSize", click: "confirmBtn" | "crossIcon" | "outside") {
            await expect(myProfile.getInvalidPhotoPopUpElement('popUpContainer')).toBeVisible();
            await expect(myProfile.getInvalidPhotoPopUpElement('title')).toHaveText(myProfileData.invalidPhotoPopUpTitle);
            await expect(myProfile.getInvalidPhotoPopUpElement('errorMsg')).toHaveText(myProfileData.invalidPhotoPopUpErrorMsgs[errorType]);
            await myProfile.closeInvalidPhotoPopUp(click);
            await expect(myProfile.getInvalidPhotoPopUpElement('popUpContainer')).toHaveCount(0);
        }

        const originalProfilePhotoName: string = helper.getImageNameFromSrc((await myProfile.getProfilePhotoSrc())!);
        const clicks: ('confirmBtn' | 'crossIcon' | 'outside')[] = ['confirmBtn', 'crossIcon', 'outside'];

        await myProfile.uploadProfilePhoto(photosDirName, myProfileData.invalidProfilePhotos["invalidFormat"]);
        await verifyAndCloseInvalidPhotoPopUp('invalidFormat', 'confirmBtn');
        await verifyProfilePhotos(myProfile, ownCabinetLeftSideMenu, navBar, helper, originalProfilePhotoName);

        for (let click of clicks) {
            await myProfile.uploadProfilePhoto(photosDirName, myProfileData.invalidProfilePhotos["largeSize"]);
            await verifyAndCloseInvalidPhotoPopUp('largeSize', click);
            await verifyProfilePhotos(myProfile, ownCabinetLeftSideMenu, navBar, helper, originalProfilePhotoName);
        }
    });

    test("TC002 - Change profile photo with valid image", async ({ myProfile, ownCabinetLeftSideMenu, navBar, helper, myProfileData }) => {
        await myProfile.uploadProfilePhoto(photosDirName, myProfileData.validProfilePhoto);
        await verifyProfilePhotos(myProfile, ownCabinetLeftSideMenu, navBar, helper, myProfileData.validProfilePhoto);
        //Postcondition: Change profile image back to default
        await myProfile.uploadProfilePhoto(photosDirName, myProfileData.defaultProfilePhoto);
    });

    test("TC003 - Change profile information with invalid private individual information", async ({ myProfile, dataGenerator, myProfileData }) => {
        await myProfile.fillMyProfileFormWithRndData(dataGenerator);
        await myProfile.selectPersonType(myProfileData.personTypes['private individual']);
        await expect(myProfile.getMyProfileInput('individualTaxpayerNumber')).toBeVisible();

        for (let invalidTaxpayerNumber of myProfileData.invalidIndividualTaxpayerNumber.notAccepted) {
            await fillAndCheckIfEmpty(myProfile, 'individualTaxpayerNumber', invalidTaxpayerNumber);
        }

        await fillAndCheckEnteredLength(myProfile, 'individualTaxpayerNumber', myProfileData.invalidIndividualTaxpayerNumber.exceeding.data, myProfileData.invalidIndividualTaxpayerNumber.exceeding.allowedLength);
        await fillAndVerifyFieldError(myProfile, myProfileData, 'individualTaxpayerNumber', myProfileData.invalidIndividualTaxpayerNumber.less, 'less');
    });

    test("TC004 - Change profile information with invalid private entrepreneur information", async ({ myProfile, dataGenerator, myProfileData }) => {
        await myProfile.fillMyProfileFormWithRndData(dataGenerator);
        await myProfile.selectPersonType(myProfileData.personTypes['individual entrepreneur']);
        await expect(myProfile.getMyProfileInput('enterpreneurTaxpayerNumber')).toBeVisible();

        for (let invalidTaxpayerNumber of myProfileData.invalidEnterpreneurTaxpayerNumber.notAccepted) {
            await fillAndCheckIfEmpty(myProfile, 'enterpreneurTaxpayerNumber', invalidTaxpayerNumber);
        }

        await fillAndCheckEnteredLength(myProfile, 'enterpreneurTaxpayerNumber', myProfileData.invalidEnterpreneurTaxpayerNumber.exceeding.data, myProfileData.invalidEnterpreneurTaxpayerNumber.exceeding.allowedLength);
        await fillAndVerifyFieldError(myProfile, myProfileData, 'enterpreneurTaxpayerNumber', myProfileData.invalidEnterpreneurTaxpayerNumber.less, 'less');
        await fillAndVerifyFieldError(myProfile, myProfileData, "enterpreneurTaxpayerNumber", '', 'empty');
    });

    test("TC005 - Change profile information with invalid legal entity information", async ({ myProfile, dataGenerator, myProfileData, helper }) => {
        const legalEntityElements: ("legalTypeDropdown" | "edrpou" | "legalEntityName")[] = ["legalTypeDropdown", "edrpou", "legalEntityName"];
        const legalEntityInputs: ("edrpou" | "legalEntityName")[] = ["edrpou", "legalEntityName"];
        const personType = "legal entity";

        await myProfile.fillMyProfileFormWithRndData(dataGenerator);
        await myProfile.selectPersonType(myProfileData.personTypes[personType]);
        for (let legalEntityField of legalEntityElements) {
            await expect(myProfile.getMyProfileInput(legalEntityField)).toBeVisible();
        }

        for (let inputName of legalEntityInputs) {
            let data = `invalid${helper.capitalizeAndTrim(inputName)}`;
            await myProfile.fillPersonTypeInfoWithRndData(dataGenerator, personType, inputName);
            await fillAndVerifyFieldError(myProfile, myProfileData, inputName, '', 'empty');
            for (let invalidData of myProfileData[data].notAccepted) {
                await fillAndCheckIfEmpty(myProfile, inputName, invalidData);
            }
            await fillAndCheckEnteredLength(myProfile, inputName, myProfileData[data].exceeding.data, myProfileData[data].exceeding.allowedLength);
            (inputName === 'edrpou') && await fillAndVerifyFieldError(myProfile, myProfileData, inputName, myProfileData[data].less, 'less');
        }
    })

    test("TC006 - Change profile information with invalid surname", async ({ myProfile, myProfileData, dataGenerator }) => {
        const personType = 'private individual';
        const fieldToCheck = 'surname';

        await myProfile.selectPersonType(myProfileData.personTypes[personType]);
        await myProfile.fillPersonTypeInfoWithRndData(dataGenerator, personType);
        await myProfile.fillMyProfileFormWithRndData(dataGenerator, fieldToCheck);

        await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, '', 'empty');
        for (let invalidSurname of myProfileData.invalidSurname.notAccepted) {
            await fillAndCheckIfEmpty(myProfile, fieldToCheck, invalidSurname);
        }
        for (let invalidSurname of myProfileData.invalidSurname.invalid) {
            await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, invalidSurname, 'invalid');
        }
        await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, myProfileData.invalidSurname.less, 'less');
        await fillAndCheckEnteredLength(myProfile, fieldToCheck, myProfileData.invalidSurname.exceeding.data, myProfileData.invalidSurname.exceeding.allowedLength);
    })

    test("TC007 - Change profile information with invalid name", async ({ myProfile, myProfileData, dataGenerator }) => {
        const personType = 'private individual';
        const fieldToCheck = 'name';
        await myProfile.selectPersonType(myProfileData.personTypes[personType]);
        await myProfile.fillPersonTypeInfoWithRndData(dataGenerator, personType);
        await myProfile.fillMyProfileFormWithRndData(dataGenerator, fieldToCheck);

        await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, '', 'empty');
        for (let invalidName of myProfileData.invalidName.notAccepted) {
            await fillAndCheckIfEmpty(myProfile, fieldToCheck, invalidName);
        }
        for (let invalidName of myProfileData.invalidName.invalid) {
            await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, invalidName, 'invalid');
        }
        await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, myProfileData.invalidName.less, 'less');
        await fillAndCheckEnteredLength(myProfile, fieldToCheck, myProfileData.invalidName.exceeding.data, myProfileData.invalidName.exceeding.allowedLength);
    })

    test("TC008 - Change profile information with invalid patronymic", async ({ myProfile, myProfileData, dataGenerator }) => {
        const personType = 'private individual';
        const fieldToCheck = 'patronymic';
        await myProfile.selectPersonType(myProfileData.personTypes[personType]);
        await myProfile.fillPersonTypeInfoWithRndData(dataGenerator, personType);
        await myProfile.fillMyProfileFormWithRndData(dataGenerator, fieldToCheck);

        for (let invalidPatronymic of myProfileData.invalidPatronymic.notAccepted) {
            await fillAndCheckIfEmpty(myProfile, fieldToCheck, invalidPatronymic);
        }
        for (let invalidPatronymic of myProfileData.invalidPatronymic.invalid) {
            await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, invalidPatronymic, 'invalid');
        }
        await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, myProfileData.invalidPatronymic.less, 'less');
        await fillAndCheckEnteredLength(myProfile, fieldToCheck, myProfileData.invalidPatronymic.exceeding.data, myProfileData.invalidPatronymic.exceeding.allowedLength);
    })

    test("TC009 - Change profile information with invalid city name", async ({ myProfile, myProfileData, dataGenerator }) => {
        const personType = 'private individual';
        const fieldToCheck = 'city';
        await myProfile.selectPersonType(myProfileData.personTypes[personType]);
        await myProfile.fillPersonTypeInfoWithRndData(dataGenerator, personType);
        await myProfile.fillMyProfileFormWithRndData(dataGenerator, fieldToCheck);

        for (let invalidCity of myProfileData.invalidCity.notAccepted) {
            await fillAndCheckIfEmpty(myProfile, fieldToCheck, invalidCity);
        }
        for (let invalidCity of myProfileData.invalidCity.invalid) {
            await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, invalidCity, 'invalid');
        }
        await fillAndCheckEnteredLength(myProfile, fieldToCheck, myProfileData.invalidCity.exceeding.data, myProfileData.invalidCity.exceeding.allowedLength);
    })

    test("TC010 - Change profile information with invalid phone number", async ({ myProfile, myProfileData, dataGenerator }) => {
        const personType = 'private individual';
        const fieldToCheck = 'phoneNumber';
        await myProfile.selectPersonType(myProfileData.personTypes[personType]);
        await myProfile.fillPersonTypeInfoWithRndData(dataGenerator, personType);
        await myProfile.fillMyProfileFormWithRndData(dataGenerator);

        await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, myProfileData.invalidPhoneNumber.less, 'less', false);
        await expect(myProfile.getVerifyPhoneElements('verifyPhoneLabel')).toBeVisible();
        await expect(myProfile.getVerifyPhoneElements('verifyPhoneLabel')).toHaveText(myProfileData.verifyPhoneLabel);
        await expect(myProfile.getVerifyPhoneElements('telegramBtn')).toBeDisabled();
        await expect(myProfile.getVerifyPhoneElements('smsBtn')).toBeDisabled();

        await fillAndCheckEnteredLength(myProfile, fieldToCheck, myProfileData.invalidPhoneNumber.exceeding.data, myProfileData.invalidPhoneNumber.exceeding.allowedLength);
        await expect(myProfile.getMyProfileInput(fieldToCheck)).toHaveClass(RegExp(myProfileData.fieldsErrorClasses[fieldToCheck]));
        await expect(myProfile.getMyProfileFieldErrorMsg(fieldToCheck)).toHaveText(myProfileData.fieldsMsgs[fieldToCheck]["notVerified"]);
        await expect(myProfile.getVerifyPhoneElements('telegramBtn')).toBeEnabled();
        await expect(myProfile.getVerifyPhoneElements('smsBtn')).toBeEnabled();
    })
})

