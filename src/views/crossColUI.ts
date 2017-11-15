class CrossColUI extends layer.ui.Sprite {

	private crossRect: egret.Rectangle;
	private colSprite: layer.ui.BitmapUI;

	public constructor(crossRect: egret.Rectangle)
	{
		super();
		this.crossRect = crossRect;
	}

	public onAddedToStage(event: egret.Event) : void {
		this.width = this.parent.width;
		this.height = this.parent.height;

		this.colSprite = new layer.ui.BitmapUI("cross_v_png");
		this.colSprite.x = this.crossRect.x;
		this.colSprite.y = this.height * .45;
		this.colSprite.width = this.crossRect.width;
		this.colSprite.height = this.height;
		this.colSprite.scaleY = .1;
		
		this.addChild(this.colSprite);
	}

	public onRemovedFromStage(event: egret.Event): void {

	}

	public removeAllEventListeners(): void {
		
	}

	public fadeOut(duration: number) : Promise<any> {
		return new Promise<any>((resolve) => {
			egret.Tween.get(this.colSprite).to({
				scaleY: 2,
				y: -this.height * 0.5
			}, duration * .8).to({
				alpha: 0
			}, duration * .2).call(() => {
				resolve();
			});
		}).then(() => {
			this.destroy();
		});
	}

}