import { test, expect, Locator } from '@playwright/test';
import { NavBar } from '../pages/components/navbar';
import { LoginPopUp } from '../pages/components/loginPopUp';
import { PasswordResetPopUp } from '../pages/components/passwordResetPopUp';
import { ProfilePage } from '../pages/profile.page';
import loginData from '../fixtures/loginData.json';


let navBar: NavBar;
let loginPopUp: LoginPopUp;
let passwordResetPopUp: PasswordResetPopUp;
let profilePage: ProfilePage;
const actions = ['click', 'pressEnter'];

async function performLoginAction(action: string) {
    if (action === 'click') {
        await loginPopUp.clickLoginBtn();
    } else {
        await loginPopUp.focusPasswordInput();
        await loginPopUp.pressEnter();
    }
}

async function verifyLoginFieldError(isEmailField = true, isFieldEmpty = true) {
    const input = isEmailField ? loginPopUp.getEmailPhoneInput() : loginPopUp.getPasswordInput();
    const errorMsg = isEmailField ? loginPopUp.getEmailPhoneInputErrorMsg() : loginPopUp.getPasswordInputErrorMsg();

    if (isFieldEmpty) {
        await expect(await input).toHaveAttribute('class', /CustomReactHookInput_error_input/);
        await expect(await errorMsg).toHaveText('Поле не може бути порожнім');
    } else {
        await expect(await input).not.toHaveAttribute('class', /CustomReactHookInput_error_input/);
    }
}

async function verifyLoggedIn() {
    await expect(await navBar.getAvatarIcon()).toBeVisible();
    await navBar.clickAvatarIcon();
    await expect(await navBar.getProfileDropdownContainer()).toBeVisible();
}

async function verifyNotLoggedIn() {
    await expect(await navBar.getLogInBtn()).toBeVisible();
    await expect(await loginPopUp.getLoginContainer()).toBeVisible();
}

test.describe('Login functionality check', () => {
    test.beforeEach(async ({ page }) => {
        navBar = new NavBar(page);
        loginPopUp = new LoginPopUp(page);

        await navBar.openUrl();
        await navBar.clickLoginBtn();
    });

    test('C200 - Authorization with empty fields', async () => {
        await loginPopUp.login();
        await verifyNotLoggedIn();
        await verifyLoginFieldError();
        await verifyLoginFieldError(false);

        await loginPopUp.login(String(process.env.EMAIL), '');
        await verifyNotLoggedIn();
        await verifyLoginFieldError(true, false);
        await verifyLoginFieldError(false);

        await loginPopUp.clearEmailPhoneInput();
        await verifyLoginFieldError();

        await loginPopUp.login('', String(process.env.PASSWORD));
        await verifyNotLoggedIn();
        await verifyLoginFieldError(false, false);
    });

    test('C199 - Reset the password with invalid email', async ({ page }) => {
        async function verifyResetPasswordError(email: string, errorMsg: Locator, errorText: string, action?: 'click' | 'pressEnter' | 'noClick') {
            await passwordResetPopUp.resetPassword(email, action);
            await expect(errorMsg).toHaveText(errorText);
            await expect(await passwordResetPopUp.getPasswordResetFormContainer()).toBeVisible();
        }

        passwordResetPopUp = new PasswordResetPopUp(page);
        const emailInputErrorMsg = await passwordResetPopUp.getEmailInputErrorMsg();
        const passwordResetPopUpErrorMsg = await passwordResetPopUp.getPasswordResetPopUpErrorMsg();

        await loginPopUp.clickForgotPasswordLink();
        await verifyResetPasswordError('', emailInputErrorMsg, 'Поле не може бути порожнім', 'click');

        await passwordResetPopUp.resetPassword(String(process.env.EMAIL), 'noClick');
        await expect(await passwordResetPopUp.getEmailInput()).toHaveValue(String(process.env.EMAIL));
        await passwordResetPopUp.clickCrossBtn();
        await expect(await passwordResetPopUp.getPasswordResetFormContainer()).not.toBeVisible();

        await loginPopUp.clickForgotPasswordLink();
        for (const invalidEmail of loginData.invalidEmails) {
            await verifyResetPasswordError(invalidEmail, emailInputErrorMsg, 'Неправильний формат email', 'click');
        }
        await verifyResetPasswordError(loginData['nonExistingEmail'], passwordResetPopUpErrorMsg, 'Користувач з таким емейлом або номером телефону не верифікований в системі', 'pressEnter');
    });

    test('C201 - Authorization with valid email and password', async () => {
        const validEmails = [String(process.env.EMAIL), String(process.env.EMAIL).toUpperCase()];

        for (const validEmail of validEmails) {
            for (const action of actions) {
                await loginPopUp.login(validEmail, String(process.env.PASSWORD), 'noClick');
                await loginPopUp.clickHidePasswordIcon();
                await expect(await loginPopUp.getPasswordInput()).toHaveAttribute('type', 'text');
                await loginPopUp.clickHidePasswordIcon();
                await expect(await loginPopUp.getPasswordInput()).toHaveAttribute('type', 'password');

                await performLoginAction(action);
                await verifyLoggedIn();
                await expect(await navBar.getProfileEmail()).toHaveText(String(process.env.EMAIL));
                await navBar.clickLogoutDropdownItem();
                await navBar.clickLoginBtn();
            }
        }
    });

    test('C202 - Authorization with valid phone and password', async ({ page }) => {
        profilePage = new ProfilePage(page);
        const phoneNumber = String(process.env.PHONE_NUMBER);
        const validPhoneNumbers = [phoneNumber, phoneNumber.slice(1), phoneNumber.slice(2)];

        for (const validPhoneNumber of validPhoneNumbers) {
            await loginPopUp.fillEmailPhoneInput(validPhoneNumber);
            await verifyLoginFieldError(true, false);
            await loginPopUp.fillPasswordInput(String(process.env.PASSWORD));
            await verifyLoginFieldError(false, false);
            await loginPopUp.clickLoginBtn();

            await verifyLoggedIn();
            await navBar.clickMyProfileDropdownItem();
            await expect(profilePage.page).toHaveURL(/owner-cabinet/);

            const phoneNumberValue = (await profilePage.getPhoneNumberInput()).replace(/\s/g, '');
            expect(phoneNumberValue).toEqual(phoneNumber);
            await expect(await profilePage.getPhoneVerificationMsg()).toHaveText('Успішно верифіковано');
            await profilePage.clickLogOutBtn();
            await navBar.clickLoginBtn();
        }
    });

    test('C576 - Authorization with invalid email', async () => {
        for (const invalidEmail of loginData.invalidEmails) {
            for (const action of actions) {
                await loginPopUp.login(invalidEmail, String(process.env.PASSWORD), 'noClick');
                await expect(await loginPopUp.getEmailPhoneInput()).toHaveValue(invalidEmail);
                await performLoginAction(action);
                await verifyNotLoggedIn();
                await expect(await loginPopUp.getEmailPhoneInputErrorMsg()).toHaveText('Неправильний формат email або номера телефону');
            }
        }

        await loginPopUp.login(String(loginData.nonExistingEmail), String(process.env.PASSWORD), 'click');
        await verifyNotLoggedIn();
        await expect(await loginPopUp.getLoginPopUpErrorMsg()).toHaveText('Невірний e-mail або пароль');
    })

    test('C577 - Authorization with invalid password', async () => {
        for (const invalidPassword of loginData.invalidPasswords) {
            for (const action of actions) {
                await loginPopUp.login(String(process.env.EMAIL), invalidPassword, 'noClick');
                await expect(await loginPopUp.getPasswordInput()).toHaveValue(invalidPassword);
                await performLoginAction(action);
                await verifyNotLoggedIn();
                await expect(await loginPopUp.getPasswordInputErrorMsg()).toHaveText('Пароль повинен містити як мінімум 1 цифру, 1 велику літеру і 1 малу літеру, також не повинен містити кирилицю та пробіли');
            }
        }
    })
});