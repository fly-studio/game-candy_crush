namespace pages.login {

	export class InfoSprite extends layer.ui.Sprite {

		public onAddedToStage(event: egret.Event) : void {
			let welcomeSprite: layer.ui.BitmapUI = new layer.ui.BitmapUI('login_frame_png');
			welcomeSprite.x = 73;
			welcomeSprite.y = 330;
			this.addChild(welcomeSprite);

			let nameField: egret.TextField = new egret.TextField;
			nameField.name = 'nickname';
			nameField.fontFamily = "Microsoft Yahei";
			nameField.bold = true;
			nameField.x = 220;
			nameField.y = 453;
			nameField.width = 308;
			nameField.height = 50;
			nameField.size = 48;
			if (DEBUG) nameField.border = true;
			nameField.text = window['LP'].user.nickname;
			nameField.textColor = 0x29030e;
			nameField.verticalAlign = egret.VerticalAlign.MIDDLE;
			nameField.textAlign = egret.HorizontalAlign.CENTER;
			this.addChild(nameField);

			let countField: egret.TextField = new egret.TextField;
			countField.name = 'score';
			countField.fontFamily = "Microsoft Yahei";
			countField.bold = true;
			countField.x = 391;
			countField.y = 540;
			countField.width = 60;
			countField.height = 67;
			if (DEBUG) countField.border = true;
			countField.size = 40;
			countField.text = window['LP'].todayRemaining;
			countField.textColor = 0xe30404;
			countField.verticalAlign = egret.VerticalAlign.MIDDLE;
			countField.textAlign = egret.HorizontalAlign.CENTER;
			this.addChild(countField);

		}

		public onRemovedFromStage(event: egret.Event): void {
			this.removeAllEventListeners();
		}

		public removeAllEventListeners(): void {

		}
	}

}
