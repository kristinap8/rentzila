import Page from '../page';
import Helper from '../../helper/helper';

const logo = '*[data-testid="Navbar"] *[data-testid="logo"]';
const searchInput = '*[class*="Navbar_search"] *[data-testid="searchInput"]';
const tendersJobRequestsSearchInput = '*[class*="Navbar_search"] *[data-testid="search"]';
const searchCrossBtn = '*[class*="Navbar_search"] *[data-testid="searchClear"]';
const searchDropdown = '*[data-testid="searchDropdown"]';
const searchHistoryPopup = '//*[text()="Історія пошуку"]/following-sibling::div[1]';
const searchHistoryElements = '//*[text()="Історія пошуку"]/following-sibling::div[1]/*[@data-testid="resultItem"]';
const searchDropdownServices = '*[data-testid="services"] *[data-testid="resultItem"]';
const searchDropdownCategories = '//*[text()="Категорії"]/following-sibling::div/*[@data-testid="resultItem"]';
const searchResults = '*[data-testid="rightsideUnits"] *[data-testid="cardContainer"]';
//catalog elements
const catalogBtn = '*[class*="NavbarCatalog_label"]';
const catalogDropdownContainer = '*[class*="Catalog_container"]';
const firstLvlCatalogSubMenuItems = '*[class*="Catalog_parent__"]';
const secondLvlCatalogSubMenuItems = '*[class*="Catalog_list"]:not([class*="listSecond"]) *[class*="CatalogItem_item"]';
const thirdLvlCatalogSubMenuItems = '(//*[contains(@class,"Catalog_listSecond")])[1]//*[contains(@class, "CatalogItem_item")]';
//notificationMenu elements
const notificationMenuIcon = '*[data-testid="notificationMenu"]';
const notificationMsgs = '*[data-testid="NotificationDropdownMenu"] *[data-testid="contentContent"]';
//myProfile elements
const logInBtn = '*[class*="NavbarAuthBlock_buttonEnter"]';
const avatarIcon = '*[data-testid="avatarBlock"]';
const avatarPhoto = '*[class*="NavbarContainer"] img[data-testid="photo"]';
const userBalance = '*[class*="Navbar"] *[class*="OwnerBalance_balance"] span';
const profileDropdownContainer = '*[class*="ProfileDropdownMenu_container"]';
const profileDropdownEmail = '*[data-testid="profileDropdown"] *[data-testid="email"]';
const profileDropdownMyProfileBtn = '*[data-testid="profileDropdown"] *[data-testid="profile"]';
const profileDropdownUnitsBtn = '*[data-testid="profileDropdown"] *[data-testid="units"]';
const profileDropdownLogoutBtn = '*[data-testid="profileDropdown"] *[data-testid="logout"]';
//mobile navbar elements
const mobileNavbarIcons = (iconName: string): string => `//*[text()="${iconName}"]//preceding-sibling::*[contains(@class,"MobileNavbar_icon")]`;

let helper: Helper;
export class NavBar extends Page {
    constructor(page: Page['page'], public isMobile: boolean) {
        super(page);
        helper = new Helper();
        this.isMobile = isMobile;
    }

    getNavbarItem(itemName: 'logo' | 'catalogBtn' | 'avatarIcon' | 'loginBtn') {
        switch (itemName) {
            case 'logo':
                return super.getElement(logo);
            case 'catalogBtn':
                return super.getElement(catalogBtn);
            case 'avatarIcon':
                return super.getElement(avatarIcon);
            case 'loginBtn':
                return super.getElement(logInBtn);
            default:
                throw new Error(`Incorrect navbar item name: ${itemName}`);
        }
    }

    async getCatalogSubmenuItemsArray(level: number) {
        switch (level) {
            case 1:
                return await super.getElementsArray(firstLvlCatalogSubMenuItems);
            case 2:
                return await super.getElementsArray(secondLvlCatalogSubMenuItems);
            case 3:
                return await super.getElementsArray(thirdLvlCatalogSubMenuItems);
            default:
                throw new Error(`Incorrect number of level: ${level}`);
        }
    }

    async getAvatarPhotoSrc() {
        return await super.getElementAttribute(avatarPhoto, 'src');
    }

    getProfileDropdown() {
        return super.getElement(profileDropdownContainer);
    }

    getProfileDropdownEmail() {
        return super.getElement(profileDropdownEmail);
    }

    async getProfileDropdownBalance() {
        await this.clickNavbarItem('avatarIcon');
        const balance = helper.getNumbersFromString(await super.getElementText(userBalance) || '');
        await this.clickNavbarItem('avatarIcon');
        return balance;
    }

    getCatalogDropdown() {
        return super.getElement(catalogDropdownContainer);
    }

    getLastNoticationMsg() {
        return super.getElementByIndex(notificationMsgs, 0);
    }

    async clickProfileDropdownBtn(btnName: 'myProfile' | 'logout' | 'advertisments') {
        switch (btnName) {
            case 'myProfile':
                await super.clickElement(profileDropdownMyProfileBtn);
                break;
            case 'logout':
                await super.clickElement(profileDropdownLogoutBtn);
                break;
            case 'advertisments':
                await super.clickElement(profileDropdownUnitsBtn);
                break;
            default:
                throw new Error(`Invalid profile dropdown button name: ${btnName}`);
        }
    }

    async clickNavbarItem(itemName: 'logo' | 'catalogBtn' | 'avatarIcon' | 'loginBtn' | 'notificationMenuIcon') {
        switch (itemName) {
            case 'logo':
                await Promise.all([
                    super.waitforUrl('/'),
                    super.clickElement(logo)]);
                break;
            case 'catalogBtn':
                await super.clickElement(catalogBtn);
                break;
            case 'avatarIcon':
                await super.clickElement(avatarIcon);
                break;
            case 'loginBtn':
                await super.clickElement(logInBtn);
                break;
            case 'notificationMenuIcon':
                await super.clickElement(notificationMenuIcon);
                break;
            default:
                throw new Error(`Incorrect navbar item name: ${itemName}`);
        }
    }

    async clickMobileNavbarIcon(iconName: 'Головна' | 'Профіль') {
        this.isMobile && await Promise.all([
            super.waitForLoadState('domcontentloaded'),
            super.tapElement(mobileNavbarIcons(iconName))
        ]);
    }

    async clickCatalogElementByLevelAndName(level: number, itemName: string) {
        let subMenuElements: string;
        switch (level) {
            case 2:
                subMenuElements = secondLvlCatalogSubMenuItems;
                break;
            case 3:
                subMenuElements = thirdLvlCatalogSubMenuItems;
                break;
            default:
                throw new Error(`Incorrect number of level: ${level}`);
        }
        await super.clickElementByLocatorAndText(subMenuElements, itemName);
    }

    async hoverCatalogElementByLevelAndName(level: number, itemName: string) {
        let subMenuElements: string;
        switch (level) {
            case 1:
                subMenuElements = firstLvlCatalogSubMenuItems;
                break;
            case 2:
                subMenuElements = secondLvlCatalogSubMenuItems;
                break;
            default:
                throw new Error(`Incorrect number of level: ${level}`);
        }
        await super.hoverElementByLocatorAndText(subMenuElements, itemName);
    }

    async fillSearchInput(searchPhrase: string) {
        await Promise.all([
            super.waitForLoadState('networkidle'),
            super.fillElement(searchInput, searchPhrase)
        ])
    }

    async searchItem(searchPhrase: string) {
        await Promise.all([
            super.fillElement(searchInput, searchPhrase),
            super.clickElement(searchResults)
        ]);
    }

    async clickSearchInput() {
        await super.clickElement(searchInput);
    }

    async clickSearchCrossBtn() {
        await super.clickElement(searchCrossBtn);
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

    async clickFirstSearchResult() {
        await super.clickElementByIndex(searchResults, 0);
    }

    async clickServiceSearchDropdown(text: string) {
        await super.clickElementByLocatorAndText(searchDropdownServices, text);
    }

    async clickCategorySearchDropdown(text: string) {
        await super.clickElementByLocatorAndText(searchDropdownCategories, text, false);
    }
}