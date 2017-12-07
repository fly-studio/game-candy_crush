namespace pages {
	export class Game3Page extends Game  {

		constructor() {
			super();
		}

		protected get groupList(): string[] {
			return ["page-game3"];
		}

		public nextPage()
		{

		}

		public onAddedToStage(event: egret.Event) : void {
			super.onAddedToStage(event);

			let bgSprite: layer.ui.BitmapUI = new layer.ui.BitmapUI('bg_png');
			this.addChild(bgSprite);

			this.scorebarSprite = new pages.game.ScorebarSprite();
			this.scorebarSprite.stageNumber = 3;
			this.addChild(this.scorebarSprite);

			let frameSprite: layer.ui.BitmapUI = new layer.ui.BitmapUI("game3_frame_png");
			frameSprite.x = 21;
			frameSprite.y = 373;
			this.addChild(frameSprite);

			let gameUI = new ui.GameUI(60);
			gameUI.x = 31;
			gameUI.y = 381;
			gameUI.width = 689;
			gameUI.height = 689;
			gameUI.blocks = [0, 1, 8, 9, 6, 7, 14, 15, 48, 49, 56, 57, 54, 55, 62, 63/*, 27, 28, 35, 36*/];
			this.addChild(gameUI);

			this.readySprite.animating().then(() => {
				gameUI.start();
			});
		}

		protected onGameStart(event: GameEvent): void {
			super.onGameStart(event);

			this.bgmChannel = layer.media.Sound.play('stage-3_mp3');
		}

		protected onGameStop(event: GameEvent) : void {
			super.onGameStop(event);

			network.scoreQuery(event.score, 3).then(json => {
				let resultSprite: game.ResultSprite = new game.ResultSprite(json.data.score, json.data.rank);
				this.addChild(resultSprite);
			});
			
		}
	}
}
