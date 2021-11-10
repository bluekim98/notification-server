export function stringToArray(value: string | string[]) {
    if (Array.isArray(value)) return value;
    return [value];
}
