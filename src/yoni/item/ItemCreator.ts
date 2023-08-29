import { Minecraft } from "../basis.js";

/**
 * 允许开发者调用一连串方法来调整出需要的物品对象。
 */
export class ItemCreator {
    /**
     * 正在修改中的物品对象。所有修改都会直接应用到此物品对象当中。
     * @types {Minecraft.ItemStack}
     */
    get itemStack(): Minecraft.ItemStack {
        if (this.#itemStack)
            return this.#itemStack;
        throw Error("物品不存在，可能物品数量为0？");
    }
    set itemStack(itemStack: Minecraft.ItemStack){
        this.#itemStack = itemStack;
    }
    /**
     * @types {Minecraft.ItemStack}
     */
    #itemStack?: Minecraft.ItemStack | void;
    /**
     * 传入一个物品对象，然后复制它，随后可以修改它的副本。
     * @param {Minecraft.ItemStack} itemStack 
     */
    constructor(itemStack: Minecraft.ItemStack)
    /**
     * 创建一个新的物品对象，随后可以修改它。
     * @param {Minecraft.ItemStack} itemStack 
     */
    constructor(itemType: Minecraft.ItemType | string, amount?: number)
    /**
     * 创建一个新的物品对象，或使用现有的物品对象，随后可以修改它。
     * @param {Minecraft.ItemStack|Minecraft.ItemType|string} itemStack 
     * @param {number} [amount] 
     */
    constructor(itemStack: Minecraft.ItemType | string | Minecraft.ItemStack, amount?: number){
        this.#itemStack = itemStack instanceof Minecraft.ItemStack
            ? itemStack
            : new Minecraft.ItemStack(itemStack);
        
        if (amount != undefined)
            this.setAmount(amount);
    }
    /**
     * 转换物品的类型，这可能会导致错误。
     * @param {Minecraft.ItemType|string} type 新的物品类型。 
     * @param {boolean} [ignoreError] 指示忽略过程中的所有错误。 
     * @returns {this} 返回 this
     */
    setType(type: Minecraft.ItemType | string, ignoreError: boolean = false): this {
        const newItemCreator = new ItemCreator(new Minecraft.ItemStack(type));
        const oldItem = this.itemStack;
        
        if (oldItem.hasComponent("enchantments")){
            const oldEnchants = ItemCreator.getEnchantmentList(oldItem);
            for (const ench of oldEnchants){
                tryExecute(() => {
                    newItemCreator.addEnchant(ench, true);
                }, ignoreError);
            }
        }
        
        if (oldItem.hasComponent("durability")){
            const oldDamage = (oldItem.getComponent("minecraft:durability") as Minecraft.ItemDurabilityComponent).damage;
            newItemCreator.setDurability(oldDamage);
        }
        
        if (oldItem.nameTag)
        tryExecute(() => {
            newItemCreator.setNameTag(oldItem.nameTag);
        }, ignoreError);
        
        tryExecute(() => {
            newItemCreator.setAmount(oldItem.amount);
        }, ignoreError);
        
        tryExecute(() => {
            newItemCreator.setKeepOnDeath(oldItem.keepOnDeath);
        }, ignoreError);
        
        tryExecute(() => {
            newItemCreator.setLockMode(oldItem.lockMode);
        }, ignoreError);
        
        const lore = oldItem.getLore();
        if (lore.length > 0)
        tryExecute(() => {
            newItemCreator.setLore(lore);
        }, ignoreError);
        
        return this;
    }
    /**
     * 增减物品数量。
     * @param {number} amount 一个数字，将会在现有数量上加上它。
     * @returns {this} 返回 this
     */
    changeAmount(amount: number): this {
        amount = this.itemStack.amount + amount;
        this.setAmount(amount);
        return this;
    }
    /**
     * 修改物品数量，将数量减为0将导致物品消失。
     * @param {number} amount 一个数字，代表新的数量。
     * @returns {this} 返回 this
     */
    setAmount(amount: number): this {
        this.itemStack.amount = amount;
        if (this.itemStack.amount < 1)
            this.#itemStack = undefined;
        return this;
    }
    /**
     * 删除物品的 lore 文本。
     * @returns {this} 返回 this
     */
    removeLore(): this {
        this.itemStack.setLore([]);
        return this;
    }
    /**
     * 修改物品的 lore 文本。
     * @param {string[]} loreList lore 文本列表。
     * @returns {this} 返回 this
     */
    setLore(loreList: string[]): this {
        if (typeof loreList === "string")
            loreList = [loreList];
        this.itemStack.setLore(loreList);
        return this;
    }
    /**
     * 设置物品存在于物品栏中时，使用的锁定模式。
     * @param {Minecraft.ItemLockMode} mode 模式。
     * @returns {this} 返回 this
     */
    setLockMode(mode: Minecraft.ItemLockMode): this {
        this.itemStack.lockMode = mode;
        return this;
    }
    /**
     * 设置物品存在于玩家的物品栏中时，是否会在玩家死亡时掉落。
     * @param {boolean} keepOnDeath 是否启用。
     * @returns {this} 返回 this
     */
    setKeepOnDeath(keepOnDeath: boolean): this {
        this.itemStack.keepOnDeath = keepOnDeath;
        return this;
    }
    /**
     * 设置物品的名称。
     * @param {string} [nameTag] 物品的名称，为空时清除。
     * @returns {this} 返回 this
     */
    setNameTag(nameTag?: string): this {
        this.itemStack.nameTag = nameTag;
        return this;
    }
    /**
     * 清除物品设置的名称。
     * @returns {this} 返回 this
     */
    removeNameTag(): this {
        this.itemStack.nameTag = undefined;
        return this;
    }
    /**
     * 对物品造成耐久消耗，这会受到耐久附魔的影响。如果需要直接修改耐久，请使用{@link ItemCreator#setDurability}。
     * @param {number} damage 要造成耐久消耗的次数。
     * @param {number} [unbreaking] 可选，额外指定耐久附魔的等级。
     * @returns {this} 返回 this
     */
    takeDamage(damage: number, unbreaking?: number): this {
        ItemCreator.takeDurability(this.itemStack, damage, unbreaking);
        return this;
    }
    /**
     * 增减物品的耐久消耗度。
     * @param {number} damage 一个数字，将会在现有耐久消耗度上加上它。
     * @returns {this} 返回 this
     */
    changeDurability(damage: number): this {
        const component = this.itemStack.getComponent("minecraft:durability") as Minecraft.ItemDurabilityComponent;
        component.damage = Math.max(0, component.damage + Math.min(component.maxDurability - component.damage, damage));
        return this;
    }
    /**
     * 修改物品耐久消耗度。
     * @param {number} amount 一个数字，代表新的耐久消耗度。
     * @returns {this} 返回 this
     */
    setDurability(damage: number): this {
        const component = this.itemStack.getComponent("minecraft:durability") as Minecraft.ItemDurabilityComponent;
        component.damage = damage;
        return this;
    }
    /**
     * 为物品增添新的附魔。
     * @param newEnchantment 新添加的附魔。
     * @param override 如果为真，则替换现有附魔（如果附魔存在）；否则，为现有附魔条目提升附魔等级。默认为替换附魔。
     * @returns 返回 this
     */
    addEnchant(newEnchantment: Enchantment, override?: boolean): this
    /**
     * 为物品增添新的附魔。
     * @param newEnchantment 新添加的附魔类型。
     * @param level 新添加的附魔的等级，默认为 1 级。
     * @param override 如果为真，则替换现有附魔（如果附魔存在）；否则，为现有附魔条目提升附魔等级。默认为替换附魔。
     * @returns 返回 this
     */
    addEnchant(newEnchantment: string | Minecraft.EnchantmentType, level: number, override?: boolean): this
    /**
     * 为物品增添新的附魔。
     * @param {Minecraft.Enchantment|Minecraft.EnchantmentType|string} newEnchantment 新添加的附魔类型。
     * @param {number} level 新添加的附魔的等级，默认为 1 级。
     * @param {boolean} [override] 如果为真，则替换现有附魔（如果附魔存在）；否则，为现有附魔条目提升附魔等级。默认为替换附魔。
     * @returns {this} 返回 this
     */
    addEnchant(newEnchantment: unknown, level: unknown, override: unknown = true): this {
        let ench: Enchantment;
        if (level === true || level === false || level === undefined){
            override = (level as boolean) ?? true;
            ench = newEnchantment as Enchantment;
        } else {
            ench = {
                type: newEnchantment as (string | Minecraft.EnchantmentType),
                level: (level as number) ?? 1
            };
        }
        
        this.addEnchants([ench], override as boolean);
        return this;
    }
    /**
     * 为物品增添一系列新的附魔。
     * @param {Enchantment[]} newEnchantments 新添加的附魔。
     * @param {boolean} [override] 如果为真，则替换现有附魔（如果附魔存在）；否则，为现有附魔条目提升附魔等级。默认为替换附魔。
     * @returns {this} 返回 this
     */
    addEnchants(newEnchantments: Enchantment[], override: boolean = true): this {
        const enchantmentList = ItemCreator.getEnchantmentList(this.itemStack);
        
        if (!override)
            newEnchantments = newEnchantments.map(ench => {
                let { type, level } = ench;
                if (enchantmentList.hasEnchantment(type))
                    level += (enchantmentList.getEnchantment(type) as Minecraft.Enchantment).level;
                
                return { type, level };
            });

        for (const ench of newEnchantments){
            if (enchantmentList.hasEnchantment(ench.type))
                enchantmentList.removeEnchantment(ench.type);

            if (ench.level > 0)
                enchantmentList.addEnchantment(ItemCreator.getEnchantment(ench.type, ench.level));
        }
        
        ItemCreator.setEnchantmentList(this.itemStack, enchantmentList);
        
        return this;
    }
    /**
     * 从物品上移除附魔。
     * @param enchantment 要移除的附魔类型，将物品上拥有的附魔的等级与指定附魔条目的等级相减。
     * @param completelyMatches 如果为真，则只有在附魔完全相同时才会移除。默认为真。
     * @returns 返回 this
     */
    removeEnchant(enchantment: Enchantment, completelyMatches?: boolean): this
    /**
     * 从物品上移除附魔。
     * @param enchantmentType 要移除的附魔类型。
     * @param level 要移除的附魔的等级，不设置 或 设置为 0 则以已有的附魔等级为此参数的值。
     * @param completelyMatches 如果为真，则只有在附魔完全相同时才会移除。默认为真。
     * @returns 返回 this
     */
    removeEnchant(enchantmentType: string | Minecraft.EnchantmentType, level?: number, completelyMatches?: boolean): this
    /**
     * 从物品上移除附魔。
     * @param {Minecraft.Enchantment|Minecraft.EnchantmentType|string} newEnchantment 要移除的附魔类型。
     * @param {number} [level] 要移除的附魔的等级，不设置 或 设置为 0 则以已有的附魔等级为此参数的值。
     * @param {boolean} [override] 如果为真，则只有在附魔完全相同时才会移除。默认为真。
     * @returns {this} 返回 this
     */
    removeEnchant(enchantment: Enchantment | string | Minecraft.EnchantmentType, level: number | boolean = 0, completelyMatches: unknown = true): this {
        let enchantmentType: Minecraft.EnchantmentType | string;
        if (level === true || level === false || level === 0){
            if (enchantment instanceof Minecraft.EnchantmentType || typeof enchantment === "string"){
                enchantmentType = enchantment;
            } else {
                enchantmentType = (enchantment as Enchantment).type;
                completelyMatches = level === 0 ? true : (level as boolean);
                level = (enchantment as Enchantment).level;
            }
        } else {
            enchantmentType = enchantment as (string | Minecraft.EnchantmentType);
        }

        const enchantmentList = ItemCreator.getEnchantmentList(this.itemStack);
        
        if (enchantmentList.hasEnchantment(enchantmentType)){
            const oldEnchantment = enchantmentList.getEnchantment(enchantmentType) as Minecraft.Enchantment;
            
            if (!completelyMatches || (completelyMatches && (level === 0 || oldEnchantment.level === level))){
                enchantmentList.removeEnchantment(enchantmentType);
                
                if (level !== 0){
                    let { type, level: level0 } = oldEnchantment;
                    level0 -= (level as number);
                    if (level0 > 0){
                        enchantmentList.addEnchantment(ItemCreator.getEnchantment(enchantmentType, level0));
                    }
                }
                
                ItemCreator.setEnchantmentList(this.itemStack, enchantmentList);
            }
        }
        return this;
    }
    /**
     * 从物品上移除所有附魔。
     * @returns {this} 返回 this
     */
    removeAllEnchants(): this {
        const component = this.itemStack.getComponent("minecraft:enchantments") as Minecraft.ItemEnchantsComponent;
        component.removeAllEnchantments();
        return this;
    }
    /**
     * 复制物品对象。
     * @returns {this} 返回 this
     */
    cloneItem(): this {
        this.itemStack = this.itemStack.clone();
        return this;
    }
    /**
     * 创建此 ItemCreator 以及其内部的物品对象的副本。
     * @returns {ItemCreator} 返回新的 ItemCreator。
     */
    clone(): ItemCreator {
        return new ItemCreator(this.itemStack.clone());
    }
    /**
     * 复制附魔列表。
     * @param {Minecraft.EnchantmentList} list 要复制的附魔列表。
     * @returns {Minecraft.EnchantmentList}
     */
    static cloneEnchantmentList(list: Minecraft.EnchantmentList): Minecraft.EnchantmentList {
        const newList = new Minecraft.EnchantmentList(list.slot);
        for (const ench of list)
            newList.addEnchantment(ench);
        return newList;
    }
    
    /**
     * 获取附魔类型对象。
     * @param {Minecraft.EnchantmentType|string} ench
     * @returns {Minecraft.EnchantmentType}
     */
    static getEnchantmentType(ench: string | Minecraft.EnchantmentType): Minecraft.EnchantmentType {
        return typeof ench === "string" ? Minecraft.EnchantmentTypes.get(ench) as Minecraft.EnchantmentType: ench;
    }
    
    /**
     * 获取附魔对象。
     * @param {Minecraft.EnchantmentType|string} enchantmentType 附魔类型。
     * @param {Minecraft.EnchantmentType|string} level 附魔等级。
     * @returns {Minecraft.Enchantment}
     */
    static getEnchantment(enchantmentType: string | Minecraft.EnchantmentType, level: number = 1): Minecraft.Enchantment {
        const ench = new Minecraft.Enchantment(enchantmentType);
        ench.level = level;
        return ench;
    }
    /**
     * 获取物品的附魔列表。
     * @param {Minecraft.ItemStack} itemStack 物品。
     * @returns {Minecraft.EnchantmentList}
     */
    static getEnchantmentList(itemStack: Minecraft.ItemStack): Minecraft.EnchantmentList {
        const component = itemStack.getComponent("minecraft:enchantments") as Minecraft.ItemEnchantsComponent;
        return component.enchantments;
    }
    /**
     * 设置物品的附魔列表。
     * @param {Minecraft.ItemStack} itemStack 物品。
     * @param {Minecraft.EnchantmentList} list 要使用的附魔列表。
     * @returns {Minecraft.ItemStack}
     */
    static setEnchantmentList(itemStack: Minecraft.ItemStack, list: Minecraft.EnchantmentList): Minecraft.ItemStack {
        const component = itemStack.getComponent("minecraft:enchantments") as Minecraft.ItemEnchantsComponent;
        component.enchantments = list;
        return itemStack;
    }
    /**
     * 对物品造成耐久消耗，这会受到耐久附魔的影响。
     * @param {Minecraft.ItemStack} itemStack 物品。
     * @param {number} damage 要造成耐久消耗的次数。
     * @param {number} [unbreaking] 可选，额外指定耐久附魔的等级。
     * @returns {this} 返回 this
     */
    static takeDurability(itemStack: Minecraft.ItemStack, damage: number, unbreaking?: number): Minecraft.ItemStack {
        const enchantments = ItemCreator.getEnchantmentList(itemStack);
        if (!unbreaking && enchantments.hasEnchantment("unbreaking"))
            unbreaking = enchantments.getEnchantment("unbreaking")?.level;
        
        const component = itemStack.getComponent("minecraft:durability") as Minecraft.ItemDurabilityComponent;
        let damageChance: number;
        if (!unbreaking || unbreaking === 0)
            damageChance = 100;
        else
            damageChance = component.getDamageChance(unbreaking);
        
        let totalDamage = 0;
        
        if (damageChance === 100)
            totalDamage += damage;
        else
            while (damage-- > 0){
                if (Math.random() * 100 > damageChance)
                    totalDamage += 1;
            }
        
        component.damage += totalDamage;
        return itemStack;
    }
}

interface Enchantment {
    type: Minecraft.EnchantmentType | string
    level: number
}

function deleteFirst<T>(array: Array<T>, element: T): Array<T> {
    const index = array.indexOf(element);
    if (index !== -1)
        array.splice(index, 1);
    
    return array;
}

function tryExecute(func: () => void, ignoreError: boolean = false): void {
    if (ignoreError)
    try {
        func();
    } catch {
        //ignore all errors
    }
    else
        func();
}