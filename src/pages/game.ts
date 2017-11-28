namespace pages {
	export abstract class Game extends Page {
		protected scorebarSprite: pages.game.ScorebarSprite = null;
		protected cheerSprite: pages.game.CheerSprite;
		protected readySprite: layer.ui.ready.CircleUI;
		private playedClock: boolean = false;

		constructor()
		{
			super();
		}

		public onAddedToStage(event: egret.Event) : void {
			this.cheerSprite = new pages.game.CheerSprite;
			this.stage.addChild(this.cheerSprite);
			this.readySprite = new layer.ui.ready.CircleUI();
			this.readySprite.readyRes = [
				{
					imageRes: "3_png",
					soundRes: "countdown_mp3"
				},
				{
					imageRes: "2_png",
					soundRes: "countdown_mp3"
				},
				{
					imageRes: "1_png",
					soundRes: "countdown_mp3"
				},
				{
					imageRes: "go_png",
					soundRes: "ready_go_mp3"
				},
			]
			this.stage.addChild(this.readySprite);

			this.addEventListener(GameEvent.GAME_START, this.onGameStart, this);
			this.addEventListener(GameEvent.GAME_STOP, this.onGameStop, this);
			this.addEventListener(GameEvent.GAME_RESUME, this.onGameResume, this);
			this.addEventListener(GameEvent.GAME_PAUSE, this.onGamePause, this);
			this.addEventListener(GameEvent.GAME_SCORE, this.onGameScore, this);
			this.addEventListener(GameEvent.GAME_DELTA_SCORE, this.onGameDeltaScore, this);
			this.addEventListener(GameEvent.GAME_COUNTDOWN, this.onGameCountdown, this);
		}

		public removeAllEventListeners(): void {
			this.removeEventListener(GameEvent.GAME_START, this.onGameStart, this);
			this.removeEventListener(GameEvent.GAME_STOP, this.onGameStop, this);
			this.removeEventListener(GameEvent.GAME_RESUME, this.onGameResume, this);
			this.removeEventListener(GameEvent.GAME_PAUSE, this.onGamePause, this);
			this.removeEventListener(GameEvent.GAME_SCORE, this.onGameScore, this);
			this.removeEventListener(GameEvent.GAME_COUNTDOWN, this.onGameCountdown, this);
		}

		protected onGameStart(event: GameEvent) : void {

		}

		protected onGameStop(event: GameEvent) : void {

			this.stage.removeChild(this.cheerSprite);
			this.cheerSprite = null;

			layer.media.Sound.play('win_mp3');
		}

		protected onGameResume(event: GameEvent) : void {

		}

		protected onGamePause(event: GameEvent) : void {

		}
		//总分
		protected onGameScore(event: GameEvent)
		{
			let score: number = event.score;
			if (this.scorebarSprite)
				this.scorebarSprite.score = score;
		}
		//单次分数
		protected onGameDeltaScore(event: GameEvent)
		{
			let score: number = event.score;
			if (this.cheerSprite) this.cheerSprite.addScore(event.score);
		}

		protected onGameCountdown(event: GameEvent)
		{
			let remaining: number = event.remaining;
			if (this.scorebarSprite)
				this.scorebarSprite.countdown = remaining;
			if (remaining <= 5000 && !this.playedClock)
			{
				this.playedClock = true;
				layer.media.Sound.play('clock_mp3', 4);
			}
		}
	}
}
