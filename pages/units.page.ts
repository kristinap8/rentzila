import Page from './page';

const resultCountMsg = 'h1[class*="MapPagination_count"]';
const favouriteUnitBtn = 'div[data-testid="favourite"]';
const favouriteImg = 'div[data-testid="favourite"] #Vector>path';
const selectedFilter = '*[class*="selectedCategory"]';
const unitsList = '*[class*="ListPagination_unitsListContainer"]';
const unitCards = '*[data-testid="cardWrapper"]';
const showUnitsListBtn = 'button[class*="MapListSwitcher_switch"]';
const loaderIcon = '*[data-testid="preloader"]';
//mobile
const filtersBtn = 'button[data-testid="filters"]';
const mobileShowUnitsListBtn = 'button[class*="ShowMapMobileButtons_switch"]';
const selectedFilterLeftsideMenu = '*[class*="ResetFilters_selectedCategory"]';
const crossBtnLeftsideMenu = '*[data-testid="filtersClose"]';

export class UnitsPage extends Page {
    constructor(page: Page['page'], public isMobile: boolean) {
        super(page);
        this.isMobile = isMobile;
    }

    async getSelectedFilter() {
        if (this.isMobile) {
            await super.tapElement(filtersBtn);
            return super.getElement(selectedFilterLeftsideMenu);
        } else {
            return super.getElement(selectedFilter);
        }
    }

    async getListUnitCards() {
        return super.getElementsArray(unitCards);
    }

    async closeFiltersLeftsideMenu() {
        this.isMobile && await super.tapElement(crossBtnLeftsideMenu);
    }

    async clickFirstUnitCard() {
        await Promise.all([
            super.waitForSelector(loaderIcon, 'detached'),
            this.isMobile ? await super.tapElementByIndex(unitCards, 0) : await super.clickElementByIndex(unitCards, 0)
        ]);
    }

    async switchToUnitsList() {
        const count = await super.getElementsCount(unitsList);
        if (count === 0) {
            const responsePromise = super.waitForResponse('/api/units/map-user-coords_2', 200);
            await Promise.all([
                responsePromise,
                this.isMobile ? super.tapElement(mobileShowUnitsListBtn) : super.clickElement(showUnitsListBtn)
            ]);
        }
    }

    async getResultCountMsg() {
        return super.getElement(resultCountMsg);
    }

    getFavouriteImg() {
        return super.getElement(favouriteImg);
    }

    async clickFavouriteUnitBtn() {
        await super.clickElement(favouriteUnitBtn);
    }
}