namespace pages.login {

	export class FormSprite extends layer.ui.Sprite {

		private nameField: egret.TextField;
		private phoneField: egret.TextField;

		constructor()
		{
			super();
		}

		public onAddedToStage(event: egret.Event) : void {
			let formSprite: layer.ui.BitmapUI = new layer.ui.BitmapUI('form_png');
			formSprite.x = 87;
			formSprite.y = 365;
			this.addChild(formSprite);

			let nameField: egret.TextField = new egret.TextField;
			nameField.type = egret.TextFieldType.INPUT;
			nameField.x = 269;
			nameField.y = 467;
			nameField.width = 254;
			nameField.height = 49;
			nameField.size = 28;
			nameField.textColor = 0x462c10;
			nameField.verticalAlign = egret.VerticalAlign.MIDDLE;
			this.nameField = nameField;
			this.addChild(nameField);

			let phoneField: egret.TextField = new egret.TextField;
			phoneField.type = egret.TextFieldType.INPUT;
			phoneField.x = 269;
			phoneField.y = 551;
			phoneField.width = 331;
			phoneField.height = 49;
			phoneField.size = 28;
			phoneField.textColor = 0x462c10;
			phoneField.verticalAlign = egret.VerticalAlign.MIDDLE;
			this.phoneField = phoneField;
			this.addChild(phoneField);
		}

		public async submit(){

		}

		public onRemovedFromStage(event: egret.Event): void {
			this.removeAllEventListeners();
		}

		public removeAllEventListeners(): void {

		}
	}
}
