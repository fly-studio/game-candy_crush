class Game1 extends Page  {
	private score: number = 0;

	constructor(){
		super();

		this.loading(["page-game1", "game", "fonts", "metro", "sound", "crush", "countdown"])
	}

	public nextPage()
	{
		//new Game2();

	}

	public onAddedToStage(event: egret.Event) : void {
		let bgSprite: layer.ui.BitmapUI = new layer.ui.BitmapUI('bg_png');
		this.addChild(bgSprite);

		let frameSprite: layer.ui.BitmapUI = new layer.ui.BitmapUI("login_frame_png");
		frameSprite.x = 75;
		frameSprite.y = 329;
		this.addChild(frameSprite);

		let rulerSprite: layer.ui.BitmapUI = new layer.ui.BitmapUI("rules_png");
		rulerSprite.x = 91;
		rulerSprite.y = 689;
		this.addChild(rulerSprite);

		let startButton: egret.Sprite = new egret.Sprite;
		startButton.addChild(new layer.ui.BitmapUI("btn-start_png"));
		startButton.x = 221;
		startButton.y = 1026;
		startButton.touchEnabled = true;
		startButton.once(egret.TouchEvent.TOUCH_TAP, () => {
			this.nextPage();
		}, this);
		this.addChild(startButton)
	}

	public onRemovedFromStage(event: egret.Event): void {
		this.removeAllEventListeners();
	}

	public removeAllEventListeners(): void {

	}
}
