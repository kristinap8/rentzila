import { test, expect, pages, testData } from "../../fixtures/fixture";

const userLoginCredentials = {
    "email": String(process.env.USER_EMAIL),
    "phoneNumber": String(process.env.USER_PHONE_NUMBER),
    "password": String(process.env.USER_PASSWORD)
}
const actions = ['click', 'pressEnter'] as const;

async function verifyNotLoggedIn(navBar: pages["navBar"], loginPopUp: pages["loginPopUp"]) {
    await expect(navBar.getNavbarItem('loginBtn')).toBeVisible();
    await expect(loginPopUp.getLoginContainer()).toBeVisible();
}

async function verifyLoginFormFieldError(loginPopUp: pages["loginPopUp"], loginFormData: testData["loginFormData"], field: 'emailPhone' | 'password', errorMsg: string) {
    await expect(loginPopUp.getLoginFormInput(field)).toHaveClass(RegExp(loginFormData["fieldsErrorClasses"][field]));
    await expect(loginPopUp.getLoginFormErrorMsg(field)).toHaveText(errorMsg);
}

async function verifyLoginFormFieldWithoutError(loginPopUp: pages["loginPopUp"], loginFormData: testData["loginFormData"], field: 'emailPhone' | 'password') {
    await expect(loginPopUp.getLoginFormInput(field)).not.toHaveClass(RegExp(loginFormData["fieldsErrorClasses"][field]));
}

async function verifyLoggedIn(navBar: pages["navBar"], loggedInEmail: string) {
    await expect(navBar.getNavbarItem('avatarIcon')).toBeVisible();
    await navBar.clickNavbarItem('avatarIcon');
    await expect(navBar.getProfileDropdown()).toBeVisible();
    await expect(navBar.getProfileDropdownEmail()).toHaveText(loggedInEmail);
}

test.describe('Login functionality check', () => {
    test.beforeEach(async ({ navBar, loginPopUp, telegramPopUp }) => {
        await telegramPopUp.closeTelegramPopUpViaLocatorHandler();
        await navBar.openUrl();
        await navBar.clickNavbarItem('loginBtn');
        await expect(loginPopUp.getLoginContainer()).toBeVisible();
    });

    test('C200 - Authorization with empty fields', async ({ loginPopUp, navBar, loginFormData }) => {
        await loginPopUp.login({});
        await verifyNotLoggedIn(navBar, loginPopUp);
        await verifyLoginFormFieldError(loginPopUp, loginFormData, 'emailPhone', loginFormData["emailPhoneInputErrorMsgs"]["empty"]);
        await verifyLoginFormFieldError(loginPopUp, loginFormData, 'password', loginFormData["passwordInputErrorMsgs"]["empty"]);

        await loginPopUp.login({ emailPhone: userLoginCredentials.email });
        await verifyNotLoggedIn(navBar, loginPopUp);
        await verifyLoginFormFieldWithoutError(loginPopUp, loginFormData, 'emailPhone');
        await verifyLoginFormFieldError(loginPopUp, loginFormData, 'password', loginFormData["passwordInputErrorMsgs"]["empty"]);

        await loginPopUp.clearEmailPhoneInput();
        await verifyLoginFormFieldError(loginPopUp, loginFormData, 'emailPhone', loginFormData["emailPhoneInputErrorMsgs"]["empty"]);

        await loginPopUp.login({ password: userLoginCredentials.password });
        await verifyNotLoggedIn(navBar, loginPopUp);
        await verifyLoginFormFieldWithoutError(loginPopUp, loginFormData, 'password');
    });

    test('C201 - Authorization with valid email and password', async ({ loginPopUp, navBar }) => {
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
                await verifyLoggedIn(navBar, validEmails[0]);
                await navBar.clickProfileDropdownBtn('logout');
                await navBar.clickNavbarItem('loginBtn');
            }
        }
    });

    test('C202 - Authorization with valid phone and password', async ({ loginPopUp, navBar, myProfile, ownCabinetLeftSideMenu, helper, myProfileData, endpointsData }) => {
        const phoneNumber = userLoginCredentials.phoneNumber;
        const validPhoneNumbers = [phoneNumber, phoneNumber.slice(1), phoneNumber.slice(3)];

        for (let validPhoneNumber of validPhoneNumbers) {
            await loginPopUp.login({ emailPhone: validPhoneNumber, password: userLoginCredentials.password });
            await verifyLoggedIn(navBar, userLoginCredentials.email);

            await navBar.clickProfileDropdownBtn('myProfile');
            await expect(myProfile.page).toHaveURL(endpointsData["myProfile"]);
            expect(helper.removeSpaces(await myProfile.getMyProfileInputValue('phoneNumber'))).toEqual(phoneNumber);
            await expect(myProfile.getPhoneVerificationMsg()).toHaveText(myProfileData["fieldsMsgs"]['phoneNumber']["verified"]);

            await ownCabinetLeftSideMenu.clickMenuBtn('logout');
            await navBar.clickNavbarItem('loginBtn');
        }
    });

    test('C576 - Authorization with invalid email', async ({ loginPopUp, navBar, loginFormData }) => {
        for (let invalidEmail of loginFormData.invalidEmails) {
            for (let action of actions) {
                await loginPopUp.login({ emailPhone: invalidEmail, password: userLoginCredentials.password, action: 'noClick' });
                await expect(loginPopUp.getLoginFormInput('emailPhone')).toHaveValue(invalidEmail);
                await loginPopUp.login({ action });
                await verifyNotLoggedIn(navBar, loginPopUp);
                await verifyLoginFormFieldError(loginPopUp, loginFormData, "emailPhone", loginFormData["emailPhoneInputErrorMsgs"]["invalidFormat"]);
            }
        }

        for (let action of actions) {
            await loginPopUp.login({ emailPhone: loginFormData.nonExistingEmail, password: userLoginCredentials.password, action });
            await verifyNotLoggedIn(navBar, loginPopUp);
            await expect(loginPopUp.getLoginFormErrorMsg('loginForm')).toHaveText(loginFormData.loginFormErrorMsgs.invalidCredentials);
        }
    });

    test('C577 - Authorization with invalid password', async ({ loginPopUp, navBar, loginFormData }) => {
        for (let invalidPassword of loginFormData.invalidPasswords) {
            for (let action of actions) {
                await loginPopUp.login({ emailPhone: userLoginCredentials.email, password: invalidPassword, action: 'noClick' });
                await expect(loginPopUp.getLoginFormInput('password')).toHaveValue(invalidPassword);
                await loginPopUp.login({ action });
                await verifyNotLoggedIn(navBar, loginPopUp);
                await verifyLoginFormFieldError(loginPopUp, loginFormData, "password", loginFormData.passwordInputErrorMsgs.invalidFormat);
            }
        }

        for (let action of actions) {
            await loginPopUp.login({ emailPhone: userLoginCredentials.email, password: loginFormData.nonExistingPassword, action });
            await verifyNotLoggedIn(navBar, loginPopUp);
            await expect(loginPopUp.getLoginFormErrorMsg('loginForm')).toHaveText(loginFormData.loginFormErrorMsgs.invalidCredentials);
        }
    });
});