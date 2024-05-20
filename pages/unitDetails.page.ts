import Page from './page';

const services = '*[class*="UnitCharacteristics_service__"]';
const category = '//*[contains(@class, "UnitCharacteristics_characteristics_title") and text()="Категорія"]/../*[contains(@class,"UnitCharacteristics_characteristics_info")]';
const model = '*[itemprop="model"] div[class*="UnitCharacteristics_characteristics_info"]';
const technicalFeatures = 'div[itemprop="features"] div[class*="UnitCharacteristics_characteristics_info"]';
const description = 'div[class*="UnitDescription_content"]';
const location = 'div[class*="UnitPlace_currentPlace"] span';
const paymentMethod = 'div[class*="ImageWithDescription_paymentMethod"]';
const minimalPrice = 'div[class*="ImageWithDescription_price_wrapper"] div[class*="ImageWithDescription_price"]';
const unitName = '*[class*="UnitName_name"]';
const editUnitBtn = '*[data-testid="unitButtons"] button:nth-of-type(1)';
const manufacturer = '*[itemprop="manufacturer"] *[class*="UnitCharacteristics_characteristics_info"]';

export class UnitDetailsPage extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    getUnitInfo(infoName: 'services') {
        switch (infoName) {
            case 'services':
                return super.getElement(services);
            default:
                throw new Error(`Unsupported unit info name: ${infoName}`);   
        }
    }

   async getCategoryText() {
        return await super.getElementText(category);
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
}