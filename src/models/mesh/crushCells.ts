interface CrushGroup {
	row: number;
	col: number;
	cellIndices: number[];
};

interface CrushCross {
	cellIndex: number;
	group1: CrushGroup;
	group2: CrushGroup;
};

class CrushCells {
	private _crushes: CrushGroup[];
	private _crosses: CrushCross[];
	public grid: layer.Grid;

	constructor(grid: layer.Grid) {
		this._crushes = new Array<CrushGroup>();
		this._crosses = new Array<CrushCross>();
		this.grid = grid;
	}

	public addCells(cells: Cell[]) {
		if (cells.length < 3)
			throw new Error('cells length must > 3');
		let crush:CrushGroup = {
			row: -1,
			col: -1,
			cellIndices: cells.map(v => v.index).sort((a, b) => a - b) //index asc
		};

		if (cells[0].row == cells[1].row) {
			crush.row = cells[0].row;
		} else if (cells[0].col == cells[1].col) {
			crush.col = cells[0].col;
		}
		this._crushes.push(crush);

		this.calcLastCross(); //检查最后一个的交集
	}

	private calcLastCross() {
		let lastIndex: number = this.length - 1;
		let last: CrushGroup = this.eq(lastIndex);
		for (var i = 0; i < this.length - 1; i++) { //最后一个不取
			let group: CrushGroup = this.eq(i);
			if (group.row == group.row || group.col == group.col) continue; //都是行或列，则跳过
			let crosses = layer.array.intersect(last.cellIndices, group.cellIndices);
			if (crosses.length) {
				let cross: CrushCross = {
					cellIndex: crosses[0],
					group1: last,
					group2: group
				};
				this._crosses.push(cross);
			}
		}
	}

	public get cellWithoutCrossIndices() : number[] {
		let cells:number[] = [].concat(...this.crushes.map(group => group.cellIndices));
		return layer.array.unique(cells);
	}

	public get cellIndices() : number[] {
		let cells:number[] = this.cellWithoutCrossIndices.concat(...this._crosses.map( group => {
			let row = this.grid.row(group.cellIndex);
			let col = this.grid.col(group.cellIndex);
			return this.grid.crossIndices(row, col);
		}));
		return layer.array.unique(cells);
	}

	public get formatedCellIndices() : number[][] {
		let formated : number[][] = new Array<number[]>();
		let cells:number[] = this.cellIndices;
		for(let row of this.grid.rowsEntries())
		{
			formated.push(
				layer.array.intersect(this.grid.rowIndices(row), cells) //当行的交集
			);
		}
		return formated;
	}

	public get crushes(): CrushGroup[] {
		return this._crushes;
	}

	public get crosses(): CrushCross[] {
		return this._crosses;
	}

	public get hasCrushes() : boolean {
		return this.length > 0;
	}

	public get hasCrosses() : boolean {
		return this.crosses.length > 0;
	}

	public eq(index: number): CrushGroup {
		return this._crushes[index];
	}

	public get rows() {
		return this._crushes.filter(group => group.row > -1);
	}

	public get cols() {
		return this._crushes.filter(group => group.row > -1);
	}

	/**
	 * 消掉的单元格数量(包括 Cross)
	 */
	public get cellsLength() : number {
		return this.cellIndices.length;
	}

	public get length() : number {
		return this._crushes.length;
	}
}