namespace pages {
	export class ScorebarSprite extends layer.ui.Sprite {

		private stageField: egret.TextField;
		private scoreField: egret.TextField;
		private countdownField: egret.TextField;

		private _stageNumber: number = 0;

		public set countdown(v: number) {
			let textFields = this.getChildByName('countdown') as egret.TextField;
			if (textFields)
				textFields.text = v <=0 ? '0 秒' : (v / 1000).toFixed(2) + ' 秒';
		}

		public set stageNumber(v: number) {
			this._stageNumber = v;
			let textFields = this.getChildByName('stage') as egret.TextField;
			if (textFields)
				textFields.text = v.toString();
		}

		public set score(v: number) {
			let textFields = this.getChildByName('score') as egret.TextField;
			if (textFields)
				textFields.text = v.toString() + ' 分';
		}

		public onAddedToStage(event: egret.Event) : void {
			let bgSprite: layer.ui.BitmapUI = new layer.ui.BitmapUI('scorebar_png');
			bgSprite.x = 24;
			bgSprite.y = 100;
			this.addChild(bgSprite);

			let stageField: egret.TextField = new egret.TextField;
			stageField.name = 'stage';
			stageField.fontFamily = "Microsoft Yahei";
			stageField.bold = true;
			stageField.x = 109;
			stageField.y = 117;
			stageField.width = 39;
			stageField.height = 23;
			if (DEBUG) stageField.border = true;
			stageField.size = 23;
			stageField.text = this._stageNumber.toString();
			stageField.textColor = 0xffffff;
			stageField.verticalAlign = egret.VerticalAlign.MIDDLE;
			stageField.textAlign = egret.HorizontalAlign.CENTER;
			this.stageField = stageField;
			this.addChild(stageField);

			let countdownField: egret.TextField = new egret.TextField;
			countdownField.name = 'countdown';
			countdownField.fontFamily = "Microsoft Yahei";
			countdownField.bold = true;
			countdownField.x = 335;
			countdownField.y = 117;
			countdownField.width = 125;
			countdownField.height = 34;
			if (DEBUG) countdownField.border = true;
			countdownField.size = 28;
			countdownField.text = '0 秒';
			countdownField.textColor = 0xffffff;
			countdownField.verticalAlign = egret.VerticalAlign.MIDDLE;
			countdownField.textAlign = egret.HorizontalAlign.LEFT;
			this.countdownField = countdownField;
			this.addChild(countdownField);

			let scoreField: egret.TextField = new egret.TextField;
			scoreField.name = 'score';
			scoreField.fontFamily = "Microsoft Yahei";
			scoreField.bold = true;
			scoreField.x = 600;
			scoreField.y = 117;
			scoreField.width = 115;
			scoreField.height = 34;
			if (DEBUG) scoreField.border = true;
			scoreField.size = 28;
			scoreField.text = '0 分';
			scoreField.textColor = 0xffffff;
			scoreField.verticalAlign = egret.VerticalAlign.MIDDLE;
			scoreField.textAlign = egret.HorizontalAlign.LEFT;
			this.scoreField = scoreField;
			this.addChild(scoreField);
		}
		public onRemovedFromStage(event: egret.Event): void {
			this.removeAllEventListeners();
		}

		public removeAllEventListeners(): void {

		}
	}
}
