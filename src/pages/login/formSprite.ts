namespace pages.login {

	export class FormSprite extends layer.ui.Sprite {

		private nameField: egret.TextField;
		private phoneField: egret.TextField;
		private form: layer.ui.Form;
		constructor()
		{
			super();
			this.form = new layer.ui.Form;
		}

		public onAddedToStage(event: egret.Event) : void {
			let formSprite: layer.ui.BitmapUI = new layer.ui.BitmapUI('form_png');
			formSprite.x = 72;
			formSprite.y = 328;
			this.addChild(formSprite);

			let phoneField: egret.TextField = new egret.TextField;
			phoneField.name = 'phone';
			phoneField.type = egret.TextFieldType.INPUT;
			phoneField.x = 286;
			phoneField.y = 940;
			phoneField.width = 257;
			phoneField.height = 49;
			phoneField.size = 28;
			phoneField.textColor = 0x462c10;
			phoneField.verticalAlign = egret.VerticalAlign.MIDDLE;
			this.phoneField = phoneField;
			this.addChild(phoneField);

			this.form.addInput(phoneField);
		}

		public submit(){
			return network.userQuery(this.form);
		}

		public onRemovedFromStage(event: egret.Event): void {
			this.removeAllEventListeners();
		}

		public removeAllEventListeners(): void {

		}
	}
}
