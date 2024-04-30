import { errorMonitor } from 'events';
import Page from '../page';

const avatarPhoto: string = 'div[class*="NavbarContainer"] img[data-testid="photo"]';

const advertismentsLink: string = 'div[class*="Navbar_navigation"] a[href="/products/"]';
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

const notificationPopUpTitle: string = 'div[class*="NotificationLikePopup_description"]';

//mobile navbar elements
const mobileNavbarIcons = (iconName: string): string => `//*[contains(@class,"MobileNavbar_item")]//*[text()="${iconName}"]`;

export class NavBar extends Page {
    constructor(page: Page['page'], public isMobile: boolean) {
        super(page);
        this.isMobile = isMobile;
    }

    getNotificationPopUpTitle() {
        return super.getElement(notificationPopUpTitle);
    }

    getAdvertismentsLink() {
        return super.getElement(advertismentsLink);
    }

    async getAvatarPhotoSrc() {
        return await super.getElementAttribute(avatarPhoto, 'src');
    }

    async getLogo() {
        return super.getElement(logo);
    }

    async getCatalogLabel() {
        return super.getElement(catalogLabel);
    }

    async getCatalogDropdownMenu() {
        return super.getElement(catalogDropdownMenu);
    }

    async getCatalogElementByText(text: string) {
        return this.getElementByLocatorAndText(catalogDropdownMenu, text);
    }

    async getAdvertismentsSearchInput() {
        return super.getElement(searchInput);
    }

    async getTendersJobRequestsSearchInput() {
        return super.getElement(tendersJobRequestsSearchInput);
    }

    async getSearchDropdown() {
        return super.getElement(searchDropdown);
    }

    async getSearchHistoryPopup() {
        return super.getElement(searchHistoryPopup);
    }

    async getSearchDropdownServices() {
        return super.getElement(searchDropdownServices);
    }

    async getSearchDropdownCategories() {
        return super.getElement(searchDropdownCategories);
    }

    async getSearchHistoryElements() {
        return super.getElement(searchHistoryElements);
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
        return super.getElement(avatarIcon);
    }

    async getProfileDropdownContainer() {
        return super.getElement(profileDropdownContainer);
    }

    async getProfileEmail() {
        return super.getElement(profileEmail);
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

    async waitForLoggedIn() {
        await super.waitForSelector(avatarIcon);
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
        await Promise.all([
            super.waitForLoadState('load'),
            await super.clickElement(logo)
        ]);
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

    async clickProfileDropdownItem(itemName: 'advertisments') {
        switch (itemName) {
            case 'advertisments':
                await super.clickElement(advertismentsDropdownItem);
                break;
            default:
                throw new Error('Non valid item name');
                break;
        }
    }
    async clickAdvertismentsDropdownItem() {

    }

    async fillSearchInput(searchPhrase: string) {
        await Promise.all([
            super.waitForLoadState('networkidle'),
            super.fillElement(searchInput, searchPhrase)
        ])
    }

    async clickMobileNavBarIcon(iconName: 'Головна') {
        this.isMobile && super.tapElement(mobileNavbarIcons(iconName));
    }

    // async searchItem(searchPhrase: string) {
    //     await Promise.all([
    //     this.fillSearchInput(searchPhrase),
    //     super.pause(5000),
    //     super.pressEnter()
    //     ]);
    // }
    //    async searchItem(searchPhrase: string) {
    //     await Promise.all([
    //         super.fillElement(searchInput, searchPhrase),
    //         super.clickElement(searchResults)
    //     ]);
    //    }

    async clickAdvertismentsLink() {
        await super.clickElement(advertismentsLink);
    }
}