import { Minecraft } from "../basis.js";
import { Location, Location1Arg, DimensionLike, Vector3 } from "../Location.js";
import { Dimension } from "../dimension.js";
import { Block } from "../block.js";
import { Entry } from "../scoreboard/Entry.js";
import { EntityBase } from "./EntityBase.js";
/**
 * 代表一个实体
 */
declare class Entity extends EntityBase {
    get [Symbol.toStringTag](): string;
    get id(): string;
    get typeId(): string;
    get velocity(): Vector3;
    get rotation(): Minecraft.XYRotation;
    get entityType(): Minecraft.EntityType;
    get dimension(): Dimension;
    get location(): Location;
    get uniqueId(): string;
    get scoreboard(): Entry;
    isAliveEntity(): boolean;
    isAlive(): boolean;
    /**
     * 获取实体的当前血量。
     */
    getCurrentHealth(): number;
    /**
     * 获取实体的血量组件。
     */
    getHealthComponent(): Minecraft.EntityHealthComponent;
    /**
     * 获取实体的物品栏容器。
     */
    getInventory(): Minecraft.Container;
    /**
     * 获取实体的最大血量。
     */
    getMaxHealth(): number;
    /**
     * 检测实体是否为某一族。
     * @abc
     * @param {string} family
     */
    hasFamily(family: string): boolean;
    /**
     * 检测实体是否有指定的多个族中的一个。
     * @param {...string} families
     * @returns {boolean}
     */
    hasAnyFamily(...families: string[]): boolean;
    /**
     * 请求以此实体的上下文执行命令。
     * @param {string} cmd
     * @returns {Promise<Minecraft.CommandResult>}
     */
    fetchCommand(cmd: string): Promise<import("../command.js").CommandResult>;
    /**
     * @param {string} message
     */
    say(message: string): Promise<import("../command.js").CommandResult>;
    /**
     * @param {number} v
     */
    setCurrentHealth(v: number): void;
    /**
     * 传入位置，将实体传送到指定位置
     * 允许两种长度的参数，由于此特性，补全提示可能会出现一些错误，已在补全中尝试修复。
     * 当传入了1个参数，被认为是yoni的方法
     * 当传入了2个参数，被认为是yoni的方法
     * 当传入了4个参数，被认为是原版的方法
     * 当传入了5个参数，被认为是原版的方法
     * yoni方法中，第一个参数认为是位置，第二个参数认为是keepVelocity
     * 原版方法中参数顺序为[location, dimension, rx, ry, keepVelocity?=null]
     * 所以你可以直接传入实体对象、方块对象、或者普通位置对象，或者接口
     * @param {import("./Location.js").Location1Arg|Minecraft.Vector3} argLocation
     * @param {Minecraft.Dimension} [argDimension]
     * @param {number} [argRx]
     * @param {number} [argRy]
     * @param {boolean} [keepVelocity]
     */
    teleport(...args: [
        Location1Arg
    ] | [Location1Arg, boolean] | [Vector3, DimensionLike, number, number] | [Vector3, DimensionLike, number, number, boolean]): void;
    /**
     * @beta
     * Given name of the entity.
     */
    get nameTag(): string;
    set nameTag(name: string);
    /**
     * @beta
     * Whether the entity is sneaking - that is, moving more slowly
     * and more quietly.
     */
    get isSneaking(): boolean;
    set isSneaking(isSneaking: boolean);
    /**
     * @beta
     * Retrieves or sets an entity that is used as the target of
     * AI-related behaviors, like attacking.
     * @throws This property can throw when used.
     */
    get target(): Entity;
    /**
     * @beta
     * @remarks
     * Adds an effect, like poison, to the entity.
     * @param effectType
     * Type of effect to add to the entity.
     * @param duration
     * Amount of time, in ticks, for the effect to apply.
     * @param amplifier
     * Optional amplification of the effect to apply.
     * @param showParticles
     * @throws This function can throw errors.
     * @example addEffect.js
     * ```typescript
     *        const villagerId = "minecraft:villager_v2<minecraft:ageable_grow_up>";
     *        const villagerLoc: mc.Vector3 = { x: 1, y: 2, z: 1 };
     *        const villager = test.spawn(villagerId, villagerLoc);
     *        const duration = 20;
     *
     *        villager.addEffect(MinecraftEffectTypes.poison, duration, 1);
     *
     *
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
     *
     * ```
     */
    addEffect(effectType: Minecraft.EffectType, duration: number, amplifier?: number, showParticles?: boolean): void;
    /**
     * @beta
     * @remarks
     * Adds a specified tag to an entity.
     * @param tag
     * Content of the tag to add.
     * @throws This function can throw errors.
     */
    addTag(tag: string): boolean;
    applyDamage(amount: number, source?: Minecraft.EntityDamageSource): boolean;
    applyImpulse(vector: Vector3): void;
    applyKnockback(directionX: number, directionZ: number, horizontalStrength: number, verticalStrength: number): void;
    clearVelocity(): void;
    extinguishFire(useEffects?: boolean): boolean;
    /**
     * @beta
     * @remarks
     * Returns the first intersecting block from the direction that
     * this entity is looking at.
     * @param options
     * @throws This function can throw errors.
     */
    getBlockFromViewDirection(options?: Minecraft.BlockRaycastOptions): Block;
    /**
     * @beta
     * @remarks
     * Gets a component (that represents additional capabilities)
     * for an entity.
     * @param componentId
     * The identifier of the component (e.g., 'minecraft:rideable')
     * to retrieve. If no namespace prefix is specified,
     * 'minecraft:' is assumed. If the component is not present on
     * the entity, undefined is returned.
     */
    getComponent(componentId: string): Minecraft.EntityComponent;
    /**
     * @beta
     * @remarks
     * Returns all components that are both present on this entity
     * and supported by the API.
     */
    getComponents(): Minecraft.EntityComponent[];
    /**
     * @beta
     * @remarks
     * Returns a property value.
     * @param identifier
     * @returns
     * Returns the value for the property, or undefined if the
     * property has not been set.
     * @throws This function can throw errors.
     */
    getDynamicProperty(identifier: string): boolean | number | string | undefined;
    /**
     * @beta
     * @remarks
     * Returns the effect for the specified EffectType on the
     * entity, or undefined if the effect is not present.
     * @param effectType
     * @returns
     * Effect object for the specified effect, or undefined if the
     * effect is not present.
     * @throws This function can throw errors.
     */
    getEffect(effectType: Minecraft.EffectType): Minecraft.Effect;
    getEffects(): Minecraft.Effect[];
    /**
     * @beta
     * @remarks
     * Returns a potential set of entities from the direction that
     * this entity is looking at.
     * @param options
     * @throws This function can throw errors.
     */
    getEntitiesFromViewDirection(options?: Minecraft.EntityRaycastOptions): Entity[];
    getHeadLocation(): Vector3;
    getRotation(): Minecraft.XYRotation;
    /**
     * @beta
     * @remarks
     * Returns all tags associated with an entity.
     * @throws This function can throw errors.
     */
    getTags(): string[];
    getVelocity(): Vector3;
    getViewDirection(): Vector3;
    /**
     * @beta
     * @remarks
     * Returns true if the specified component is present on this
     * entity.
     * @param componentId
     * The identifier of the component (e.g., 'minecraft:rideable')
     * to retrieve. If no namespace prefix is specified,
     * 'minecraft:' is assumed.
     */
    hasComponent(componentId: string): boolean;
    /**
     * @beta
     * @remarks
     * Tests whether an entity has a particular tag.
     * @param tag
     * Identifier of the tag to test for.
     * @throws This function can throw errors.
     */
    hasTag(tag: string): boolean;
    /**
     * @beta
     * @remarks
     * Kills this entity. The entity will drop loot as normal.
     * @throws This function can throw errors.
     */
    kill(): void;
    playAnimation(animationName: string, options?: Minecraft.PlayAnimationOptions): void;
    /**
     * @beta
     * @remarks
     * Removes a specified property.
     * @param identifier
     * @throws This function can throw errors.
     */
    removeDynamicProperty(identifier: string): boolean;
    /**
     * @beta
     * @remarks
     * Removes a specified tag from an entity.
     * @param tag
     * Content of the tag to remove.
     * @throws This function can throw errors.
     */
    removeTag(tag: string): boolean;
    runCommand(commandString: string): Minecraft.CommandResult;
    /**
     * @remarks
     * Runs a particular command asynchronously from the context of
     * this entity. Note that there is a maximum queue of 128
     * asynchronous commands that can be run in a given tick.
     * @param commandString
     * Command to run. Note that command strings should not start
     * with slash.
     * @returns
     * For commands that return data, returns a JSON structure with
     * command response values.
     * @throws This function can throw errors.
     */
    runCommandAsync(commandString: string): Promise<Minecraft.CommandResult>;
    /**
     * @beta
     * @remarks
     * Sets a specified property to a value.
     * @param identifier
     * @param value
     * Data value of the property to set.
     * @throws This function can throw errors.
     */
    setDynamicProperty(identifier: string, value: boolean | number | string): void;
    setOnFire(seconds: number, useEffects?: boolean): boolean;
    /**
     * @beta
     * @remarks
     * Sets the main rotation of the entity.
     * @param degreesX
     * @param degreesY
     * @throws This function can throw errors.
     */
    setRotation(degreesX: number, degreesY: number): void;
    /**
     * @beta
     * @remarks
     * Teleports the selected entity to a new location, and will
     * have the entity facing a specified location.
     * @param location
     * New location for the entity.
     * @param dimension
     * Dimension to move the selected entity to.
     * @param facingLocation
     * Location that this entity will be facing.
     * @param keepVelocity
     * @throws This function can throw errors.
     */
    teleportFacing(location: Vector3, dimension: Minecraft.Dimension, facingLocation: Vector3, keepVelocity?: boolean): void;
    /**
     * @beta
     * @remarks
     * Triggers an entity type event. For every entity, a number of
     * events are defined in an entities' definition for key entity
     * behaviors; for example, creepers have a
     * minecraft:start_exploding type event.
     * @param eventName
     * Name of the entity type event to trigger. If a namespace is
     * not specified, minecraft: is assumed.
     * @throws This function can throw errors.
     */
    triggerEvent(eventName: string): void;
}
export default Entity;
export { Entity as YoniEntity, Entity };
