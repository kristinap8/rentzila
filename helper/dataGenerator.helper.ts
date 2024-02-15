import { faker } from '@faker-js/faker';

class DataGenerator {
    public generateUnitName() {
        return "Test unit" + faker.string.uuid();
    }

    public generateModelName() {
        return faker.lorem.word({ length: { min: 1, max: 15 } });
    }

    public generateRandomText() {
        return faker.lorem.sentences({ min: 1, max: 90 });
    }

    public generateTypeOfWork() {
        return faker.helpers.arrayElement(['CHANGE', 'HOUR', 'TON', 'HECTARE', 'SQUARE METER', 'METER CUBE', 'PIECE', 'KG', 'KM']);
    }

    public generateTimeOfWork() {
        return faker.helpers.arrayElement(['FOUR', 'EIGHT']);
    }

    public generateMinimalPrice() {
        return faker.number.int({ min: 1, max: 999999999 });
    }

    public generateMoneyValue() {
        return faker.helpers.arrayElement(['UAH', 'USD', 'EUR']);
    }

    public generatePaymentMethod() {
        return faker.helpers.arrayElement(['CASH_OR_CARD', 'CASHLESS_PAYMENT_WITH_VAT', 'CASHLESS_PAYMENT_WITHOUT_VAT']);
    }

    public generateLatLng() {
        return faker.location.nearbyGPSCoordinate({ origin: [50.45466, 30.5238], radius: 50, isMetric: true })
    }

    public getRandomManufacturer(manufacturers: Array<JSON>) {
        const randomManufacturer: any = faker.helpers.arrayElement(manufacturers);
        return randomManufacturer.id;
    }

    public getRandomCategory(categories: Array<any>) {
        const randomCategory: any = faker.helpers.arrayElement(categories.filter(category => category.level === 3));
        return randomCategory.id;
    }

    public getRandomServices(services: Array<JSON>) {
        const randomServices: any = faker.helpers.arrayElements(services, { min: 1, max: 10 });
        return randomServices.map(service => service.id);
    }
}

export default DataGenerator;