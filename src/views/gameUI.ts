namespace ui {
export class GameUI extends layer.ui.Sprite {
	public mesh: Mesh;
	private meshSprite: MeshUI;
	private _selectedCell: Cell;
	private score: number = 0;

	private enabled: boolean = false;
	private running: boolean = false;
	private countdown: layer.timer.Countdown;

	constructor() {
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
		this.countdown = new layer.timer.Countdown(60 * 1000);
	}

	public set selectedCell(value: Cell) {
		this._selectedCell = value;
		this.meshSprite.select(value);
	}

	public get selectedCell() : Cell|null {
		return this._selectedCell;
	}

	private incrementScore(value: number) : void {
		this.score += value;

		// 分数动画，以及create / prefect

		let text: egret.TextField = this.getChildByName('score') as egret.TextField;
		if (text) text.text = this.score + '分';
	}

	public start() {
		this.enabled = true;
		this.running = true;
		this.score = 0;
		this.countdown.start(70);
		this.renderCountdown().then(v => this.stop()); //直到倒计时结束
	}

	public pause()
	{
		this.countdown.pause();
		this.enabled = false;
		this.running = false;
	}

	public resume() {
		this.countdown.resume();
		this.enabled = true;
		this.running = true;
	}

	private stop() {
		this.enabled = false;
		this.running = false;
	}

	public onAddedToStage(event: egret.Event) : void {

		this.addEventListener(CellEvent.CELL_DRAG, this.onCellDrag, this);
		this.addEventListener(CellEvent.CELL_SELECT, this.onCellSelect, this);

		let cdText: egret.TextField = new egret.TextField;
		cdText.name = 'countdown';
		cdText.x = 20;
		cdText.y = 150;
		cdText.text = "剩余：60.00 秒";
		cdText.textColor = 0xffffff;
		cdText.size = 35;
		this.addChild(cdText);

		let scoreText: egret.TextField = new egret.TextField;
		scoreText.name = 'score';
		scoreText.x = 500;
		scoreText.y = 150;
		scoreText.text = "0 分";
		scoreText.textColor = 0xffffff;
		scoreText.size = 35;

		this.addChild(scoreText);

		this.buildMeshSprite();

		this.start();
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
		if (this.meshSprite) this.meshSprite.destroy();
		this.meshSprite = new MeshUI(this.mesh);
		this.meshSprite.width = this.stage.stageWidth * .95;
		this.meshSprite.height = this.stage.stageHeight * .5;
		this.meshSprite.x = this.stage.stageWidth * .025;
		this.meshSprite.y = this.stage.stageHeight * 0.2;
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
	 * 渲染倒计时
	 */
	public async renderCountdown()
	{
		let remaining: number;
		let text: egret.TextField = this.getChildByName('countdown') as egret.TextField;
		while(remaining = await this.countdown.remainingPromise()) {
			if (text) text.text = "剩余："+ (remaining > 0 ? (remaining / 1000).toFixed(3) : 0) +" 秒";
		}
		if (text) text.text = "剩余：0 秒";
	}

	/**
	 * 渲染作弊
	 */
	public renderCheat()
	{
		let method: CrushedMethod = this.mesh.crushesTopMethod();
		if (method) {
			let cell: CellUI = this.meshSprite.getChildByCellIndex(method.cellIndex);
			if (cell) {
				switch (method.postion) {
					case layer.sharp.POSITION.UP:
						cell.text = '↑';
						break;
					case layer.sharp.POSITION.FORWARD:
						cell.text = '→';
						break;
					case layer.sharp.POSITION.DOWN:
						cell.text = '↓';
						break;
					case layer.sharp.POSITION.BACKWARD:
						cell.text = '←';
						break;
				}
			}
		}
	}

	public async swapAndCrush(fromCell: Cell, toCell: Cell, crushedCells: CrushedCells)
	{
		this.enabled = false;

		await this.meshSprite.renderSwap(fromCell, toCell, !crushedCells.isCellIndicesCrushed(fromCell.index, toCell.index));

		while (crushedCells.hasCrushes && this.running)
		{
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
