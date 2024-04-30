import { APIRequestContext, request } from '@playwright/test';

class UserApiHelper {
    private baseURL: string;
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

    public async getLoggedInUserInfo(email: string, password: string, phone: string) {
        const accessToken = await this.createAccessToken(email, password, phone);
        const jsonResponse = await (await (await this.apiContext).get('auth/users/me/', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })).json();
        return jsonResponse;
    }
}

export default UserApiHelper;