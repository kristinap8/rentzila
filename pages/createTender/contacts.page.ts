import Page from '../page';

const contactPersonCheckbox: string = 'input[data-testid="operatorCheckbox"]';

export class Contacts extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async unckeckContactPersonCheckbox() {
        await super.uncheckElement(contactPersonCheckbox);
    } 
}