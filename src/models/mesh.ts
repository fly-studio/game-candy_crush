class Mesh {
	private cells:Cell[];
	public rows:number;
	public cols:number;
	public cellColors: number[];
	public blocks:number[];

	constructor(rows:number, cols:number) {
		this.rows = rows;
		this.cols = cols;
		this.blocks = [];
		this.cellColors = [];
		this.cells = [];
	}

	public create() : void
	{
		this.cells = [];
		for(let row:number = 0; row < this.rows; row++) {
			for(let col:number = 0; col < this.cols; col++) {
				let cell:Cell = new Cell(this, row, col);
				this.cells.push(cell);
				cell.colorIndex = this.randomColorIndex(row, col);
			}
		}
	}

	public index(row: number, col: number) : number {
		return row * this.cols + col;
	}

	public color(row: number, col: number) : number | null {
		return this.cell(row, col).color;
	}

	public block(row: number, col: number) : boolean {
		return this.cell(row, col).block;
	}

	public cell(row:number, col:number): Cell {
		let index: number = this.index(row, col);
		if (index >= this.cells.length || index < 0)
			throw new Error('Out of "cells" Array\'s bound');
			
		return this.cells[index];
	}

	public randomColorIndex(row:number, col:number) : number {
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
}