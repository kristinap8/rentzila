import Page from '../page';

const passwordResetPopUpContainer: string = '*[data-testid="restorePasswordContainer"]';
const emailInput: string = '*[data-testid="restorePasswordContainer"] input[class*="CustomReactHookInput_input"]';
const emailInputErrorMsg: string = 'p[class*="CustomReactHookInput_error_message"]';
const resetPasswordBtn: string = '*[data-testid="restorePasswordContainer"] button';
const crossBtn: string = '*[data-testid="restorePasswordContainer"] *[data-testid="crossIcon"]';
const passwordResetPopUpErrorMsg: string = '*[data-testid="restoreError"]';
const captchaFrame: string = '*[title="reCAPTCHA"]';
const captchaCheckbox: string = '#recaptcha-anchor';

export class PasswordResetPopUp extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async getPasswordResetFormContainer() {
        return await super.getElement(passwordResetPopUpContainer);
    }

    async getPasswordResetPopUpErrorMsg() {
        return await super.getElement(passwordResetPopUpErrorMsg);
    }

    async getEmailInput() {
        return await super.getElement(emailInput);
    }

    async getEmailInputErrorMsg() {
        return await super.getElement(emailInputErrorMsg);
    }

    async clickCrossBtn() {
        await super.clickElement(crossBtn);
    }

    async fillEmailInput(email: string) {
        await super.fillElement(emailInput, email);
    }
    async resetPassword(email: string, action: 'click' | 'pressEnter' | 'noClick' = 'click') {
        await this.fillEmailInput(email);
        await super.checkFrameElement(captchaFrame, captchaCheckbox);
        
        if (action === 'click') {
            await super.clickElement(resetPasswordBtn);
        } else if (action === 'pressEnter') {
            await super.focus(emailInput);
            await super.pressEnter();
        }
    }
}