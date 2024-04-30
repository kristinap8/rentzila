import { test as base } from '@playwright/test';
import { servicesData } from '../data/sectionsData/servicesData.json';
import { vehiclesData } from '../data/sectionsData/vehiclesData.json';
import * as endpoints from '../data/endpoints.data.json';

export type testData = {
    servicesData: typeof servicesData,
    vehiclesData: typeof vehiclesData
    endpointsData: typeof endpoints
}

const testData = base.extend<testData>({
    servicesData: async ({ }, use) => {
        await use(servicesData);
    },
    vehiclesData: async ({ }, use) => {
        await use(vehiclesData);
    },
    endpointsData: async({ }, use) => {
        await use(endpoints);
    }
})

export const test = testData;