class meshUI extends layer.ui.Sprite {
	public mesh: Mesh;
	private gameSprite: gameUI;
	private _selectedCell: Cell;

	constructor() {
		super();

		this.mesh = new Mesh(9, 9);
		this.mesh.cellColors = [
			0xff0000,
			0x00ff00,
			0x0000ff,
			0xff00ff,
			0x00ffff
		];
		this._selectedCell = null;
	}

	public set selectedCell(value: Cell) {
		this._selectedCell = value;
		this.gameSprite.select(value);
	}

	public get selectedCell() : Cell|null {
		return this._selectedCell;
	}

	public start() {

	}

	public onAddedToStage(event: egret.Event) : void {
		if (this.width <=0 || this.height <= 0)
			throw new Error('Set width/height first');

		this.addEventListener(CellEvent.CELL_DRAG, this.onCellDrag, this);
		this.addEventListener(CellEvent.CELL_SELECT, this.onCellSelect, this);
		
		this.gameSprite = new gameUI(this.mesh);
		this.addChild(this.gameSprite);
	}

	public onRemovedFromStage(event: egret.Event): void {
		this.removeAllEventListeners();
	}

	public removeAllEventListeners(): void {
		this.removeEventListener(CellEvent.CELL_DRAG, this.onCellDrag, this);
		this.removeEventListener(CellEvent.CELL_SELECT, this.onCellSelect, this);
	}

	public async swapAndCrush(fromCell: Cell, toCell:Cell, crushCells: CrushCells)
	{
		await this.gameSprite.renderSwap(fromCell, toCell, !crushCells.hasCrushes);

		while (crushCells.hasCrushes)
		{
			await this.gameSprite.renderCrush(crushCells);
			let filledCells = this.mesh.rebuildWithCrush(crushCells);
			await this.gameSprite.renderFill(filledCells);

			crushCells = this.mesh.crushCells();
		}

	}

	private onCellDrag(event:CellEvent) {
		if(event.cell.block) return;
		//如果是Drag，取消选择
		this.selectedCell = null;

		let cell: Cell = this.mesh.getCellByPostion(event.cell, event.position);
		if (cell instanceof Cell) { // valid
			let crushCells: CrushCells  = this.mesh.swapWithCrush(event.cell, cell); //计算可以消失的cells

			this.swapAndCrush(event.cell, cell, crushCells); //使用yield直到动画完成，
		}
	}

	private onCellSelect(event:CellEvent) {
		if(event.cell.block) return;

		if (!this.selectedCell) {
			this.selectedCell = event.cell;
		} else if (this.selectedCell instanceof Cell) {
			if (
				(Math.abs(event.cell.row - this.selectedCell.row) == 1 && event.cell.col == this.selectedCell.col)
				|| (Math.abs(event.cell.col - this.selectedCell.col) == 1 && event.cell.row == this.selectedCell.row)
			) { //只差距1格
				let crushCells: CrushCells  = this.mesh.swapWithCrush(event.cell, this.selectedCell); //计算可以消失的cells

				this.swapAndCrush(event.cell, this.selectedCell, crushCells); //使用yield直到动画完成，
				
				this.selectedCell = null;
			}
		}
	}
}