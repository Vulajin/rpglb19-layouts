const {customElement, property} = Polymer.decorators;
const ONE_THOUSAND = 1000;
type Alignment = 'left' | 'center' | 'right';

@customElement('gdq-omnibar-milestone-tracker-point')
export default class GDQOmnibarMilestoneTrackerPointElement extends Polymer.Element {
	@property({type: String, reflectToAttribute: true, observer: GDQOmnibarMilestoneTrackerPointElement.prototype._alignChanged})
	align: Alignment = 'left';

	@property({type: Number})
	amount: number;

	@property({type: Boolean})
	dropTrailingZeroes = false;

	_alignChanged(newVal: Alignment) {
		const bodyElem = this.$.body as HTMLDivElement;
		if (newVal !== 'center') {
			bodyElem.style.left = '';
		}

		const bodyRect = this.$.body.getBoundingClientRect();
		bodyElem.style.left = `${(bodyRect.width / -2) + 1.5}px`;
	}

	_calcDisplayAmount(amount: number) {
		return `$${this._formatAmount(amount / ONE_THOUSAND)}K`;
	}

	_formatAmount(amount: number) {
		let amountString = String(amount).substr(0, 4);

		if (amountString.endsWith('.')) {
			return amountString.slice(0, -1)
		}

		if (this.dropTrailingZeroes) {
			while (
				(amountString.endsWith('0') || amountString.endsWith('.')) &&
				amountString.length > 1
				) {
				amountString = amountString.slice(0, -1);
			}
		}

		return amountString;
	}
}
