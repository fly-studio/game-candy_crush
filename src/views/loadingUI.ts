namespace ui {
	export class LoadingUI extends layer.ui.BlankLoadingUI {
		public onAddedToStage(e: egret.Event) : void
		{
			super.onAddedToStage(e);

			let logo = new layer.ui.BitmapUI('logo_png');
			logo.x = this.stage.stageWidth / 2 - logo.width / 2;
			logo.y = this.stage.stageHeight / 2 - logo.height / 2 - 50;

			this.textField.y = logo.y + logo.height + 20

			this.addChild(logo);
		}
	}


}