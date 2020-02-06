interface String {
    replaceAll(from: string | RegExp, to: string): string;
}

String.prototype.replaceAll = function (from: string | RegExp, to: string): string {
    if (from instanceof String) {
        return String(this).split(from as string).join(to);
    } else {
        const re = new RegExp(from as RegExp, 'g');
        return String(this).replace(re, to);
    }
};
