import Page from '../page';

const mapPopUpForm: string = '*[data-testid="mapPopup"]';
const zoomInBtn: string = 'a[class*="zoom-in"]';
const zoomOutBtn: string = 'a[class*="zoom-out"]';
const confirmChoiceBtn: string = '//*[contains(@class, "MapPopup_btns")]//button[text()="Підтвердити вибір"]';
const mapZoom: string = '*[class="leaflet-proxy leaflet-zoom-animated"]';

export class MapPopUp extends Page {

    getMapZoom() {
        return super.getElement(mapZoom);
    }
    async mapZoomIn() {
        await super.clickElement(zoomInBtn);
    }
}