class GameEvent extends egret.Event {

	static GAME_START: string = 'GAME_START';
	static GAME_PAUSE: string = 'GAME_PAUSE';
	static GAME_RESUME: string = 'GAME_RESUME';
	static GAME_COUNTDOWN: string = 'GAME_COUNTDOWN';
	static GAME_STOP: string = 'GAME_STOP';
	static GAME_SCORE: string = 'GAME_SCORE';
	static GAME_DELTA_SCORE: string = 'GAME_DELTA_SCORE';

	public deltaScore: number = 0;
	public score: number = 0;
	public remaining: number = 0;

	public static dispatchGameEvent(target: egret.IEventDispatcher, type: string, score: number = 0, remaining: number = 0): boolean {
		if (!(target instanceof ui.GameUI))
			throw new Error('target must be an instance of ui.GameUI');

		let event: GameEvent = egret.Event.create(GameEvent, type, true);
		event.score = score;
		event.remaining = remaining;
		let result: boolean = target.dispatchEvent(event);
		egret.Event.release(event);
		return result;
	}

}
