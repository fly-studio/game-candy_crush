class GameUI extends layer.ui.Sprite {
	public mesh: Mesh;
	private meshSprite: MeshUI;
	private _selectedCell: Cell;
	private score: number = 0;


	private enabled: boolean = false;
	private running: boolean = false;
	private countdown: layer.timer.Countdown;

	constructor() {
		super();

		this.mesh = new Mesh(9, 9);
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
		this.countdownRender().then(v => this.stop()); //直到倒计时结束
	}

	public stop() {
		this.enabled = false;
		this.running = false;
	}

	public onAddedToStage(event: egret.Event) : void {

		this.addEventListener(CellEvent.CELL_DRAG, this.onCellDrag, this);
		this.addEventListener(CellEvent.CELL_SELECT, this.onCellSelect, this);
		
		this.meshSprite = new MeshUI(this.mesh);
		this.meshSprite.width = this.stage.stageWidth * .95;
		this.meshSprite.height = this.stage.stageHeight * .5;
		this.meshSprite.x = this.stage.stageWidth * .025;
		this.meshSprite.y = this.stage.stageHeight * 0.2;
		this.addChild(this.meshSprite);

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

		this.start();
	}

	public onRemovedFromStage(event: egret.Event): void {
		this.removeAllEventListeners();
	}

	public removeAllEventListeners(): void {
		this.removeEventListener(CellEvent.CELL_DRAG, this.onCellDrag, this);
		this.removeEventListener(CellEvent.CELL_SELECT, this.onCellSelect, this);
	}

	public async countdownRender()
	{
		let remaining: number;
		let text: egret.TextField = this.getChildByName('countdown') as egret.TextField;
		while(remaining = await this.countdown.remainingPromise()) {
			if (text) text.text = "剩余："+ (remaining > 0 ? (remaining / 1000).toFixed(3) : 0) +" 秒";
		}
		if (text) text.text = "剩余：0 秒";
	}

	public async swapAndCrush(fromCell: Cell, toCell:Cell, crushedCells: CrushedCells)
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
		this.enabled = true;
	}

	private onCellDrag(event:CellEvent) {
		if(event.cell.block || !this.enabled) return;

		this.selectedCell = event.cell;

		let cell: Cell = this.mesh.getCellByPostion(event.cell, event.position);
		if (cell instanceof Cell) { // valid
			let crushedCells: CrushedCells  = this.mesh.swapWithCrush(event.cell, cell); //计算可以消失的cells
			this.swapAndCrush(event.cell, cell, crushedCells);
		}
	}

	private onCellSelect(event:CellEvent) {
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
			} else { //隔太远 重新点击
				this.selectedCell = event.cell;
			}
		}
	}
}