import {CurrentLayout} from '../../../src/types/schemas/currentLayout';
import {Tweets} from '../../../src/types/schemas/tweets';
import {Tweet} from '../../../src/types/Twitter';

const {customElement, property} = Polymer.decorators;
const currentLayout = nodecg.Replicant<CurrentLayout>('currentLayout');
const tweets = nodecg.Replicant<Tweets>('tweets');

/**
 * @customElement
 * @polymer
 * @appliesMixin Polymer.MutableData
 */
@customElement('gdq-twitter-controls')
export default class GDQTwitterControlsElement extends Polymer.MutableData(Polymer.Element) {
	@property({type: Array})
	tweets: Tweets;

	ready() {
		super.ready();
		const cover = this.$.cover as HTMLElement;

		currentLayout.on('change', newVal => {
			switch (newVal) {
				case 'countdown':
				case 'interview':
				case 'standard_2':
				case 'standard_4':
				case 'gameboy_2':
				case 'ds':
					cover.style.display = 'flex';
					break;
				default:
					cover.style.display = 'none';
			}
		});

		tweets.on('change', newVal => {
			(this.$.empty as HTMLElement).style.display = newVal.length > 0 ? 'none' : 'flex';
			this.tweets = newVal;
		});
	}

	_sortTweets(a: Tweet, b: Tweet) {
		// @ts-ignore
		return new Date(b.created_at) - new Date(a.created_at);
	}
}
