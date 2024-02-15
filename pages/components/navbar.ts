import Page from '../page';

const logo: string = '*[data-testid="Navbar"] *[data-testid="logo"]';
const catalogLabel: string = '*[class*="NavbarCatalog_label"]';
const catalogDropdownMenu: string = '*[class*="Catalog_container"]';
const firstLvlCatalogSubMenuItems: string = 'div[class*="Catalog_parent__"]';
const secondLvlCatalogSubMenuItems: string = '(//div[contains(@class, "Catalog_list")])[1]//div[contains(@class, "CatalogItem_item")]';
const thirdLvlCatalogSubMenuItems: string = '(//div[contains(@class, "Catalog_listSecond")])[1]//div[contains(@class, "CatalogItem_item")]';
const searchInput: string = '*[class*="Navbar_search"] *[data-testid="searchInput"]';
const tendersJobRequestsSearchInput: string = '*[class*="Navbar_search"] *[data-testid="search"]';
const searchCrossBtn: string = '*[class*="Navbar_search"] *[data-testid="searchClear"]';
const searchDropdown: string = '*[data-testid="searchDropdown"]';
const searchHistoryPopup: string = '//*[text()="Історія пошуку"]/following-sibling::div[1]';
const searchHistoryElements: string = '//*[text()="Історія пошуку"]/following-sibling::div[1]/*[@data-testid="resultItem"]';
const searchDropdownServices: string = '*[data-testid="services"] *[data-testid="resultItem"]';
const searchDropdownCategories: string = '//*[text()="Категорії"]/following-sibling::div/*[@data-testid="resultItem"]';
const searchResults: string = '*[data-testid="rightsideUnits"] *[data-testid="cardContainer"]';
const logInBtn: string = '*[class*="NavbarAuthBlock_buttonEnter"]';
const avatarIcon: string = '*[data-testid="avatarBlock"]';
const profileDropdownContainer: string = 'div[class*="ProfileDropdownMenu_container"]';
const profileEmail: string = 'div[class*="ProfileDropdownMenu_email"]';
const logoutDropdownItem: string = 'div[data-testid="logout"]';
const myProfileDropdownItem: string = 'div[data-testid="profile"]';
const advertismentsDropdownItem: string = 'div[data-testid="units"]';

export class NavBar extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async getLogo() {
        return await super.getElement(logo);
    }

    async getCatalogLabel() {
        return await super.getElement(catalogLabel);
    }

    async getCatalogDropdownMenu() {
        return await super.getElement(catalogDropdownMenu);
    }

    async getCatalogElementByText(text: string) {
        return await this.getElementByLocatorAndText(catalogDropdownMenu, text);
    }

    async getAdvertismentsSearchInput() {
        return await super.getElement(searchInput);
    }

    async getTendersJobRequestsSearchInput() {
        return await super.getElement(tendersJobRequestsSearchInput);
    }

    async getSearchDropdown() {
        return await super.getElement(searchDropdown);
    }

    async getSearchHistoryPopup() {
        return await super.getElement(searchHistoryPopup);
    }

    async getSearchDropdownServices() {
        return await super.getElement(searchDropdownServices);
    }

    async getSearchDropdownCategories() {
        return await super.getElement(searchDropdownCategories);
    }

    async getSearchHistoryElements() {
        return await super.getElement(searchHistoryElements);
    }

    async getLastSearchHistoryElement() {
        return await super.getElementByIndex(searchHistoryElements, 0);
    }

    async getSearchResults() {
        await super.pause(1000);
        return await super.getElementsArray(searchResults);
    }

    async getThirdLvlCatalogSubMenuItems() {
        return await super.getElementsArray(thirdLvlCatalogSubMenuItems);
    }

    async getSecondLvlCatalogSubMenuItems() {
        return await super.getElementsArray(secondLvlCatalogSubMenuItems);
    }

    async getFirstLvlCatalogSubMenuItems() {
        return await super.getElementsArray(firstLvlCatalogSubMenuItems);
    }

    async getLogInBtn() {
        return await super.getElement(logInBtn);
    }

    async getAvatarIcon() {
        return await super.getElement(avatarIcon);
    }

    async getProfileDropdownContainer() {
        return await super.getElement(profileDropdownContainer);
    }

    async getProfileEmail() {
        return await super.getElement(profileEmail);
    }

    async hoverCatalogElementByLevelAndInd(level: number, ind: number) {
        let subMenuElements: string;

        switch (level) {
            case 1:
                subMenuElements = firstLvlCatalogSubMenuItems;
                break;
            case 2:
                subMenuElements = secondLvlCatalogSubMenuItems;
                break;
            case 3:
                subMenuElements = thirdLvlCatalogSubMenuItems;
                break;
            default:
                throw new Error("Invalid level provided");
        }

        await super.hoverElementByIndex(subMenuElements, ind);
    }

    async clickLoginBtn() {
        await super.clickElement(logInBtn);
    }

    async clickAvatarIcon() {
        await super.clickElement(avatarIcon);
    }

    async clickCatalogElementByLevelAndInd(level: number, ind: number) {
        let subMenuElements: string;

        switch (level) {
            case 2:
                subMenuElements = secondLvlCatalogSubMenuItems;
                break;
            case 3:
                subMenuElements = thirdLvlCatalogSubMenuItems;
                break;
            default:
                throw new Error("Invalid level provided");
        }

        await super.clickElementByIndex(subMenuElements, ind);
    }

    async clickFirstSearchResult() {
        await super.clickElementByIndex(searchResults, 0);
    }

    async clickServiceSearchDropdown(text: string) {
        await super.clickElementByLocatorAndText(searchDropdownServices, text);
    }

    async clickCategorySearchDropdown(text: string) {
        await super.clickElementByLocatorAndText(searchDropdownCategories, text, false);
    }

    async clickLogo() {
        await super.clickElement(logo);
        await super.pause(1000);
    }

    async clickSearchInput() {
        await super.clickElement(searchInput);
    }

    async clickSearchCrossBtn() {
        await super.clickElement(searchCrossBtn);
    }

    async clickCatalog() {
        await super.clickElement(catalogLabel);
    }

    async clickLogoutDropdownItem() {
        await super.clickElement(logoutDropdownItem);
    }

    async clickMyProfileDropdownItem() {
        await super.clickElement(myProfileDropdownItem);
    }

    async clickAdvertismentsDropdownItem() {
        await super.clickElement(advertismentsDropdownItem);
    }

    async fillSearchInput(searchPhrase: string) {
        await super.fillElement(searchInput, searchPhrase);
    }

    async searchItem(searchPhrase: string) {
        await this.fillSearchInput(searchPhrase);
        await super.pressEnter();
    }
}