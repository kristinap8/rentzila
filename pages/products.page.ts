import Page from './page';

const resultCountMsg: string = 'h1[class*="MapPagination_count"]';
const selectedFilter: string = '*[class*="selectedCategory"]';
const unitCards: string = '*[data-testid="cardWrapper"]';

export class ProductsPage extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async getSelectedFilter() {
        return await super.getElement(selectedFilter);
    }

    async getUnitCards() {
        return await super.getElementsArray(unitCards);
    }

    async getResultCountMsg() {
        return await super.getElement(resultCountMsg);
    }

    async clickFirstUnitCard() {
        await super.clickElementByIndex(unitCards, 0);
        await super.pause(100);
    }
}