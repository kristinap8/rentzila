import { APIRequestContext, request } from '@playwright/test';

export interface feedback {
    id: number,
    name: string,
    phone: string,
    created_date: string,
    closed_date: string | null,
    is_closed: boolean
}

const loginData = {
    adminEmail: String(process.env.ADMIN_EMAIL),
    adminPassword: String(process.env.ADMIN_PASSWORD),
    adminPhone: String(process.env.ADMIN_PHONE_NUMBER)
}

class FeedbackApiHelper {
    private baseURL: string;
    private accessToken: string;
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

    public async getCreatedFeedback(name: string, phone: string) {
        this.accessToken = await this.createAccessToken(loginData.adminEmail, loginData.adminPassword, loginData.adminPhone)
        const jsonResponse = await (await (await this.apiContext).get('backcall/', {
            params: {
                'name': name,
                'phone': phone,
            },
            headers: { 'Authorization': `Bearer ${this.accessToken}` }

        })).json();
        this.sortFeedbackByCreatedDate(jsonResponse);
        return jsonResponse.at(-1);
    }

    private sortFeedbackByCreatedDate(feedbackArray: feedback[]) {
        feedbackArray.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime());
    }

    public async deleteCreatedFeedback(id: number) {
        const response = await (await this.apiContext).delete(`backcall/${id}/`, {
            headers: { 'Authorization': `Bearer ${this.accessToken}` }
        });
        return response.status();
    }
}

export default FeedbackApiHelper;