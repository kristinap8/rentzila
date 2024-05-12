import Page from '../page';

const contactPersonCheckbox = 'input[data-testid="operatorCheckbox"]';
const surnameInput = 'input[name="fNameOperator"]';
const surnameErrorMsg = 'input[name="fNameOperator"] ~ *[data-testid="errorDescr"]';
const nameInput = 'input[name="lNameOperator"]';
const nameErrorMsg = 'input[name="lNameOperator"] ~ *[data-testid="errorDescr"]';
const phoneInput = '#mobile';
const phoneErrorMsg = '#mobile ~ *[data-testid="errorMessage"]';

export class ContactsTab extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    getContactsTabInput(fieldName: 'surname' | 'name' | 'phone') {
        switch (fieldName) {
            case 'surname':
                return super.getElement(surnameInput);
            case 'name':
                return super.getElement(nameInput);
            case 'phone':
                return super.getElement(phoneInput);
            default:
                throw new Error(`Unsupported input name: ${fieldName}`);
        }
    }

    getContactsTabErrorMsg(fieldName: 'surname' | 'name' | 'phone') {
        switch (fieldName) {
            case 'surname':
                return super.getElement(surnameErrorMsg);
            case 'name':
                return super.getElement(nameErrorMsg);
            case 'phone':
                return super.getElement(phoneErrorMsg);
            default:
                throw new Error(`Unsupported input name: ${fieldName}`);
        }
    }

    async unckeckContactPersonCheckbox() {
        await super.uncheckElement(contactPersonCheckbox);
    }
}