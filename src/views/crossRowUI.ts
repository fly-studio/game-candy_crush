namespace ui {
	export class CrossRowUI extends layer.ui.Sprite {

		private crossRect: egret.Rectangle;
		private rowSprite: layer.ui.BitmapUI;

		public constructor(crossRect: egret.Rectangle)
		{
			super();
			this.crossRect = crossRect;
		}

		public onAddedToStage(event: egret.Event) : void {
			this.width = this.parent.width;
			this.height = this.parent.height;

			this.rowSprite = new layer.ui.BitmapUI("cross_png");
			this.rowSprite.x = this.width * .45;
			this.rowSprite.y = this.crossRect.y;
			this.rowSprite.width = this.width;
			this.rowSprite.height = this.crossRect.height;
			this.rowSprite.scaleX = .1;

			this.addChild(this.rowSprite);
		}

		public onRemovedFromStage(event: egret.Event): void {

		}

		public removeAllEventListeners(): void {

		}

		public async fadeOut(duration: number) : Promise<any> {
			await new Promise<any>((resolve) => {
				egret.Tween.get(this.rowSprite).to({
					scaleX: 2,
					x: -this.width * 0.5
				}, duration * 0.8).to({
					alpha: 0
				}, duration * 0.2).call(() => {
					resolve(null);
				});
			});
			this.destroy();
		}

	}
}
