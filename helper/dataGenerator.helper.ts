import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';
import { ukrainianCities } from '../data/ukrainianCities.json';
import ApiHelper from './api.helper';

class DataGenerator {
    public generateRandomUUID() {
        return faker.string.uuid();
    }

    public generateRandomText(minLength: number, maxLength: number) {
        const length = faker.number.int({ min: minLength, max: maxLength });
        let text = '';
        while (text.length < length) {
            text += faker.lorem.words();
        }
        return text.substring(0, length);
    }

    public generateCoordinates() {
        return faker.location.nearbyGPSCoordinate({ origin: [49.582226, 31.992188], radius: 100, isMetric: true })
    }

    public generateMinimalPrice() {
        return faker.number.int({ min: 1, max: 999999999 });
    }

    public generateTypeOfWork(item: "tender" | "unit") {
        const typesOfWork = ['CHANGE', 'HOUR', 'TON', 'HECTARE', 'SQUARE METER', 'METER CUBE',];;
        if (item === "unit") {
            typesOfWork.push('PIECE', 'KG', 'KM');
        }
        return faker.helpers.arrayElement(typesOfWork);
    }

    public generateProposeDates() {
        const startProposeDate = faker.date.soon({ days: 30 });
        const endProposeDate = DateTime.fromJSDate(startProposeDate).plus({ days: faker.number.int({ min: 1, max: 365 }) }).toJSDate();
        const startTenderDate = DateTime.fromJSDate(endProposeDate).plus({ days: faker.number.int({ min: 1, max: 365 }) }).toJSDate();
        const endTenderDate = DateTime.fromJSDate(startTenderDate).plus({ days: faker.number.int({ min: 1, max: 365 }) }).toJSDate();
        return [startProposeDate.toISOString(), endProposeDate.toISOString(), startTenderDate.toISOString(), endTenderDate.toISOString()];
    }

    public getRandomServiceAndCategory(services: Array<any>) {
        const randomService: any = faker.helpers.arrayElement(services);
        return { "service": [randomService.id], "category": randomService.category[0].id };
    }

    public getRandomCategory(categories: Array<any>) {
        const randomCategory: any = faker.helpers.arrayElement(categories.filter(category => category.level === 3));
        return randomCategory.id;
    }

    public getRandomServices(services: Array<JSON>) {
        const randomServices: any = faker.helpers.arrayElements(services, { min: 1, max: 10 });
        return randomServices.map(service => service.id);
    }

    public async getRandomServiceName() {
        const apiHelper = new ApiHelper();
        const services = await apiHelper.getData('services');
        const randomService: any = faker.helpers.arrayElement(services);
        return randomService.name;
    }

    public generateCurrency() {
        return faker.helpers.arrayElement(['UAH', 'USD', 'EUR']);
    }

    public generatePaymentMethod() {
        return faker.helpers.arrayElement(['CASH_OR_CARD', 'CASHLESS_PAYMENT_WITH_VAT', 'CASHLESS_PAYMENT_WITHOUT_VAT']);
    }

    public generateTimeOfWork() {
        return faker.helpers.arrayElement(['FOUR', 'EIGHT']);
    }

    public getRandomManufacturer(manufacturers: Array<JSON>) {
        const randomManufacturer: any = faker.helpers.arrayElement(manufacturers);
        return randomManufacturer;
    }

    public getRandomElementFromArray(array: Array<any>) {
        return faker.helpers.arrayElement(array);
    }

    public generateFirstName() {
        return faker.person.firstName();
    }

    public generateLastName() {
        return faker.person.lastName();
    }

    public generateMiddleName() {
        return faker.person.middleName();
    }

    public generateCity() {
        return faker.helpers.arrayElement(ukrainianCities).replace('’', "'");
    }

    /**
    * Generates random ukrainian phone number in the format '+380#########'
    *
    * @returns {string} The random phone number in the specified format.
    */
    public generatePhoneNumber(): string {
        const operatorCodes = ['050', '063', '066', '073', '091', '092', '093', '094', '095', '096', '097', '098', '099'];
        let phoneNumber = '+38' + faker.helpers.arrayElement(operatorCodes) + faker.string.numeric(7);
        return phoneNumber;
    }

    public generateTelegramUsername() {
        const length = faker.number.int({ min: 5, max: 15 });
        // Generate the first character as alphabetic
        let username = faker.string.alpha(1);
        // Generate characters excluding the first and last, which can contain alphabetic, numeric, or underscore
        username += faker.helpers.fromRegExp(RegExp(`[a-zA-Z0-9_]{${length - 1}}`));
        // Generate the last character, which can contain alphabetic or numeric characters
        username += faker.string.alphanumeric(1);
        return username;
    }

    public generateTaxpayerNumber() {
        return faker.string.numeric(10);
    }

    public generateLegalType() {
        return faker.helpers.arrayElement(['ТОВ', 'ВАТ', 'ЗАТ']);
    }

    public generateEdrpou() {
        return faker.string.numeric(8);
    }

    public generateLegalEntityName() {
        return faker.company.name().slice(25);
    }

    public generateFutureDate(years: number = 1) {
        return faker.date.future({ years });
    }

    /**
     * Generate a random time difference in hours between 24 and a specified maximum.
     * 
     * @param {number} maxHours - The maximum number of hours for the time difference.
     * @returns {number} - A random time difference in hours.
     */
    public generateHoursDifference(maxHours: number = 24 * 100): number {
        return faker.number.int({ min: 24, max: maxHours });
    }

    public generateDaysDifference(minDays: number = 0, maxDays: number = 365): number {
        return faker.number.int({ min: minDays, max: maxDays });
    }

    public generateDeclaredBudget() {
        return faker.number.int({ min: 1, max: 999999999 });
    }
}

export default DataGenerator;