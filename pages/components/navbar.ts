import Page from '../page';

const logo = '*[data-testid="Navbar"] *[data-testid="logo"]';
//catalog elements
const catalogBtn = '*[class*="NavbarCatalog_label"]';
const catalogDropdownContainer = '*[class*="Catalog_container"]';
const firstLvlCatalogSubMenuItems = '*[class*="Catalog_parent__"]';
const secondLvlCatalogSubMenuItems = '*[class*="Catalog_list"]:not([class*="listSecond"]) *[class*="CatalogItem_item"]';
const thirdLvlCatalogSubMenuItems = '(//*[contains(@class,"Catalog_listSecond")])[1]//*[contains(@class, "CatalogItem_item")]';
//myProfile elements
const logInBtn = '*[class*="NavbarAuthBlock_buttonEnter"]';
const avatarIcon = '*[data-testid="avatarBlock"]';
const profileDropdownContainer = '*[class*="ProfileDropdownMenu_container"]';
const profileDropdownEmail = '*[data-testid="profileDropdown"] *[data-testid="email"]';
const profileDropdownMyProfileBtn = '*[data-testid="profileDropdown"] *[data-testid="profile"]';
const profileDropdownLogoutBtn = '*[data-testid="profileDropdown"] *[data-testid="logout"]';
//mobile navbar elements
const mobileNavbarIcons = (iconName: string): string => `//*[text()="${iconName}"]//preceding-sibling::*[contains(@class,"MobileNavbar_icon")]`;

export class NavBar extends Page {
    constructor(page: Page['page'], public isMobile: boolean) {
        super(page);
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

    getProfileDropdown() {
        return super.getElement(profileDropdownContainer);
    }

    getProfileDropdownEmail() {
        return super.getElement(profileDropdownEmail);
    }

    getCatalogDropdown() {
        return super.getElement(catalogDropdownContainer);
    }

    async clickProfileDropdownBtn(btnName: 'myProfile' | 'logout') {
        switch (btnName) {
            case 'myProfile':
                await super.clickElement(profileDropdownMyProfileBtn);
                break;
            case 'logout':
                await super.clickElement(profileDropdownLogoutBtn);
                break;
            default:
                throw new Error(`Invalid profile dropdown button name: ${btnName}`);
        }
    }

    async clickNavbarItem(itemName: 'logo' | 'catalogBtn' | 'avatarIcon' | 'loginBtn') {
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
}

// const avatarPhoto:string = '*[class*="NavbarContainer"] img[data-testid="photo"]';
// const advertismentsLink: string = 'div[class*="Navbar_navigation"] a[href="/products/"]';

// 

// const thirdLvlCatalogSubMenuItems: string = '(//div[contains(@class, "Catalog_listSecond")])[1]//div[contains(@class, "CatalogItem_item")]';
// const searchInput: string = '*[class*="Navbar_search"] *[data-testid="searchInput"]';
// const tendersJobRequestsSearchInput: string = '*[class*="Navbar_search"] *[data-testid="search"]';
// const searchCrossBtn: string = '*[class*="Navbar_search"] *[data-testid="searchClear"]';
// const searchDropdown: string = '*[data-testid="searchDropdown"]';
// const searchHistoryPopup: string = '//*[text()="Історія пошуку"]/following-sibling::div[1]';
// const searchHistoryElements: string = '//*[text()="Історія пошуку"]/following-sibling::div[1]/*[@data-testid="resultItem"]';
// const searchDropdownServices: string = '*[data-testid="services"] *[data-testid="resultItem"]';
// const searchDropdownCategories: string = '//*[text()="Категорії"]/following-sibling::div/*[@data-testid="resultItem"]';
// const searchResults: string = '*[data-testid="rightsideUnits"] *[data-testid="cardContainer"]';


// const advertismentsDropdownItem: string = 'div[data-testid="units"]';

// const notificationPopUpTitle: string = 'div[class*="NotificationLikePopup_description"]';










// getNotificationPopUpTitle() {
//     return super.getElement(notificationPopUpTitle);
// }

// getAdvertismentsLink() {
//     return super.getElement(advertismentsLink);
// }

// async getAvatarPhotoSrc() {
//     return await super.getElementAttribute(avatarPhoto, 'src');
// }



// async getCatalogDropdownMenu() {
//     return super.getElement(catalogDropdownMenu);
// }

// async getCatalogElementByText(text: string) {
//     return this.getElementByLocatorAndText(catalogDropdownMenu, text);
// }

// async getAdvertismentsSearchInput() {
//     return super.getElement(searchInput);
// }

// async getTendersJobRequestsSearchInput() {
//     return super.getElement(tendersJobRequestsSearchInput);
// }

// async getSearchDropdown() {
//     return super.getElement(searchDropdown);
// }

// async getSearchHistoryPopup() {
//     return super.getElement(searchHistoryPopup);
// }

// async getSearchDropdownServices() {
//     return super.getElement(searchDropdownServices);
// }

// async getSearchDropdownCategories() {
//     return super.getElement(searchDropdownCategories);
// }

// async getSearchHistoryElements() {
//     return super.getElement(searchHistoryElements);
// }

// async getLastSearchHistoryElement() {
//     return await super.getElementByIndex(searchHistoryElements, 0);
// }

// async getSearchResults() {
//     await super.pause(1000);
//     return await super.getElementsArray(searchResults);
// }

// async getThirdLvlCatalogSubMenuItems() {
//     return await super.getElementsArray(thirdLvlCatalogSubMenuItems);
// }

// async getSecondLvlCatalogSubMenuItems() {
//     return await super.getElementsArray(secondLvlCatalogSubMenuItems);
// }

// async getFirstLvlCatalogSubMenuItems() {
//     return await super.getElementsArray(firstLvlCatalogSubMenuItems);
// }

// getLogInBtn() {
//     return super.getElement(logInBtn);
// }



// // async getProfileDropdownContainer() {
// //     return super.getElement(profileDropdownContainer);
// // }



// // async waitForLoggedIn() {
// //     await super.waitForSelector(avatarIcon);
// // }

// async clickLoginBtn() {
//     await super.clickElement(logInBtn);
// }



// async clickCatalogElementByLevelAndInd(level: number, ind: number) {
//     let subMenuElements: string;

//     switch (level) {
//         case 2:
//             subMenuElements = secondLvlCatalogSubMenuItems;
//             break;
//         case 3:
//             subMenuElements = thirdLvlCatalogSubMenuItems;
//             break;
//         default:
//             throw new Error("Invalid level provided");
//     }

//     await super.clickElementByIndex(subMenuElements, ind);
// }

// async clickFirstSearchResult() {
//     await super.clickElementByIndex(searchResults, 0);
// }

// async clickServiceSearchDropdown(text: string) {
//     await super.clickElementByLocatorAndText(searchDropdownServices, text);
// }

// async clickCategorySearchDropdown(text: string) {
//     await super.clickElementByLocatorAndText(searchDropdownCategories, text, false);
// }

// async clickLogo() {
//     await Promise.all([
//         super.waitForLoadState('load'),
//         await super.clickElement(logo)
//     ]);
// }

// async clickSearchInput() {
//     await super.clickElement(searchInput);
// }

// async clickSearchCrossBtn() {
//     await super.clickElement(searchCrossBtn);
// }

// async clickCatalog() {
//     await super.clickElement(catalogLabel);
// }



// async clickMyProfileDropdownItem() {
//     await super.clickElement(myProfileDropdownItem);
// }

// async clickProfileDropdownItem(itemName: 'advertisments') {
//     switch (itemName) {
//         case 'advertisments':
//             await super.clickElement(advertismentsDropdownItem);
//             break;
//         default:
//             throw new Error('Non valid item name');
//             break;
//     }
// }
// async clickAdvertismentsDropdownItem() {

// }

// async fillSearchInput(searchPhrase: string) {
//     await Promise.all([
//         super.waitForLoadState('networkidle'),
//         super.fillElement(searchInput, searchPhrase)
//     ])
// }



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

// async clickAdvertismentsLink() {
//     await super.clickElement(advertismentsLink);
// }
//}