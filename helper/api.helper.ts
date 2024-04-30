import { request, APIRequestContext } from '@playwright/test';

const loginData = {
    adminEmail: String(process.env.ADMIN_EMAIL),
    adminPassword: String(process.env.ADMIN_PASSWORD),
    adminPhone: String(process.env.ADMIN_PHONE_NUMBER),
    userEmail: String(process.env.USER_EMAIL),
    userPassword: String(process.env.USER_PASSWORD),
    userPhone: String(process.env.USER_PHONE_NUMBER)
}

class ApiHelper {
    protected baseURL: string;
    protected apiContext: Promise<APIRequestContext>;

    protected userAccessToken: string;
    protected adminAccessToken: string;

    constructor() {
        this.baseURL = 'https://stage.rentzila.com.ua/api/';
        this.apiContext = request.newContext({
            baseURL: this.baseURL
        });
    }

    public async createAccessToken(role: "user" | "admin"): Promise<string> {
        let email: string;
        let password: string;
        let phone: string;

        if (role === "user") {
            email = loginData.userEmail;
            password = loginData.userPassword;
            phone = loginData.userPhone;
        } else if (role === "admin") {
            email = loginData.adminEmail;
            password = loginData.adminPassword;
            phone = loginData.adminPhone;
        } else {
            throw new Error("Invalid role provided");
        }

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

    public async getUserId(): Promise<number> {
        if (!this.userAccessToken) {
            this.userAccessToken = await this.createAccessToken("user");
        }
        const jsonResponse = await (await (await this.apiContext).get('auth/users/me/', {
            headers: { 'Authorization': `Bearer ${this.userAccessToken}` }
        })).json();
        return jsonResponse.id;
    }

    public async getData(name: 'services' | 'manufacturers' | 'category') {
        let endpoint: string;
        switch (name) {
            case 'services':
                endpoint = 'services/';
                break;
            case 'manufacturers':
                endpoint = 'manufacturers/';
                break;
            case 'category':
                endpoint = 'category/';
                break;
            default:
                throw new Error('Invalid name parameter');
        }
        const response = await (await this.apiContext).get(endpoint);
        return await response.json();
    }

    async getFirstLvlCategoryById(categoryId: number) {
        if (!this.adminAccessToken) {
            this.adminAccessToken = await this.createAccessToken("admin");
        }
        while (true) {
            const response = await (await this.apiContext).get(`crm/categories/${categoryId}/`, {
                headers: { 'Authorization': `Bearer ${this.adminAccessToken}` }
            });
            if (response.status() !== 200) {
                throw new Error(`Failed to fetch category ${categoryId}`);
            }
            const responseJson = await response.json();
            if (!responseJson.parent) {
                return responseJson.name;
            }
            categoryId = responseJson.parent;
        }
    }
}

export default ApiHelper;