import { test as base } from '@playwright/test';
import { servicesData } from '../data/sectionsData/servicesData.json';
import { vehiclesData } from '../data/sectionsData/vehiclesData.json';
import * as loginFormData from '../data/loginData/loginFormData.json';
import * as myProfileData from '../data/myProfileData/data.json';
import * as endpoints from '../data/endpoints.data.json';

export type testData = {
    servicesData: typeof servicesData
    vehiclesData: typeof vehiclesData
    loginFormData: typeof loginFormData
    myProfileData: typeof myProfileData
    endpointsData: typeof endpoints
}

const testData = base.extend<testData>({
    servicesData: async ({ }, use) => {
        await use(servicesData);
    },
    vehiclesData: async ({ }, use) => {
        await use(vehiclesData);
    },
    loginFormData: async ({ }, use) => {
        await use(loginFormData);
    },
    myProfileData: async ({ }, use) => {
        await use(myProfileData);
    },
    endpointsData: async({ }, use) => {
        await use(endpoints);
    }
})

export const test = testData;