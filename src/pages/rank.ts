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
			frameSprite.x = 51;
			frameSprite.y = 27;
			this.addChild(frameSprite);

			let rankSprite: pages.rank.RankSprite = new pages.rank.RankSprite();
			rankSprite.x = 85;
			rankSprite.y = 180;
			this.addChild(rankSprite);

			network.topQuery().then(data => {
				rankSprite.data = data;
			});

			let homeButton: egret.Sprite = new layer.ui.BlankButtonUI("click_mp3");
			homeButton.name = 'rank-button';
			homeButton.touchEnabled = true;
			homeButton.x = 241;
			homeButton.y = 1090;
			homeButton.width = 311;
			homeButton.height = 78;
			homeButton.once(egret.TouchEvent.TOUCH_TAP, () => {
				window.location.href = window['baseURI'] + 'crush?_=' + Math.random();
			}, this);
			this.addChild(homeButton);
		}

		public removeAllEventListeners(): void {

		}
	}
}

