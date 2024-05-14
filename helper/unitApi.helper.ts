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
        if (response.status() !== 200) {
            throw new Error(`Failed to get the unit by id`);
        }
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
        if (response.status() !== 201) {
            throw new Error(`Failed to create unit, status: ${response.status()}`);
        }
        const responseBody = await response.json();
        return responseBody;
    }

    public async addUnitImage(unitId: number, folderName: string, unitImageName: string) {
        if (!this.userAccessToken) {
            super.userAccessToken = await super.createAccessToken("user");
        }
        const stream = fs.createReadStream(path.resolve('data', folderName, unitImageName));
        const response = await (await this.apiContext).post('unit-images/', {
            headers: { 'Authorization': `Bearer ${this.userAccessToken}` },
            multipart: {
                unit: unitId,
                is_main: true,
                image: stream
            }
        });
        if (response.status() !== 201) {
            throw new Error(`Failed to upload image to tender`);
        }
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
        if (response.status() !== 200) {
            throw new Error(`Failed to approve the unit`);
        }
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
        if (response.status() !== 200) {
            throw new Error(`Failed to decline the unit`);
        }
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
        if (response.status() !== 202) {
            throw new Error(`Failed to deactive the unit`);
        }
        return response;
    }

    public async deleteUnit(unitId: number) {
        if (!this.adminAccessToken) {
            super.adminAccessToken = await super.createAccessToken("admin");
        }
        const response = await (await this.apiContext).delete(`units/${unitId}/`, {
            headers: { 'Authorization': `Bearer ${this.adminAccessToken}` }
        });
        if(response.status() !== 204) {
            throw new Error(`Failed to delete the unit`);
        }
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
        if(response.status() !== 201) {
            throw new Error(`Failed to add unit to favourites`);
        }
        return response;
    }
}
export default UnitApiHelper;