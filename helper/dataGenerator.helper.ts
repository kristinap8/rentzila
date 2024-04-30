import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';

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
}

export default DataGenerator;

// public generateOrderUnitPeriod() {
//     const startDate = faker.date.soon({ days: 30 });
//     const maxEndDate = DateTime.fromJSDate(startDate).plus({ months: 2 }).toJSDate();
//     const endDate = faker.date.between({ from: startDate, to: maxEndDate });

//     return { startDate, endDate };
// }

// public generateUnitName() {
//     return "Test unit" + faker.string.uuid();
// }

// public generateModelName() {
//     return faker.lorem.word({ length: { min: 1, max: 15 } });
// }



// public generateComment() {
//     return faker.lorem.sentences({ min: 1, max: 40 });
// }





// public generateMinimalPrice() {
//     return faker.number.int({ min: 1, max: 999999999 });
// }

// public generateMoneyValue() {
//     return faker.helpers.arrayElement(['UAH', 'USD', 'EUR']);
// }







// public getRandomCategory(categories: Array<any>) {
//     const randomCategory: any = faker.helpers.arrayElement(categories.filter(category => category.level === 3));
//     return randomCategory.id;
// }

// public getRandomServices(services: Array<JSON>) {
//     const randomServices: any = faker.helpers.arrayElements(services, { min: 1, max: 10 });
//     return randomServices.map(service => service.id);
// }

// private generateText(length: number) {
//     let text = '';
//     while (text.length < length) {
//         text += faker.lorem.words();
//     }
//     return text.substring(0, length);
// }

// public getRandomInd(elementsCount: number) {
//     return faker.number.int({ min: 0, max: elementsCount - 1 });
// }

// public generateTenderName(length?: number) {
//     if (!length) {
//         length = faker.number.int({ min: 10, max: 70 });
//     }
//     return this.generateText(length);
// }

// public async getRandomService() {
//     const createUnitApiHelper = new CreateUnitApiHelper();
//     const services = await createUnitApiHelper.getData('services') as { name: string }[];
//     return faker.helpers.arrayElement(services).name;
// }

// public generateDeclaredBudget() {
//     return faker.number.int({ min: 1, max: 999999999 });
// }

// public generateAdditionalInfo(length?: number) {
//     if (!length) {
//         length = faker.number.int({ min: 40, max: 50 });
//     }
//     return this.generateText(length);
// }

