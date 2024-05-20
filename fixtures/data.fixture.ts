import { test as base } from '@playwright/test';
import { servicesData } from '../data/sectionsData/servicesData.json';
import { vehiclesData } from '../data/sectionsData/vehiclesData.json';
import * as loginFormData from '../data/loginData/loginFormData.json';
import * as myProfileData from '../data/myProfileData/data.json';
import { menuItems } from '../data/catalogData/catalogMenuItems.json';
import * as endpoints from '../data/endpoints.data.json';
import * as notificationMsgs from '../data/notificationPopUp.data.json';
import * as createTenderData from '../data/createTenderData/data.json';
import * as editTenderData from '../data/editTenderData/data.json';
import * as feedbackData from '../data/feedbackData/data.json';
import * as unitsData from '../data/myAdvertismentsData/data.json';
import * as unitProposalData from '../data/unitProposalData/data.json';
import * as searchData from '../data/searchData.json';

export type testData = {
    servicesData: typeof servicesData
    vehiclesData: typeof vehiclesData
    loginFormData: typeof loginFormData
    myProfileData: typeof myProfileData
    menuItems: typeof menuItems
    endpointsData: typeof endpoints
    notificationMsgs: typeof notificationMsgs
    createTenderData: typeof createTenderData
    editTenderData: typeof editTenderData
    feedbackData: typeof feedbackData
    unitsData: typeof unitsData
    unitProposalData: typeof unitProposalData
    searchData: typeof searchData
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
    menuItems: async ({ }, use) => {
        await use(menuItems);
    },
    endpointsData: async ({ }, use) => {
        await use(endpoints);
    },
    notificationMsgs: async ({ }, use) => {
        await use(notificationMsgs);
    },
    createTenderData: async ({ }, use) => {
        await use(createTenderData);
    },
    editTenderData: async ({ }, use) => {
        await use(editTenderData);
    }, 
    feedbackData: async ({ }, use) => {
        await use(feedbackData);
    },
    unitsData: async ({ }, use) => {
        await use(unitsData);
    },
    unitProposalData: async({ }, use) => {
        await use(unitProposalData);
    },
    searchData: async({ }, use) => {
        await use(searchData);
    }
})

export const test = testData;