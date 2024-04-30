import Page from './page';

const title: string = 'div[class*="OwnerFavouriteUnitsPage_title"]';
const emptyBlockTitle: string = 'div[class*="EmptyBlockInfo"][data-testid="title"]';
const emptyBlockBtn: string = 'button[class*="EmptyBlockInfo_btn"][data-testid="emptyBlockButton"]';
const searchInput: string = 'div[data-testid="search"] input';
const unitCards: string = 'div[data-testid="unitCard"]';
const unitCardNames: string = 'div[class*="OwnerUnitCard_name"]';
const favouriteImgs: string = 'div[data-testid="favourite"]';
const clearFiltersBtn: string = '//button[@data-testid="emptyBlockButton"][text()="Скинути фільтри"]';
const pagination: string = 'ul[class*="Pagination_pagination"]';
const previousPageArrow: string = 'a[class*="Pagination_arrow"][aria-label="Previous page"]';
const nextPageArrow: string = 'a[class*="Pagination_arrow"][aria-label="Next page"]';
const pageNumberLink = (pageNumber : number): string  => `//a[contains(@class, "Pagination_page") and text()="${pageNumber}"]`;
const categoriesDropdownSelectedItem = 'div[class*="SearchPanel_categoryContainer"] span[class*="CustomSelect_value"]';
const categoryDropdownItem = (categoryName: string): string => `//div[contains(@class, 'SearchPanel_categoryContainer')]//span[@data-testid="span-customSelect" and text()="${categoryName}"]`;
const sortDropdownSelectedItem = 'div[class*="SearchPanel_sortContainer"] span[class*="CustomSelect_value"]';
const sortDropdownItem = (sortByName: string): string => `//div[contains(@class, "SearchPanel_sortContainer")]//span[contains(text(), "${sortByName}")]`;
const clearFavouriteUnitsBtn: string = 'button[class*="OwnerFavouriteUnitsPage_removeList"]';

const clearFavouriteUnitsPopup: string = 'div[class*="PopupLayout_content"]';
const clearFavouriteUnitsPopupTitle: string = 'div[class*="PopupLayout_label"]';
const clearFavouriteUnitsPopupCancelBtn: string = '//div[contains(@class, "DialogPopup_btnsWrapper")]//button[text()="Скасувати"]';
const clearFavouriteUnitsPopupCloseBtn: string = 'div[class*="PopupLayout_content"] div[data-testid="closeIcon"]';
const clearFavouriteUnitsPopupAcceptBtn: string = '//div[contains(@class, "DialogPopup_btnsWrapper")]//button[text()="Так"]';

export class myFavouriteUnitsPage extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    getClearFavouriteUnitsPopup() {
        return super.getElement(clearFavouriteUnitsPopup);
    }

    getClearFavouriteUnitsPopupTitle() {
        return super.getElement(clearFavouriteUnitsPopupTitle);
    }

    getTitle() {
        return super.getElement(title);
    }

    getSearchInput() {
        return super.getElement(searchInput);
    }

    getEmptyBlockTitle() {
        return super.getElement(emptyBlockTitle);
    }

    getEmptyBlockBtn() {
        return super.getElement(emptyBlockBtn);
    }

    getClearFiltersBtn() {
        return super.getElement(clearFiltersBtn);
    }

    getUnitCards() {
        return super.getElement(unitCards);
    }

    getUnitCardNames() {
        return super.getElement(unitCardNames);
    }

    getPagination() {
        return super.getElement(pagination);
    }

    getPaginationArrow(page: 'previous' | 'next') {
        switch (page) {
            case 'previous':
                return super.getElement(previousPageArrow);
            case 'next':
                return super.getElement(nextPageArrow);
            default:
                throw new Error(`Invalid page name arrow -- ${page}`);
        }
    }

    getPageNumber(pageNumber: number) {
        return super.getElement(pageNumberLink(pageNumber));
    }

    getCategoriesDropdownSelectedItem() {
        return super.getElement(categoriesDropdownSelectedItem);
    }

    getSortDropdownSelectedItem() {
        return super.getElement(sortDropdownSelectedItem);
    }

    async clickEmptyBlockBtn() {
        await super.clickElement(emptyBlockBtn);
    }

    async searchUnit(unitName: string, action: 'noClick' | 'enter'  = 'noClick') {
        await super.clearElement(searchInput);
        if (unitName) {
            await super.type(searchInput, unitName);
        }
        if (action === 'enter') {
            await super.pressEnter();
        } 
    }

    async clickFavouriteUnitBtn() {
        await super.clickElement(favouriteImgs);
    }

    async clickClearFiltersBtn() {
        await super.clickElement(clearFiltersBtn);
    }

    async clickPaginationArrow(page: 'previous' | 'next') {
        switch (page) {
            case 'previous':
                await super.clickElement(previousPageArrow);
                break;
            case 'next':
                await super.clickElement(nextPageArrow);
                break;
            default:
                throw new Error(`Invalid page name arrow -- ${page}`);
        }
    }

    async clickPageNumber(pageNumber: number) {
        await super.clickElement(pageNumberLink(pageNumber));
    }

    async filterByCategory(categoryName: string) {
        await super.clickElement(categoriesDropdownSelectedItem);
        await super.clickElement(categoryDropdownItem(categoryName));
    }

    async sort(by: string) {
        await super.clickElement(sortDropdownSelectedItem);
        await super.clickElement(sortDropdownItem(by));
    }

    async clickClearFavouriteUnitsBtn() {
        await super.clickElement(clearFavouriteUnitsBtn);
    }

    async clickClearFavouriteUnitsPopupBtn(btnName: 'close' | 'cancel' | 'accept') {
        switch (btnName) {
            case 'close':
                await super.clickElement(clearFavouriteUnitsPopupCloseBtn);
                break;
            case 'cancel':
                await super.clickElement(clearFavouriteUnitsPopupCancelBtn);
                break;
            case 'accept':
                await super.clickElement(clearFavouriteUnitsPopupAcceptBtn);
                break;
            default:
                throw new Error(`Invalid button name -- ${btnName}`);
        }
    }
}