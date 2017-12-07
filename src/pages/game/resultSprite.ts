namespace pages.game {
	export class ResultSprite extends layer.ui.Sprite {
		private score: number = 0;
		private rank: number = 0;

		constructor(score: number, rank: number)
		{
			super();
			this.score = score;
			this.rank = rank;
		}

		public onAddedToStage(event: egret.Event) : void {
			let frameSprite = new layer.ui.BitmapUI('last-frame_png');
			frameSprite.x = 71;
			frameSprite.y = 346;
			this.addChild(frameSprite);

			let scoreField: egret.TextField = new egret.TextField;
			scoreField.name = 'score';
			scoreField.fontFamily = "Microsoft Yahei";
			scoreField.bold = true;
			scoreField.x = 400;
			scoreField.y = 565;
			scoreField.width = 175;
			scoreField.height = 33;
			if (DEBUG) scoreField.border = true;
			scoreField.size = 28;
			scoreField.text = this.score.toString();
			scoreField.textColor = 0x0;
			scoreField.verticalAlign = egret.VerticalAlign.MIDDLE;
			scoreField.textAlign = egret.HorizontalAlign.CENTER;
			this.addChild(scoreField);


			let rankField: egret.TextField = new egret.TextField;
			rankField.name = 'rank';
			rankField.fontFamily = "Microsoft Yahei";
			rankField.bold = true;
			rankField.x = 420;
			rankField.y = 658;
			rankField.width = 154;
			rankField.height = 33;
			if (DEBUG) rankField.border = true;
			rankField.size = 28;
			rankField.text = this.rank.toString();
			rankField.textColor = 0x0;
			rankField.verticalAlign = egret.VerticalAlign.MIDDLE;
			rankField.textAlign = egret.HorizontalAlign.CENTER;
			this.addChild(rankField);

			let buttonRank: layer.ui.ButtonUI = new layer.ui.ButtonUI('btn-rank_png', 'click_mp3');
			buttonRank.x = 123;
			buttonRank.y = 843;
			buttonRank.once(egret.TouchEvent.TOUCH_TAP, () => {
				new RankPage();
			}, this);
			this.addChild(buttonRank);

			let buttonHome: layer.ui.ButtonUI = new layer.ui.ButtonUI('btn-home_png', 'click_mp3');
			buttonHome.x = 408;
			buttonHome.y = 843;
			buttonHome.once(egret.TouchEvent.TOUCH_TAP, () => {
				window.location.href = window['baseURI'] + 'crush?_=' + Math.random();
			}, this);
			this.addChild(buttonHome);
		}

		public onRemovedFromStage(event: egret.Event): void {
			this.removeAllEventListeners();
		}

		public removeAllEventListeners(): void {

		}
	}
}
