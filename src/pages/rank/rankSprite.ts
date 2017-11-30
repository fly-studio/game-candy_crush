namespace pages.rank {

	export class RankSprite extends eui.Component {
		private rankList: eui.List;
		private scroller: eui.Scroller;

		public set data(value: Object[]) {
			this.rankList.dataProvider = new eui.ArrayCollection( value );
		}

		constructor() {
			super();

			this.once( eui.UIEvent.COMPLETE, this.uiCompHandler, this );
			this.skinName = RES.getRes('rank-list_exml');
		}

		private uiCompHandler(): void
		{
			this.rankList.useVirtualLayout = true;

			this.rankList.itemRenderer = pages.rank.RankItemSprite;
		}

		protected createChildren(): void
		{
			super.createChildren();

		}
	}

}
