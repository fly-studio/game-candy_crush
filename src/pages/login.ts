class LoginPage extends Page {

	private formSprite: pages.login.FormSprite;

	constructor(){
		super();

		this.loading(["page-login"])
	}

	public nextPage()
	{
		if (this.formSprite) { // 提交
			this.formSprite.submit().then(() => {
				new Game1();
			})
		} else {
			new Game1();
		}
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

		this.formSprite = new pages.login.FormSprite;
		this.addChild(this.formSprite);

		let startButton: egret.Sprite = new egret.Sprite;
		startButton.addChild(new layer.ui.BitmapUI("btn-start_png"));
		startButton.x = 221;
		startButton.y = 1026;
		startButton.touchEnabled = true;
		startButton.once(egret.TouchEvent.TOUCH_TAP, () => {
			this.nextPage();
		}, this);
		this.addChild(startButton);
	}

	public onRemovedFromStage(event: egret.Event): void {
		this.removeAllEventListeners();
	}

	public removeAllEventListeners(): void {

	}
}
