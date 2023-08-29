import { Minecraft } from "../basis.js";

/**
 * 允许开发者调用一连串方法来调整出需要的物品对象。
 */
export class ItemUpdater {
    /**
     * 所有修改都会直接应用到此物品对象当中。
     */
    itemStack: Minecraft.ItemStack;
    constructor(itemStack: Minecraft.ItemStack){
        this.itemStack = itemStack;
    }
    setAmount(amount: number): this {
        this.itemStack.amount = amount;
        return this;
    }
    setLore(loreList: string[]): this {
        this.itemStack.setLore(loreList);
        return this;
    }
    setLockMode(mode: Minecraft.ItemLockMode): this {
        this.itemStack.lockMode = mode;
        return this;
    }
    setKeepOnDeath(keepOnDeath: boolean): this {
        this.itemStack.keepOnDeath = keepOnDeath;
        return this;
    }
    setNameTag(nameTag?: string): this {
        this.itemStack.nameTag = nameTag;
        return this;
    }
    removeNameTag(): this {
        this.itemStack.nameTag = undefined;
        return this;
    }
    /**
     * 为物品增添新的附魔。
     * @param newEnchantment 新添加的附魔。
     * @param override 如果为真，则替换现有附魔（如果附魔存在）；否则，为现有附魔条目提升附魔等级。
     * @returns 返回 this
     */
    addEnchant(newEnchantment: Enchantment, override?: boolean): this
    /**
     * 为物品增添新的附魔。
     * @param newEnchantment 新添加的附魔类型。
     * @param level 新添加的附魔的等级，默认为 1 级。
     * @param override 如果为真，则替换现有附魔（如果附魔存在）；否则，为现有附魔条目提升附魔等级。
     * @returns 返回 this
     */
    addEnchant(newEnchantment: string | Minecraft.EnchantmentType, level: number, override?: boolean): this
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
    addEnchants(newEnchantments: Enchantment[], override: boolean = true): this {
        const component = this.itemStack.getComponent("minecraft:enchantments") as Minecraft.ItemEnchantsComponent;
        const { enchantments: enchantmentList } = component;
        
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
                enchantmentList.addEnchantment(ItemUpdater.getEnchantment(ench.type, ench.level));
        }
        
        component.enchantments = enchantmentList;
        
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

        const component = this.itemStack.getComponent("minecraft:enchantments") as Minecraft.ItemEnchantsComponent;
        const { enchantments: enchantmentList } = component;
        
        if (enchantmentList.hasEnchantment(enchantmentType)){
            const oldEnchantment = enchantmentList.getEnchantment(enchantmentType) as Minecraft.Enchantment;
            
            if (!completelyMatches || (completelyMatches && (level === 0 || oldEnchantment.level === level))){
                enchantmentList.removeEnchantment(enchantmentType);
                
                if (level !== 0){
                    let { type, level: level0 } = oldEnchantment;
                    level0 -= (level as number);
                    if (level0 > 0){
                        enchantmentList.addEnchantment(ItemUpdater.getEnchantment(enchantmentType, level0));
                    }
                }
                
                component.enchantments = enchantmentList;
            }
        }
        return this;
    }
    static cloneEnchantmentList(list: Minecraft.EnchantmentList): Minecraft.EnchantmentList {
        const newList = new Minecraft.EnchantmentList(list.slot);
        for (const ench of list)
            newList.addEnchantment(ench);
        return newList;
    }
    
    static getEnchantmentType(ench: string | Minecraft.EnchantmentType): Minecraft.EnchantmentType {
        return typeof ench === "string" ? Minecraft.EnchantmentTypes.get(ench) as Minecraft.EnchantmentType: ench;
    }
    
    static getEnchantment(enchantmentType: string | Minecraft.EnchantmentType, level: number = 1): Minecraft.Enchantment {
        let ench = new Minecraft.Enchantment(enchantmentType);
        ench.level = level;
        return ench;
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