namespace pages {
	export class ResultSprite extends layer.ui.Sprite {
		private score: number = 0;
		private rank: number = 0;

		constructor(score: number, rank: number)
		{
			super();
			this.score = score;
			this.rank = rank;
			//window['LP']['rank'] = rank;

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
			scoreField.y = 558;
			scoreField.width = 172;
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
			rankField.x = 400;
			rankField.y = 650;
			rankField.width = 172;
			rankField.height = 33;
			if (DEBUG) rankField.border = true;
			rankField.size = 28;
			rankField.text = this.rank.toString();
			rankField.textColor = 0x0;
			rankField.verticalAlign = egret.VerticalAlign.MIDDLE;
			rankField.textAlign = egret.HorizontalAlign.CENTER;
			this.addChild(rankField);

			let buttonRank: layer.ui.BlankButtonUI = new layer.ui.BlankButtonUI('click_mp3');
			buttonRank.x = 123;
			buttonRank.y = 813;
			buttonRank.width = 230;
			buttonRank.height = 62;
			buttonRank.once(egret.TouchEvent.TOUCH_TAP, () => {
				alert('已经取消');
			}, this);
			this.addChild(buttonRank);

			let buttonHome: layer.ui.BlankButtonUI = new layer.ui.BlankButtonUI('click_mp3');
			buttonHome.x = 408;
			buttonHome.y = 813;
			buttonHome.width = 230;
			buttonHome.height = 62;
			buttonHome.once(egret.TouchEvent.TOUCH_TAP, () => {
				window.location.reload();
			}, this);
			this.addChild(buttonHome);

			let linkHome: layer.ui.BlankButtonUI = new layer.ui.BlankButtonUI('click_mp3');
			linkHome.x = 153;
			linkHome.y = 901;
			linkHome.width = 452;
			linkHome.height = 68;
			linkHome.once(egret.TouchEvent.TOUCH_TAP, () => {
				alert('已经取消');
			}, this);
			this.addChild(linkHome);
		}

		public onRemovedFromStage(event: egret.Event): void {
			this.removeAllEventListeners();
		}

		public removeAllEventListeners(): void {

		}
	}
}
