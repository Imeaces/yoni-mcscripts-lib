import { VanillaWorld, Minecraft } from "./basis.js";

import { Location } from "./Location.js";

import { YoniEntity, YoniPlayer } from "./entity.js";

import { LocationParamsOneArg, Vector3 } from "./Location.js";
import { DimensionLikeValue } from "./dim.js";

import { YoniBlock, Block } from "./block.js";
import { EntityBase } from "./entity/EntityBase.js";
import { Command } from "./command.js";

import { DimensionValues } from "./dim.js";

export class Dimension {
    static #dimensionMappings = new Map();
    
    static toDimension(dimid: DimensionLikeValue): YoniDimension {
        let vanilla: Minecraft.Dimension | null = null;
        if (typeof dimid === "string" || typeof dimid === "number"){
            vanilla = DimensionValues[dimid];
            if (vanilla == null){
                //此处可能抛出错误，如果参数错误的话
                vanilla = VanillaWorld.getDimension(dimid as string);
            }
        } else if (dimid instanceof Dimension){
            return dimid as YoniDimension;
        } else if (dimid instanceof Minecraft.Dimension){
            vanilla = dimid;
        }
        
        if (vanilla == null){
            throw new Error("specific identifier doesn't refer to a dimension");
        }
        let result = Dimension.#dimensionMappings.get(vanilla);
        if (result === undefined){
            result = new Dimension(vanilla);
            Dimension.#dimensionMappings.set(vanilla, result);
        }
        return result;
    }

    static isDimension(object: any): object is (Minecraft.Dimension | YoniDimension | Dimension){
        return object instanceof Minecraft.Dimension || object instanceof Dimension;
    }
    
    // @ts-ignore
    readonly vanillaDimension: Minecraft.Dimension;
    /**
     * Identifier of the dimension.
     * @throws This property can throw when used.
     */
    // @ts-ignore
    readonly id: string;
    
    /**
     * @hideconstructor
     * @param {Minecraft.Dimension}
     */
    protected constructor(vanillaDimension: Minecraft.Dimension){
        Object.defineProperty(this, "vanillaDimension", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: vanillaDimension
        });
        Object.defineProperty(this, "id", {
            configurable: true,
            enumerable: false,
            get(){
                return this.vanillaDimension.id;
            },
            set(v: any){
                // @ts-ignore
                this.vanillaDimension.id = v;
            }
        });
    }
    /**
     * @beta
     * @remarks
     * Returns a block instance at the given location. This method
     * was introduced as of version 1.17.10.21.
     * @param location
     * The location at which to return a block.
     * @returns
     * Block at the specified location.
     * @throws This function can throw errors.
     */
    getBlock(location: LocationParamsOneArg): YoniBlock {
        let loc: Location;
        if (location instanceof Location){
            loc = location;
        } else {
            loc = new Location(location);
        }
        let vanillaBlock = this.vanillaDimension.getBlock(loc.getVanillaBlockLocation());
        if (vanillaBlock)
            return Block.from(vanillaBlock);
        else
            throw new Error("This location has not been loaded\n"+loc.toString());
    }
    /**
     * @beta
     * @remarks
     * Gets the first block that intersects with a vector emanating
     * from a location.
     * @param location
     * @param direction
     * @param options
     * Additional options for processing this raycast query.
     * @throws This function can throw errors.
     */
    getBlockFromRay(location: Vector3, direction: Vector3, options?: Minecraft.BlockRaycastOptions): YoniBlock {
        //@ts-ignore
        return Block.from(this.vanillaDimension.getBlockFromRay.apply(this.vanillaDimension, arguments)) ?? null;
    }
    /**
     * @beta
     * @remarks
     * Returns a set of entities based on a set of conditions
     * defined via the EntityQueryOptions set of filter criteria.
     * @param getEntities
     * @returns
     * An entity array.
     * @throws This function can throw errors.
     * @example testThatEntityIsFeatherItem.ts
     * ```typescript
     *        const query = {
     *          type: "item",
     *          location: targetLocation,
     *        };
     *        const items = overworld.getEntities(query);
     *
     *        for (const item of items) {
     *          const itemComp = item.getComponent("item") as any;
     *
     *          if (itemComp) {
     *            if (itemComp.itemStack.id.endsWith("feather")) {
     *              console.log("Success! Found a feather", 1);
     *            }
     *          }
     *        }
     *
     * ```
     */
    * getEntities(getEntities?: Minecraft.EntityQueryOptions): Generator<YoniEntity> {
        //@ts-ignore
        for (let ent of this.vanillaDimension.getEntities.apply(this.vanillaDimension, arguments)){
            yield EntityBase.from(ent) as YoniEntity;
        }
    }
    /**
     * @beta
     * @remarks
     * Returns a set of entities at a particular location.
     * @param location
     * The location at which to return entities.
     * @returns
     * Zero or more entities at the specified location.
     */
    getEntitiesAtBlockLocation(location: Vector3): YoniEntity[] {
        //@ts-ignore
        return this.vanillaDimension.getEntitiesAtBlockLocation.apply(this.vanillaDimension, arguments).map(EntityBase.from);
    }
    /**
     * @beta
     * @remarks
     * Gets entities that intersect with a specified vector
     * emanating from a location.
     * @param location
     * @param direction
     * @param options
     * Additional options for processing this raycast query.
     * @throws This function can throw errors.
     */
    getEntitiesFromRay(location: Vector3, direction: Vector3, options?: Minecraft.EntityRaycastOptions): YoniEntity[] {
        //@ts-ignore
        return this.vanillaDimension.getEntitiesFromRay.apply(this.vanillaDimension, arguments).map(EntityBase.from);
    }
    /**
     * @beta
     * @remarks
     * Returns a set of players based on a set of conditions
     * defined via the EntityQueryOptions set of filter criteria.
     * @param getPlayers
     * @returns
     * A player array.
     * @throws This function can throw errors.
     */
    getPlayers(getPlayers?: Minecraft.EntityQueryOptions): YoniPlayer[] {
        //@ts-ignore
        return this.vanillaDimension.getPlayers.apply(this.vanillaDimension, arguments).map(EntityBase.from);
    }
    fetchCommand(commandString: string){
        return Command.fetchExecute(this.vanillaDimension, commandString);
    }
    /**
     * @beta
     * @remarks
     * Creates a new entity (e.g., a mob) at the specified
     * location.
     * @param identifier
     * Identifier of the type of entity to spawn. If no namespace
     * is specified, 'minecraft:' is assumed.
     * @param location
     * The location at which to create the entity.
     * @returns
     * Newly created entity at the specified location.
     * @throws This function can throw errors.
     * @example createOldHorse.ts
     * ```typescript
     *          // create a horse and trigger the 'ageable_grow_up' event, ensuring the horse is created as an adult
     *          overworld.spawnEntity("minecraft:horse<minecraft:ageable_grow_up>", targetLocation);
     * ```
     * @example quickFoxLazyDog.ts
     * ```typescript
     *        const fox = overworld.spawnEntity("minecraft:fox", {
     *          x: targetLocation.x + 1,
     *          y: targetLocation.y + 2,
     *          z: targetLocation.z + 3,
     *        });
     *        fox.addEffect(mc.MinecraftEffectTypes.speed, 10, 20);
     *        log("Created a fox.");
     *
     *        const wolf = overworld.spawnEntity("minecraft:wolf", {
     *          x: targetLocation.x + 4,
     *          y: targetLocation.y + 2,
     *          z: targetLocation.z + 3,
     *        });
     *        wolf.addEffect(mc.MinecraftEffectTypes.slowness, 10, 20);
     *        wolf.isSneaking = true;
     *        log("Created a sneaking wolf.", 1);
     *
     * ```
     * @example trapTick.ts
     * ```typescript
     *          let ticks = 0;
     *
     *          mc.world.events.tick.subscribe((event: mc.TickEvent) => {
     *            ticks++;
     *
     *            // Minecraft runs at 20 ticks per second
     *            if (ticks % 1200 === 0) {
     *              overworld.runCommand("say Another minute passes...");
     *            }
     *          });
     * ```
     */
    spawnEntity(identifier: string, location: Vector3): YoniEntity {
        //@ts-ignore
        return EntityBase.from(this.vanillaDimension.spawnEntity.apply(this.vanillaDimension, arguments));
    }
    /**
     * @beta
     * @remarks
     * Creates a new item stack as an entity at the specified
     * location.
     * @param item
     * @param location
     * The location at which to create the item stack.
     * @returns
     * Newly created item stack entity at the specified location.
     * @throws This function can throw errors.
     * @example itemStacks.ts
     * ```typescript
     *        const oneItemLoc: mc.Vector3 = { x: 3, y: 2, z: 1 };
     *        const fiveItemsLoc: mc.Vector3 = { x: 1, y: 2, z: 1 };
     *        const diamondPickaxeLoc: mc.Vector3 = { x: 2, y: 2, z: 4 };
     *
     *        const oneEmerald = new mc.ItemStack(mc.MinecraftItemTypes.emerald, 1, 0);
     *        const onePickaxe = new mc.ItemStack(mc.MinecraftItemTypes.diamondPickaxe, 1, 0);
     *        const fiveEmeralds = new mc.ItemStack(mc.MinecraftItemTypes.emerald, 5, 0);
     *
     *        overworld.spawnItem(oneEmerald, oneItemLoc);
     *        overworld.spawnItem(fiveEmeralds, fiveItemsLoc);
     *        overworld.spawnItem(onePickaxe, diamondPickaxeLoc);
     *
     * ```
     * @example spawnItem.ts
     * ```typescript
     *          const featherItem = new mc.ItemStack(mc.MinecraftItemTypes.feather, 1, 0);
     *
     *          overworld.spawnItem(featherItem, targetLocation);
     *          log("New feather created!");
     * ```
     */
    spawnItem(item: Minecraft.ItemStack, location: Vector3): YoniEntity {
        //@ts-ignore
        return EntityBase.getYoniEntity(this.vanillaDimension.spawnItem.apply(this.vanillaDimension, arguments));
    }
    /**
     * @beta
     * @remarks
     * Creates a new particle emitter at a specified location in
     * the world.
     * @param effectName
     * Identifier of the particle to create.
     * @param location
     * The location at which to create the particle emitter.
     * @param molangVariables
     * A set of additional, customizable variables that can be
     * adjusted for this particle emitter.
     * @returns
     * Newly created entity at the specified location.
     */
    spawnParticle(effectName: string, location: Vector3, molangVariables: Minecraft.MolangVariableMap): void {
        //@ts-ignore
        return this.vanillaDimension.spawnParticle.apply(this.vanillaDimension, arguments);
    }
}

type BaseVanillaDimensionClass = Omit<Minecraft.Dimension, keyof Dimension>;
export type YoniDimension = Dimension & BaseVanillaDimensionClass;
