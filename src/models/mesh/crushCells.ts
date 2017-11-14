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

	/**
	 * 添加消除组
	 * 
	 * 注意：此处并不判断索引是否符合消除条件，需要在外面判断
	 */
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

	/**
	 * 每次添加一个消除组时
	 * 计算与之前组，是否包含十字消
	 */
	private calcLastCross() {
		let lastIndex: number = this._crushes.length - 1;
		let last: CrushGroup = this.eq(lastIndex);
		for (var i = 0; i < this._crushes.length - 1; i++) { //最后一个不取
			let group: CrushGroup = this.eq(i);
			if (group.row == group.row || group.col == group.col) continue; //都是行或列，则跳过
			let crosses = _.intersection(last.cellIndices, group.cellIndices);
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
	/**
	 * 取所有可以消除的索引
	 * 
	 * @param withCross [false] 是否包含十字消的索引
	 */
	public cellIndices(withCross:boolean = true) : number[] {
		let indices: number[] = [].concat(...this._crushes.map(group => group.cellIndices));
		if (withCross)
		{
			indices = indices.concat(...this._crosses.map( group => {
				let row: number = this.grid.row(group.cellIndex);
				let col: number = this.grid.col(group.cellIndex);
				return this.grid.crossIndices(row, col); // 十字全消
			}));
		}
		return _.uniq(indices).sort((a, b) => a - b); //去重 正序
	}

	/**
	 * 按列取需要消除的索引
	 * 
	 * 返回
	 * [
	 * 	[0, 9, 18], // 0 列
	 *  [x, x, x], // 1 列
	 *  ... // N 列
	 * ]
	 * 
	 * }
	 */
	public colCellIndices() : number[][] {
		let formated : number[][] = new Array<number[]>();
		let cells:number[] = this.cellIndices();
		for(let col of this.grid.colsEntries()) // 按 列，内容倒序
		{
			formated.push(
				_.intersection(this.grid.colIndices(col), cells).sort((a, b) => b - a)
			);
		}
		return formated;
	}
	/**
	 * 按行取需要消除的索引
	 * 
	 * 返回
	 * [
	 * 	[0, 1, 2], // 0 行
	 *  [x, x, x], // 1 行
	 *  ... // N 行
	 * ]
	 */
	public rowCellIndices() : number[][] {
		let formated : number[][] = new Array<number[]>();
		let cells:number[] = this.cellIndices();
		for(let row of this.grid.rowsEntries()) // 按 行 内容正序
		{
			formated.push(
				_.intersection(this.grid.rowIndices(row), cells).sort((a, b) => a - b)
			);
		}
		return formated;
	}

	/**
	 * 该索引是否在消除组列表中
	 * 注意：输入多个索引，只要一个匹配即返回 TRUE
	 * 
	 */
	public isCellIndicesCrushed(...args: number[]) : boolean
	{
		return _.intersection(this.cellIndices(false), args).length > 0;
	}

	/**
	 * 所有消除组
	 */
	public get crushes(): CrushGroup[] {
		return this._crushes;
	}

	/**
	 * 所有十字消除组
	 */
	public get crosses(): CrushCross[] {
		return this._crosses;
	}

	/**
	 * 是否有消除
	 */
	public get hasCrushes() : boolean {
		return this._crushes.length > 0;
	}

	/**
	 * 是否有十字消
	 */
	public get hasCrosses() : boolean {
		return this.crosses.length > 0;
	}

	/**
	 * 取第几个消除组
	 */
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
	public get length() : number {
		return this.cellIndices().length;
	}
}