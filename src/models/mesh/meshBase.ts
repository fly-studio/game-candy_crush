class MeshBase extends layer.Grid {

	public cells:Cell[];
	public cellColors: number[];
	public blocks:number[];

	constructor(rows:number, cols:number) {
		super(rows, cols);
		this.blocks = [];
		this.cellColors = [];
		this.cells = [];
	}
}