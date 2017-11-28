namespace pages.game {
	export class CheerSprite extends egret.Sprite {
		public addScore(score: number)
		{

			let words: string = '';
			if (score <= 3) //一组
			{
				//words = 'normal';
			}
			else if (score <= 4) // 1组超过3
			{
				words = 'good';
			}
			else if (score <= 6) // 两组
			{
				words = 'great';
			}
			else if (score <= 8) // 一条
			{
				words = 'amazing';
			}
			else if (score <= 11) //一条 + 1组
			{
				words = 'excellent';
			}
			else if (score > 11)
			{
				words = 'unbelievable';
			}
			this.createWords(words + '_png');
			layer.media.Sound.play(words + '_mp3');
		}

		protected createWords(words: string)
		{
			if (!this.parent) return;

			let wordSprite: egret.Sprite = new egret.Sprite;
			let bmp: layer.ui.BitmapUI = new layer.ui.BitmapUI(words);
			wordSprite.addChild(bmp);
			wordSprite.x = (this.stage.stageWidth - bmp.width) / 2;
			wordSprite.y = 378;
			this.addChild(wordSprite);
			egret.Tween.get(wordSprite).wait(500).to({
				y: 300,
				alpha: 0
			}, 500).call(() => {
				wordSprite.parent.removeChild(wordSprite);
			}, this);
		}
	}
}
