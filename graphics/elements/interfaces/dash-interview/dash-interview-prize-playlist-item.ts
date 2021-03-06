import {Prize} from '../../../../src/types';
import {InterviewPrizePlaylist} from '../../../../src/types/schemas/interview_prizePlaylist';

const {customElement, property} = Polymer.decorators;
const prizePlaylistRep = nodecg.Replicant<InterviewPrizePlaylist>('interview_prizePlaylist');

/**
 * @customElement
 * @polymer
 * @appliesMixin Polymer.MutableData
 */
@customElement('dash-interview-prize-playlist-item')
export default class DashInterviewPrizePlaylistItemElement extends Polymer.MutableData(Polymer.Element) {
	@property({type: Object})
	prize: Prize;

	@property({type: String,
		reflectToAttribute: true,
		computed: '_computePrizeId(prize.id)'
	})
	prizeId: string;

	@property({
		type: Boolean,
		reflectToAttribute: true,
		computed: '_computeComplete(prize, _prizePlaylist)',
		observer: '_completeChanged'
	})
	complete: boolean;

	@property({type: Array})
	_prizePlaylist: InterviewPrizePlaylist;

	private _initialized: boolean;
	private _handledFirstCheckboxChange: boolean;

	connectedCallback() {
		super.connectedCallback();

		if (!this._initialized) {
			this._initialized = true;
			prizePlaylistRep.on('change', newVal => {
				this._prizePlaylist = newVal;
			});
		}
	}

	markAsDone() {
		if (!this.prize) {
			return;
		}
		nodecg.sendMessage('interview:markPrizeAsDone', this.prize.id);
	}

	markAsNotDone() {
		if (!this.prize) {
			return;
		}
		nodecg.sendMessage('interview:markPrizeAsNotDone', this.prize.id);
	}

	_computePrizeId(prizeId: string) {
		return prizeId;
	}

	_computeComplete(prize?: Prize, prizePlaylist?: InterviewPrizePlaylist) {
		if (!prize || !Array.isArray(prizePlaylist)) {
			return;
		}

		const playlistEntry = prizePlaylist.find(entry => entry.id === this.prize.id);
		return Boolean(playlistEntry && playlistEntry.complete);
	}

	_completeChanged(newVal: boolean) {
		(this as any).parentNode.style.backgroundColor = newVal ? '#C2C2C2' : '';
	}

	_handleCheckboxChanged(e: any) {
		if (!this._handledFirstCheckboxChange) {
			this._handledFirstCheckboxChange = true;
			if (e.detail.value === false) {
				return;
			}
		}

		if (e.detail.value) {
			this.markAsDone();
		} else {
			this.markAsNotDone();
		}
	}
}
