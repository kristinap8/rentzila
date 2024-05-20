import Page from '../page';

const loginBtn = '*[data-testid="loginPopup"] button[type="submit"]'
const loginContainer = '*[data-testid="authorizationContainer"]';
const loginPopUpErrorMsg = '*[data-testid="loginPopup"] *[data-testid="errorMessage"]';
const crossBtn = '*[data-testid="authClose"]';

const emailPhoneInput = '*[data-testid="loginPopup"] input[id="email"]';
const emailPhoneInputErrorMsg = '*[data-testid="loginPopup"] label[for="email"]~*[class*="error_message"]';

const passwordInput = '*[data-testid="loginPopup"] input[id="password"]';
const passwordInputErrorMsg = '*[data-testid="loginPopup"] label[for="password"]~*[class*="error_message"]';
const hidePasswordIcon = '*[data-testid="loginPopup"] *[data-testid="reactHookButton"]';


export class LoginPopUp extends Page {
    constructor(page: Page['page'], public isMobile: boolean) {
        super(page);
        this.isMobile = isMobile;
    }

    getLoginContainer() {
        return super.getElement(loginContainer);
    }

    getLoginFormInput(inputName: 'emailPhone' | 'password') {
        switch (inputName) {
            case 'emailPhone':
                return super.getElement(emailPhoneInput);
            case 'password':
                return super.getElement(passwordInput);
            default:
                throw new Error(`Incorrect input name: ${inputName}`);
        }
    }

    getLoginFormErrorMsg(errorType: 'emailPhone' | 'password' | 'loginForm') {
        switch (errorType) {
            case 'emailPhone':
                return super.getElement(emailPhoneInputErrorMsg);
            case 'password':
                return super.getElement(passwordInputErrorMsg);
            case 'loginForm':
                return super.getElement(loginPopUpErrorMsg);
            default:
                throw new Error(`Incorrect error type: ${errorType}`);
        }
    }

    async clearEmailPhoneInput() {
        await super.clearElement(emailPhoneInput);
    }

    async clickHidePasswordIcon() {
        (this.isMobile) ? await super.tapElement(hidePasswordIcon) : await super.clickElement(hidePasswordIcon);
    }

    async login({ emailPhone = '', password = '', action = 'click' }: { emailPhone?: string, password?: string, action?: 'click' | 'noClick' | 'pressEnter' }) {
        emailPhone && await super.fillElement(emailPhoneInput, emailPhone);
        password && await super.fillElement(passwordInput, password);

        if (action === "click") {
            (this.isMobile) ? await super.tapElement(loginBtn) : await super.clickElement(loginBtn);
        }
        if (action === "pressEnter") {
            await super.focus(emailPhoneInput);
            await super.pressEnter();
        }
    }

    async waitLoginPopToClose() {
        await super.waitForSelector(loginContainer, 'detached');
    }
}