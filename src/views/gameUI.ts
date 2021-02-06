namespace ui {
	export class GameUI extends layer.ui.Sprite {
		public mesh: Mesh;
		private meshSprite: MeshUI;
		// 上一个被点击的cell
		private _lastTappedCell: Cell;
		private score: number = 0;

		private enabled: boolean = false;
		private running: boolean = false;
		private countdown: layer.timer.Countdown;

		public blocks: number[] = [];

		constructor(duration:number) {
			super();

			this.mesh = new Mesh(12, 8);

			/*this.mesh.cellColors = [
				0xff0000,
				0x00ff00,
				0x0000ff,
				0xff00ff,
				0x00ffff
			];*/
			this.mesh.cellColors = [
				this.makeCharacter('bear'),
				this.makeCharacter('chicken'),
				this.makeCharacter('fox'),
				this.makeCharacter('frog'),
				this.makeCharacter('hippo'),
				this.makeCharacter('owl'),
			];
			this._lastTappedCell = null;
			this.countdown = new layer.timer.Countdown(duration * 1000);
		}

		private makeCharacter(name: string) {
			return (parent: egret.Sprite, cell: Cell) => {
				let factory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(RES.getRes(name + '_json'), RES.getRes(name + '_png'));
				let data: egret.MovieClipData = factory.generateMovieClipData(name);
				data.frameRate = 30; // 重新计算帧率
				let mc: egret.MovieClip = new egret.MovieClip(data);
				mc.x = parent.width / 2;
				mc.y = parent.height / 2;
				mc.width = parent.width;
				mc.height = parent.height;

				mc.addEventListener(CellEvent.CELL_SELECT, (event: CellEvent) => {
					if (event.cell.isNormalAction)
						mc.gotoAndPlay(CellAction.SELECTED, -1)
				}, mc);
				mc.addEventListener(CellEvent.CELL_UNSELECT, (event: CellEvent) => {
					if (event.cell.isNormalAction)
						mc.stop()
				}, mc);
				mc.addEventListener(CellEvent.CELL_CHANGE, (event: CellEvent) => {

					if (!event.cell.isNormalAction && mc.currentFrameLabel != event.cell.action){
						mc.gotoAndPlay(event.cell.action, -1)
					}
				}, mc);

				if (!cell.isNormalAction) {
					mc.gotoAndPlay(cell.action, -1);
				}

				parent.addChild(mc)
				return mc
			}

		}

		public set lastTappedCell(value: Cell) {
			let _last = this._lastTappedCell
			// 上一次点击的unselect
			if (_last instanceof Cell && value != _last) {
				this.meshSprite.unselect(this._lastTappedCell);
			}

			this._lastTappedCell = value;
			if (value)
				layer.media.Sound.play('click1_mp3');

			// 当前点击的select
			if (value != _last)
			{
				this.meshSprite.select(value);
			}

		}

		public get lastTappedCell() : Cell|null {
			return this._lastTappedCell;
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
			this.asyncCountdown().then(v => this.stop()).catch(error => {}); //直到倒计时结束
			this.renderCheat();

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
			try {
				while((remaining = await this.countdown.remainingPromise()) > 0) {
					this.triggerEvent(GameEvent.GAME_COUNTDOWN, null, remaining);
				}
			} catch (error) {

			}

			this.triggerEvent(GameEvent.GAME_COUNTDOWN, null, 0);
		}

		public onAddedToStage(event: egret.Event) : void {

			this.addEventListener(CellEvent.CELL_DRAG, this.onCellDrag, this);
			this.addEventListener(CellEvent.CELL_TAP, this.onCellTap, this);

			this.buildMeshSprite();
		}

		public onRemovedFromStage(event: egret.Event): void {
			this.removeAllEventListeners();
		}

		public removeAllEventListeners(): void {
			this.removeEventListener(CellEvent.CELL_DRAG, this.onCellDrag, this);
			this.removeEventListener(CellEvent.CELL_TAP, this.onCellTap, this);
		}

		public buildMeshSprite()
		{
			this.mesh.blocks = this.blocks;
			if (this.meshSprite)
				this.meshSprite.destroy();
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
		public async renderDead() : Promise<any> {
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

			await Promise.all([
				new Promise(resolve => {
					//重新渲染游戏区
					this.buildMeshSprite();
					resolve(null);
				}),
				new Promise<any>(resolve => {
					setTimeout(() => {
						resolve(null);
					}, 500); //至少让用户等待.5秒
				})
			]);

			this.stage.removeChild(deadSprite); //移除死局遮罩
			this.resume();
		}

		/**
		 * 渲染作弊
		 */
		public renderCheat()
		{
			if (!DEBUG && window.location.hash != '#automation') return;
			let method: CrushedMethod = this.mesh.crushesTopMethod();
			if (method) {
				if (window.location.hash == '#automation') {
					let event = new CellEvent('');
					event.cell = this.mesh.cell(method.cellIndex);
					event.position = method.position;
					this.onCellDrag(event);
				}
				let cell: CellUI = this.meshSprite.getChildByCellIndex(method.cellIndex);
				if (cell) {
					switch (method.position) {
						case POSITION.UP:
							cell.text = '↑';
							break;
						case POSITION.FORWARD:
							cell.text = '→';
							break;
						case POSITION.DOWN:
							cell.text = '↓';
							break;
						case POSITION.BACKWARD:
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

			// 如果能消除，渲染交换的动画，不然还需要渲染交换回来的动画
			try {
				await this.meshSprite.renderSwap(fromCell, toCell, !isCrushed);
			} catch (error) {

			}

			// 判断可以消除, 并渲染动画
			// 往下填充后需要重复计算全局是否可以消除
			while (crushedCells.hasCrushes && this.running)
			{
				if (serials > 0)
					layer.media.Sound.play('syllable_' + (serials % 9) + '_mp3');
				else
					layer.media.Sound.play('normal_mp3');

				serials++;

				// 如果有消除的cells，需要清理上一次点击的cell
				this.lastTappedCell = null;
				this.incrementScore(crushedCells.length);

				// 移除特殊cells项
				this.mesh.removeSpecialCells(crushedCells.cellIndices(true));

				try {
					// 渲染消除动画
					await this.meshSprite.renderCrush(crushedCells);
					// 生成需要补充的cells
					let filledCells: FilledCells = this.mesh.rebuildWithCrush(crushedCells);
					// 渲染补充动画, 即从上往下掉
					await this.meshSprite.renderFill(filledCells);

				} catch (error) {

				}

				// 重新计算特殊cells，并发起change event
				this.mesh.makeSpecialCells();
				this.triggerChangeCell();

				crushedCells = this.mesh.crushedCells();
			}
			if (this.mesh.AllDead()) {
				try {
					await this.renderDead();
				} catch (error) {

				}
			}
			this.enabled = this.running;

			this.renderCheat();

			this.triggerChangeCell()
		}

		/**
		 * 直接在一个cell上滑动
		 * @param event
		 */
		private onCellDrag(event: CellEvent) {
			if(event.cell.block || !this.enabled) return;

			this.lastTappedCell = event.cell;

			let cell: Cell = this.mesh.getCellByPosition(event.cell.index, event.position);
			if (cell instanceof Cell) { // valid
				let crushedCells: CrushedCells  = this.mesh.swapWithCrush(event.cell, cell); //计算可以消失的cells
				this.swapAndCrush(event.cell, cell, crushedCells);
			}
		}

		/**
		 * 在cell上设置焦点，需要检查是否上一个被选中的cell，如有，则表示期望swap。如果太远则将将焦点设置为当前cell
		 * @param event
		 */
		private onCellTap(event: CellEvent) {
			if(event.cell.block || !this.enabled) return;

			if (!this.lastTappedCell) {
				this.lastTappedCell = event.cell;
			} else if (this.lastTappedCell instanceof Cell) { // 有上一次的点击, 需要判断是否需要swap
				if (
					(Math.abs(event.cell.row - this.lastTappedCell.row) == 1 && event.cell.col == this.lastTappedCell.col)
					|| (Math.abs(event.cell.col - this.lastTappedCell.col) == 1 && event.cell.row == this.lastTappedCell.row)
				) { //只差距1格, 表示可以swap
					let crushedCells: CrushedCells  = this.mesh.swapWithCrush(event.cell, this.lastTappedCell); //计算可以消失的cells
					this.swapAndCrush(event.cell, this.lastTappedCell, crushedCells);
					this.lastTappedCell = null;

				} else { //隔太远 重新设置点击
					this.lastTappedCell = event.cell;
				}
			}
		}

		private triggerChangeCell() {
			this.meshSprite.changeCell();
		}
	}
}
