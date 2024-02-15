import Page from './page';

const services: string = '*[class*="UnitCharacteristics_service__"]';
const category: string = '*[itemprop="category"] *[class*="UnitCharacteristics_characteristics_info__"]';
const unitName: string = '*[class*="UnitName_name"]';

export class UnitDetailsPage extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async getServices() {
        return await super.getElement(services);
    }

    async getCategoryName() {
        return await super.getElementText(category);
    }

    async getUnitName() {
        return await super.getElement(unitName);
    }
}