class MeshBase extends Grid {

	// 棋盘格子
	public cells: Cell[] = [];
	// 可使用的颜色，至少大于3个
	public cellColors: any[] = [];
	// 障碍物的 cellIndex[]
	public blocks: number[] = [];
	// 特殊功能的 cellIndex[]
	protected _specialCells: Cell[] = [];
	public maxSpecialCellCount: number = 3;

	constructor(rows: number, cols: number) {
		super(rows, cols);
		this.blocks = [];
		this.cellColors = [];
		this.cells = [];

	}

	public rowIndices(row: number, exceptBlocks: boolean = false): number[] {
		let indices:number[] = super.rowIndices(row);
		return exceptBlocks ? _.difference(indices, this.blocks) : indices;
	}

	public colIndices(col: number, exceptBlocks: boolean = false): number[] {
		let indices:number[] = super.colIndices(col);
		return exceptBlocks ? _.difference(indices, this.blocks) : indices;
	}


	public crossIndices(rowOrIndex: number, col?: number, exceptBlocks: boolean = false): number[] {
		let indices:number[] = super.crossIndices(rowOrIndex, col);
		return exceptBlocks ? _.difference(indices, this.blocks) : indices;
	}

	/**
	 * 所有索引
	 */
	public indices(exceptBlocks: boolean = false) : number[] {
		let indices:number[] = super.indices();
		return exceptBlocks ? _.difference(indices, this.blocks) : indices;
	}

	public get specialCells(): Cell[] {
		return this._specialCells;
	}

}