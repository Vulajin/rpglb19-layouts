import * as tslib_1 from "tslib";
import { TimelineLite, Linear, Sine, Power2 } from 'gsap';
import InterruptMixin from '../../../mixins/interrupt-mixin';
const { customElement, property } = Polymer.decorators;
const SVG = (window.svgjs || window.SVG);
/**
 * @customElement
 * @polymer
 */
let GDQBreakFanartElement = class GDQBreakFanartElement extends InterruptMixin(Polymer.Element) {
    /**
     * @customElement
     * @polymer
     */
    constructor() {
        super(...arguments);
        this.backgroundOpacity = 0.25;
    }
    ready() {
        super.ready();
        this.$.tweet.companionElement = null;
        this._initBackgroundSVG();
    }
    connectedCallback() {
        super.connectedCallback();
        Polymer.RenderStatus.beforeNextRender(this, () => {
            this._addReset();
        });
    }
    /**
     * Adds a reset to the master timeline.
     */
    _addReset() {
        const tl = this.timeline;
        tl.set(this._bgRect.node, { drawSVG: '0%', 'fill-opacity': 0 });
        tl.set(this.$.label, { scaleX: 0, color: 'transparent', clipPath: '' });
        tl.call(this.$.tweet._addReset, undefined, this.$.tweet);
    }
    /**
     * Creates an entrance animation timeline.
     * @param tweet - The tweet to enter.
     * @returns A GSAP animation timeline.
     */
    _createEntranceAnim(tweet) {
        const tl = new TimelineLite();
        const $image = this.$.image;
        const media = tweet.gdqMedia;
        if (!media) {
            return tl;
        }
        let didStartingWork = false; // GSAP likes to run .calls again when you .resume
        tl.call(() => {
            if (didStartingWork) {
                return;
            }
            didStartingWork = true;
            tl.pause();
            $image.$svg.image.load(media[0].media_url_https).loaded(() => {
                tl.resume();
            }).error(error => {
                nodecg.log.error(error);
                tl.clear();
                tl.resume();
            });
        }, undefined, null, '+=0.03');
        tl.addLabel('start', '+=0.03');
        tl.to(this._bgRect.node, 0.75, {
            drawSVG: '100%',
            ease: Linear.easeNone
        }, 'start');
        tl.add($image.enter(), 'start');
        tl.add(this.$.tweet._createEntranceAnim(tweet), 'start+=0.1');
        tl.to(this.$.label, 0.334, {
            scaleX: 1,
            ease: Sine.easeInOut,
            onComplete: () => {
                this.$.label.style.color = '';
            }
        }, 'start+=0.4');
        tl.to(this._bgRect.node, 0.5, {
            'fill-opacity': this.backgroundOpacity,
            ease: Sine.easeOut
        }, 'start+=1');
        if (media.length > 1) {
            media.slice(1).forEach(mediaEntity => {
                tl.add(this._createHold());
                tl.add(this._changeImage(mediaEntity.media_url_https));
            });
        }
        return tl;
    }
    /**
     * Creates an animation for changing the currently displayed tweet.
     * This is only used when hot-swapping tweets
     * (i.e., changing tweets while the graphic is already showing).
     * @param tweet - The new tweet to show.
     * @returns A GSAP animation timeline.
     */
    _createChangeAnim(tweet) {
        const tl = new TimelineLite();
        if (!tweet.gdqMedia) {
            return tl;
        }
        let exitedPreviousItem = false; // GSAP likes to run .calls again when you .resume
        tl.call(() => {
            if (exitedPreviousItem) {
                return;
            }
            tl.pause();
            const exitTextTl = new TimelineLite();
            exitTextTl.add(this.$.tweet._createChangeAnim(tweet), 0);
            exitTextTl.call(() => {
                exitedPreviousItem = true;
                tl.resume();
            });
        }, undefined, null, '+=0.03');
        tl.add(this._changeImage(tweet.gdqMedia[0].media_url_https), '+=0.03');
        if (tweet.gdqMedia.length > 1) {
            tweet.gdqMedia.slice(1).forEach(mediaEntity => {
                tl.add(this._createHold());
                tl.add(this._changeImage(mediaEntity.media_url_https));
            });
        }
        return tl;
    }
    /**
     * Changes just the image, without changing the tweet body.
     * Used in tweets which have more than one image (they can have up to four).
     * @param newSrc - The url of the new image to show.
     * @returns A GSAP animation timeline.
     */
    _changeImage(newSrc) {
        const tl = new TimelineLite();
        const $image = this.$.image;
        tl.add($image.exit({
            onComplete: () => {
                tl.pause();
                $image.$svg.image.load(newSrc).loaded(() => {
                    tl.resume();
                }).error(error => {
                    nodecg.log.error(error);
                    tl.resume();
                });
            }
        }));
        tl.add($image.enter(), '+=0.05');
        return tl;
    }
    /**
     * Creates an exit animation timeline.
     * @returns A GSAP animation timeline.
     */
    _createExitAnim() {
        const tl = new TimelineLite();
        tl.add('exit');
        tl.to(this._bgRect.node, 0.5, {
            'fill-opacity': 0,
            ease: Sine.easeOut
        }, 'exit');
        tl.to(this._bgRect.node, 1.5, {
            drawSVG: '0%',
            ease: Power2.easeIn
        }, 'exit');
        tl.fromTo(this.$.label, 0.334, {
            clipPath: 'inset(0 0% 0 0)'
        }, {
            clipPath: 'inset(0 100% 0 0)',
            ease: Sine.easeInOut
        }, 'exit+=0.9');
        tl.add(this.$.tweet._createExitAnim(), 'exit');
        tl.add(this.$.image.exit(), 'exit+=0.1');
        return tl;
    }
    _initBackgroundSVG() {
        const STROKE_SIZE = 1;
        const ELEMENT_WIDTH = this.$.background.clientWidth;
        const ELEMENT_HEIGHT = this.$.background.clientHeight;
        const svgDoc = SVG(this.$.background);
        const bgRect = svgDoc.rect();
        this._bgRect = bgRect;
        svgDoc.size(ELEMENT_WIDTH, ELEMENT_HEIGHT);
        // Intentionally flip the width and height.
        // This is part of how we get the drawSVG anim to go in the direction we want.
        bgRect.size(ELEMENT_HEIGHT, ELEMENT_WIDTH);
        bgRect.stroke({
            color: 'white',
            // Makes it effectively STROKE_SIZE, because all SVG strokes
            // are center strokes, and the outer half is cut off.
            width: STROKE_SIZE * 2
        });
        bgRect.fill({ color: 'black', opacity: this.backgroundOpacity });
        // Rotate and translate such that drawSVG anims start from the bottom right
        // and move counter-clockwise to draw, clockwise to un-draw.
        bgRect.style({ transform: `rotate(90deg) scaleX(-1) translateX(${-ELEMENT_HEIGHT}px) translateY(${-ELEMENT_WIDTH}px)` });
    }
};
tslib_1.__decorate([
    property({ type: Number })
], GDQBreakFanartElement.prototype, "backgroundOpacity", void 0);
GDQBreakFanartElement = tslib_1.__decorate([
    customElement('gdq-break-fanart')
], GDQBreakFanartElement);
export default GDQBreakFanartElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2RxLWJyZWFrLWZhbmFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdkcS1icmVhay1mYW5hcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDeEQsT0FBTyxjQUFpQyxNQUFNLGlDQUFpQyxDQUFDO0FBS2hGLE1BQU0sRUFBQyxhQUFhLEVBQUUsUUFBUSxFQUFDLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztBQUNyRCxNQUFNLEdBQUcsR0FBRyxDQUFFLE1BQWMsQ0FBQyxLQUFLLElBQUssTUFBYyxDQUFDLEdBQUcsQ0FBa0IsQ0FBQztBQUU1RTs7O0dBR0c7QUFFSCxJQUFxQixxQkFBcUIsR0FBMUMsTUFBcUIscUJBQXNCLFNBQVEsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7SUFMbEY7OztPQUdHO0lBQ0g7O1FBR0Msc0JBQWlCLEdBQUcsSUFBSSxDQUFDO0lBME4xQixDQUFDO0lBdE5BLEtBQUs7UUFDSixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQXlCLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQzFELElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxpQkFBaUI7UUFDaEIsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDMUIsT0FBTyxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO1lBQ2hELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNsQixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRDs7T0FFRztJQUNILFNBQVM7UUFDUixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3pCLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFD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