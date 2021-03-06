import {Run} from '../../../../src/types';

const {customElement, property} = Polymer.decorators;
const currentRun = nodecg.Replicant<Run>('currentRun');

@customElement('gdq-runinfo')
export default class GDQRuninfoElement extends Polymer.Element {
	@property({type: Number})
	maxNameSize = 45;

	@property({type: Boolean, reflectToAttribute: true})
	forceSingleLineName = false;

	@property({type: String})
	category: string;

	@property({type: String})
	name = '?';

	private initialized = false;

	ready() {
		super.ready();
		Polymer.RenderStatus.afterNextRender(this, () => {
			currentRun.on('change', this.currentRunChanged.bind(this));
		});
	}

	currentRunChanged(newVal: Run) {
		this.name = newVal.name;
		this.category = newVal.category;

		// Avoids some issues that can arise on the first time that fitText is run.
		// Currently unsure why these issues happen.
		if (this.initialized) {
			this.fitText();
		} else {
			Polymer.RenderStatus.afterNextRender(this, this.fitText);
			this.initialized = true;
		}
	}

	fitText() {
		Polymer.flush();
		(window as any).textFit(this.$.name, {maxFontSize: this.maxNameSize});
	}

	_processName(name?: string) {
		if (!name) {
			return '&nbsp;';
		}

		if (this.forceSingleLineName) {
			return `<div class="name-line">${name.replace('\\n', ' ')}</div>`;
		}

		return name.split('\\n')
			.map((lineText) => {
				return `<div class="name-line">${lineText}</div>`;
			})
			.join('\n');
	}
}
