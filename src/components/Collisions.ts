import { IGroupHoldr } from "groupholdr/lib/IGroupHoldr";
import { IMenuDialogRaw, IMenuGraphr } from "menugraphr/lib/IMenuGraphr";
import { IObjectMakr } from "objectmakr/lib/IObjectMakr";
import { IPixelDrawr } from "pixeldrawr/lib/IPixelDrawr";
import { IScenePlayr } from "sceneplayr/lib/IScenePlayr";
import { IStateHoldr } from "stateholdr/lib/IStateHoldr";

import { Direction } from "../Constants";
import { Actions } from "./Actions";
import { Graphics } from "./Graphics";
import {
    ICharacter, IDetector, IGrass, IMapScreenr, IPlayer, IPokeball, IThing, IWaterEdge
} from "../IFullScreenPokemon";
import { Menus } from "./Menus";
import { Physics } from "./Physics";
import { Saves } from "./Saves";
import { Things } from "./Things";
import { Utilities } from "./Utilities";

/**
 * 
 */
export interface ICollisionsSettings {
    /**
     * Action functions used by FullScreenPokemon instances.
     */
    animations: Actions;

    /**
     * Graphics functions used by FullScreenPokemon instances.
     */
    graphics: Graphics;

    /**
     * A general storage abstraction for keyed containers of items.
     */
    groupHolder: IGroupHoldr;

    /**
     * A flexible container for map attributes and viewport.
     */
    mapScreener: IMapScreenr;

    /**
     * Menu functions used by FullScreenPokemon instances.
     */
    menus: Menus;

    /**
     * Menu management system.
     */
    menuGrapher: IMenuGraphr;

    /**
     * An abstract factory for dynamic attribute-based JavaScript classes.
     */
    objectMaker: IObjectMakr;

    /**
     * Physics functions used by FullScreenPokemon instances.
     */
    physics: Physics;

    /**
     * A real-time scene drawer for large amounts of PixelRendr sprites.
     */
    pixelDrawer: IPixelDrawr;

    /**
     * Storage functions used by FullScreenPokemon instances.
     */
    saves: Saves;

    /**
     * A cutscene runner for jumping between scenes and their routines.
     */
    scenePlayer: IScenePlayr;

    /**
     * General localStorage saving for collections of state.
     */
    stateHolder: IStateHoldr;

    /**
     * Thing manipulation functions used by FullScreenPokemon instances.
     */
    things: Things;

    /**
     * Miscellaneous utility functions used by FullScreenPokemon instances.
     */
    utilities: Utilities;
}

/**
 * Collision functions used by FullScreenPokemon instances.
 */
export class Collisions {
    /**
     * Action functions used by FullScreenPokemon instances.
     */
    protected readonly animations: Actions;

    /**
     * Graphics functions used by FullScreenPokemon instances.
     */
    protected readonly graphics: Graphics;

    /**
     * A general storage abstraction for keyed containers of items.
     */
    protected readonly groupHolder: IGroupHoldr;

    /**
     * A flexible container for map attributes and viewport.
     */
    protected readonly mapScreener: IMapScreenr;

    /**
     * Menu functions used by FullScreenPokemon instances.
     */
    protected readonly menus: Menus;

    /**
     * Menu management system.
     */
    protected readonly menuGrapher: IMenuGraphr;

    /**
     * An abstract factory for dynamic attribute-based JavaScript classes.
     */
    protected readonly objectMaker: IObjectMakr;

    /**
     * Physics functions used by FullScreenPokemon instances.
     */
    protected readonly physics: Physics;

    /**
     * A real-time scene drawer for large amounts of PixelRendr sprites.
     */
    protected readonly pixelDrawer: IPixelDrawr;

    /**
     * Storage functions used by FullScreenPokemon instances.
     */
    protected readonly saves: Saves;

    /**
     * A cutscene runner for jumping between scenes and their routines.
     */
    protected readonly scenePlayer: IScenePlayr;

    /**
     * General localStorage saving for collections of state.
     */
    protected readonly stateHolder: IStateHoldr;

    /**
     * Thing manipulation functions used by FullScreenPokemon instances.
     */
    protected readonly things: Things;

    /**
     * Miscellaneous utility functions used by FullScreenPokemon instances.
     */
    protected readonly utilities: Utilities;

    /**
     * Initializes a new instance of the Collisions class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: ICollisionsSettings) {
        this.animations = settings.animations;
        this.graphics = settings.graphics;
        this.groupHolder = settings.groupHolder;
        this.mapScreener = settings.mapScreener;
        this.menus = settings.menus;
        this.menuGrapher = settings.menuGrapher;
        this.objectMaker = settings.objectMaker;
        this.physics = settings.physics;
        this.pixelDrawer = settings.pixelDrawer;
        this.saves = settings.saves;
        this.scenePlayer = settings.scenePlayer;
        this.stateHolder = settings.stateHolder;
        this.things = settings.things;
        this.utilities = settings.utilities;
    }

    /**
     * Function generator for the generic canThingCollide checker. This is used
     * repeatedly by ThingHittr to generate separately optimized Functions for
     * different Thing types.
     * 
     * @returns A Function that generates a canThingCollide checker.
     */
    public generateCanThingCollide(): (thing: IThing) => boolean {
        /**
         * Generic checker for canCollide. This just returns if the Thing is alive.
         * 
         * @param thing
         * @returns Whether the thing can collide.
         */
        return (thing: IThing): boolean => thing.alive;
    }

    /**
     * Function generator for the generic isCharacterTouchingCharacter checker.
     * This is used repeatedly by ThingHittr to generate separately optimized
     * Functions for different Thing types.
     * 
     * @returns A Function that generates isCharacterTouchingCharacter. 
     */
    public generateIsCharacterTouchingCharacter(): (thing: ICharacter, other: ICharacter) => boolean {
        /**
         * Generic checker for whether two characters are touching each other.
         * This checks to see if either has the nocollide flag, or if they're
         * overlapping, respecting tolerances.
         * 
         * @param thing
         * @param other
         * @returns Whether thing is touching other.
         */
        return (thing: ICharacter, other: ICharacter): boolean => (
            !thing.nocollide && !other.nocollide
            && thing.right >= (other.left + other.tolLeft)
            && thing.left <= (other.right - other.tolRight)
            && thing.bottom >= (other.top + other.tolTop)
            && thing.top <= (other.bottom - other.tolBottom));
    }

    /**
     * Function generator for the generic isCharacterTouchingSolid checker. This
     * is used repeatedly by ThingHittr to generate separately optimized
     * Functions for different Thing types.
     * 
     * @returns A Function that generates isCharacterTouchingSolid.
     */
    public generateIsCharacterTouchingSolid(): (thing: ICharacter, other: IThing) => boolean {
        /**
         * Generic checker for whether a character is touching a solid. The
         * hidden, collideHidden, and nocollidesolid flags are most relevant.
         * 
         * @param thing
         * @param other
         * @returns Whether thing is touching other.
         */
        return (thing: ICharacter, other: IThing): boolean => (
            !thing.nocollide && !other.nocollide
            && thing.right >= (other.left + other.tolLeft)
            && thing.left <= (other.right - other.tolRight)
            && thing.bottom >= (other.top + other.tolTop)
            && thing.top <= (other.bottom - other.tolBottom));
    }

    /**
     * Function generator for the generic hitCharacterThing callback. This is 
     * used repeatedly by ThingHittr to generate separately optimized Functions
     * for different Thing types.
     * 
     * @returns A Function that generates hitCharacterThing.
     */
    public generateHitCharacterThing(): (thing: ICharacter, other: IThing) => boolean {
        /**
         * Generic callback for when a Character touches a Thing. Other may have a
         * .collide to override with, but normally this just sets thing's position.
         * 
         * @param thing
         * @param other
         * @returns Whether thing is hitting other.
         */
        return (thing: ICharacter, other: IThing): boolean => {
            // If either Thing is the player, it should be the first
            if ((other as ICharacter).player && !thing.player) {
                [thing, other] = [other as ICharacter, thing];
            }

            // The other's collide may return true to cancel overlapping checks
            if (other.collide && other.collide.call(this, thing, other)) {
                return false;
            }

            // Both the thing and other should know they're bordering each other
            // If other is a large solid, this will be irreleveant, so it's ok
            // that multiple borderings will be replaced by the most recent
            switch (this.physics.getDirectionBordering(thing, other)) {
                case Direction.Top:
                    if (thing.left !== other.right - other.tolRight && thing.right !== other.left + other.tolLeft) {
                        this.setThingBordering(thing, other, Direction.Top);
                        this.setThingBordering(other, thing, Direction.Bottom);
                        this.physics.setTop(thing, other.bottom - other.tolBottom);
                    }
                    break;

                case Direction.Right:
                    if (thing.top !== other.bottom - other.tolBottom && thing.bottom !== other.top + other.tolTop) {
                        this.setThingBordering(thing, other, Direction.Right);
                        this.setThingBordering(other, thing, Direction.Left);
                        this.physics.setRight(thing, other.left + other.tolLeft);
                    }
                    break;

                case Direction.Bottom:
                    if (thing.left !== other.right - other.tolRight && thing.right !== other.left + other.tolLeft) {
                        this.setThingBordering(thing, other, Direction.Bottom);
                        this.setThingBordering(other, thing, Direction.Top);
                        this.physics.setBottom(thing, other.top + other.tolTop);
                    }
                    break;

                case Direction.Left:
                    if (thing.top !== other.bottom - other.tolBottom && thing.bottom !== other.top + other.tolTop) {
                        this.setThingBordering(thing, other, Direction.Left);
                        this.setThingBordering(other, thing, Direction.Right);
                        this.physics.setLeft(thing, other.right - other.tolRight);
                    }
                    break;

                default:
                    break;
            }

            // Todo: investigate why this never returns true?
            return false;
        };
    }

    /**
     * Marks other as being a border of thing in the given direction, respecting borderPrimary.
     * 
     * @param thing   A Thing whose borders are being checked.
     * @param other   A new border for thing.
     * @param direction   The direction border being changed.
     */
    public setThingBordering(thing: IThing, other: IThing, direction: Direction): void {
        if (thing.bordering[direction] && thing.bordering[direction]!.borderPrimary && !other.borderPrimary) {
            return;
        }

        thing.bordering[direction] = other;
    }

    /**
     * Collision callback for a Character and a CollisionDetector. Only Players may
     * trigger the detector, which has to be active to do anything.
     * 
     * @param thing   A Character triggering other.
     * @param other   A Detector triggered by thing.
     * @returns Whether to override normal positioning logic in hitCharacterThing.
     */
    public collideCollisionDetector(thing: IPlayer, other: IDetector): boolean {
        if (!thing.player) {
            return false;
        }

        if (other.active) {
            if (!other.requireOverlap || this.physics.isThingWithinOther(thing, other)) {
                if (
                    typeof other.requireDirection !== "undefined"
                    && !(thing.keys as any)[other.requireDirection]
                    && !thing.allowDirectionAsKeys
                    && thing.direction !== other.requireDirection
                ) {
                    return false;
                }

                if (other.singleUse) {
                    other.active = false;
                }

                if (!other.activate) {
                    throw new Error("No activate callback for collision detector.");
                }

                other.activate.call(this.animations, thing, other);
            }

            return true;
        }

        // If the thing is moving towards the triggerer, it's now active
        if (thing.direction === this.physics.getDirectionBordering(thing, other)) {
            other.active = true;
            return true;
        }

        return false;
    }

    /**
     * Collision callback for a Player and a dialog-containing Character. The
     * dialog is started if it exists, as with a cutscene from other.
     * 
     * @param thing   A Player triggering other.
     * @param other   A Character with dialog triggered by thing.
     */
    public collideCharacterDialog(thing: IPlayer, other: ICharacter): void {
        let dialog: IMenuDialogRaw | IMenuDialogRaw[] | undefined = other.dialog;
        let direction: Direction | undefined;

        if (other.cutscene) {
            this.scenePlayer.startCutscene(other.cutscene, {
                thing: thing,
                triggerer: other
            });
        }

        if (!dialog) {
            return;
        }

        direction = this.physics.getDirectionBetween(other, thing);
        if (!direction) {
            throw new Error("Characters not close enough to collide for dialog.");
        }

        if (other.dialogDirections) {
            dialog = (dialog as IMenuDialogRaw[])[direction];
            if (!dialog) {
                return;
            }
        }

        thing.talking = true;
        other.talking = true;
        thing.canKeyWalking = false;

        if (!this.menuGrapher.getActiveMenu()) {
            this.menuGrapher.createMenu("GeneralText", {
                deleteOnFinish: !other.dialogOptions
            });
            this.menuGrapher.setActiveMenu("GeneralText");
            this.menuGrapher.addMenuDialog(
                "GeneralText",
                dialog,
                (): void => this.animations.animateCharacterDialogFinish(thing, other)
            );
        }

        if (other.switchDirectionOnDialog) {
            this.animations.animateCharacterSetDirection(other, direction);
        }
    }

    /**
     * Collision callback for a Player and a Pokeball it's interacting with.
     * 
     * @param thing   A Player interacting with other.
     * @param other   A Pokeball being interacted with by thing.
     */
    public collidePokeball(thing: IPlayer, other: IPokeball): void {
        switch (other.action) {
            case "item":
                if (!other.item) {
                    throw new Error("Pokeball must have an item for the item action.");
                }

                this.menuGrapher.createMenu("GeneralText");
                this.menuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        "%%%%%%%PLAYER%%%%%%% found " + other.item + "!"
                    ],
                    (): void => {
                        this.menuGrapher.deleteActiveMenu();
                        this.physics.killNormal(other);
                        this.stateHolder.addChange(
                            other.id, "alive", false
                        );
                    }
                );
                this.menuGrapher.setActiveMenu("GeneralText");

                this.saves.addItemToBag(other.item, other.amount);
                break;

            case "cutscene":
                if (!other.cutscene) {
                    throw new Error("Pokeball must have a cutscene for the cutscene action.");
                }

                this.scenePlayer.startCutscene(other.cutscene, {
                    player: thing,
                    triggerer: other
                });
                if (other.routine) {
                    this.scenePlayer.playRoutine(other.routine);
                }
                break;

            case "pokedex":
                if (!other.pokemon) {
                    throw new Error("Pokeball must have a Pokemon for the cutscene action.");
                }

                this.menus.openPokedexListing(other.pokemon);
                break;

            case "dialog":
                if (!other.dialog) {
                    throw new Error("Pokeball must have a dialog for the cutscene action.");
                }

                this.menuGrapher.createMenu("GeneralText");
                this.menuGrapher.addMenuDialog("GeneralText", other.dialog);
                this.menuGrapher.setActiveMenu("GeneralText");
                break;

            case "yes/no":
                this.menuGrapher.createMenu("Yes/No", {
                    killOnB: ["GeneralText"]
                });
                this.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: (): void => console.log("What do, yes?")
                        }, {
                            text: "NO",
                            callback: (): void => console.log("What do, no?")
                        }]
                });
                this.menuGrapher.setActiveMenu("Yes/No");
                break;

            default:
                throw new Error("Unknown Pokeball action: " + other.action + ".");
        }
    }

    /**
     * Marks a Character as being visually within grass. 
     * 
     * @param thing   A Character within grass.
     * @param other   The specific Grass that thing is within.
     */
    public collideCharacterGrass(thing: ICharacter, other: IGrass): boolean {
        if (thing.grass || !this.physics.isThingWithinGrass(thing, other)) {
            return true;
        }

        thing.grass = other;
        this.saves.addStateHistory(thing, "height", thing.height);

        // Todo: Find a better way than manually setting canvas height?
        thing.canvas.height = thing.heightGrass * 4;
        this.pixelDrawer.setThingSprite(thing);

        thing.shadow = this.objectMaker.make(thing.title, {
            nocollide: true,
            id: thing.id + " shadow"
        }) as IThing;

        if (thing.shadow.className !== thing.className) {
            this.graphics.setClass(thing.shadow, thing.className);
        }

        this.things.add(thing.shadow, thing.left, thing.top);

        // Todo: is the arrayToEnd call necessary?
        this.groupHolder.switchMemberGroup(thing.shadow, thing.shadow.groupType, "Terrain");
        this.utilities.arrayToEnd(thing.shadow, this.groupHolder.getGroup("Terrain") as IThing[]);

        return true;
    }

    /**
     * Collision callback for a Character and a Ledge. If possible, the Character
     * is animated to start hopping over the Ledge.
     * 
     * @param thing   A Character walking to other.
     * @param other   A Ledge walked to by thing.
     */
    public collideLedge(thing: ICharacter, other: IThing): boolean {
        if (thing.ledge || !thing.walking) {
            return true;
        }

        if (thing.direction !== other.direction) {
            return false;
        }

        if (thing.direction % 2 === 0) {
            if (thing.left === other.right || thing.right === other.left) {
                return true;
            }
        } else {
            if (thing.top === other.bottom || thing.bottom === other.top) {
                return true;
            }
        }

        if (thing.player) {
            (thing as IPlayer).canKeyWalking = false;
            this.mapScreener.blockInputs = true;
        }
        this.animations.animateCharacterHopLedge(thing, other);

        return true;
    }

    /**
     * Collision callback for a Character and a WaterEdge. If possible, the Character
     * is animated to move onto land.
     *
     * @param thing   A Character walking to other.
     * @param other   A Ledge walked to by thing.
     * @returns Whether the Character was able animate onto land.
     */
    public collideWaterEdge(thing: ICharacter, other: IThing): boolean {
        const edge: IWaterEdge = other as IWaterEdge;

        if (!thing.surfing || edge.exitDirection !== thing.direction) {
            return false;
        }

        this.animations.animateCharacterStartWalking(thing, thing.direction, [2]);
        thing.surfing = false;
        this.graphics.removeClass(thing, "surfing");
        return true;
    }
}
