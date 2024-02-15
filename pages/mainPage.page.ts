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
    constructor(page: Page['page']) {
        super(page);
    }

    async getPageTitle() {
        return await super.getElement(pageTitle);
    }

    async getConsultationForm() {
        return await super.getElement(consultationForm);
    }

    async getFeedbackNameInput() {
        return await super.getElement(feedbackNameInput);
    }

    async getFeedbackNameErrorMsg() {
        return await super.getElement(feedbackNameErrorMsg);
    }

    async getFeedbackPhoneInput() {
        return await super.getElement(feedbackPhoneInput);
    }

    async getFeedbackPhoneErrorMsg() {
        return await super.getElement(feedbackPhoneErrorMsg);
    }

    async getServicesTabs() {
        return await super.getElementsArray(servicesTabs);
    }

    async getVehiclesTabs() {
        return await super.getElementsArray(vehiclesTabs);
    }

    async getSectionItems(sectionName: string) {
        switch (sectionName) {
            case 'vehicles':
                return await super.getElement(vehicles);
                break;
            case 'services':
                return await super.getElement(services);
                break;
            default:
                throw new Error(`Unsupported section name: ${sectionName}`);
        }
    }

    async getSectionItemCount(sectionName: string) {
        switch (sectionName) {
            case 'vehicles':
                return await super.getElementsCount(vehicles);
                break;
            case 'services':
                return await super.getElementsCount(services);
                break;
            default:
                throw new Error(`Unsupported section name: ${sectionName}`);
        }
    }

    async clickFeedbackPhoneInput() {
        await super.clickElement(feedbackPhoneInput);
    }

    async clickSectionTab(sectionName: string, index: number) {
        switch (sectionName) {
            case 'vehicles':
                await super.clickElementByIndex(vehiclesTabs, index);
                break;
            case 'services':
                await super.clickElementByIndex(servicesTabs, index);
                break;
            default:
                throw new Error(`Unsupported section name: ${sectionName}`);
        }
    }

    async clickSectionItem(sectionName: string, index: number) {
        switch (sectionName) {
            case 'vehicles':
                await super.clickElementByIndex(vehicles, index);
                await super.pause(1000);
                break;
            case 'services':
                await super.clickElementByIndex(services, index);
                await super.pause(1000);
                break;
            default:
                throw new Error(`Unsupported section name: ${sectionName}`);
        }
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

    async scrollToSection(sectionName: string) {
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