namespace ui {
	export class ReadyUI extends layer.ui.Sprite {

		private circleSprite: egret.Sprite;
		public constructor()
		{
			super();
		}

		public onAddedToStage(event: egret.Event) : void {
			let radius: number = this.stage.stageHeight;
			let circlePos: egret.Point = new egret.Point(this.stage.stageWidth / 2, this.stage.stageHeight * 1.5);

			//mask
			this.addChild(new layer.ui.MaskUI(0xffffff));

			this.circleSprite = new egret.Sprite;

			this.circleSprite.anchorOffsetX = radius;
			this.circleSprite.anchorOffsetY = radius;
			this.circleSprite.x = circlePos.x;
			this.circleSprite.y = circlePos.y;
			if (DEBUG) {
				this.circleSprite.graphics.lineStyle(1, 0x0);
				this.circleSprite.graphics.drawCircle(radius, radius, radius);
			}

			//draw 3
			['go', 1, 2, 3].forEach((v, i) => {
				let bmp: layer.ui.BitmapUI = new layer.ui.BitmapUI(v + "_png");
				bmp.anchorOffsetX = bmp.width / 2;
				bmp.anchorOffsetY = bmp.height / 2;
				let pt: egret.Point = layer.sharp.circlePoint(new egret.Point(radius, radius), radius, layer.sharp.d2r(90 * i));
				bmp.x = pt.x;
				bmp.y = pt.y;
				bmp.rotation = 90 * (i + 1);
				this.circleSprite.addChild(bmp);
			});


			this.addChild(this.circleSprite);
		}

		public onRemovedFromStage(event: egret.Event): void {
			this.removeAllEventListeners();
		}

		public removeAllEventListeners(): void {
		}

		public animating()
		{
			return new Promise<any> ((resolve => {
				egret.Tween.get(this.circleSprite)
				.wait(500)
				.call(() => { // 3
					Sound.play('countdown_mp3');
				}, this)
				.to({rotation: 90}, 500) // 2
				.wait(500)
				.call(() => {
					Sound.play('countdown_mp3');
				}, this)
				.to({rotation: 180}, 500)
				.wait(500)
				.call(() => { // GO
					Sound.play('ready_go_mp3');
				}, this)
				.to({rotation: 270}, 500)

				.wait(500)
				.call(() => {
					this.destroy();
					resolve();
				}, this);
				;
			}));
		}

	}
}
