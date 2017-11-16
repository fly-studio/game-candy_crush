class MeshBase extends layer.Grid {

	public cells:Cell[];
	public cellColors: any[];
	public blocks:number[];

	constructor(rows:number, cols:number) {
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

}