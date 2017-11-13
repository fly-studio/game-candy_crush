class Mesh extends MeshData {

	public createMesh() : void
	{
		this.cells = [];
		for(let row:number = 0; row < this.rows; row++) {
			for(let col:number = 0; col < this.cols; col++) {
				let cell:Cell = new Cell(this, this.index(row, col));
				this.cells.push(cell);
				cell.colorIndex = this.randomColorIndex(row, col);
			}
		}
	}

	public clearRow(row: number) {
		if (row < 0 || row >= this.rows) return;
		for(let i: number = 0; i < this.length; ++i)
		{
			if (this.at(i).row == row)
				this.cells[i] = null;
		}
	}

	public clearCol(col: number) {
		if (col < 0 || col >= this.cols) return;
		for(let i: number = 0; i < this.length; ++i)
		{
			if (this.at(i).col == col)
				this.cells[i] = null;
		}
	}

	public createRow(cols:number) : void {

	}

	public createCol(rows:number) : void {

	}

	public rebuildWithCrush(crushCells: CrushCells) : Cell[] {
		if (!crushCells.hasCrushes) return [];

		let gridCells: number[][] = crushCells.formatedCellIndices.reverse(); //DESC


		return [];
	}

	public replace(fromCell:Cell, toCell:Cell) {

	}

	public swap(fromCell:Cell, toCell:Cell) : void {
		if (fromCell.block || toCell.block) 
			throw new Error('Cell must be not block.');

		toCell.swap(fromCell);
	}
	
	public swapWithCrush(fromCell:Cell, toCell:Cell) : CrushCells|null {
		//交换一次
		this.swap(fromCell, toCell);

		let crushCells: CrushCells = this.crushCells();

		if (!crushCells.length) //没有可以消的 //交换回来
			this.swap(fromCell, toCell);
		
		return crushCells;
	}

	public getCellByPostion(fromCell:Cell, position:layer.sharp.POSITION) : Cell {
		if (fromCell.block) 
			throw new Error('Cell must be not block.');

		let cell: Cell = null;
		switch (position) {
			case layer.sharp.POSITION.TOP:
				cell = fromCell.row <= 0 ? null : this.cell(fromCell.row - 1, fromCell.col);
				break;
			case layer.sharp.POSITION.RIGHT:
				cell = fromCell.col >= this.cols - 1 ? null : this.cell(fromCell.row, fromCell.col + 1);
				break;
			case layer.sharp.POSITION.BOTTOM:
				cell = fromCell.row >= this.rows - 1 ? null : this.cell(fromCell.row + 1, fromCell.col);
				break;
			case layer.sharp.POSITION.LEFT:
				cell = fromCell.col <= 0 ? null : this.cell(fromCell.row, fromCell.col - 1);
				break;
		}
		return cell instanceof Cell && !cell.block ? cell : null;
	}

	
}