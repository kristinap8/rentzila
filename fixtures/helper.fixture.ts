import { test as base } from '@playwright/test';
import Helper from '../helper/helper';
import ApiHelper from '../helper/api.helper';
import UnitApiHelper from '../helper/unitApi.helper';
import UserApiHelper from '../helper/userApi.helper';
import DataGenerator from '../helper/dataGenerator.helper';
import TenderApiHelper from '../helper/tenderApi.helper';
import FeedbackApiHelper from '../helper/feedbackApi.helper';

export type helpers = {
    helper: Helper
    apiHelper: ApiHelper
    unitApiHelper: UnitApiHelper
    userApiHelper: UserApiHelper
    tenderApiHelper: TenderApiHelper
    dataGenerator: DataGenerator
    feedbackApiHelper: FeedbackApiHelper
}

const testHelpers = base.extend<helpers>({
    helper: async({}, use) => {
        await use(new Helper());
    },
    apiHelper: async({}, use) => {
        await use(new ApiHelper());
    },
    unitApiHelper: async ({ }, use) => {
        await use(new UnitApiHelper());
    },
    tenderApiHelper: async ({ }, use) => {
        await use(new TenderApiHelper());
    },
    userApiHelper: async ({ }, use) => {
        await use(new UserApiHelper());
    },
    dataGenerator: async ({ }, use) => {
        await use(new DataGenerator());
    },
    feedbackApiHelper: async ({ }, use) => {
        await use(new FeedbackApiHelper());
    }
})

export const test = testHelpers;