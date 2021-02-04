namespace pages {
	export class NextStageSprite extends layer.ui.Sprite {
		private score: number;
		private nextStageCallback: Function;
		constructor(score: number = 0, nextStageCallback: Function)
		{
			super();
			this.score = score;
			this.nextStageCallback = nextStageCallback;
		}

		public onAddedToStage(event: egret.Event) : void {

			let bgSprite: layer.ui.BitmapUI = new layer.ui.BitmapUI('next-stage_png');
			bgSprite.x = 108;
			bgSprite.y = 457;
			this.addChild(bgSprite);

			let scoreField: egret.TextField = new egret.TextField;
			scoreField.name = 'score';
			scoreField.fontFamily = "Microsoft Yahei";
			scoreField.bold = true;
			scoreField.x = 406;
			scoreField.y = 685;
			scoreField.width = 129;
			scoreField.height = 39;
			if (DEBUG)
				scoreField.border = true;
			scoreField.size = 35;
			scoreField.text = this.score.toString();
			scoreField.textColor = 0x0;
			scoreField.verticalAlign = egret.VerticalAlign.MIDDLE;
			scoreField.textAlign = egret.HorizontalAlign.CENTER;
			this.addChild(scoreField);

			let buttonSprite: egret.Sprite = new layer.ui.BlankButtonUI("click_mp3");
			buttonSprite.x = 250;
			buttonSprite.y = 835;
			buttonSprite.width = 250;
			buttonSprite.height = 76;
			buttonSprite.touchEnabled = true;
			if (DEBUG)
				buttonSprite.graphics.lineStyle(1, 0x0);
			//没实体无法点击，所以绘制一个透明的
			buttonSprite.graphics.beginFill(0x0, 0);
			buttonSprite.graphics.drawRect(0, 0, buttonSprite.width, buttonSprite.height);
			buttonSprite.graphics.endFill();
			buttonSprite.once(egret.TouchEvent.TOUCH_END, () => {
				this.nextStageCallback.call(this.parent, this.score);
			}, this);
			this.addChild(buttonSprite);
		}

		public onRemovedFromStage(event: egret.Event): void {
			this.removeAllEventListeners();
		}

		public removeAllEventListeners(): void {

		}
	}
}
