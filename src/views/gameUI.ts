namespace ui {
	export class GameUI extends layer.ui.Sprite {
		public mesh: Mesh;
		private meshSprite: MeshUI;
		private _selectedCell: Cell;
		private score: number = 0;

		private enabled: boolean = false;
		private running: boolean = false;
		private countdown: layer.timer.Countdown;

		public blocks: number[] = [];

		constructor(duration:number) {
			super();

			this.mesh = new Mesh(8, 8);

			/*this.mesh.cellColors = [
				0xff0000,
				0x00ff00,
				0x0000ff,
				0xff00ff,
				0x00ffff
			];*/
			this.mesh.cellColors = [
				'metro_1_png',
				'metro_2_png',
				'metro_3_png',
				'metro_4_png',
				'metro_5_png'
			];
			this._selectedCell = null;
			this.countdown = new layer.timer.Countdown(duration * 1000);
		}

		public set selectedCell(value: Cell) {
			this._selectedCell = value;
			if (value)
				layer.media.Sound.play('click1_mp3');

			this.meshSprite.select(value);
		}

		public get selectedCell() : Cell|null {
			return this._selectedCell;
		}

		private incrementScore(value: number) : void {
			this.score += value;
			this.triggerEvent(GameEvent.GAME_DELTA_SCORE, value);
			this.triggerEvent(GameEvent.GAME_SCORE);
		}

		public start() {
			this.enabled = true;
			this.running = true;
			this.score = 0;
			this.countdown.start(70);
			this.asyncCountdown().then(v => this.stop()); //直到倒计时结束

			this.triggerEvent(GameEvent.GAME_START);
		}

		public pause()
		{
			this.countdown.pause();
			this.enabled = false;
			this.running = false;
			this.triggerEvent(GameEvent.GAME_PAUSE);
		}

		public resume() {
			this.countdown.resume();
			this.enabled = true;
			this.running = true;
			this.triggerEvent(GameEvent.GAME_RESUME);
		}

		private stop() {
			this.enabled = false;
			this.running = false;
			this.triggerEvent(GameEvent.GAME_STOP);
		}

		private triggerEvent(type: string, score?: number, remaining?: number)
		{
			GameEvent.dispatchGameEvent(this, type, score == null ? this.score : score, remaining == null ? this.countdown.remaining : remaining);
		}

		/**
		 * 倒计时
		 */
		public async asyncCountdown()
		{
			let remaining: number = 0;
			while((remaining = await this.countdown.remainingPromise()) > 0) {
				this.triggerEvent(GameEvent.GAME_COUNTDOWN, null, remaining);
			}
			this.triggerEvent(GameEvent.GAME_COUNTDOWN, null, 0);
		}

		public onAddedToStage(event: egret.Event) : void {

			this.addEventListener(CellEvent.CELL_DRAG, this.onCellDrag, this);
			this.addEventListener(CellEvent.CELL_SELECT, this.onCellSelect, this);

			this.buildMeshSprite();
		}

		public onRemovedFromStage(event: egret.Event): void {
			this.removeAllEventListeners();
		}

		public removeAllEventListeners(): void {
			this.removeEventListener(CellEvent.CELL_DRAG, this.onCellDrag, this);
			this.removeEventListener(CellEvent.CELL_SELECT, this.onCellSelect, this);
		}

		public buildMeshSprite()
		{
			this.mesh.blocks = this.blocks;
			if (this.meshSprite) this.meshSprite.destroy();
			this.meshSprite = new MeshUI(this.mesh);
			this.meshSprite.width = this.width;
			this.meshSprite.height = this.height;
			this.meshSprite.x = 0;
			this.meshSprite.y = 0;
			this.addChild(this.meshSprite);

			this.renderCheat();
		}

		/**
		 * 渲染死局界面
		 */
		public renderDead() : Promise<any> {
			this.pause();
			let deadSprite: egret.Sprite = new egret.Sprite;
			deadSprite.x = 0;
			deadSprite.y = 0;
			let text: egret.TextField = new egret.TextField;
			text.text = '死局 重算中';
			text.textColor = 0xff0000;
			text.size = 40;
			text.textAlign = 'center';
			text.width = this.stage.stageWidth;
			text.y = 100;
			deadSprite.addChild(text);

			layer.media.Sound.play('deadmap_mp3');

			this.stage.addChild(deadSprite);

			return Promise.all([
				new Promise(resolve => {
					//重新渲染游戏区
					this.buildMeshSprite();
					resolve();
				}),
				new Promise<any>(resolve => {
					setTimeout(() => {
						resolve();
					}, 500); //至少让用户等待.5秒
				})
			]).then(() => {
				this.stage.removeChild(deadSprite); //移除死局遮罩
				this.resume();
			});
		}

		/**
		 * 渲染作弊
		 */
		public renderCheat()
		{
			if (!DEBUG) return;
			let method: CrushedMethod = this.mesh.crushesTopMethod();
			if (method) {
				let cell: CellUI = this.meshSprite.getChildByCellIndex(method.cellIndex);
				if (cell) {
					switch (method.postion) {
						case sharp.POSITION.UP:
							cell.text = '↑';
							break;
						case sharp.POSITION.FORWARD:
							cell.text = '→';
							break;
						case sharp.POSITION.DOWN:
							cell.text = '↓';
							break;
						case sharp.POSITION.BACKWARD:
							cell.text = '←';
							break;
					}
				}
			}
		}

		public async swapAndCrush(fromCell: Cell, toCell: Cell, crushedCells: CrushedCells)
		{
			let serials :number = 0;
			this.enabled = false;
			let isCrushed: boolean = crushedCells.isCellIndicesCrushed(fromCell.index, toCell.index);

			if (!isCrushed)
				layer.media.Sound.play('break_mp3');

			await this.meshSprite.renderSwap(fromCell, toCell, !isCrushed);

			while (crushedCells.hasCrushes && this.running)
			{
				if (serials > 0)
					layer.media.Sound.play('syllable_' + (serials % 8) + '_mp3');
				else
					layer.media.Sound.play('normal_mp3');

				serials++;

				this.selectedCell = null;
				this.incrementScore(crushedCells.length);

				await this.meshSprite.renderCrush(crushedCells);
				let filledCells:FilledCells = this.mesh.rebuildWithCrush(crushedCells);
				await this.meshSprite.renderFill(filledCells);

				crushedCells = this.mesh.crushedCells();
			}
			if (this.mesh.AllDead()) {
				await this.renderDead();
			}
			await this.renderCheat();
			this.enabled = this.running;
		}

		private onCellDrag(event: CellEvent) {
			if(event.cell.block || !this.enabled) return;

			this.selectedCell = event.cell;

			let cell: Cell = this.mesh.getCellByPostion(event.cell.index, event.position);
			if (cell instanceof Cell) { // valid
				let crushedCells: CrushedCells  = this.mesh.swapWithCrush(event.cell, cell); //计算可以消失的cells
				this.swapAndCrush(event.cell, cell, crushedCells);
			}
		}

		private onCellSelect(event: CellEvent) {
			if(event.cell.block || !this.enabled) return;

			if (!this.selectedCell) {
				this.selectedCell = event.cell;
			} else if (this.selectedCell instanceof Cell) {
				if (
					(Math.abs(event.cell.row - this.selectedCell.row) == 1 && event.cell.col == this.selectedCell.col)
					|| (Math.abs(event.cell.col - this.selectedCell.col) == 1 && event.cell.row == this.selectedCell.row)
				) { //只差距1格
					let crushedCells: CrushedCells  = this.mesh.swapWithCrush(event.cell, this.selectedCell); //计算可以消失的cells
					this.swapAndCrush(event.cell, this.selectedCell, crushedCells);
					this.selectedCell = null;

				} else { //隔太远 重新点击
					this.selectedCell = event.cell;
				}
			}
		}
	}
}
