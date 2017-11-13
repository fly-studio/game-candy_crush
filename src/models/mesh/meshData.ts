class MeshData extends layer.Grid {
	public cells:Cell[];
	
	public cellColors: number[];
	public blocks:number[];

	constructor(rows:number, cols:number) {
		super(rows, cols);
		this.blocks = [];
		this.cellColors = [];
		this.cells = [];
	}

	public color(row: number, col: number) : number | null {
		return this.cell(row, col).color;
	}

	public block(row: number, col: number) : boolean {
		return this.cell(row, col).block;
	}

	public at(index:number) : Cell|null {
		if (index >= this.cells.length || index < 0)
			throw new Error('Out of "cells" Array\'s bound');
		return this.cells[index];
	}

	public cell(row:number, col:number): Cell {
		let index: number = this.index(row, col);
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
		for(let row:number = 0; row < this.rows; row++) {
			for(let col:number = 0; col < this.cols; col++) { 
				let cell:Cell = this.cell(row, col);
				compare(cell);
				if (col == this.cols - 1) { // 到列尾
					dump();
				}
			}
		}
		cells.splice(0); // clear
		//列
		for(let col:number = 0; col < this.cols; col++) {
			for(let row:number = 0; row < this.rows; row++) {
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