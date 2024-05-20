import Page from './page';

const servicesSectionWrapper = '*[data-testid="services"]';
const servicesTabs = '*[data-testid*="services__"]';
const servicesItems = '*[data-testid*="service__"]';
const vehiclesSectionWrapper = '*[data-testid="specialEquipment"]';
const vehiclesTabs = '*[data-testid*="specialEquipment__"]';
const vehiclesItems = '*[data-testid*="category__"]';
const pageTitle = '[class*="HeroSection_title"]';
const consultationForm = '*[class*="ConsultationForm_container"]';
const orderConsultationBtn = '*[class*="ConsultationForm_container"] button';
const feedbackNameInput = '*[class*="ConsultationForm_name"] input';
const feedbackPhoneInput = '*[class*="ConsultationForm_phone"] input';
const feedbackNameErrorMsg = '*[class*="ConsultationForm_name"] *[class*="ConsultationForm_error_message"]';
const feedbackPhoneErrorMsg= '*[class*="ConsultationForm_phone"] *[class*="ConsultationForm_error_message"]';

export class MainPage extends Page {
    constructor(page: Page['page'], public isMobile: boolean) {
        super(page);
        this.isMobile = isMobile;
    }

    async getSectionTabsArray(sectionName: "services" | "vehicles") {
        const tabs = sectionName === "services" ? servicesTabs : vehiclesTabs;
        return super.getElementsArray(tabs);
    }

    async getSectionItems(sectionName: 'services' | 'vehicles') {
        switch (sectionName) {
            case 'vehicles':
                return super.getElement(vehiclesItems);
            case 'services':
                return super.getElement(servicesItems);
            default:
                throw new Error(`Unsupported section name: ${sectionName}`);
        }
    }

    async getSectionItemCount(sectionName: 'services' | 'vehicles') {
        switch (sectionName) {
            case 'vehicles':
                return await super.getElementsCount(vehiclesItems);
            case 'services':
                return await super.getElementsCount(servicesItems);
            default:
                throw new Error(`Unsupported section name: ${sectionName}`);
        }
    }

    async clickSectionTab(sectionName: 'services' | 'vehicles', index: number) {
        let tabs: string;
        switch (sectionName) {
            case 'vehicles':
                tabs = vehiclesTabs;
                break;
            case 'services':
                tabs = servicesTabs;
                break;
            default:
                throw new Error(`Unsupported section name: ${sectionName}`);
        }
        this.isMobile ? await super.tapElementByIndex(tabs, index) : await super.clickElementByIndex(tabs, index);
    }

    async clickSectionItem(sectionName: 'vehicles' | 'services', index: number) {
        let element: string;
        switch (sectionName) {
            case 'vehicles':
                element = vehiclesItems;
                break;
            case 'services':
                element = servicesItems;
                break;
            default:
                throw new Error(`Unsupported section name: ${sectionName}`);
        }

        await (await super.getElementByIndex(element, index)).scrollIntoViewIfNeeded();
        const responsePromise = super.waitForResponse('/api/units/map-user-coords_2', 200);
        await Promise.all([
            responsePromise,
            this.isMobile ? super.tapElementByIndex(element, index) : super.clickElementByIndex(element, index)
        ]);
    }

    async scrollToSection(sectionName: "vehicles" | "services") {
        switch (sectionName) {
            case 'vehicles':
                await super.scrollToElement(vehiclesSectionWrapper);
                break;
            case 'services':
                await super.scrollToElement(servicesSectionWrapper);
                break;
            default:
                throw new Error(`Unsupported section name: ${sectionName}`);
        }
    }

    async clickFeedbackPhoneInput() {
    await super.clickElement(feedbackPhoneInput);
}

    async getPageTitle() {
        return super.getElement(pageTitle);
    }

    async getConsultationForm() {
        return super.getElement(consultationForm);
    }

    async getFeedbackNameInput() {
        return super.getElement(feedbackNameInput);
    }

    async getFeedbackNameErrorMsg() {
        return super.getElement(feedbackNameErrorMsg);
    }

    async getFeedbackPhoneInput() {
        return super.getElement(feedbackPhoneInput);
    }

    async getFeedbackPhoneErrorMsg() {
        return super.getElement(feedbackPhoneErrorMsg);
    }

    async orderConsultation(options?: { name?: string, phone?: string }) {
        const { name, phone } = options ?? {};

        if (name !== undefined) {
            await super.fillElement(feedbackNameInput, name);
        }

        if (phone !== undefined) {
            await super.fillElement(feedbackPhoneInput, phone);
        }

        await super.clickElement(orderConsultationBtn);
    }

    async scrollToConsultationForm() {
        await super.scrollToElement(consultationForm);
    }
}