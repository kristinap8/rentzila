import Page from '../page';

const telegramPopUp = '*[class*="RequestsPopup_telegram"]';
const telegramCrossIcon = '*[class*="RequestsPopup_telegram"]~*[data-testid="crossButton"]';

export class TelegramPopUp extends Page {
    constructor(page: Page['page'], public isMobile: boolean) {
        super(page);
        this.isMobile = isMobile;
    }

    async closeTelegramPopUp() {
        await this.page.addLocatorHandler(super.getElement(telegramPopUp), async () => {
            this.isMobile ? await super.tapElement(telegramCrossIcon) : await super.clickElement(telegramCrossIcon);
        });
    }
}