import { DateTime } from "luxon";

export default class Helper {
    getImageNameFromSrc(src: string) {
        const decodedSrc = decodeURIComponent(src);
        const imageName = decodedSrc.substring(decodedSrc.lastIndexOf('/') + 1).split('&')[0];
        const imageNameWithoutIdentifier = imageName.replace(/_.*(?=\.)/, "");
        return imageNameWithoutIdentifier;
    }

    mixCase(inputString: string): string {
        let mixedString = '';
        for (let i = 0; i < inputString.length; i++) {
            if (Math.random() < 0.5) {
                mixedString += inputString[i].toUpperCase();
            } else {
                mixedString += inputString[i].toLowerCase();
            }
        }
        return mixedString;
    }

    generatePartialName(name: string): string {
        const minLength = 3;
        const maxLength = Math.min(name.length, 10);
        const partialLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
        const startPos = Math.floor(Math.random() * (name.length - partialLength + 1));
        return name.substring(startPos, partialLength);
    }

    capitalizeAndTrim(input: string) {
        return input.trim().charAt(0).toUpperCase() + input.trim().slice(1);
    }

    removeSpaces(input: string) {
        return input.replace(/\s+/g, '');
    }

    getNumbersFromString(input: string) {
        return input.replace(/\D/g, '');
    }

    addHoursToDate(initialDate: string, hours: number, endHour: boolean = false): Date {
        const date = DateTime.fromFormat(initialDate, 'dd.MM.yyyy, H:mm', { zone: 'utc' });
        endHour && date.endOf('hour');
        return date.plus({ hours }).toJSDate();
    }

    addDaysToDate(initialDate: string | Date, days: number, endDay: boolean = false, fromFormat: boolean = true) {
        const date = fromFormat ? DateTime.fromFormat(initialDate as string, 'dd.MM.yyyy, H:mm', { zone: 'utc' }) : DateTime.fromJSDate(initialDate as Date, { zone: 'utc' });
        endDay && date.endOf('day');
        return date.plus({ days }).toJSDate();
    }

    subtractDaysFromDate(initialDate: string | Date, days: number, endDay: boolean = false, fromFormat: boolean = true) {
        const date = fromFormat ? DateTime.fromFormat(initialDate as string, 'dd.MM.yyyy, H:mm', { zone: 'utc' }) : DateTime.fromJSDate(initialDate as Date, { zone: 'utc' });
        endDay && date.endOf('day');
        return date.minus({ days }).toJSDate();
    }

    convertDateToString(date: Date) {
        return DateTime.fromJSDate(date).toFormat('dd.MM.yyyy');
    }
}