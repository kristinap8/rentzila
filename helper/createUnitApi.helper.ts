import { request, APIRequestContext } from '@playwright/test';
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

const loginData = {
    userEmail: process.env.USER_EMAIL,
    userPassword: process.env.USER_PASSWORD,
    userPhone: process.env.USER_PHONE_NUMBER,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    adminPhone: process.env.ADMIN_PHONE_NUMBER
}

class CreateUnitApiHelper {
    private baseURL: string;
    private userAccessToken: any = null;;
    private adminAccessToken: any = null;
    private createdUnitId: number;
    private apiContext: Promise<APIRequestContext>;

    constructor() {
        this.baseURL = 'https://stage.rentzila.com.ua/api/';
        this.apiContext = request.newContext({
            baseURL: this.baseURL
        });
    }

    private async createAccessToken(email: string, password: string, phone: string) {
        const response = await (await this.apiContext).post('auth/jwt/create/', {
            data: {
                email: email,
                password: password,
                phone: phone
            }
        });
        const jsonResponse = await response.json();
        return jsonResponse.access;
    }

    public async generateUnitData(): Promise<Unit> {
        const dataGenerator = new DataGenerator();
        const latlng = dataGenerator.generateLatLng();
        const manufacturers = dataGenerator.getRandomManufacturer(await this.getData('manufacturers'));
        const ownerId = (await this.getData('ownerInfo')).id;
        const categories = dataGenerator.getRandomCategory(await this.getData('categories'));
        const services = dataGenerator.getRandomServices(await this.getData('services'));
        return {
            name: dataGenerator.generateUnitName(),
            model_name: dataGenerator.generateModelName(),
            description: dataGenerator.generateRandomText(),
            features: dataGenerator.generateRandomText(),
            type_of_work: dataGenerator.generateTypeOfWork(),
            time_of_work: dataGenerator.generateTimeOfWork(),
            phone: String(process.env.USER_PHONE_NUMBER),
            minimal_price: dataGenerator.generateMinimalPrice(),
            money_value: dataGenerator.generateMoneyValue(),
            payment_method: dataGenerator.generatePaymentMethod(),
            lat: latlng[0],
            lng: latlng[1],
            manufacturer: manufacturers,
            owner: ownerId,
            category: categories,
            services: services
        };
    }

    public async createUnit(unitParams: Unit): Promise<number> {
        this.userAccessToken = await this.createAccessToken(
            loginData.userEmail || '',
            loginData.userPassword || '',
            loginData.userPhone || ''
        );
        const response = await (await this.apiContext).post('units/', {
            data: unitParams,
            headers: { 'Authorization': `Bearer ${this.userAccessToken}` }
        });
        this.createdUnitId = (await response.json()).id;
        return response.status();
    }

    public async uploadUnitImage() {
        const file = path.resolve("data/", "municipalVehicle.jpeg");
        const image = fs.readFileSync(file);
        const response = await (await this.apiContext).post(`unit-images/`, {
            multipart: {
                unit: this.createdUnitId,
                image: {
                    name: file,
                    mimeType: "image/jpeg",
                    buffer: image,
                },
                is_main: true
            },
            headers: {
                'Accept': "*/*",
                'ContentType': "multipart/form-data",
                'Authorization': `Bearer ${this.userAccessToken}`
            }
        });
        return response.status()
    }

    public async getData(name: string) {
        let endpoint = '';
        switch (name) {
            case 'ownerInfo':
                endpoint = `auth/users/phone/${process.env.USER_PHONE_NUMBER}/`;
                break;
            case 'manufacturers':
                endpoint = 'manufacturers/';
                break;
            case 'categories':
                endpoint = 'category/';
                break;
            case 'services':
                endpoint = 'services/';
                break;
            default:
                throw new Error('Invalid name parameter');
        }

        const response = await (await this.apiContext).get(endpoint);
        return await response.json();
    }

    public async deleteUnit(): Promise<number> {
        this.adminAccessToken = await this.createAccessToken(
            loginData.adminEmail || '',
            loginData.adminPassword || '',
            loginData.adminPhone || ''
        );
        const response = await (await this.apiContext).delete(`units/${this.createdUnitId}/`, {
            headers: { 'Authorization': `Bearer ${this.adminAccessToken}` }
        });
        return response.status();
    }
}

export default CreateUnitApiHelper;