export function convertBase(str: string, fromBase: number, toBase: number) {
    const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";

    const add = (x: string | any[], y: string | any[], base: number) => {
        let z = [];
        // @ts-ignore
        const n = Math.max(x.length, y.length);
        let carry = 0;
        let i = 0;
        while (i < n || carry) {
            // @ts-ignore
            const xi = i < x.length ? x[i] : 0;
            // @ts-ignore
            const yi = i < y.length ? y[i] : 0;
            const zi = carry + xi + yi;
            z.push(zi % base);
            carry = Math.floor(zi / base);
            i++;
        }
        return z;
    }

    const multiplyByNumber = (num: number, x: any[], base: number) => {
        if (num < 0) return [];
        if (num == 0) return [];

        let result: number[] = [];
        let power = x;
        while (true) {
            num & 1 && (result = add(result, power, base));
            num = num >> 1;
            if (num === 0) break;
            power = add(power, power, base);
        }

        return result;
    }

    const parseToDigitsArray = (str: string, base: number) => {
        // @ts-ignore
        const digits = str.split('');
        let arr = [];
        for (let i = digits.length - 1; i >= 0; i--) {
            const n = DIGITS.indexOf(digits[i])
            //if (n == -1) return null;
            arr.push(n);
        }
        return arr;
    }

    const digits = parseToDigitsArray(str, fromBase);
    //if (digits === null) return null;

    let outArray: string | any[] = [];
    let power: any[] = [1];
    for (let i = 0; i < digits.length; i++) {
        digits[i] && (outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase));
        power = multiplyByNumber(fromBase, power, toBase);
    }

    let out = '';
    for (let i = outArray.length - 1; i >= 0; i--)
        out += DIGITS[outArray[i]];

    return out;
}

export function pkToWallet(pk: string) {
    return convertBase(pk, 16, 62);
}

export function walletToPk(wallet: string) {
    return "0" + convertBase(wallet, 62, 16);
}