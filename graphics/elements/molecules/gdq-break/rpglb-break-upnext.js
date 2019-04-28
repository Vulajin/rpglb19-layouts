import * as tslib_1 from "tslib";
import { TimelineLite, Sine } from 'gsap';
const { customElement, property } = Polymer.decorators;
const currentRun = nodecg.Replicant('currentRun');
const schedule = nodecg.Replicant('schedule');
/**
 * @customElement
 * @polymer
 */
let RPGLBBreakUpnextElement = class RPGLBBreakUpnextElement extends Polymer.MutableData(Polymer.Element) {
    ready() {
        super.ready();
        currentRun.on('change', () => {
            this.update();
        });
        schedule.on('change', () => {
            this.update();
        });
        this._runElem = this.$.upnext;
    }
    update() {
        this._updateDebouncer = Polymer.Debouncer.debounce(this._updateDebouncer, Polymer.Async.timeOut.after(16), this._update.bind(this));
    }
    _update() {
        const tl = new TimelineLite();
        if (schedule.status !== 'declared' ||
            currentRun.status !== 'declared' ||
            !schedule.value ||
            !currentRun.value) {
            return tl;
        }
        tl.set(this._runElem, { willChange: 'opacity' });
        tl.to(this._runElem, 0.5, {
            opacity: 0,
            ease: Sine.easeInOut
        }, '+=0.25');
        tl.call(() => {
            this.upNext = currentRun.value;
        });
        tl.to(this._runElem, 0.5, {
            opacity: 1,
            ease: Sine.easeInOut
        }, '+=0.1');
        tl.set(this._runElem, { clearProps: 'will-change' });
        return tl;
    }
};
tslib_1.__decorate([
    property({ type: Object })
], RPGLBBreakUpnextElement.prototype, "upNext", void 0);
RPGLBBreakUpnextElement = tslib_1.__decorate([
    customElement('rpglb-break-upnext')
], RPGLBBreakUpnextElement);
export default RPGLBBreakUpnextElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnBnbGItYnJlYWstdXBuZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicnBnbGItYnJlYWstdXBuZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsWUFBWSxFQUFFLElBQUksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUl4QyxNQUFNLEVBQUMsYUFBYSxFQUFFLFFBQVEsRUFBQyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7QUFFckQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBTSxZQUFZLENBQUMsQ0FBQztBQUN2RCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFpQixVQUFVLENBQUMsQ0FBQztBQUU5RDs7O0dBR0c7QUFFSCxJQUFxQix1QkFBdUIsR0FBNUMsTUFBcUIsdUJBQXdCLFNBQVEsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBT3hGLEtBQUs7UUFDSixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFZCxVQUFVLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDNUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDMUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2YsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBb0MsQ0FBQztJQUM3RCxDQUFDO0lBRUQsTUFBTTtRQUNMLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FDakQsSUFBSSxDQUFDLGdCQUFnQixFQUNyQixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUN2QixDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU87UUFDTixNQUFNLEVBQUUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRTlCLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxVQUFVO1lBQ2pDLFVBQVUsQ0FBQyxNQUFNLEtBQUssVUFBVTtZQUNoQyxDQUFDLFFBQVEsQ0FBQyxLQUFLO1lBQ2YsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFO1lBQ25CLE9BQU8sRUFBRSxDQUFDO1NBQ1Y7UUFFRCxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUUvQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1lBQ3pCLE9BQU8sRUFBRSxDQUFDO1lBQ1YsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTO1NBQ3BCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFYixFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLEtBQU0sQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDekIsT0FBTyxFQUFFLENBQUM7WUFDVixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVM7U0FDcEIsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVaLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUMsQ0FBQyxDQUFDO1FBRW5ELE9BQU8sRUFBRSxDQUFDO0lBQ1gsQ0FBQztDQUNELENBQUE7QUF6REE7SUFEQyxRQUFRLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUM7dURBQ2I7QUFGUSx1QkFBdUI7SUFEM0MsYUFBYSxDQUFDLG9CQUFvQixDQUFDO0dBQ2YsdUJBQXVCLENBMkQzQztlQTNEb0IsdUJBQXVCIn0=