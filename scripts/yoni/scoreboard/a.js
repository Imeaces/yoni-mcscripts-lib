class a {
    static #b;
    #c;
    v(){
        this.#c=88;
        a.#b =99;
    }
    static s(){
        return a.#b;
    }
}