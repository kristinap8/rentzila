import { mergeTests, expect as testExpect } from '@playwright/test';
import { test as pagesTest, pages } from './pages.fixture';
import { test as helpersTest, helpers } from './helper.fixture';
import { test as dataTest, testData } from './data.fixture';

export const test = mergeTests(pagesTest, helpersTest, dataTest);
export { testExpect as expect };
export { pages };
export { helpers };
export { testData };