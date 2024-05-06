import Page from '../page';

const notificationPopUpMsg = '*[class*="NotificationLikePopup_description"]';

export class NotificationPopUp extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    getNotificationPopUpMsg() {
        return super.getElement(notificationPopUpMsg);
    }
}