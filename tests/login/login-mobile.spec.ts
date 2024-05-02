import { test, expect, pages, testData, helpers } from "../../fixtures/fixture";

const userLoginCredentials = {
    "email": String(process.env.USER_EMAIL),
    "phoneNumber": String(process.env.USER_PHONE_NUMBER),
    "password": String(process.env.USER_PASSWORD)
}
const actions: ('click' | 'pressEnter')[] = ['click', 'pressEnter'];

async function verifyLoginFormFieldError(loginPopUp: pages["loginPopUp"], loginFormData: testData["loginFormData"], field: 'emailPhone' | 'password', errorMsg: string) {
    await expect(loginPopUp.getLoginFormInput(field)).toHaveClass(RegExp(loginFormData["fieldsErrorClasses"][field]));
    await expect(loginPopUp.getLoginFormErrorMsg(field)).toHaveText(errorMsg);
}

async function verifyLoginFormFieldWithoutError(loginPopUp: pages["loginPopUp"], loginFormData: testData["loginFormData"], field: 'emailPhone' | 'password') {
    await expect(loginPopUp.getLoginFormInput(field)).not.toHaveClass(RegExp(loginFormData["fieldsErrorClasses"][field]));
}

async function verifyLoggedIn(navBar: pages["navBar"], ownCabinetLeftSideMenu: pages["ownCabinetLeftSideMenu"], myProfile: pages["myProfile"], helper: helpers["helper"], loggedInEmail: string = '', loggedInPhoneNumber: string = '') {
    await navBar.clickMobileNavBarIcon('Профіль');
    await ownCabinetLeftSideMenu.clickMenuBtn('myProfile');
    (loggedInEmail) && expect(await myProfile.getMyProfileInputValue('email')).toEqual(loggedInEmail);
    (loggedInPhoneNumber) && expect(helper.removeSpaces(await myProfile.getMyProfileInputValue('phoneNumber'))).toEqual(loggedInPhoneNumber);
}

async function openLoginPopUp(navBar: pages['navBar'], loginPopUp: pages['loginPopUp']) {
    await navBar.clickMobileNavBarIcon('Профіль');
    await expect(loginPopUp.getLoginContainer()).toBeVisible();
}

async function logout(navBar: pages["navBar"], ownCabinetLeftSideMenu: pages["ownCabinetLeftSideMenu"]) {
    await navBar.clickMobileNavBarIcon('Профіль');
    await ownCabinetLeftSideMenu.clickMenuBtn('logout');
}

test.describe('Login functionality check', () => {
    test.beforeEach(async ({ navBar, loginPopUp, telegramPopUp }) => {
        await telegramPopUp.closeTelegramPopUp();
        await loginPopUp.openUrl();
        await openLoginPopUp(navBar, loginPopUp);
    });

    test('C200 Mobile - Authorization with empty fields', async ({ loginPopUp, loginFormData }) => {
        await loginPopUp.login({});
        await expect(loginPopUp.getLoginContainer()).toBeVisible();
        await verifyLoginFormFieldError(loginPopUp, loginFormData, 'emailPhone', loginFormData["emailPhoneInputErrorMsgs"]["empty"]);
        await verifyLoginFormFieldError(loginPopUp, loginFormData, 'password', loginFormData["passwordInputErrorMsgs"]["empty"]);

        await loginPopUp.login({ emailPhone: userLoginCredentials.email });
        await expect(loginPopUp.getLoginContainer()).toBeVisible();
        await verifyLoginFormFieldWithoutError(loginPopUp, loginFormData, 'emailPhone');
        await verifyLoginFormFieldError(loginPopUp, loginFormData, 'password', loginFormData["passwordInputErrorMsgs"]["empty"]);

        await loginPopUp.clearEmailPhoneInput();
        await verifyLoginFormFieldError(loginPopUp, loginFormData, 'emailPhone', loginFormData["emailPhoneInputErrorMsgs"]["empty"]);

        await loginPopUp.login({ password: userLoginCredentials.password });
        await expect(loginPopUp.getLoginContainer()).toBeVisible();
        await verifyLoginFormFieldWithoutError(loginPopUp, loginFormData, 'password');
    });

    test('C201 Mobile - Authorization with valid email and password', async ({ loginPopUp, navBar, ownCabinetLeftSideMenu, myProfile, helper }) => {
        const validEmails = [userLoginCredentials.email, userLoginCredentials.email.toUpperCase()];

        for (let validEmail of validEmails) {
            for (let action of actions) {
                await loginPopUp.login({ emailPhone: validEmail, password: userLoginCredentials.password, action: 'noClick' });
                const typesAttributes = ['text', 'password'];

                for (let typeAttribute of typesAttributes) {
                    await loginPopUp.clickHidePasswordIcon();
                    await expect(loginPopUp.getLoginFormInput('password')).toHaveAttribute('type', typeAttribute);
                }

                await loginPopUp.login({ action });
                await loginPopUp.waitLoginPopToClose();
                await verifyLoggedIn(navBar, ownCabinetLeftSideMenu, myProfile, helper, validEmails[0]);
                await logout(navBar, ownCabinetLeftSideMenu);
                await openLoginPopUp(navBar, loginPopUp);
            }
        }
    });

    test('C202 Mobile - Authorization with valid phone and password', async ({ loginPopUp, navBar, myProfile, ownCabinetLeftSideMenu, helper, myProfileData }) => {
        const phoneNumber = userLoginCredentials.phoneNumber;
        const validPhoneNumbers = [phoneNumber, phoneNumber.slice(1), phoneNumber.slice(3)];

        for (let validPhoneNumber of validPhoneNumbers) {
            await loginPopUp.login({ emailPhone: validPhoneNumber, password: userLoginCredentials.password });
            await loginPopUp.waitLoginPopToClose();
            await verifyLoggedIn(navBar, ownCabinetLeftSideMenu, myProfile, helper, undefined, phoneNumber);
            await expect(myProfile.getPhoneVerificationMsg()).toHaveText(myProfileData["fieldsMsgs"]['phoneNumber']["verified"]);
            await logout(navBar, ownCabinetLeftSideMenu);
            await openLoginPopUp(navBar, loginPopUp);   
        }
    });

    test('C576 Mobile - Authorization with invalid email', async ({ loginPopUp, navBar, loginFormData }) => {
        for (let invalidEmail of loginFormData.invalidEmails) {
            for (let action of actions) {
                await loginPopUp.login({ emailPhone: invalidEmail, password: userLoginCredentials.password, action: 'noClick' });
                await expect(loginPopUp.getLoginFormInput('emailPhone')).toHaveValue(invalidEmail);
                await loginPopUp.login({ action });
                await expect(loginPopUp.getLoginContainer()).toBeVisible();
                await verifyLoginFormFieldError(loginPopUp, loginFormData, "emailPhone", loginFormData["emailPhoneInputErrorMsgs"]["invalidFormat"]);
            }
        }

        for (let action of actions) {
            await loginPopUp.login({ emailPhone: loginFormData.nonExistingEmail, password: userLoginCredentials.password, action });
            await expect(loginPopUp.getLoginContainer()).toBeVisible();
            await expect(loginPopUp.getLoginFormErrorMsg('loginForm')).toHaveText(loginFormData.loginFormErrorMsgs.invalidCredentials);
        }
    });

    test('C577 Mobile - Authorization with invalid password', async ({ loginPopUp, navBar, loginFormData }) => {
        for (let invalidPassword of loginFormData.invalidPasswords) {
            for (let action of actions) {
                await loginPopUp.login({ emailPhone: userLoginCredentials.email, password: invalidPassword, action: 'noClick' });
                await expect(loginPopUp.getLoginFormInput('password')).toHaveValue(invalidPassword);
                await loginPopUp.login({ action });
                await expect(loginPopUp.getLoginContainer()).toBeVisible();
                await verifyLoginFormFieldError(loginPopUp, loginFormData, "password", loginFormData.passwordInputErrorMsgs.invalidFormat);
            }
        }

        for (let action of actions) {
            await loginPopUp.login({ emailPhone: userLoginCredentials.email, password: loginFormData.nonExistingPassword, action });
            await expect(loginPopUp.getLoginContainer()).toBeVisible();
            await expect(loginPopUp.getLoginFormErrorMsg('loginForm')).toHaveText(loginFormData.loginFormErrorMsgs.invalidCredentials);
        }
    });
});