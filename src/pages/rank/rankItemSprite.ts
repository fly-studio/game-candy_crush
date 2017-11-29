namespace pages.rank
{
	export class RankItemSprite extends eui.ItemRenderer {

		constructor() {
			super();

			this.skinName = RES.getRes('rank-item_exml');
			this.once( eui.UIEvent.COMPLETE, this.uiCompHandler, this );

		}

		private uiCompHandler(): void
		{

		}

		protected createChildren():void {
			super.createChildren();
		}

		protected dataChanged():void {

		}
	}
}
