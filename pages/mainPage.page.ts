import Page from './page';

const pageTitle: string = '[class*="HeroSection_title"]';
const consultationForm: string = '*[class*="ConsultationForm_container"]';
const orderConsultationBtn: string = '*[class*="ConsultationForm_container"] button';
const feedbackNameInput: string = 'div[class*="ConsultationForm_name"] input';
const feedbackPhoneInput: string = 'div[class*="ConsultationForm_phone"] input';
const feedbackNameErrorMsg: string = 'div[class*="ConsultationForm_name"] *[class*="ConsultationForm_error_message"]';
const feedbackPhoneErrorMsg: string = 'div[class*="ConsultationForm_phone"] *[class*="ConsultationForm_error_message"]';
const servicesSection: string = '*[data-testid="services"]';
const specialEquipmentSection: string = '*[data-testid="specialEquipment"]';
const servicesTabs: string = 'div[data-testid*="services__"]';
const services: string = 'div[data-testid*="service__"]';
const vehiclesTabs: string = '*[data-testid*="specialEquipment__"]';
const vehicles: string = 'div[data-testid*="category__"]';

export class MainPage extends Page {
    constructor(page: Page['page'], public isMobile: boolean) {
        super(page);
        this.isMobile = isMobile;
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

    async getSectionTabs(sectionName: "services" | "vehicles") {
        const tabs = sectionName === "services" ? servicesTabs : vehiclesTabs;
        return super.getElementsArray(tabs);
    }

    async getSectionItems(sectionName: 'services' | 'vehicles') {
        switch (sectionName) {
            case 'vehicles':
                return super.getElement(vehicles);
            case 'services':
                return super.getElement(services);
            default:
                throw new Error(`Unsupported section name: ${sectionName}`);
        }
    }

    async getSectionItemCount(sectionName: 'services' | 'vehicles') {
        switch (sectionName) {
            case 'vehicles':
                return await super.getElementsCount(vehicles);
            case 'services':
                return await super.getElementsCount(services);
            default:
                throw new Error(`Unsupported section name: ${sectionName}`);
        }
    }

    async clickFeedbackPhoneInput() {
        await super.clickElement(feedbackPhoneInput);
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
                element = vehicles;
                break;
            case 'services':
                element = services;
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

    async scrollToSection(sectionName: "vehicles" | "services") {
        switch (sectionName) {
            case 'vehicles':
                await super.scrollToElement(specialEquipmentSection);
                break;
            case 'services':
                await super.scrollToElement(servicesSection);
                break;
            default:
                throw new Error(`Unsupported section name: ${sectionName}`);
        }
    }
}