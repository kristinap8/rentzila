import Page from './page';

const expectedAdvertismentsTab: string = 'button[id*="Очікуючі"]';
const expectedUnitCardNames: string = 'div[class*="OwnerUnitCard_name"]';

export class MyAdvertisments extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async getExpectedUnitCardNames() {
        return super.getElement(expectedUnitCardNames);
    }

    async clickExpectedAdvertismentsTab() {
        await super.clickElement(expectedAdvertismentsTab);
    }
}