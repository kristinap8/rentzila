import Page from './page';

const title: string = 'div[class*="OwnerUnitsPage_title"]';
const expectedAdvertismentsTab: string = 'button[id*="Очікуючі"]';
const unitCardNames: string = 'div[class*="OwnerUnitCard_name"]';


const unitCardName = (unitName: string): string => `//div[contains(@class, "OwnerUnitCard_name") and text()="${unitName}"]`;

export class MyAdvertisments extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    getTitle() {
        return super.getElement(title);
    }

    getUnitCardNames() {
        return super.getElement(unitCardNames);
    }

    async clickUnitCard(unitName: string) {
        await super.clickElement(unitCardName(unitName));
    }

    async clickExpectedAdvertismentsTab() {
        await super.clickElement(expectedAdvertismentsTab);
    }

    async clickProposalBtn(unitName: string) {
        await super.clickElement(unitCardProposalBtn(unitName));
    }

    async clickEditBtn(unitName: string) {
        await Promise.all([
            this.page.waitForLoadState('networkidle'),
            super.clickElement(unitCardEditBtn(unitName))
        ]);
    }
}