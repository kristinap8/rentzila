import ApiHelper from './api.helper';
import DataGenerator from './dataGenerator.helper';
import fs from "fs";
import path from "path";

export interface Unit {
    name: string;
    model_name: string;
    description: string;
    features: string;
    type_of_work: string;
    time_of_work: string;
    phone: string;
    minimal_price: number;
    money_value: string;
    payment_method: string;
    lat: number;
    lng: number;
    manufacturer: number;
    owner: number;
    category: number;
    services: number[];
}

class UnitApiHelper extends ApiHelper {
    constructor() {
        super();
    }

    public async getUnit(unitId: number) {
        const response = await (await this.apiContext).get(`units/${unitId}/`);
        return response;
    }
    private async generateUnitData(): Promise<Unit> {
        const dataGenerator = new DataGenerator();
        const coordinates = dataGenerator.generateCoordinates();
        return {
            name: "Test unit " + dataGenerator.generateRandomUUID(),
            model_name: dataGenerator.generateRandomText(1, 15),
            description: dataGenerator.generateRandomText(40, 90),
            features: dataGenerator.generateRandomText(40, 90),
            type_of_work: dataGenerator.generateTypeOfWork("unit"),
            time_of_work: dataGenerator.generateTimeOfWork(),
            phone: String(process.env.USER_PHONE_NUMBER),
            minimal_price: dataGenerator.generateMinimalPrice(),
            money_value: "UAH",
            payment_method: dataGenerator.generatePaymentMethod(),
            lat: coordinates[0],
            lng: coordinates[1],
            manufacturer: dataGenerator.getRandomManufacturer(await this.getData('manufacturers')).id,
            owner: await super.getUserId(),
            category: dataGenerator.getRandomCategory(await this.getData('category')),
            services: dataGenerator.getRandomServices(await this.getData('services'))
        };
    }

    public async createUnit() {
        if (!this.userAccessToken) {
            super.userAccessToken = await super.createAccessToken("user");
        }
        const response = await (await this.apiContext).post('units/', {
            data: await this.generateUnitData(),
            headers: { 'Authorization': `Bearer ${this.userAccessToken}` }
        });
        return response;
    }

    public async addUnitImage(unitId: number) {
        if (!this.userAccessToken) {
            super.userAccessToken = await super.createAccessToken("user");
        }
        const fileName = 'vehicle.jpg';
        const stream = fs.createReadStream(path.resolve('data', 'unitData', fileName));
        const response = await (await this.apiContext).post('unit-images/', {
            headers: { 'Authorization': `Bearer ${this.userAccessToken}` },
            multipart: {
                unit: unitId,
                is_main: true,
                image: stream
            }
        });
        return response;
    }

    public async approveUnit(unitId: number) {
        if (!this.adminAccessToken) {
            super.adminAccessToken = await super.createAccessToken("admin");
        }
        const response = await (await this.apiContext).patch(`crm/units/${unitId}/moderate/`, {
            headers: { 'Authorization': `Bearer ${this.adminAccessToken}` },
            data: {
                is_approved: true
            }
        });
        return response;
    }

    public async declineUnit(unitId: number) {
        if (!this.adminAccessToken) {
            super.adminAccessToken = await super.createAccessToken("admin");
        }
        const response = await (await this.apiContext).patch(`crm/units/${unitId}/moderate/`, {
            headers: { 'Authorization': `Bearer ${this.adminAccessToken}` },
            data: {
                declined_incorrect_data: true,
                is_approved: false
            }
        });
        return response;
    }

    public async deactivateUnit(unitId: number) {
        if (!this.userAccessToken) {
            super.userAccessToken = await super.createAccessToken("user");
        }
        const response = await (await this.apiContext).patch(`units/${unitId}/`, {
            headers: { 'Authorization': `Bearer ${this.userAccessToken}` },
            data: {
                is_archived: true
            }
        });
        return response;
    }

    public async deleteUnit(unitId: number) {
        if (!this.adminAccessToken) {
            super.adminAccessToken = await super.createAccessToken("admin");
        }
        const response = await (await this.apiContext).delete(`units/${unitId}/`, {
            headers: { 'Authorization': `Bearer ${this.adminAccessToken}` }
        });
        return response;
    }

    public async addUnitToFavourites(unitId: number) {
        if (!this.userAccessToken) {
            super.userAccessToken = await super.createAccessToken("user");
        }
        const userId = await super.getUserId();
        const response = await (await this.apiContext).post(`auth/users/${userId}/favourite-units/${unitId}/`, {
            headers: { 'Authorization': `Bearer ${this.userAccessToken}` }
        });
        return response;
    }
}
export default UnitApiHelper;
// public async createUnit(unitParams: Unit) {
//     this.userAccessToken = await this.createAccessToken(
//         loginData.userEmail,
//         loginData.userPassword,
//         loginData.userPhone
//     );
//     const response = await (await this.apiContext).post('units/', {
//         data: unitParams,
//         headers: { 'Authorization': `Bearer ${this.userAccessToken}` }
//     });
//     this.createdUnitId = (await response.json()).id;
//     return response;
// }

// public async uploadUnitImage(dirName: string, imageName: string) {
//     const file = path.resolve("data/", "municipalVehicle.jpeg");
//     const image = fs.readFileSync(file);
//     const response = await (await this.apiContext).post(`unit-images/`, {
//         multipart: {
//             unit: this.createdUnitId,
//             image: {
//                 name: file,
//                 mimeType: "image/jpeg",
//                 buffer: image,
//             },
//             is_main: true
//         },
//         headers: {
//             'Accept': "*/*",
//             'ContentType': "multipart/form-data",
//             'Authorization': `Bearer ${this.userAccessToken}`
//         }
//     });
//     return response.status()
// }

// public async getData(name: string) {
//     let endpoint: string;
//     switch (name) {
//         case 'ownerInfo':
//             endpoint = `auth/users/phone/${process.env.USER_PHONE_NUMBER}/`;
//             break;
//         case 'manufacturers':
//             endpoint = 'manufacturers/';
//             break;
//         case 'categories':
//             endpoint = 'category/';
//             break;
//         case 'services':
//             endpoint = 'services/';
//             break;
//         default:
//             throw new Error('Invalid name parameter');
//     }

//     const response = await (await this.apiContext).get(endpoint);
//     return await response.json();
// }

// public async approveUnit() {
//     this.adminAccessToken = await this.createAccessToken(
//         loginData.adminEmail,
//         loginData.adminPassword,
//         loginData.adminPhone
//     );
//     const response = await (await this.apiContext).patch(`crm/units/${this.createdUnitId}/moderate/`, {
//         data: { is_approved: true },
//         headers: { 'Authorization': `Bearer ${this.adminAccessToken}` }
//     });
//     return response.status();
// }

// public async deleteUnit(): Promise<number> {
//     this.adminAccessToken = await this.createAccessToken(
//         loginData.adminEmail,
//         loginData.adminPassword,
//         loginData.adminPhone
//     );
//     const response = await (await this.apiContext).delete(`units/${this.createdUnitId}/`, {
//         headers: { 'Authorization': `Bearer ${this.adminAccessToken}` }
//     });
//     return response.status();
// }


