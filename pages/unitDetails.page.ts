import Page from './page';

const services: string = '*[class*="UnitCharacteristics_service__"]';
const category: string = '//*[contains(@class, "UnitCharacteristics_characteristics_title") and text()="Категорія"]/../*[contains(@class,"UnitCharacteristics_characteristics_info")]';
const manufacturer: string = 'div[itemprop="manufacturer"] div[class*="UnitCharacteristics_characteristics_info"]';
const model: string = 'div[itemprop="model"] div[class*="UnitCharacteristics_characteristics_info"]';
const technicalFeatures: string = 'div[itemprop="features"] div[class*="UnitCharacteristics_characteristics_info"]';
const description: string = 'div[class*="UnitDescription_content"]';
const location: string = 'div[class*="UnitPlace_currentPlace"] span';
const paymentMethod: string = 'div[class*="ImageWithDescription_paymentMethod"]';
const minimalPrice: string = 'div[class*="ImageWithDescription_price_wrapper"] div[class*="ImageWithDescription_price"]';
const unitName: string = '*[class*="UnitName_name"]';
const editUnitBtn: string = '*[data-testid="unitButtons"] button:nth-of-type(1)';

export class UnitDetailsPage extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    getServices() {
        return super.getElement(services);
    }

    async getServicesArray() {
        return await super.getElementsArray(services);
    }

    getCategory() {
        return super.getElement(category);
    }

    async getCategoryText() {
        return await super.getElementText(category);
    }

    getManufacturer() {
        return super.getElement(manufacturer);
    }

    getModel() {
        return super.getElement(model);
    }

    getTechnicalFeatures() {
        return super.getElement(technicalFeatures);
    }

    getDescription() {
        return super.getElement(description);
    }

    getLocation() {
        return super.getElement(location);
    }

    getMinimalPrice() {
        return super.getElement(minimalPrice);
    }

    getUnitName() {
        return super.getElement(unitName);
    }

    getPaymentMethod() {
        return super.getElement(paymentMethod);
    }

    async clickEditBtn() {
        await Promise.all([
            this.page.waitForLoadState('networkidle'),
            super.clickElement(editUnitBtn)
        ]);
    }


    // name: string;
    // model_name: string;
    // description: string;
    // features: string;
    // type_of_work: string;
    // time_of_work: string;
    // phone: string;
    // minimal_price: number;
    // money_value: string;
    // payment_method: string;
    // lat: number;
    // lng: number;
    // manufacturer: number;
    // owner: number;
    // category: number;
    // services: number[];
}