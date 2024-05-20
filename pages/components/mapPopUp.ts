import Page from '../page';

const mapPopUpContainer = '*[data-testid="div-mapPopup"]';
const cityInput = 'input[data-testid="cityInput"]';
const cityInputCrossIcon = '*[data-testid="div-mapPopup"] *[data-testid="clearSearch"]';
const placesResultsDropdown = '*[data-testid="places"] li';
const zoomInBtn = 'a[class*="zoom-in"]';
const zoomOutBtn = 'a[class*="zoom-out"]';
const confirmChoiceBtn = '//*[contains(@class, "MapPopup_btns")]//button[text()="Підтвердити вибір"]';
const map = '#map';
const mapZoom = '*[class="leaflet-proxy leaflet-zoom-animated"]';
const crossIcon = '*[data-testid="div-mapPopup"] *[data-testid="crossIcon"]';
const cancelBtn = '//*[contains(@class, "MapPopup_btns")]//button[text()="Скасувати"]';

export class MapPopUp extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    getMapPopUp() {
        return super.getElement(mapPopUpContainer);
    }

    async getMapZoom() {
        const scaleRegExp = /scale\(([^)]+)\)/;
        const scaleMatch = (await super.getElementAttribute(mapZoom, 'style'))!.match(scaleRegExp)!;
        return Number(scaleMatch[1]);
    }

    async getMapZoomButtonAccessability(type: 'in' | 'out') {
        const btn = (type === 'in') ? zoomInBtn : zoomOutBtn;
        return await super.getElementAttribute(btn, 'aria-disabled');
    }

    async enterCity(city: string) {
        await super.fillElement(cityInput, city);
        await super.pause(2000);
        (await super.getElementsCount(placesResultsDropdown) > 0) && await super.clickElementByIndex(placesResultsDropdown, 0);
    }

    async mapZoomIn() {
        await super.clickElement(zoomInBtn);
    }

    async mapZoomOut() {
        await super.clickElement(zoomOutBtn);
    }

    async clickConfirmChoiceBtn() {
        await super.clickElement(confirmChoiceBtn);
    }

    async closeMapPopUp(click: 'crossIcon' | 'cancelBtn') {
        switch (click) {
            case 'cancelBtn':
                super.clickElement(cancelBtn);
                break;
            case 'crossIcon':
                super.clickElement(crossIcon);
                break;
            default:
                throw new Error(`Unsupported element name to click: ${click}`);
        }
    }

    async selectLocationOutsideUkraine() {
        while(await this.getMapZoomButtonAccessability('out') !== "true") {
            await this.mapZoomOut();
            await super.pause(500);
        }
        const box = (await super.getElement(map).boundingBox())!;
        await this.page.mouse.click(box.x, box.y + box.height / 2);
        await super.pause(1000);
    }
}