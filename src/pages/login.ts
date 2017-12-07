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

			let startButton: egret.Sprite = new layer.ui.BlankButtonUI("click_mp3");
			startButton.name = 'start-button';
			startButton.touchEnabled = true;
			startButton.width = 310;
			startButton.height = 75;
			startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextPage, this);
			this.addChild(startButton);

			if (window['LP'] == undefined || window['LP']['user'] == undefined || window['LP']['user']['id'] == undefined)
			{
				this.formSprite = new pages.login.FormSprite;
				this.addChild(this.formSprite);

				startButton.x = 220;
				startButton.y = 1074;
			}
			else
			{
				let infoSprite = new pages.login.InfoSprite;
				this.addChild(infoSprite);

				startButton.x = 220;
				startButton.y = 957;
			}
			
		}

		public removeAllEventListeners(): void {
			let startButton = this.getChildByName('start-button');
			startButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextPage, this);
		}
	}
}
