class MeshRead extends MeshBase {
	//此类都是读取的函数

	public color(rowOrIndex: number, col?: number) : number | null {
		return this.cell(rowOrIndex, col).color;
	}

	public block(rowOrIndex: number, col?: number) : boolean {
		return this.cell(rowOrIndex, col).block;
	}

	public at(index:number) : Cell|null {
		if (index >= this.cells.length || index < 0)
			throw new Error('Out of "cells" Array\'s bound');
		return this.cells[index];
	}

	public cell(rowOrIndex:number, col?:number): Cell {
		let index: number = col == null ? rowOrIndex : this.index(rowOrIndex, col);
		return this.at(index);
	}

	protected randomColorIndex(row:number, col:number) : number {
		if (this.block(row, col)) return -1; // 实心

		let colorIndex:number = -1;
		let colorCount:number = this.cellColors.length;
		let last2Row = row >= 2 ? this.cell(row - 2, col).colorIndex : -1; //纵列不能3个相同
		let last2Col = col >= 2 ? this.cell(row, col - 2).colorIndex : -1; //横列不能3个相同
		do {
			colorIndex = ~~(Math.random() * colorCount);
		} while(colorIndex == last2Row || colorIndex == last2Col);

		return colorIndex;
	}

	public crushCells() : CrushCells {
		let crushs : CrushCells = new CrushCells(this);
		let cells: Cell[] = [];

		let dump = function(){
			if (cells.length >= 3) //必须3连
				crushs.addCells(cells);
			cells.splice(0); // clear
		};

		let compare = function(cell: Cell) {
			if (cells.length <= 0) {
				cells.push(cell); //加入
			} else if (cells[cells.length - 1].sameColor(cell)) { //和前一个相同颜色
				cells.push(cell); //加入
			} else if (!cells[cells.length - 1].sameColor(cell)) { //不同颜色
				dump();
				cells.push(cell); //Dump之后加入
			}
		};
		// 横
		for(let row of this.rowsEntries()) {
			for(let col of this.colsEntries()) { 
				let cell:Cell = this.cell(row, col);
				compare(cell);
				if (col == this.cols - 1) { // 到列尾
					dump();
				}
			}
		}
		cells.splice(0); // clear
		//列
		for(let col of this.colsEntries()) {
			for(let row of this.rowsEntries()) {
				let cell:Cell = this.cell(row, col);
				compare(cell);
				if (row == this.rows - 1) { // 到行尾
					dump();
				}
			}
		}
		return crushs;
	}
}