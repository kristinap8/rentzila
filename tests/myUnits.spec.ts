import { test, expect, testData } from "../fixtures/fixture";

const userLoginData = {
    email: String(process.env.USER_EMAIL),
    password: String(process.env.USER_PASSWORD)
};
const tabs: ('pending' | 'active' | 'deactivated' | 'declined')[] = ['pending', 'active', 'deactivated', 'declined'];

async function createUnits(unitApiHelper: any, unitsCount: number, action: 'active' | 'deactivated' | 'declined' | 'pending') {
    let units: Array<any> = [];
    for (let index = 0; index < unitsCount; index++) {
        let response = await unitApiHelper.createUnit();
        expect(response.status()).toBe(201);
        units.push(await response.json());
        response = await unitApiHelper.addUnitImage(units[index].id);
        expect(response.status()).toBe(201);
        await performUnitAction(unitApiHelper, units[index].id, action);
    }
    return units;
}

async function performUnitAction(unitApiHelper: any, unitId: number, action: 'active' | 'deactivated' | 'declined' | 'pending') {
    let response: any;
    switch (action) {
        case 'active':
            response = await unitApiHelper.approveUnit(unitId);
            expect(response.status()).toBe(200);
            break;
        case 'deactivated':
            response = await unitApiHelper.deactivateUnit(unitId);
            expect(response.status()).toBe(202);
            break;
        case 'declined':
            response = await unitApiHelper.declineUnit(unitId);
            expect(response.status()).toBe(200);
            break;
        case 'pending':
            break;
        default:
            throw new Error(`Incorrect action: ${action}`);
    }
}

async function verifyNonFoundUnits(unitsData: testData['unitsData'], myUnitsPage: any, by: 'name' | 'category' | 'empty', name?: string) {
    let title: string;
    let desc: string = '';

    if (by === 'empty') {
        title = unitsData.nonFoundUnitsMg.empty.title;
        desc = unitsData.nonFoundUnitsMg.empty.desc;
    } else if (by === 'category') {
        title = unitsData.nonFoundUnitsMg.inCategory.replace("{name}", name || "");
    } else {
        title = unitsData.nonFoundUnitsMg.byName.replace("{name}", name || "");
    }

    await expect(myUnitsPage.getEmptyBlockTitle()).toHaveText(title);
    if (by === 'empty') {
        await expect(myUnitsPage.getEmptyBlockDescription()).toHaveText(desc);
    }
}

test.describe("My units functionality check", async () => {
    test.beforeEach(async ({ myUnitsPage, loginPopUp, telegramPopUp, endpointsData }) => {
        await myUnitsPage.openUrl(endpointsData.myUnits);
        await loginPopUp.login({ emailPhone: userLoginData.email, password: userLoginData.password });
        await telegramPopUp.closeTelegramPopUp();
    })

    test('Check the "Мої оголошення"" page without any created units', async ({ page, baseURL, myUnitsPage, endpointsData, unitsData }) => {
        await verifyNonFoundUnits(unitsData, myUnitsPage, 'empty');

        await myUnitsPage.clickCreateUnitBtn();
        await expect(page).toHaveURL(`${baseURL}${endpointsData.createUnit}`);
    })

    test("Verify the tabs are clickable", async ({ unitApiHelper, dataGenerator, myUnitsPage, unitsData }) => {
        const unitsCount = 1;
        const rndAction = dataGenerator.getRandomElementFromArray(tabs);
        const unitData = await createUnits(unitApiHelper, unitsCount, rndAction);

        await myUnitsPage.refresh();
        for (const tab of tabs) {
            await myUnitsPage.clickTab(tab);
            if (rndAction === tab) {
                await expect(myUnitsPage.getUnitCardNames()).toHaveText(unitData[0].name);
            } else {
                await expect(myUnitsPage.getEmptyBlockTitle()).toHaveText(unitsData.noUnitsMsgByTabs[tab]);
            }
        }

        const response = await unitApiHelper.deleteUnit(unitData[0].id);
        expect(response.status()).toBe(204);
    })

    test("Check filtering by category", async ({ apiHelper, unitApiHelper, myUnitsPage, unitsData }) => {
        const unitsCount = 4;
        for (const tab of tabs) {
            const myUnitsData = await createUnits(unitApiHelper, unitsCount, tab);
            // Get first level categories of the created units
            const firstLvlCategories: string[] = [];
            for (const unit of myUnitsData) {
                firstLvlCategories.push(await apiHelper.getFirstLvlCategoryById(unit.category.id));
            }

            await myUnitsPage.refresh();
            await myUnitsPage.clickTab(tab);

            await expect(myUnitsPage.getCategoriesDropdownSelectedItem()).toHaveText(unitsData['filterOptions']['all']);
            await expect(myUnitsPage.getUnitCardNames()).toHaveCount(unitsCount);
            for (const option of unitsData['filterOptions']['otherCategories']) {
                await myUnitsPage.filterByCategory(option);
                if (firstLvlCategories.includes(option)) {
                    const unitsNameWithSelectedCategory = myUnitsData.filter((unit, index) => firstLvlCategories[index] === option).map(unit => unit.name).reverse();
                    await expect(myUnitsPage.getUnitCardNames()).toHaveText(unitsNameWithSelectedCategory);
                }
                else {
                    await verifyNonFoundUnits(unitsData, myUnitsPage, 'category', option);
                }
            }

            for (const unit of myUnitsData) {
                const response = await unitApiHelper.deleteUnit(unit.id);
                expect(response.status()).toBe(204);
            }
        }
    })

    test("Сheck sorting units", async ({ unitApiHelper, myUnitsPage, unitsData }) => {
        const unitsCount = 2;
        for (const tab of tabs) {
            const unitsData = await createUnits(unitApiHelper, unitsCount, tab);

            await myUnitsPage.refresh();
            await myUnitsPage.clickTab(tab);

            await expect(myUnitsPage.getUnitCardNames()).toHaveCount(unitsCount);

            await myUnitsPage.sort(unitsData['sortOptions']['byDate']);
            const sortedUnitsByDate = unitsData.map(unit => unit.name).reverse();
            await expect(myUnitsPage.getUnitCardNames()).toHaveText(sortedUnitsByDate);

            await myUnitsPage.sort(unitsData['sortOptions']['byName']);
            const sortedUnitsByName = (unitsData.map(unit => unit.name)).sort();
            await expect(myUnitsPage.getUnitCardNames()).toHaveText(sortedUnitsByName);

            for (const unit of unitsData) {
                const response = await unitApiHelper.deleteUnit(unit.id);
                expect(response.status()).toBe(204);
            }
        }
    })

    test('Check "Заголовок оголошення" search field functionality', async ({ unitApiHelper, myUnitsPage, unitsData, helper }) => {
        const unitsCount = 1;
        let myUnitsData: any[] = [];
        for (const tab of tabs) {
            const unitData = await createUnits(unitApiHelper, unitsCount, tab);
            myUnitsData.push(unitData[0]);
        }

        for (let i = 0; i < tabs.length; i++) {
            await myUnitsPage.refresh();
            await myUnitsPage.clickTab(tabs[i]);

            await myUnitsPage.searchUnit(unitsData.searchUnitValue.empty, 'enter');
            await expect(myUnitsPage.getUnitCardNames()).toHaveCount(unitsCount);

            await myUnitsPage.searchUnit(unitsData[i].name, "noClick");
            await expect(myUnitsPage.getUnitCardNames()).toHaveText(unitsData[i].name);

            //BUG: the unit search results should be case sensitive
            // const mixedCaseUnitName = mixCase(unitData[0].name);
            // await myUnitsPage.searchUnit(mixedCaseUnitName, "noClick");
            // await expect(myUnitsPage.getUnitCardNames()).toHaveCount(0);

            const partialUnitName = helper.generatePartialName(unitsData[i].name);
            await myUnitsPage.searchUnit(partialUnitName, "noClick");
            await expect(myUnitsPage.getUnitCardNames()).toHaveText(unitsData[i].name);

            await myUnitsPage.searchUnit(unitsData.searchUnitValue.nonExistingName, "noClick");
            await verifyNonFoundUnits(unitsData, myUnitsPage, "name", unitsData.searchUnitValue.nonExistingName);
            await myUnitsPage.clickClearFiltersBtn();
            await expect(myUnitsPage.getUnitCardNames()).toHaveCount(unitsCount);

            for (const spaces of unitsData.searchUnitValue.spaces) {
                await myUnitsPage.searchUnit(spaces, "noClick");
                await verifyNonFoundUnits(unitsData, myUnitsPage, "name", " ");
            }

            for (const restrictedSymbol of unitsData.searchUnitValue.restrictedSymbols) {
                await expect(myUnitsPage.getSearchInput()).toHaveText('');
            }

            for (const allowedSymbol of unitsData.searchUnitValue.allowedSymbols) {
                await myUnitsPage.searchUnit(allowedSymbol, "noClick");
                await verifyNonFoundUnits(unitsData, myUnitsPage, "name", allowedSymbol);
            }

            await myUnitsPage.searchUnit(unitsData.searchUnitValue.exceeding, "noClick");
            await verifyNonFoundUnits(unitsData, myUnitsPage, "name", unitsData.searchUnitValue.exceeding.slice(0, 50) + "...");

            await myUnitsPage.searchUnit(unitsData.searchUnitValue.multipleWords, "noClick");
            await verifyNonFoundUnits(unitsData, myUnitsPage, "name", unitsData.searchUnitValue.multipleWords);

            const otherTab = tabs.filter(currentTab => currentTab !== tabs[i]).pop()!;
            await myUnitsPage.clickTab(otherTab);
            await myUnitsPage.searchUnit(unitsData[i].name);
            await verifyNonFoundUnits(unitsData, myUnitsPage, "name", unitsData[i].name);
            await myUnitsPage.clickTab(tabs[i]);
            await expect(myUnitsPage.getUnitCardNames()).toHaveText(unitsData[i].name);
        }

        for (const unit of myUnitsData) {
            const response = await unitApiHelper.deleteUnit(unit.id);
            expect(response.status()).toBe(204);
        }
    })
})