import ApiHelper from './api.helper';
import DataGenerator from './dataGenerator.helper';
import fs from "fs";
import path from "path";

export interface Tender {
    name: string;
    description: string;
    lat: number;
    lng: number;
    start_price: number;
    type_of_work: string;
    start_propose_date: string;
    end_propose_date: string;
    start_tender_date: string;
    end_tender_date: string;
    customer: number;
    category: number;
    services: number[],
    currency: string,
    time_of_work: string
}

class TenderApiHelper extends ApiHelper {
    constructor() {
        super();
    }

    public async getTender(tenderId: number) {
        const response = await (await this.apiContext).get(`tender/${tenderId}/`);
        return response;
    }

    public async getTenderIdByName(tenderName: string) {
        const response = await (await this.apiContext).get(`tenders/`);
        if (response.status() !== 200) {
            throw new Error(`Failed to get all tenders`);
        }
        const tenderId = (await response.json()).tenders.find(tender => tender.name === tenderName).id;
        return tenderId;
    }

    private async generateTenderData(): Promise<Tender> {
        const dataGenerator = new DataGenerator();
        const coordinates = dataGenerator.generateCoordinates();
        const proposeDates = dataGenerator.generateProposeDates();
        const service = dataGenerator.getRandomServiceAndCategory(await super.getData('services'));
        return {
            name: "Test tender " + dataGenerator.generateRandomUUID(),
            description: dataGenerator.generateRandomText(40, 90),
            lat: coordinates[0],
            lng: coordinates[1],
            start_price: dataGenerator.generateMinimalPrice(),
            type_of_work: dataGenerator.generateTypeOfWork("tender"),
            start_propose_date: proposeDates[0],
            end_propose_date: proposeDates[1],
            start_tender_date: proposeDates[2],
            end_tender_date: proposeDates[3],
            customer: await super.getUserId(),
            category: service.category,
            services: service.service,
            currency: "UAH",
            time_of_work: dataGenerator.generateTimeOfWork()
        };
    }

    public async createTender() {
        if (!this.userAccessToken) {
            super.userAccessToken = await super.createAccessToken("user");
        }
        const response = await (await this.apiContext).post('tenders/', {
            data: await this.generateTenderData(),
            headers: { 'Authorization': `Bearer ${this.userAccessToken}` }
        });
        if (response.status() !== 201) {
            throw new Error(`Failed to create tender, status: ${response.status()}`);
        }
        return await response.json();
    }

    public async addTenderAttachment(tenderId: number) {
        if (!this.userAccessToken) {
            super.userAccessToken = await super.createAccessToken("user");
        }
        const fileName = 'validFile.pdf';
        const stream = fs.createReadStream(path.resolve('data', 'tenderData', fileName));
        const response = await (await this.apiContext).post('tender/attachment-file/', {
            headers: { 'Authorization': `Bearer ${this.userAccessToken}` },
            multipart: {
                name: fileName,
                tender: tenderId,
                attachment_file: stream
            }
        });
        if (response.status() !== 201) {
            throw new Error(`Failed to add attachment to tender, status: ${response.status()}`);
        }
        return response;
    }

    public async moderateTender(tenderId: number, status: "approved" | "declined") {
        if (!this.adminAccessToken) {
            super.adminAccessToken = await super.createAccessToken("admin");
        }
        const response = await (await this.apiContext).post(`crm/tenders/${tenderId}/moderate/?status=${status}`, {
            headers: { 'Authorization': `Bearer ${this.adminAccessToken}` }
        });
        return response;
    }

    public async closeTender(tenderId: number) {
        if (!this.userAccessToken) {
            super.userAccessToken = await super.createAccessToken("user");
        }
        const response = await (await this.apiContext).patch(`tender/${tenderId}/`, {
            data: {
                is_closed: true
            },
            headers: { 'Authorization': `Bearer ${this.userAccessToken}` }
        });
        return response;
    }

    public async deleteTender(tenderId: number) {
        if (!this.adminAccessToken) {
            super.adminAccessToken = await super.createAccessToken("admin");
        }
        const response = await (await this.apiContext).delete(`crm/tenders/${tenderId}/`, {
            headers: { 'Authorization': `Bearer ${this.adminAccessToken}` }
        });
        if (response.status() !== 204) {
            throw new Error(`Failed to delete the tender`);
        }
    }
}

export default TenderApiHelper;