import Page from '../page';
import path from 'path';

const fileUploadInput: string = 'div[data-testid="dropDiv"] > input';
const uploadedDocumentNames: string = 'div[class*="DocumentsChoosing_name"]';
const deleteFileIcon: string = 'div[data-testid="deleteFile"]';
const nonValidImgPopUp: string = 'div[class*="PopupLayout_content"]';
const nonValidImgPopUpTitle: string = 'div[class*="PopupLayout_label"]';
const nonValidImgPopUpErrorMsg: string = 'div[data-testid="errorPopup"]';
const confirmNonValidImgPopUpBtn: string = 'div[class*="PopupLayout_content"] button';

export class Documentation extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    async getNonValidImgPopUp() {
        return await super.getElement(nonValidImgPopUp);
    }

    async getNonValidImgPopUpTitle() {
        return await super.getElement(nonValidImgPopUpTitle);
    }

    async getNonValidImagePopUpErrorMsg() {
        return await super.getElement(nonValidImgPopUpErrorMsg);
    }

    async getUploadedDocumentNames() {
        return await super.getElement(uploadedDocumentNames);
    }

    async clickConfirmNonValidImgPopUpBtn() {
        await super.clickElement(confirmNonValidImgPopUpBtn);
    }

    async uploadDocumentationFiles(dirName: string, filePathes: string[]) {
        const joinedFilePathes = filePathes.map(filePath => path.join(dirName, filePath));
        await super.uploadFiles(fileUploadInput, joinedFilePathes);
    }

    async deleteFirstUploadedFile() {
        await super.clickElementByIndex(deleteFileIcon, 0);
    }
}