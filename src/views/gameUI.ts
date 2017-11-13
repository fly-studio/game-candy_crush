class gameUI extends layer.ui.Sprite {
	private mesh: Mesh;
	public readonly cellColPadding: number = 7.5;
	public readonly cellRowPadding: number = 5;
	private cellWidth:number;
	private cellHeight:number;

	constructor(mesh: Mesh) {
		super();
		this.mesh = mesh;

		this.mesh.createMesh();
	}

	public onAddedToStage(e: egret.Event): void
	{
		this.width = this.parent.width;
		this.height = this.parent.height;
		this.cellWidth = (this.width - this.cellColPadding * this.mesh.cols * 2) / this.mesh.cols;
		this.cellHeight = (this.height - this.cellRowPadding * this.mesh.rows * 2) / this.mesh.rows;

		this.renderMesh()
	}

	public onRemovedFromStage(e: egret.Event): void
	{

	}

	public removeAllEventListeners(): void
	{

	}

	public getCellRectangle(row: number, col: number) : egret.Rectangle
	{
		return new egret.Rectangle(
			this.cellColPadding * col * 2 + this.cellWidth * col + this.cellColPadding, 
			this.cellRowPadding * row * 2 + this.cellHeight * row + this.cellRowPadding,
			this.cellWidth,
			this.cellHeight
		);
	}

	public renderMesh() : void
	{
		this.removeChildren();

		for(let row: number = 0; row < this.mesh.rows; ++row) {
			for(let col:number = 0; col < this.mesh.cols; col++) {
				let cell: CellUI = new CellUI(this.mesh.cell(row, col));
				let rect = this.getCellRectangle(row, col);
				cell.x = rect.x;
				cell.y = rect.y;
				cell.width = rect.width;
				cell.height = rect.height;
				this.addChild(cell);
			}
		}
	}

	public renderSwap(fromCell: Cell, toCell:Cell, swapBack:boolean) : Promise<any>
	{
		let fromCellUI: CellUI = this.getChildByCellIndex(fromCell.index) as CellUI;
		let toCellUI: CellUI = this.getChildByCellIndex(toCell.index) as CellUI;
		console.log('swap: ', fromCell.index, toCell.index);

		let promises : Promise<any>[] = [];
		if (swapBack)
		{
			promises.push(fromCellUI.moveTo(200, toCellUI.position, fromCellUI.position));
			promises.push(toCellUI.moveTo(200, fromCellUI.position, toCellUI.position));
		} else {
			promises.push(fromCellUI.moveTo(200, toCellUI.position));
			promises.push(toCellUI.moveTo(200, fromCellUI.position));
		}
		return Promise.all(promises);
	}

	public renderCrush(crushCells: CrushCells) : Promise<any>
	{
		return ;
	}

	public renderFill(filledCells) : Promise<any> {
		return ;
	}

	public getChildByCellIndex(index: number) : CellUI|null {
		for (let i = 0; i < this.numChildren; i++) {
			let element: CellUI = this.getChildAt(i) as CellUI;
			if (element.cell.index == index)
				return element;
		}
		return null;
	}

	public clearSelected() : void {
		for (let i = 0; i < this.numChildren; i++) {
			let element: CellUI = this.getChildAt(i) as CellUI;
			element.selected = false;
		}
	}

	public select(cell: Cell) : void {
		this.clearSelected();
		if (!cell) return;
		let element: CellUI = this.getChildByCellIndex(cell.index);
		if (element instanceof CellUI)
			element.selected = true;
	}


}