export default class Helper {
    getImageNameFromSrc(src: string) {
        const decodedSrc = decodeURIComponent(src);
        const imageName = decodedSrc.substring(decodedSrc.lastIndexOf('/') + 1).split('&')[0];
        return imageName;
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
}