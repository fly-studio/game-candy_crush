namespace pages {
	export class LoginPage extends Page {

		private formSprite: pages.login.FormSprite;

		constructor(){
			super();
		}

		protected get groupList(): string[] {
			return ["page-login"];
		}

		public nextPage()
		{
			if (this.formSprite) { // 提交
				this.formSprite.submit().then(() => {
					new Game1Page();
				})
			} else {
				new Game1Page();
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

			if (window['LP'] != null && !window['LP']['user'])
			{
				this.formSprite = new pages.login.FormSprite;
				this.addChild(this.formSprite);
			}
			else
			{
				let infoSprite = new pages.login.InfoSprite;
				this.addChild(infoSprite);
			}

			let startButton: egret.Sprite = new layer.ui.ButtonUI('btn-start_png', "click_mp3");
			startButton.name = 'start-button';
			startButton.x = 221;
			startButton.y = 1026;
			startButton.touchEnabled = true;
			startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextPage, this);
			this.addChild(startButton);
		}

		public removeAllEventListeners(): void {
			let startButton = this.getChildByName('start-button');
			startButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextPage, this);
		}
	}
}
