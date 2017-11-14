class CrossUI extends layer.ui.Sprite {

	private crossRect: egret.Rectangle;
	private rowSprite: layer.ui.BitmapUI;
	private colSprite: layer.ui.BitmapUI;

	public constructor(crossRect: egret.Rectangle)
	{
		super();
		this.crossRect = crossRect;

		this.width = this.parent.width;
		this.height = this.parent.height;
			
		this.rowSprite = new layer.ui.BitmapUI("cross_png");
		this.rowSprite.x = 0;
		this.rowSprite.y = this.crossRect.y;
		this.rowSprite.width = this.width;
		this.rowSprite.height = this.crossRect.height;
		this.rowSprite.scaleX = .7;

		this.addChild(this.rowSprite);

		this.rowSprite = new layer.ui.BitmapUI("cross_png");
		this.rowSprite.x = this.crossRect.x;
		this.rowSprite.y = 0;
		this.rowSprite.width = this.width;
		this.rowSprite.height = this.crossRect.height;
		this.rotation = 90;
		this.rowSprite.scaleX = .7;
	}

	public onAddedToStage(event: egret.Event) : void {
		
	}

	public onRemovedFromStage(event: egret.Event): void {

	}

	public removeAllEventListeners(): void {
		
	}

	public fadeOut(duration: number) : Promise<any> {
		return Promise.all([
			new Promise<any>((resolve) => {
				egret.Tween.get(this.rowSprite).to({
					scaleX: 1.2,
					x: -this.rowSprite.width * 0.1
				}, duration * .8).to({
					alpha: 0
				}, duration * .2).call(() => {
					resolve();
				});
			}),
			new Promise<any>((resolve) => {
				egret.Tween.get(this.colSprite).to({
					scaleX: 1.2,
					y: -this.colSprite.width * 0.1
				}, duration * .8).to({
					alpha: 0
				}, duration * .2).call(() => {
					resolve();
				});
			})
		]).then(() => {
			this.destroy();
		});
	}

}