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

			if (window['LP'] == undefined || window['LP']['user'] == undefined || window['LP']['user']['id'] == undefined)
			{
				this.formSprite = new pages.login.FormSprite;
				this.addChild(this.formSprite);

				startButton.x = 220;
				startButton.y = 1064;
				startButton.width = 310;
				startButton.height = 75;

				let copyright = new layer.ui.BitmapUI('copyright_png');
				copyright.x = this.stage.stageWidth - copyright.width >> 1;
				copyright.y = this.stage.stageHeight - copyright.height >> 1;
				copyright.touchEnabled = true;
				copyright.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
					copyright.visible = false;
				}, this);
				copyright.visible = false;
				this.addChild(copyright);

				let copyrightButton: egret.Sprite = new layer.ui.BlankButtonUI("click_mp3");
				copyrightButton.name = 'copyright-button';
				copyrightButton.touchEnabled = true;
				copyrightButton.x = 292;
				copyrightButton.y = 1015;
				copyrightButton.width = 180;
				copyrightButton.height = 37;
				copyrightButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
					copyright.visible = true;
				}, this);
				this.addChild(copyrightButton);

				
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
			this.addChild(startButton);
			
		}

		public removeAllEventListeners(): void {
			let startButton = this.getChildByName('start-button');
			startButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextPage, this);
			
		}
	}
}
