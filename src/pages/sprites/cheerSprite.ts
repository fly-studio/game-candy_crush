namespace pages {
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
			else if (score <= 8) // 一横条 或2
			{
				words = 'great';
			}
			else if (score <= 12) // 一竖条
			{
				words = 'excellent';
			}
			else if (score > 12) //包裹 或 1条+1组
			{
				words = 'unbelievable';
			}
			if (words.length)
				this.createWords(words + '_png');
			layer.media.Sound.play(words + '_mp3');
		}

		protected createWords(words: string)
		{
			if (!this.parent) return;

			let wordSprite: egret.Sprite = new egret.Sprite;
			let bmp  = new layer.ui.BitmapUI(words);

			wordSprite.addChild(bmp);
			wordSprite.x = (this.stage.stageWidth - bmp.width) / 2;
			wordSprite.y = 200;
			this.addChild(wordSprite);
			egret.Tween.get(wordSprite).wait(300).to({
				y: 150,
				alpha: 0
			}, 500).call(() => {
				wordSprite.parent.removeChild(wordSprite);
			}, this);
		}
	}
}
