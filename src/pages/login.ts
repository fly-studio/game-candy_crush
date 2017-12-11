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
			startButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextPage, this);
			this.addChild(startButton);

			if (window['LP'] == undefined || window['LP']['user'] == undefined || window['LP']['user']['id'] == undefined)
			{
				this.formSprite = new pages.login.FormSprite;
				this.addChild(this.formSprite);

				startButton.x = 220;
				startButton.y = 1074;
				startButton.width = 310;
				startButton.height = 75;
			}
			else
			{
				let infoSprite = new pages.login.InfoSprite;
				this.addChild(infoSprite);

				startButton.x = 400;
				startButton.y = 960;
				startButton.width = 230;
				startButton.height = 65;

				let rankButton: egret.Sprite = new layer.ui.BlankButtonUI("click_mp3");
				rankButton.name = 'rank-button';
				rankButton.touchEnabled = true;
				rankButton.x = 120;
				rankButton.y = 960;
				rankButton.width = 230;
				rankButton.height = 65;
				rankButton.once(egret.TouchEvent.TOUCH_TAP, () => {
					new RankPage();
				}, this);
				this.addChild(rankButton);
				
			}
			
		}

		public removeAllEventListeners(): void {
			let startButton = this.getChildByName('start-button');
			startButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextPage, this);
		}
	}
}
