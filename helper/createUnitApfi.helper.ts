
// import { request } from '@playwright/test';

// const baseURL: string = "https://stage.rentzila.com.ua/api/";
// let userAccessToken: string;
// let adminAccessToken: string;
// let createdUnitId: number;

// export interface Unit {
//     name: string;
//     model_name: string;
//     description: string;
//     features: string;
//     type_of_work: string;
//     time_of_work: string;
//     phone: string;
//     minimal_price: number;
//     money_value: string;
//     payment_method: string;
//     lat: number;
//     lng: number;
//     manufacturer: number;
//     owner: number;
//     category: number;
//     services: number[];
// }

// async function createAccessToken(email: string, password: string, phone: string) {
//     const apiContext = await request.newContext({
//         baseURL: baseURL
//     })
//     const response = await (await apiContext.post('auth/jwt/create/', {
//         data: {
//             email: email,
//             password: password,
//             phone: phone
//         }
//     })).json();
//     return response.access;
// }

// export async function createUnit(unitParams: Unit) {
//     userAccessToken = await createAccessToken(process.env.USER_EMAIL || '', process.env.USER_PASSWORD || '', process.env.USER_PHONE_NUMBER || '');
//     const apiContext = await request.newContext({
//         baseURL: baseURL,
//         extraHTTPHeaders: { 'Authorization': `Bearer ${userAccessToken}` },
//     });
//     const response = await apiContext.post('units/', {
//         data: unitParams
//     });
//     createdUnitId = (await response.json()).id;
//     return response.status();
// }

// export async function deleteUnit() {
//     adminAccessToken = await createAccessToken(process.env.ADMIN_EMAIL || '', process.env.ADMIN_PASSWORD || '', process.env.ADMIN_PHONE_NUMBER || '');
//     const apiContext = await request.newContext({
//         baseURL: baseURL,
//         extraHTTPHeaders: { 'Authorization': `Bearer ${adminAccessToken}`},
//     });
//     const response = await apiContext.delete(`units/${createdUnitId}/`);
//     return response.status();
// }

// import { APIRequestContext } from "@playwright/test";

// let accessToken: any = null;
// let feedbackList: any;

// const data: any = {
//     email: process.env.ADMIN_EMAIL,
//     password: process.env.ADMIN_PASSWORD,
// };

// class APIhelper {
//   constructor(private request: APIRequestContext) {
//     this.request = request;
//   }
//   async createAccessToken() {
//     if (accessToken === null) {
//       await this.request
//         .post(`https://stage.rentzila.com.ua/api/auth/jwt/create/`, {
//           data: {
//             email: data.email,
//             password: data.password,
//           },
//         })
//         .then(async (response) => {
//           const responseBody = await response.json();
//           accessToken = responseBody.access;
//         });
//     }
//     return accessToken;
//   }

//   async getFeedbackList() {
//     const userAccessToken = await this.createAccessToken();
//     await this.request
//       .get(`https://stage.rentzila.com.ua/api/backcall/`, {
//         headers: {
//           Authorization: `Bearer ${userAccessToken}`,
//         },
//       })
//       .then(async (response) => {
//         feedbackList = await response.json();
//       });
//     return feedbackList;
//   }

//   async checkResponseResults(name: string, phone: string): Promise<boolean> {
//     const response = await this.getFeedbackList();
//     for (const feedback of response) {
//       if (feedback.name === name && feedback.phone === phone) {
//         return true;
//       }
//     }
//     return false;
//   }

//   async getFeedbackId(name: string, phone: string): Promise<number | null> {
//     const response = await this.getFeedbackList();
//     let id: number | null = null;
//     for (const feedback of response) {
//       if (feedback.name === name && feedback.phone === phone) {
//         id = feedback.id;
//         // console.log(feedback.name + ", " + feedback.created_date)
//         return id;
//       }
//     }
//     return id;
//   }

//   async deleteFeedback(name: string, phone: string) {
//     const id = await this.getFeedbackId(name, phone);
//     const userAccessToken = await this.createAccessToken();
//     await this.request.delete(
//       `https://stage.rentzila.com.ua/api/backcall/${id}/`,
//       {
//         headers: {
//           Authorization: `Bearer ${userAccessToken}`,
//         },
//       }
//     );
//   }
// }

// export default APIhelper;