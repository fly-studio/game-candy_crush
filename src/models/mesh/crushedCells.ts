interface CrushedGroup {
	row: number;
	col: number;
	cellIndices: number[];
};

interface CrushedCross {
	cellIndex: number;
	group1: CrushedGroup;
	group2: CrushedGroup;
};

class CrushedCells {
	private _crushes: CrushedGroup[];
	private _crosses: CrushedCross[];
	public mesh: MeshBase;

	constructor(mesh: MeshBase) {
		this._crushes = new Array<CrushedGroup>();
		this._crosses = new Array<CrushedCross>();
		this.mesh = mesh;
	}

	/**
	 * 添加消除组
	 * 
	 * 注意：此处并不判断索引是否符合消除条件，需要在外面判断
	 */
	public addCells(cells: Cell[]) {
		//cells中有block
		if (cells.filter(cell => cell.block).length > 0)
			throw new Error('some cells are block.');
		//数量小于3		
		if (cells.length < 3)
			throw new Error('cells length must > 3.');
		let crush:CrushedGroup = {
			row: -1,
			col: -1,
			cellIndices: cells.map(v => v.index).sort((a, b) => a - b) //index asc
		};

		if (cells[0].row == cells[1].row) {
			crush.row = cells[0].row;
		} else if (cells[0].col == cells[1].col) {
			crush.col = cells[0].col;
		} else {
			//这么巧，不同列、行
			throw new Error('cells are not the same row or col.')
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
		let last: CrushedGroup = this.eq(lastIndex);
		for (var i = 0; i < this._crushes.length - 1; i++) { //最后一个不取
			let group: CrushedGroup = this.eq(i);
			if (group.row == group.row || group.col == group.col) continue; //都是行或列，则跳过
			let crosses = _.intersection(last.cellIndices, group.cellIndices);
			if (crosses.length) {
				let cross: CrushedCross = {
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
				let row: number = this.mesh.row(group.cellIndex);
				let col: number = this.mesh.col(group.cellIndex);
				return this.mesh.crossIndices(row, col); // 十字全消
			}));
		}
		return _.difference(
			_.uniq(indices), //去重
			this.mesh.blocks //去block项目
		).sort((a, b) => a - b); // 正序
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
		for(let col of this.mesh.colsEntries()) // 按 列，内容倒序
		{
			formated.push(
				_.difference(
					_.intersection(this.mesh.colIndices(col), cells), //取当前列
					this.mesh.blocks // 去block
				).sort((a, b) => b - a) // 倒序
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
		for(let row of this.mesh.rowsEntries()) // 按 行 内容正序
		{
			formated.push(
				_.difference(
					_.intersection(this.mesh.rowIndices(row), cells), //取当前行
					this.mesh.blocks // 去block					
				).sort((a, b) => a - b) // 正序
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
	public get crushes(): CrushedGroup[] {
		return this._crushes;
	}

	/**
	 * 所有十字消除组
	 */
	public get crosses(): CrushedCross[] {
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
	public eq(index: number): CrushedGroup {
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