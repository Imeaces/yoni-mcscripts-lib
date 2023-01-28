export default class ItemStack {
    constructor(item) {
        return new Proxy(item);
    }
}
