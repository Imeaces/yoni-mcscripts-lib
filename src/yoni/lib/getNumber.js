export function getNumber(n){
    n = Number(n);
    if (!isFinite(n))
        throw new RangeError("number not finite");
    return n;
}
