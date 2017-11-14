class MeshWrite extends MeshRead {
	//此类都是写入的函数

	public createCell(rowOrIndex: number, col?: number) : Cell {
		let index: number = rowOrIndex;
		if (!isNaN(col))
			index = this.index(rowOrIndex, col);
		return new Cell(this, index);
	}

	public createMesh() : void
	{
		this.cells = [];
		for(let row of this.rowsEntries()) {
			for(let col of this.colsEntries()) {
				let cell: Cell = this.createCell(row, col);
				this.cells.push(cell); //先加入
				cell.colorIndex = this.randomColorIndex(row, col);
			}
		}
	}

	public rebuildWithCrush(crushedCells: CrushedCells) : FilledCells {
		if (!crushedCells.hasCrushes)
			throw new Error('crushedCells has no crushes.');

		let colCells: number[][] = crushedCells.colCellIndices(); //Col DESC
		let filledCells: FilledCells = new FilledCells(this);

		colCells.forEach((crushedIndices, col) => {
			if (crushedIndices.length > 0) { // 需填充
				let list:any[] = [];
				let colIndices: number[] = _.difference(this.colIndices(col), this.blocks).sort((a, b) => b - a); //当前列(去block) desc
				let exists: number[] = _.difference(colIndices, crushedIndices).sort((a, b) => b - a); // 现在剩余的 desc
				//尾部对齐，将上面的替补到下面
				colIndices.forEach((index, i) => {
					if (i < exists.length) { //存在替补
						if (exists[i] !== index) { // 不一样，则需要补充
							let cell: Cell = this.cell(exists[i]);
							filledCells.add(exists[i], index); //添加到结果集
							cell.to(this.cell(index)); //将替补 移动到该位置
						} 
					} else { //不存在，则创建一个新的
						filledCells.add(-1, index);
						let cell: Cell = this.createCell(index);
						this.cells[index] = cell; //设置一个新的cell
						cell.colorIndex = this.randomColorIndex(-1);
					}
				});
			}
		});
		return filledCells;
	}

	public replace(fromCell:Cell, toCell:Cell) {

	}

	public swap(fromCell:Cell, toCell:Cell) : void {
		if (fromCell.block || toCell.block) 
			throw new Error('Cell must be not block.');

		toCell.swap(fromCell);
	}
	
	public swapWithCrush(fromCell:Cell, toCell:Cell) : CrushedCells|null {
		//交换一次
		this.swap(fromCell, toCell);

		let crushedCells: CrushedCells = this.crushedCells();

		if (!crushedCells.isCellIndicesCrushed(fromCell.index, toCell.index)) //没有可以消的 //交换回来
			this.swap(fromCell, toCell);
		
		return crushedCells;
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