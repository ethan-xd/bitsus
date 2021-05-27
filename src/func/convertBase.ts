export function convertBase(str: string, fromBase: number, toBase: number) {
    const ALL_DIGITS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";

    const add = (x: number[], y: number[], base: number) => {
        let z = [];
        const n = Math.max(x.length, y.length);
        let carry = 0;
        let i = 0;
        while (i < n || carry) {
            const xi = i < x.length ? x[i] : 0;
            const yi = i < y.length ? y[i] : 0;
            const zi = carry + xi + yi;
            z.push(zi % base);
            carry = Math.floor(zi / base);
            i++;
        }
        return z;
    }

    const multiplyByNumber = (num: number, power: number[], base: number) => {
        if (num <= 0) return [];

        let result: number[] = [];
        while (true) {
            num & 1 && (result = add(result, power, base));
            num = num >> 1;
            if (num === 0) break;
            power = add(power, power, base);
        }

        return result;
    }


    /*const parseToDigitsArray = (str: string) => {
        const digits = str.split('');
        let arr = [];
        for (let i = digits.length - 1; i >= 0; i--) {
            const foundDigitInSet = ALL_DIGITS.indexOf(digits[i])
            if (foundDigitInSet === -1) continue;
            arr.push(foundDigitInSet);
        }
        return arr;
    }*/

    function parseToDigitsArray(str: string) {
        return str.split('').reverse().map(char => {
            const index = ALL_DIGITS.indexOf(char)
            if (index === -1)
                throw new Error(`you are retarded: ${char}`)
            else
                return index
        })
    }

    const digits = parseToDigitsArray(str);
    if (digits.length === 0) return "";

    let outArray: number[] = [];
    let power = [1];
    for (let i = 0; i < digits.length; i++) {
        digits[i] && (outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase));
        power = multiplyByNumber(fromBase, power, toBase);
    }

    let out = '';
    for (let i = outArray.length - 1; i >= 0; i--)
        out += ALL_DIGITS[outArray[i]];

    return out;
}

export function pkToWallet(pk: string) {
    return convertBase(pk, 16, 62);
}

export function walletToPk(wallet: string) {
    return "0" + convertBase(wallet, 62, 16);
}