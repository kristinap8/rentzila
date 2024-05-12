import Page from '../page';
import path from 'path';

const fileUploadArea = '*[data-testid="dropDiv"]';
const fileUploadInput = '*[data-testid="dropDiv"] > input';
const fileUploadErrorMsg = '*[class*="DocumentsChoosing_errorTextVisible"]';

const uploadedDocumentNames = '*[class*="DocumentsChoosing_name"]';
const deleteFileIcon = '*[data-testid="deleteFile"]';

const nonValidImgPopUp = '*[class*="PopupLayout_content"]';
const nonValidImgPopUpTitle = '*[class*="PopupLayout_label"]';
const nonValidImgPopUpErrorMsg = '*[data-testid="errorPopup"]';
const confirmNonValidImgPopUpBtn = '*[class*="PopupLayout_content"] button';

export class DocumentationTab extends Page {
    constructor(page: Page['page']) {
        super(page);
    }

    getFileUploadArea() {
        return super.getElement(fileUploadArea);
    }

    getFileUploadErrorMsg() {
        return super.getElement(fileUploadErrorMsg);
    }


    getNonValidImgPopUp() {
        return super.getElement(nonValidImgPopUp);
    }

    getNonValidImgPopUpTitle() {
        return super.getElement(nonValidImgPopUpTitle);
    }

    getNonValidImagePopUpErrorMsg() {
        return super.getElement(nonValidImgPopUpErrorMsg);
    }

    getUploadedDocumentNames() {
        return super.getElement(uploadedDocumentNames);
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