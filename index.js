'use strict';

const util = require('util');

const naming = require('bem-naming');

const stringifyEntity = naming.stringify;
const typeOfEntity = naming.typeOf;

module.exports = class BemEntityName {
    /**
     * @param {[object]} obj — representation of entity name.
     * @param {[string]} obj.block  — the block name of entity.
     * @param {[string]} [obj.elem] — the element name of entity.
     * @param {[object]} [obj.mod]  — the modifier of entity.
     * @param {[string]} [obj.mod.name] — the modifier name of entity.
     * @param {[string]} [obj.mod.val]  — the modifier value of entity.
     */
    constructor(obj) {
        if (!obj.block) {
             throw new Error('This is not valid BEM entity: the field `block` is undefined.');
        }

        this._obj = { block: obj.block };
        obj.elem && (this._obj.elem = obj.elem);

        const modName = (typeof obj.mod === 'string' ? obj.mod : obj.mod && obj.mod.name) || obj.modName;

        if (modName) {
            const modVal = obj.hasOwnProperty('modVal') || obj.mod && obj.mod.hasOwnProperty('val')
                ? obj.mod && obj.mod.val || obj.modVal
                : true;

            this._obj.mod = {
                name: modName,
                val: modVal
            };
        }
        this._isEntity = true;
    }
    /**
     * Returns the name of block to which this entity belongs.
     *
     * @returns {string} name of entity block.
     * @example
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'button' });
     *
     * console.log(name.block); // button
     */
    get block() { return this._obj.block; }
    /**
     * Returns the element name of this entity.
     *
     * If entity is not element or modifier of element then returns empty string.
     *
     * @returns {string} name of entity element.
     * @example
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'button', elem: 'text' });
     *
     * console.log(name.elem); // text
     */
    get elem() { return this._obj.elem; }
    /**
     * Returns the modifier of this entity.
     *
     * If entity is not modifier then returns empty object.
     *
     * @returns {object} entity modifier.
     * @example
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'button', mod: 'disabled' });
     *
     * console.log(name.mod); // { name: 'disabled', val: true }
     */
    get mod() { return this._obj.mod || {}; }
    /**
     * Returns the modifier name of this entity.
     *
     * If entity is not modifier then returns `undefined`.
     *
     * @returns {string} entity modifier name.
     * @deprecated use `mod.name` instead.
     */
    get modName() { return this.mod.name; }
    /**
     * Returns the modifier value of this entity.
     *
     * If entity is not modifier then returns `undefined`.
     *
     * @returns {string} entity modifier name.
     * @deprecated use `mod.val` instead.
     */
    get modVal() { return this.mod.val; }
    /**
     * Returns id for this entity.
     *
     * Important: should only be used to determine uniqueness of entity.
     *
     * If you want to get string representation in accordance with the provisions naming convention
     * you should use `bem-naming` package.
     *
     * @returns {string} id of entity.
     * @example
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'button', mod: 'disabled' });
     *
     * console.log(name.id); // button_disabled
     */
    get id() {
        if (this._id) { return this._id; }

        const entity = { block: this._obj.block };

        this.elem && (entity.elem = this.elem);
        this.mod.name && (entity.modName = this.mod.name);
        this.mod.val && (entity.modVal = this.mod.val);

        this._id = stringifyEntity(entity);

        return this._id;
    }
    /**
     * Returns type for this entity.
     *
     * @returns {string} type of entity.
     * @example <caption>type of element</caption>
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'button', elem: 'text' });
     *
     * console.log(name.type); // elem
     * @example <caption>type of element modifier</caption>
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'menu', elem: 'item', mod: 'current' });
     *
     * console.log(name.type); // elemMod
     */
    get type() {
        if (this._type) { return this._type; }

        const entity = { block: this._obj.block };

        this.elem && (entity.elem = this.elem);
        this.mod.name && (entity.modName = this.mod.name);
        this.mod.val && (entity.modVal = this.mod.val);

        this._type = typeOfEntity(entity);

        return this._type;
    }
    /**
     * Returns string representing the entity name.
     *
     * Important: If you want to get string representation in accordance with the provisions naming convention
     * you should use `bem-naming` package.
     *
     * @returns {string}
     * @example
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'button' });
     *
     * console.log(`name: ${name}`); // button
     */
    toString() { return this.id; }
    /**
     * Returns object representing the entity name. Is needed for debug in Node.js.
     *
     * In some browsers `console.log()` calls `valueOf()` on each argument.
     * This method will be called to get custom string representation of the object.
     *
     * The representation object contains only `block`, `elem` and `mod` fields
     * without private and deprecated fields (`modName` and `modVal`).
     *
     * @returns {object}
     * @example
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'button' });
     *
     * console.log(name); // { block: 'button' }
     */
    valueOf() { return this._obj; }
    /**
     * Returns object representing the entity name. Is needed for debug in Node.js.
     *
     * In Node.js, `console.log()` calls `util.inspect()` on each argument without a formatting placeholder.
     * This method will be called to get custom string representation of the object.
     *
     * The representation object contains only `block`, `elem` and `mod` fields
     * without private and deprecated fields (`modName` and `modVal`).
     *
     * @param {integer} depth — tells inspect how many times to recurse while formatting the object.
     * @param {object} options — An optional `options` object may be passed
     *                         	 that alters certain aspects of the formatted string.
     *
     * @returns {object}
     * @example
     * const BemEntityName = require('bem-entity-name');
     * const name = new BemEntityName({ block: 'button' });
     *
     * console.log(name); // { block: 'button' }
     */
    inspect(depth, options) {
        const stringRepresentation = util.inspect(this._obj, options);

        return `BemEntityName ${stringRepresentation}`;
    }
    /**
     * Determines whether specified entity is the deepEqual entity.
     *
     * @param {BemEntityName} entity - the entity to compare.
     *
     * @returns {boolean} A Boolean indicating whether or not specified entity is the deepEqual entity.
     * @example
     * const BemEntityName = require('bem-entity-name');
     *
     * const inputName = new BemEntityName({ block: 'input' });
     * const buttonName = new BemEntityName({ block: 'button' });
     *
     * console.log(inputName.isEqual(buttonName)); // false
     * console.log(buttonName.isEqual(buttonName)); // true
     */
    isEqual(entity) {
        return entity && (this.id === entity.id);
    }
    /**
     * Determines whether specified entity is instance of BemEntityName.
     *
     * @param {BemEntityName} entity - the entity to check.
     *
     * @returns {boolean} A Boolean indicating whether or not specified entity is instance of BemEntityName.
     */
    static isBemEntity(entity) {
        return entity._isEntity;
    }
};
