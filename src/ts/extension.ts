interface String {
    toRegExp(): RegExp;
    replaceAll(from: string | RegExp, to: string): string;
    capital(): string;
}

String.prototype.toRegExp = function (): RegExp {
    return new RegExp(String(this).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
};

String.prototype.replaceAll = function (from: string | RegExp, to: string): string {
    if (from instanceof RegExp) {
        const re = new RegExp(from as RegExp, 'g');
        return String(this).replace(re, to);
    } else {
        // return String(this).replaceAll((from as string).toRegExp(), to);
        let result: string = String(this);
        while (result.indexOf(from as string) !== -1) {
            result = result.replace(from as string, to);
        }
        return result;
    }
};

String.prototype.capital = function (): string {
    return String(this).replace(String(this)[0], String(this)[0].toUpperCase());
};
