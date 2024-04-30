import { test, expect } from '../fixtures/fixture';
import * as endpoints from '../data/endpoints.data.json';
import * as favouriteUnitsData from '../data/myFavouriteUnitsData/data.json';
import * as myAdvertismentsData from '../data/myAdvertismentsData/data.json';

const userLoginData = {
    email: String(process.env.USER_EMAIL),
    password: String(process.env.USER_PASSWORD)
};

async function createUnits(unitApiHelper: any, unitsCount: number) {
    let units: Array<any> = [];
    for (let index = 0; index < unitsCount; index++) {
        let response = await unitApiHelper.createUnit();
        expect(response.status()).toBe(201);
        units.push(await response.json());
        response = await unitApiHelper.addUnitImage(units[index].id);
        expect(response.status()).toBe(201);
        response = await unitApiHelper.approveUnit(units[index].id);
        expect(response.status()).toBe(200);
    }
    return units;
}
async function createUnitsAndAddToFavourites(unitApiHelper: any, unitsCount: number) {
    const unitsData = await createUnits(unitApiHelper, unitsCount);
    for (const unit of unitsData) {
        let response = await unitApiHelper.addUnitToFavourites(unit.id);
        expect(response.status()).toBe(201);
    }
    return unitsData;
}
async function setupFavoritesPage(myTenders: any, loginPopUp: any, telegramPopUp: any) {
    await myTenders.openUrl(endpoints.myFavouriteUnits);
    await loginPopUp.login(userLoginData.email, userLoginData.password);
    await telegramPopUp.closeTelegramPopUp();
}

async function checkUnitIsNotFavorited(myFavouriteUnitsPage: any, navBar: any, unitsPage: any, unitsData: any) {
    await myFavouriteUnitsPage.clickEmptyBlockBtn();
    for (const unit of unitsData) {
        await navBar.fillSearchInput(unit.name);
        await expect(unitsPage.getFavouriteImg()).not.toHaveCSS('fill', favouriteUnitsData.heartColor);
    }
}

async function testClearFavouriteUnitsPopup(myFavouriteUnitsPage: any, unitsCount: number, action: 'close' | 'cancel' | 'accept') {
    await myFavouriteUnitsPage.clickClearFavouriteUnitsBtn();
    await expect(myFavouriteUnitsPage.getClearFavouriteUnitsPopup()).toBeVisible();
    await expect(myFavouriteUnitsPage.getClearFavouriteUnitsPopupTitle()).toHaveText(favouriteUnitsData.clearFavouriteUnitsPopUpTitle);
    await myFavouriteUnitsPage.clickClearFavouriteUnitsPopupBtn(action);

    if (action === 'accept') {
        await verifyNonFoundUnits(myFavouriteUnitsPage, 'empty');
    } else {
        await expect(myFavouriteUnitsPage.getClearFavouriteUnitsPopup()).toHaveCount(0);
        await expect(myFavouriteUnitsPage.getUnitCards()).toHaveCount(unitsCount);
    }
}

async function verifyNonFoundUnits(myFavouriteUnitsPage: any, by: 'name' | 'category' | 'empty', name?: string) {
    let msg = (by === 'empty') ? favouriteUnitsData.nonFoundUnitsMg.empty :
        (by === 'category') ? favouriteUnitsData.nonFoundUnitsMg.inCategory :
            favouriteUnitsData.nonFoundUnitsMg.byName;

    if (name) {
        msg = msg.replace("{name}", name);
    }
    await expect(myFavouriteUnitsPage.getEmptyBlockTitle()).toHaveText(msg);
    if (by === 'empty') {
        await expect(myFavouriteUnitsPage.getEmptyBlockBtn()).toBeVisible();
    } else {
        await expect(myFavouriteUnitsPage.getClearFiltersBtn()).toBeVisible();
    }
}

async function searchAndVerifyValidUnit(myFavouriteUnitsPage: any, unitName: string) {
    await myFavouriteUnitsPage.searchUnit(unitName);
    await expect(myFavouriteUnitsPage.getUnitCards()).toHaveCount(1);
    await expect(myFavouriteUnitsPage.getUnitCardNames()).toHaveText(unitName);
}

let unitsData: Array<any>;

test.describe("Favourite units functionality check", async () => {
    test("Verify the 'Обрані оголошення' page without 'Обрані' units", async ({ page, baseURL, myTenders, loginPopUp, telegramPopUp, myFavouriteUnitsPage, navBar }) => {
        await setupFavoritesPage(myTenders, loginPopUp, telegramPopUp);

        await verifyNonFoundUnits(myFavouriteUnitsPage, 'empty');
        await myFavouriteUnitsPage.clickEmptyBlockBtn();
        expect(page).toHaveURL(`${baseURL}${endpoints.units}`);
        await expect(navBar.getAdvertismentsLink()).toHaveClass(/active/);
    })

    test("Verify 'Обрані' icon functionality", async ({ unitApiHelper, myTenders, navBar, loginPopUp, telegramPopUp, unitsPage, myProfileSideMenu, myAdvertisments, myFavouriteUnitsPage }) => {
        const unitsCount = 1;
        unitsData = await createUnits(unitApiHelper, unitsCount);

        await myTenders.openUrl(endpoints.units);
        await navBar.clickLoginBtn();
        await loginPopUp.login(userLoginData.email, userLoginData.password);

        await navBar.fillSearchInput(unitsData[0].name);
        await unitsPage.clickFavouriteUnitBtn();
        await expect(unitsPage.getFavouriteImg()).toHaveCSS('fill', favouriteUnitsData.heartColor);

        await navBar.clickAvatarIcon();
        await navBar.clickProfileDropdownItem('advertisments');
        await expect(myAdvertisments.getTitle()).toHaveText(myAdvertismentsData.title);
        await telegramPopUp.closeTelegramPopUp();
        await myProfileSideMenu.clickSelectedAdvertismentsItem();
        await expect(myFavouriteUnitsPage.getTitle()).toHaveText(favouriteUnitsData.title);

        await searchAndVerifyValidUnit(myFavouriteUnitsPage, unitsData[0].name);

        await myFavouriteUnitsPage.clickFavouriteUnitBtn();
        await verifyNonFoundUnits(myFavouriteUnitsPage, 'empty');
        await checkUnitIsNotFavorited(myFavouriteUnitsPage, navBar, unitsPage, unitsData);
    })

    test('Check "Пошук по назві" search field functionality', async ({ unitApiHelper, myTenders, loginPopUp, telegramPopUp, myFavouriteUnitsPage }) => {
        function getFilteredUnitNames(unitsData: any[], searchUnitValue?: string) {
            return searchUnitValue ?
                unitsData.filter(unit => unit.name.includes(searchUnitValue)).map(unit => unit.name).reverse() :
                unitsData.map(unit => unit.name).reverse();
        }

        async function searchAndVerifyResults(searchValue: string) {
            await myFavouriteUnitsPage.searchUnit(searchValue);
            let foundUnitsNames = getFilteredUnitNames(unitsData, searchValue);
            if (foundUnitsNames.length > 0) {
                await expect(myFavouriteUnitsPage.getUnitCardNames()).toHaveText(foundUnitsNames);
            } else {
                await verifyNonFoundUnits(myFavouriteUnitsPage, 'name', searchValue);
            }
        }

        const unitsCount = 3;
        unitsData = await createUnitsAndAddToFavourites(unitApiHelper, unitsCount);
        await setupFavoritesPage(myTenders, loginPopUp, telegramPopUp);

        const allUnitsNames = getFilteredUnitNames(unitsData);
        await myFavouriteUnitsPage.searchUnit(favouriteUnitsData.searchUnitValue.empty, 'enter');
        await expect(myFavouriteUnitsPage.getUnitCardNames()).toHaveText(allUnitsNames);

        for (const searchValue of favouriteUnitsData.searchUnitValue.spaces) {
            await myFavouriteUnitsPage.searchUnit(searchValue);
            await expect(myFavouriteUnitsPage.getSearchInput()).toHaveValue(searchValue);
        }

        await myFavouriteUnitsPage.clickClearFiltersBtn();
        await expect(myFavouriteUnitsPage.getUnitCardNames()).toHaveText(allUnitsNames);

        await searchAndVerifyResults(favouriteUnitsData.searchUnitValue.number);

        for (const searchValue of favouriteUnitsData.searchUnitValue.restrictedSymbols) {
            await myFavouriteUnitsPage.searchUnit(searchValue);
            await expect(myFavouriteUnitsPage.getSearchInput()).toHaveValue('');
        }

        for (const symbol of favouriteUnitsData.searchUnitValue.allowedSymbols) {
            await searchAndVerifyResults(symbol);
        }

        await myFavouriteUnitsPage.searchUnit(favouriteUnitsData.searchUnitValue.nonExistingName);
        await verifyNonFoundUnits(myFavouriteUnitsPage, 'name', favouriteUnitsData.searchUnitValue.nonExistingName);

        const firstUnitName = unitsData[unitsData.length - 1].name;
        await searchAndVerifyValidUnit(myFavouriteUnitsPage, firstUnitName);
    })

    test('Check "Всі категорії" dropdown menu functionality', async ({ unitApiHelper, apiHelper, myTenders, loginPopUp, telegramPopUp, myFavouriteUnitsPage }) => {
        const unitsCount = 4;
        unitsData = await createUnitsAndAddToFavourites(unitApiHelper, unitsCount);
        // Get first level categories of the created units
        const firstLvlCategories: string[] = [];
        for (const unit of unitsData) {
            firstLvlCategories.push(await apiHelper.getFirstLvlCategoryById(unit.category.id));
        }

        await setupFavoritesPage(myTenders, loginPopUp, telegramPopUp);

        await expect(myFavouriteUnitsPage.getCategoriesDropdownSelectedItem()).toHaveText(favouriteUnitsData.filterOptions.all);
        await expect(myFavouriteUnitsPage.getUnitCards()).toHaveCount(unitsCount);
        for (const option of favouriteUnitsData.filterOptions.otherCategories) {
            await myFavouriteUnitsPage.filterByCategory(option);
            if (firstLvlCategories.includes(option)) {
                const unitsNameWithSelectedCategory = unitsData.filter((unit, index) => firstLvlCategories[index] === option).map(unit => unit.name).reverse();
                await expect(myFavouriteUnitsPage.getUnitCardNames()).toHaveText(unitsNameWithSelectedCategory);
            }
            else {
                await verifyNonFoundUnits(myFavouriteUnitsPage, 'category', option);
            }
        }
    })

    test('Check "По даті створення" dropdown menu functionality', async ({ unitApiHelper, myTenders, loginPopUp, telegramPopUp, myFavouriteUnitsPage }) => {
        const unitsCount = 4;
        unitsData = await createUnitsAndAddToFavourites(unitApiHelper, unitsCount);
        await setupFavoritesPage(myTenders, loginPopUp, telegramPopUp);

        const sortedUnitsByDate = unitsData.map(unit => unit.name).reverse();
        const sortedUnitsByName = (unitsData.map(unit => unit.name)).sort();

        await expect(myFavouriteUnitsPage.getSortDropdownSelectedItem()).toHaveText(favouriteUnitsData.sortOptions.byDate);
        await expect(myFavouriteUnitsPage.getUnitCardNames()).toHaveText(sortedUnitsByDate);
        await myFavouriteUnitsPage.sort(favouriteUnitsData.sortOptions.byName);
        await expect(myFavouriteUnitsPage.getUnitCardNames()).toHaveText(sortedUnitsByName);
    })

    test('Check "Очистити список" button functionality', async ({ unitApiHelper, myTenders, loginPopUp, telegramPopUp, myFavouriteUnitsPage, navBar, unitsPage }) => {
        const unitsCount = 2;
        unitsData = await createUnitsAndAddToFavourites(unitApiHelper, unitsCount);
        await setupFavoritesPage(myTenders, loginPopUp, telegramPopUp);

        await testClearFavouriteUnitsPopup(myFavouriteUnitsPage, unitsCount, 'cancel');
        await testClearFavouriteUnitsPopup(myFavouriteUnitsPage, unitsCount, 'close');
        await testClearFavouriteUnitsPopup(myFavouriteUnitsPage, unitsCount, 'accept');

        await checkUnitIsNotFavorited(myFavouriteUnitsPage, navBar, unitsPage, unitsData);
    })

    test('Check the pagination on the "Обрані оголошення" page', async ({ unitApiHelper, myTenders, loginPopUp, telegramPopUp, myFavouriteUnitsPage }) => {
        async function clickPaginationArrowAndVerify(arrow: 'previous' | 'next', clickArrow: boolean, isArrowDisabled: boolean, destinationPageNumber: number) {
            if (clickArrow) {
                await myFavouriteUnitsPage.clickPaginationArrow(arrow);
            }
            if (isArrowDisabled) {
                await expect(myFavouriteUnitsPage.getPaginationArrow(arrow)).toBeDisabled();
            }
            await expect(myFavouriteUnitsPage.getPageNumber(destinationPageNumber)).toHaveAttribute('aria-current', 'page');
        }

        const unitsCount = 12;
        unitsData = await createUnitsAndAddToFavourites(unitApiHelper, unitsCount);
        await setupFavoritesPage(myTenders, loginPopUp, telegramPopUp);

        await expect(myFavouriteUnitsPage.getPagination()).toBeVisible();
        await clickPaginationArrowAndVerify('previous', false, true, 1);
        await clickPaginationArrowAndVerify('next', true, false, 2);
        await clickPaginationArrowAndVerify('next', true, true, 3);
        await clickPaginationArrowAndVerify('previous', true, false, 2);
        await clickPaginationArrowAndVerify('previous', true, true, 1);
    })

    test.afterEach(async ({ unitApiHelper }) => {
        if (unitsData) {
            for (let index = 0; index < unitsData.length; index++) {
                let response = await unitApiHelper.getUnit(unitsData[index].id);
                if (response.status() === 200) {
                    response = await unitApiHelper.deleteUnit(unitsData[index].id);
                    expect(response.status()).toBe(204);
                }
            }
        }
    })
})



