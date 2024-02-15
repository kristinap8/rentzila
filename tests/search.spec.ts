import { test, expect } from '@playwright/test';
import { NavBar } from '../pages/components/navbar';
import { ProductsPage } from '../pages/products.page';
import { UnitDetailsPage } from '../pages/unitDetails.page';
import searchData from '../fixtures/searchData.json';

let navBar: NavBar;
let productsPage: ProductsPage;
let unitDetailsPage: UnitDetailsPage;

test.describe('Search check', () => {
    test.beforeEach(async ({ page }) => {
        navBar = new NavBar(page);
        productsPage = new ProductsPage(page);
        unitDetailsPage = new UnitDetailsPage(page);

        await navBar.openUrl();
    });

    test("C530 - Verify search input", async () => {
        await navBar.clickSearchInput();

        await expect(await navBar.getSearchDropdown()).toBeVisible();
        await expect(await navBar.getSearchHistoryPopup()).toBeVisible();
        await expect(await navBar.getSearchDropdownServices()).toHaveText(searchData.searchDropdownServices);
        await expect(await navBar.getSearchDropdownCategories()).toHaveText(searchData.searchDropdownCategories);

        await navBar.pressEnter();
        await expect(productsPage.page).toHaveURL(/products/);
        await expect(await navBar.getAdvertismentsSearchInput()).toBeEmpty();
        for (const unitCard of await productsPage.getUnitCards()) {
            await expect(unitCard).toBeVisible();
        }

        for (const searchPhrase of searchData.searchPhrases1) {
            await navBar.clickLogo();
            await navBar.searchItem(searchPhrase);
            await expect(productsPage.page).toHaveURL(/products/);
            await expect(await productsPage.getResultCountMsg()).toContainText(searchPhrase);
            for (const unitCard of await productsPage.getUnitCards()) {
                await expect(unitCard).toBeVisible();
            }

            await productsPage.clickFirstUnitCard();
            await expect(unitDetailsPage.page).toHaveURL(/unit/);

            await navBar.clickLogo();
            await navBar.clickSearchInput();
            await expect(await navBar.getSearchDropdown()).toBeVisible();
            await expect(await navBar.getLastSearchHistoryElement()).toHaveText(searchPhrase);
        }

        await navBar.fillSearchInput(searchData.searchPhrase2);
        let searchResults = await navBar.getSearchResults();
        for (const searchResult of searchResults) {
            await expect(searchResult).toContainText(searchData.searchPhrase2);
        }
        await navBar.clickFirstSearchResult();
        await expect(unitDetailsPage.page).toHaveURL(/unit/);
        await expect(await unitDetailsPage.getUnitName()).toContainText(searchData.searchPhrase2);

        await navBar.clickLogo();
        await navBar.fillSearchInput(searchData.emptySearchPhrase);
        expect(await navBar.getSearchResults()).toHaveLength(0);
        await expect(await navBar.getSearchDropdownServices()).toHaveCount(0);
        await expect(await navBar.getSearchDropdownCategories()).toHaveCount(0);
        await expect(await navBar.getSearchHistoryElements()).toHaveText([searchData.emptySearchPhrase, searchData.searchPhrase2, searchData.searchPhrases1[1]]);

        await navBar.pressEnter();
        await expect(productsPage.page).toHaveURL(/products/);
        await expect(await productsPage.getResultCountMsg()).toHaveText('Знайдено 0 оголошень на видимій території за запитом " "');

        await navBar.clickLogo();
        await navBar.fillSearchInput(searchData.numberSearchPhrase);
        searchResults = await navBar.getSearchResults();
        for (const searchResult of searchResults) {
            await expect(searchResult).toContainText(searchData.numberSearchPhrase);
        }
        await navBar.pressEnter();
        await expect(await productsPage.getResultCountMsg()).toHaveText(new RegExp(`^Знайдено \\d+ (оголошень|оголошення)  на видимій території за запитом "${searchData.numberSearchPhrase}"$`));

        await productsPage.clickFirstUnitCard();
        await expect(unitDetailsPage.page).toHaveURL(/unit/);

        for (const symbol of searchData.specificSymbols) {
            await navBar.clickLogo();
            await navBar.fillSearchInput(symbol);
            await expect(await navBar.getAdvertismentsSearchInput()).toHaveValue(symbol);
            await expect(await navBar.getSearchDropdown()).toBeVisible();
            searchResults = await navBar.getSearchResults();
            for (const searchResult of searchResults) {
                await expect(searchResult).toContainText(symbol);
            }

            await navBar.pressEnter();
            await expect(productsPage.page).toHaveURL(/products/);
            await expect(await productsPage.getResultCountMsg()).toHaveText(new RegExp(`^Знайдено \\d+ (оголошень|оголошення)  на видимій території за запитом "\\${symbol}"$`));
        }

        for (const symbol of searchData.bannedSpecificSymbols) {
            await navBar.clickLogo();
            await navBar.fillSearchInput(symbol);

            await navBar.pressEnter();
            await expect(productsPage.page).toHaveURL(/products/);
            await expect(await navBar.getAdvertismentsSearchInput()).toBeEmpty();
            for (const unitCard of await productsPage.getUnitCards()) {
                await expect(unitCard).toBeVisible();
            }
        }

        await navBar.clickLogo();
        await navBar.fillSearchInput(searchData.nonExistingSearchPhrase);
        await expect(await navBar.getSearchResults()).toHaveLength(0);

        await navBar.pressEnter();
        await expect(productsPage.page).toHaveURL(/products/);
        await expect(await navBar.getAdvertismentsSearchInput()).toHaveValue(searchData.nonExistingSearchPhrase);
        await expect(await productsPage.getResultCountMsg()).toHaveText(new RegExp(`^Знайдено 0 оголошень  на видимій території за запитом "${searchData.nonExistingSearchPhrase}"$`));

        await navBar.clickLogo();
        await navBar.fillSearchInput(searchData.existingServiceSearchPhrase);
        await expect(await navBar.getSearchDropdownServices()).toContainText([searchData.existingServiceSearchPhrase]);

        await navBar.clickServiceSearchDropdown(searchData.existingServiceSearchPhrase);
        await expect(productsPage.page).toHaveURL(/products/);
        await expect(await productsPage.getSelectedFilter()).toHaveText(searchData.existingServiceSearchPhrase);
        await expect(await productsPage.getResultCountMsg()).toHaveText(new RegExp(`^Знайдено \\d+ (оголошень|оголошення)  на видимій території $`));

        await navBar.clickLogo();
        await navBar.fillSearchInput(searchData.existingVehicleSearchPhrase);
        await expect(await navBar.getSearchDropdown()).toBeVisible();
        await expect(await navBar.getSearchDropdownCategories()).toContainText([searchData.existingVehicleSearchPhrase], { ignoreCase: true });

        await navBar.clickCategorySearchDropdown(searchData.existingVehicleSearchPhrase);
        await expect(productsPage.page).toHaveURL(/products/);
        await expect(await productsPage.getSelectedFilter()).toContainText(searchData.existingVehicleSearchPhrase, { ignoreCase: true });
        await expect(await productsPage.getResultCountMsg()).toHaveText(new RegExp(`^Знайдено \\d+ (оголошень|оголошення)  на видимій території $`));

        await navBar.clickLogo();
        await navBar.fillSearchInput(searchData.searchPhrase2);
        await expect(await navBar.getSearchDropdown()).toBeVisible();
        searchResults = await navBar.getSearchResults();
        for (const searchResult of searchResults) {
            await expect(searchResult).toContainText(searchData.searchPhrase2);
        }

        await navBar.clickSearchCrossBtn();
        await expect(await navBar.getAdvertismentsSearchInput()).toBeEmpty();
        await expect(await navBar.getSearchDropdown()).not.toBeVisible();

        await navBar.refresh();
        await navBar.clickSearchInput();
        await expect(await navBar.getSearchHistoryElements()).toHaveText([searchData.searchPhrase2, searchData.existingVehicleSearchPhrase, searchData.existingServiceSearchPhrase]);
    });
});