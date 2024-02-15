import Page from './page';

const phoneNumberInput: string = 'input[data-testid="input_OwnerProfileNumber"]';
const phoneVerificationMsg: string = 'div[data-testid="verification_OwnerProfileNumber"]';
const logOutBtn: string = 'div[data-testid="logOut"]';

export class ProfilePage extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async getPhoneNumberInput() {
        return await super.getElementValue(phoneNumberInput);
    }

    async getPhoneVerificationMsg() {
        return await super.getElement(phoneVerificationMsg);
    } 

    async clickLogOutBtn() {
        await super.clickElement(logOutBtn);
    }
}