import {Prize} from '../../../../src/types';
import {InterviewPrizePlaylist} from '../../../../src/types/schemas/interview_prizePlaylist';
import MapSortMixin from '../../../mixins/map-sort-mixin';

const {customElement, property} = Polymer.decorators;
const allPrizesRep = nodecg.Replicant<Prize[]>('allPrizes');
const prizePlaylistRep = nodecg.Replicant<InterviewPrizePlaylist>('interview_prizePlaylist');
const prizePlaylistSortMapRep = nodecg.Replicant<string[]>('interview_prizePlaylistSortMap');

/**
 * @customElement
 * @polymer
 * @appliesMixin window.MapSortMixin
 */
@customElement('dash-interview-monitor-prizes')
export default class DashInterviewMonitorPrizesElement extends MapSortMixin(Polymer.MutableData(Polymer.Element)) {
	@property({type: Array})
	allPrizes: Prize[];

	@property({type: Array})
	prizePlaylist: InterviewPrizePlaylist;

	@property({type: Array, computed: '_computePlaylistPrizes(allPrizes, prizePlaylist)'})
	playlistPrizes: Prize[];

	@property({type: Boolean, computed: '_computeNoPlaylistPrizes(playlistPrizes)'})
	noPlaylistPrizes: boolean;

	ready() {
		super.ready();

		allPrizesRep.on('change', newVal => {
			if (!newVal || newVal.length === 0) {
				this.allPrizes = [];
				return;
			}

			this.allPrizes = newVal;
		});

		prizePlaylistRep.on('change', newVal => {
			if (!newVal || newVal.length === 0) {
				this.prizePlaylist = [];
				return;
			}

			this.prizePlaylist = newVal;
		});

		prizePlaylistSortMapRep.on('change', (newVal, _oldVal, operations) => {
			if (!newVal) {
				return;
			}
			this._sortMapVal = newVal;
			(this.$.repeat as Polymer.DomRepeat).render();

			if (newVal.length > 0 && this._shouldFlash(operations)) {
				this._flashElementBackground(this);
			}
		});
	}

	_computePlaylistPrizes(allPrizes?: Prize[], prizePlaylist?: InterviewPrizePlaylist) {
		if (!allPrizes || allPrizes.length === 0 ||
			!prizePlaylist || prizePlaylist.length === 0) {
			return [];
		}

		return prizePlaylist.filter(playlistEntry => {
			return !playlistEntry.complete;
		}).map(playlistEntry => {
			return allPrizes.find(prize => {
				return prize.id === playlistEntry.id;
			});
		});
	}

	_computeNoPlaylistPrizes(playlistPrizes?: Prize[]) {
		return !playlistPrizes || playlistPrizes.length <= 0;
	}
}
