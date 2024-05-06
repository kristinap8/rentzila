import { test, expect, pages, helpers, testData } from '../fixtures/fixture';

const photosDirName: string = 'data/myProfileData';
const userLoginCredentials = {
    "email": String(process.env.USER_EMAIL),
    "phoneNumber": String(process.env.USER_PHONE_NUMBER),
    "password": String(process.env.USER_PASSWORD)
}
const unverifiedPhoneUserLoginCredentials = {
    "email": String(process.env.USER_UNVERIFIEDPHONE_EMAIL),
    "password": String(process.env.USER_UNVERIFIEDPHONE_PASSWORD)
}

async function verifyProfilePhotos(myProfile: pages['myProfile'], ownCabinetLeftSideMenu: pages["ownCabinetLeftSideMenu"], navBar: pages["navBar"], helper: helpers["helper"], image: string) {
    await myProfile.reload();
    const imagesSrc = [await myProfile.getProfilePhotoSrc(), await ownCabinetLeftSideMenu.getProfilePhotoSrc(), await navBar.getAvatarPhotoSrc()];
    for (let imageSrc of imagesSrc) {
        expect(helper.getImageNameFromSrc((imageSrc)!)).toEqual(image);
    }
}

async function fillAndCheckIfEmpty(myProfile: pages["myProfile"], fieldName: 'individualTaxpayerNumber' | 'enterpreneurTaxpayerNumber' | 'edrpou' | 'legalEntityName' | 'surname' | 'name' | 'patronymic' | 'city' | 'phoneNumber' | 'viber' | 'telegram', data: string) {
    await myProfile.clearMyProfileFormField(fieldName);
    await myProfile.fillMyProfileFormField(fieldName, data);
    await expect(myProfile.getMyProfileInput(fieldName)).toHaveValue('');
}

async function fillAndVerifyFieldError(myProfile: pages["myProfile"], myProfileData: testData["myProfileData"], fieldName: 'individualTaxpayerNumber' | 'enterpreneurTaxpayerNumber' | 'edrpou' | 'legalEntityName' | 'surname' | 'name' | 'patronymic' | 'city' | 'phoneNumber' | 'viber' | 'telegram', data: string, errorMsg: string, clickSaveChanngesBtn: boolean = true) {
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

async function fillAndCheckEnteredLength(myProfile: pages["myProfile"], fieldName: 'individualTaxpayerNumber' | 'enterpreneurTaxpayerNumber' | 'edrpou' | 'legalEntityName' | 'surname' | 'name' | 'patronymic' | 'city' | 'phoneNumber' | 'viber' | 'telegram', data: string, maxLength: number) {
    await myProfile.clearMyProfileFormField(fieldName);
    await myProfile.fillMyProfileFormField(fieldName, data);
    await expect(myProfile.getMyProfileInput(fieldName)).toHaveValue(data.slice(0, maxLength));
}

async function verifyFieldErrorState(myProfile: pages["myProfile"], myProfileData: testData["myProfileData"], fieldName: 'phoneNumber' | 'viber', errorMsgType: 'invalid' | 'notVerified') {
    await expect(myProfile.getMyProfileInput(fieldName)).toHaveClass(RegExp(myProfileData.fieldsErrorClasses[fieldName]));
    await expect(myProfile.getMyProfileFieldErrorMsg(fieldName)).toHaveText(myProfileData.fieldsMsgs[fieldName][errorMsgType]);
}

async function loginAndCloseTelegramPopUp(loginPopUp: pages['loginPopUp'], telegramPopUp: pages['telegramPopUp'], email: string, password: string) {
    await loginPopUp.login({ emailPhone: email, password });
    await telegramPopUp.closeTelegramPopUp();
}

test.describe('My profile functionality check', async () => {
    test.beforeEach(async ({ loginPopUp, endpointsData }) => {
        await loginPopUp.openUrl(endpointsData["myProfile"]);
    })

    test("TC001 - Change profile photo with invalid image", async ({ loginPopUp, telegramPopUp, myProfile, ownCabinetLeftSideMenu, navBar, myProfileData, helper }) => {
        async function verifyAndCloseInvalidPhotoPopUp(errorType: "invalidFormat" | "largeSize", click: "confirmBtn" | "crossIcon" | "outside") {
            await expect(myProfile.getInvalidPhotoPopUpElement('popUpContainer')).toBeVisible();
            await expect(myProfile.getInvalidPhotoPopUpElement('title')).toHaveText(myProfileData.invalidPhotoPopUpTitle);
            await expect(myProfile.getInvalidPhotoPopUpElement('errorMsg')).toHaveText(myProfileData.invalidPhotoPopUpErrorMsgs[errorType]);
            await myProfile.closeInvalidPhotoPopUp(click);
            await expect(myProfile.getInvalidPhotoPopUpElement('popUpContainer')).toHaveCount(0);
        }

        const clicks: ('confirmBtn' | 'crossIcon' | 'outside')[] = ['confirmBtn', 'crossIcon', 'outside'];
        await loginAndCloseTelegramPopUp(loginPopUp, telegramPopUp, userLoginCredentials.email, userLoginCredentials.password);

        const originalProfilePhotoName: string = helper.getImageNameFromSrc((await myProfile.getProfilePhotoSrc())!);
        await myProfile.uploadProfilePhoto(photosDirName, myProfileData.invalidProfilePhotos["invalidFormat"]);
        await verifyAndCloseInvalidPhotoPopUp('invalidFormat', 'confirmBtn');
        await verifyProfilePhotos(myProfile, ownCabinetLeftSideMenu, navBar, helper, originalProfilePhotoName);

        for (let click of clicks) {
            await myProfile.uploadProfilePhoto(photosDirName, myProfileData.invalidProfilePhotos["largeSize"]);
            await verifyAndCloseInvalidPhotoPopUp('largeSize', click);
            await verifyProfilePhotos(myProfile, ownCabinetLeftSideMenu, navBar, helper, originalProfilePhotoName);
        }
    });

    test("TC002 - Change profile photo with valid image", async ({ loginPopUp, telegramPopUp, myProfile, ownCabinetLeftSideMenu, navBar, helper, myProfileData }) => {
        await loginAndCloseTelegramPopUp(loginPopUp, telegramPopUp, userLoginCredentials.email, userLoginCredentials.password);
        await myProfile.uploadProfilePhoto(photosDirName, myProfileData.validProfilePhoto);
        await verifyProfilePhotos(myProfile, ownCabinetLeftSideMenu, navBar, helper, myProfileData.validProfilePhoto);
        //Postcondition: Change profile image back to default
        await myProfile.uploadProfilePhoto(photosDirName, myProfileData.defaultProfilePhoto);
    });

    test("TC003 - Change profile information with invalid private individual information", async ({ loginPopUp, telegramPopUp, myProfile, dataGenerator, myProfileData }) => {
        await loginAndCloseTelegramPopUp(loginPopUp, telegramPopUp, userLoginCredentials.email, userLoginCredentials.password);
        await myProfile.fillMyProfileFormWithRndData(dataGenerator);
        await myProfile.selectPersonType(myProfileData.personTypes['private individual']);
        await expect(myProfile.getMyProfileInput('individualTaxpayerNumber')).toBeVisible();

        for (let invalidTaxpayerNumber of myProfileData.invalidIndividualTaxpayerNumber.notAccepted) {
            await fillAndCheckIfEmpty(myProfile, 'individualTaxpayerNumber', invalidTaxpayerNumber);
        }

        await fillAndCheckEnteredLength(myProfile, 'individualTaxpayerNumber', myProfileData.invalidIndividualTaxpayerNumber.exceeding.data, myProfileData.invalidIndividualTaxpayerNumber.exceeding.allowedLength);
        await fillAndVerifyFieldError(myProfile, myProfileData, 'individualTaxpayerNumber', myProfileData.invalidIndividualTaxpayerNumber.less, 'less');
    });

    test("TC004 - Change profile information with invalid private entrepreneur information", async ({ loginPopUp, telegramPopUp, myProfile, dataGenerator, myProfileData }) => {
        await loginAndCloseTelegramPopUp(loginPopUp, telegramPopUp, userLoginCredentials.email, userLoginCredentials.password);
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

    test("TC005 - Change profile information with invalid legal entity information", async ({ loginPopUp, telegramPopUp, myProfile, dataGenerator, myProfileData, helper }) => {
        const legalEntityElements: ("legalTypeDropdown" | "edrpou" | "legalEntityName")[] = ["legalTypeDropdown", "edrpou", "legalEntityName"];
        const legalEntityInputs: ("edrpou" | "legalEntityName")[] = ["edrpou", "legalEntityName"];
        const personType = "legal entity";

        await loginAndCloseTelegramPopUp(loginPopUp, telegramPopUp, userLoginCredentials.email, userLoginCredentials.password);
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

    test("TC006 - Change profile information with invalid surname", async ({ loginPopUp, telegramPopUp, myProfile, myProfileData, dataGenerator }) => {
        const personType = 'private individual';
        const fieldToCheck = 'surname';

        await loginAndCloseTelegramPopUp(loginPopUp, telegramPopUp, userLoginCredentials.email, userLoginCredentials.password);
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

    test("TC007 - Change profile information with invalid name", async ({ loginPopUp, telegramPopUp, myProfile, myProfileData, dataGenerator }) => {
        const personType = 'private individual';
        const fieldToCheck = 'name';
        await loginAndCloseTelegramPopUp(loginPopUp, telegramPopUp, userLoginCredentials.email, userLoginCredentials.password);
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

    test("TC008 - Change profile information with invalid patronymic", async ({ loginPopUp, telegramPopUp, myProfile, myProfileData, dataGenerator }) => {
        const personType = 'private individual';
        const fieldToCheck = 'patronymic';
        await loginAndCloseTelegramPopUp(loginPopUp, telegramPopUp, userLoginCredentials.email, userLoginCredentials.password);
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

    test("TC009 - Change profile information with invalid city name", async ({ loginPopUp, telegramPopUp, myProfile, myProfileData, dataGenerator }) => {
        const personType = 'private individual';
        const fieldToCheck = 'city';
        await loginAndCloseTelegramPopUp(loginPopUp, telegramPopUp, userLoginCredentials.email, userLoginCredentials.password);
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

    test("TC010 - Change profile information with invalid phone number", async ({ loginPopUp, telegramPopUp, myProfile, myProfileData, dataGenerator }) => {
        async function verifyPhoneNumberBtnsState(isDisabled: boolean = true) {
            const telegramBtn = myProfile.getVerifyPhoneElements('telegramBtn');
            const smsBtn = myProfile.getVerifyPhoneElements('smsBtn');

            if (isDisabled) {
                await expect(telegramBtn).toBeDisabled();
                await expect(smsBtn).toBeDisabled();
            } else {
                await expect(telegramBtn).toBeEnabled();
                await expect(smsBtn).toBeEnabled();
            }
        }

        const personType = 'private individual';
        const fieldToCheck = 'phoneNumber';
        await loginAndCloseTelegramPopUp(loginPopUp, telegramPopUp, userLoginCredentials.email, userLoginCredentials.password);
        await myProfile.selectPersonType(myProfileData.personTypes[personType]);
        await myProfile.fillPersonTypeInfoWithRndData(dataGenerator, personType);
        await myProfile.fillMyProfileFormWithRndData(dataGenerator);

        await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, myProfileData.invalidPhoneNumber.less, 'less', false);
        await expect(myProfile.getVerifyPhoneElements('verifyPhoneLabel')).toBeVisible();
        await expect(myProfile.getVerifyPhoneElements('verifyPhoneLabel')).toHaveText(myProfileData.verifyPhoneLabel);
        await verifyPhoneNumberBtnsState();

        await fillAndCheckEnteredLength(myProfile, fieldToCheck, myProfileData.invalidPhoneNumber.exceeding.data, myProfileData.invalidPhoneNumber.exceeding.allowedLength);
        await verifyFieldErrorState(myProfile, myProfileData, fieldToCheck, 'notVerified');
        await verifyPhoneNumberBtnsState(false);

        for (let invalidPhoneNumber of myProfileData.invalidPhoneNumber.notAccepted) {
            await fillAndCheckIfEmpty(myProfile, fieldToCheck, invalidPhoneNumber);
            await verifyFieldErrorState(myProfile, myProfileData, fieldToCheck, 'invalid');
            await verifyPhoneNumberBtnsState();
        }
        await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, '', "notVerified");
        await verifyPhoneNumberBtnsState();

        for (let invalidPhoneNumber of myProfileData.invalidPhoneNumber.invalid) {
            await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, invalidPhoneNumber, "invalid", false);
            await verifyPhoneNumberBtnsState();
        }
        //Postcondition: Enter verified phone number back
        await myProfile.clearMyProfileFormField(fieldToCheck);
        await myProfile.fillMyProfileFormField(fieldToCheck, userLoginCredentials.phoneNumber);
    })

    test("TC011 - Change profile information with an invalid VIBER phone number", async ({ loginPopUp, telegramPopUp, myProfile, myProfileData, dataGenerator }) => {
        const personType = 'private individual';
        const fieldToCheck = 'viber';
        await loginAndCloseTelegramPopUp(loginPopUp, telegramPopUp, userLoginCredentials.email, userLoginCredentials.password);
        await myProfile.selectPersonType(myProfileData.personTypes[personType]);
        await myProfile.fillPersonTypeInfoWithRndData(dataGenerator, personType);
        await myProfile.fillMyProfileFormWithRndData(dataGenerator, fieldToCheck);

        await myProfile.focusOnViberField();
        await expect(myProfile.getMyProfileInput(fieldToCheck)).toHaveValue('+380');
        await verifyFieldErrorState(myProfile, myProfileData, fieldToCheck, 'invalid');

        await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, myProfileData.invalidViber.less, 'less');
        await fillAndCheckEnteredLength(myProfile, fieldToCheck, myProfileData.invalidViber.exceeding.data, myProfileData.invalidViber.exceeding.allowedLength);
        for (let invalidViber of myProfileData.invalidViber.notAccepted) {
            await fillAndCheckIfEmpty(myProfile, fieldToCheck, invalidViber);
        }
        for (let invalidViber of myProfileData.invalidViber.invalid) {
            await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, invalidViber, 'invalid');
        }
    })

    test("TC012 - Change profile information with an invalid telegram", async ({ loginPopUp, telegramPopUp, myProfile, myProfileData, dataGenerator }) => {
        const personType = 'private individual';
        const fieldToCheck = 'telegram';
        await loginAndCloseTelegramPopUp(loginPopUp, telegramPopUp, userLoginCredentials.email, userLoginCredentials.password);
        await myProfile.selectPersonType(myProfileData.personTypes[personType]);
        await myProfile.fillPersonTypeInfoWithRndData(dataGenerator, personType);
        await myProfile.fillMyProfileFormWithRndData(dataGenerator, fieldToCheck);

        for (let exceedingTelegram of myProfileData.invalidTelegram.exceeding) {
            await fillAndCheckEnteredLength(myProfile, fieldToCheck, exceedingTelegram.data, exceedingTelegram.allowedLength);
        }
        for (let invalidTelegramFormat of myProfileData.invalidTelegram.invalidFormat) {
            await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, invalidTelegramFormat, 'invalidFormat');
        }
        for (let notAcceptedTelegram of myProfileData.invalidTelegram.notAccepted) {
            await fillAndCheckIfEmpty(myProfile, fieldToCheck, notAcceptedTelegram);
        }
        for (let invalidTelegramPhoneNumber of myProfileData.invalidTelegram.invalidPhoneNumber) {
            await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, invalidTelegramPhoneNumber, 'invalidPhoneNumber');
        }
        await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, myProfileData.invalidTelegram.invalidUsername, 'invalidUsername');
        await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, myProfileData.invalidTelegram.usernameLess, 'lessUsername');
        await fillAndVerifyFieldError(myProfile, myProfileData, fieldToCheck, myProfileData.invalidTelegram.phoneNumberLess, 'lessPhoneNumber');
    })

    test('TC013 - Verify the "Email" field', async ({ loginPopUp, telegramPopUp, myProfile }) => {
        await loginAndCloseTelegramPopUp(loginPopUp, telegramPopUp, userLoginCredentials.email, userLoginCredentials.password);
        await myProfile.scrollToEmail();
        await expect(myProfile.getMyProfileInput('email')).toHaveValue(userLoginCredentials.email);
        await expect(myProfile.getMyProfileInput('email')).toBeDisabled();
    })

    test("TC014 - Verify phone number with a telegram", async ({ loginPopUp, telegramPopUp, myProfile, myProfileData, dataGenerator }) => {
        const fieldToCheck = 'phoneNumber';
        await loginAndCloseTelegramPopUp(loginPopUp, telegramPopUp, unverifiedPhoneUserLoginCredentials.email, unverifiedPhoneUserLoginCredentials.password);
        await myProfile.clearMyProfileFormField('phoneNumber');
        await myProfile.fillMyProfileFormField("phoneNumber", undefined, dataGenerator);
        await verifyFieldErrorState(myProfile, myProfileData, fieldToCheck, 'notVerified');

        await myProfile.clickTelegramBtn();
        await expect(myProfile.getTelegramBotPopUpElement('popUpContainer')).toBeVisible();
        await myProfile.closeTelegramPopUp();
        await expect(myProfile.getTelegramBotPopUpElement('popUpContainer')).toHaveCount(0);
        await myProfile.clickTelegramBtn();
        await expect(myProfile.getTelegramBotPopUpElement('goToTelegramBotBtn')).toHaveAttribute('href', myProfileData.telegramBotLink);
        await myProfile.closeTelegramPopUp();
    })

    test("TC016 - Change profile information with the valid data", async ({ loginPopUp, telegramPopUp, myProfile, notificationPopUp, myProfileData, notificationMsgs, dataGenerator, helper }) => {
        const personTypes: ('private individual' | 'individual entrepreneur' | 'legal entity')[] = ['private individual', 'individual entrepreneur', 'legal entity'];
        let newPersonTypeData: { fieldName: string; inputValue: string; }[];
        let newMyProfileData: { fieldName: string; inputValue: string; }[];

        await loginAndCloseTelegramPopUp(loginPopUp, telegramPopUp, userLoginCredentials.email, userLoginCredentials.password);
        for (let personType of personTypes) {
            await myProfile.selectPersonType(myProfileData.personTypes[personType]);
            newPersonTypeData = await myProfile.fillPersonTypeInfoWithRndData(dataGenerator, personType);
            if (personType === 'private individual') {
                newMyProfileData = await myProfile.fillMyProfileFormWithRndData(dataGenerator);
            }
            await myProfile.clickSaveChangesBtn();
            await expect(notificationPopUp.getNotificationPopUpMsg()).toHaveText(notificationMsgs.editMyProfile);
            await myProfile.reload();
            for (let data of newPersonTypeData) {
                expect(await myProfile.getMyProfileInputValue(data.fieldName)).toEqual(data.inputValue);
            }
            if (personType === 'private individual') {
                for (let data of newMyProfileData!) {
                    let inputValue = await myProfile.getMyProfileInputValue(data.fieldName);
                    if (data.fieldName === 'viber' || data.fieldName === 'telegram') {
                        inputValue = helper.removeSpaces(inputValue);
                    }
                    expect(inputValue).toEqual(data.inputValue);
                }
            }
        }
    })
    test.afterEach(async ({ myProfile, myProfileData, dataGenerator }) => {
        await myProfile.selectPersonType(myProfileData.personTypes['individual entrepreneur']);
        await myProfile.fillPersonTypeInfoWithRndData(dataGenerator, 'individual entrepreneur');
        await myProfile.fillMyProfileFormWithRndData(dataGenerator);
    })
})