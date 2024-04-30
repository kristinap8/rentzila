import Page from '../page';

const loginBtn: string = '*[data-testid="loginPopup"] button[type="submit"]'
const loginContainer: string = '*[data-testid="authorizationContainer"]';
const crossBtn: string = '*[data-testid="authClose"]';
const emailPhoneInput: string = 'input[id="email"]';
const emailPhoneInputErrorMsg: string = '//input[@id="email"]/../following-sibling::p';
const passwordInput: string = 'input[id="password"]';
const passwordInputErrorMsg: string = '//input[@id="password"]/../following-sibling::p';
const forgotPasswordLink: string = '(//div[contains(@class, "LoginForm_link")])[3]';
const hidePasswordIcon: string = '*[data-testid="reactHookButton"]';
const loginPopUpErrorMsg: string = 'div[data-testid="errorMessage"]';

export class LoginPopUp extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async getLoginContainer() {
        return await super.getElement(loginContainer);
    }

    async getEmailPhoneInput() {
        return await super.getElement(emailPhoneInput);
    }

    async getEmailPhoneInputErrorMsg() {
        return await super.getElement(emailPhoneInputErrorMsg);
    }

    async getPasswordInput() {
        return await super.getElement(passwordInput);
    }

    async getPasswordInputErrorMsg() {
        return await super.getElement(passwordInputErrorMsg);
    }

    async getLoginPopUpErrorMsg() {
        return await super.getElement(loginPopUpErrorMsg);
    }

    async fillEmailPhoneInput(emailPhone: string) {
        await super.fillElement(emailPhoneInput, emailPhone);
    }

    async clearEmailPhoneInput() {
        await super.clearElement(emailPhoneInput);
    }

    async fillPasswordInput(password: string) {
        await super.fillElement(passwordInput, password);
    }

    async clickForgotPasswordLink() {
        await super.clickElement(forgotPasswordLink);
    }

    async clickCrossBtn() {
        await this.clickElement(crossBtn);
    }

    async login(emailPhone='', password='', action: 'click' | 'pressEnter' | 'noClick' = 'click') {
        await super.fillElement(emailPhoneInput, emailPhone);
        await super.fillElement(passwordInput, password);

        if (action === 'click') {
            await Promise.all([
                this.page.waitForSelector(loginContainer, {state: 'detached'}),
                super.clickElement(loginBtn)
            ])
        } else if (action === 'pressEnter') {
            await super.focus(emailPhoneInput);
            await super.pressEnter();
        }
    }

    async clickLoginBtn() {
        await super.clickElement(loginBtn);
    }

    async clickHidePasswordIcon() {
        await super.clickElement(hidePasswordIcon);
    }

    async focusPasswordInput() {
        await this.focus(passwordInput);
    }
}