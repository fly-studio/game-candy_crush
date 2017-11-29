namespace pages {
	export class RankPage extends Page {

		constructor(){
			super();
		}

		protected get groupList(): string[] {
			return ["page-rank"];
		}

		public nextPage()
		{
		}

		public onAddedToStage(event: egret.Event) : void {
			let bgSprite: layer.ui.BitmapUI = new layer.ui.BitmapUI('bg_png');
			this.addChild(bgSprite);

			let frameSprite: layer.ui.BitmapUI = new layer.ui.BitmapUI("rank_frame_png");
			frameSprite.x = 48;
			frameSprite.y = 63;
			this.addChild(frameSprite);

			let rankSprite: pages.rank.RankSprite = new pages.rank.RankSprite();
			rankSprite.x = 85;
			rankSprite.y = 230;
			this.addChild(rankSprite);
		}

		public removeAllEventListeners(): void {

		}
	}
}

