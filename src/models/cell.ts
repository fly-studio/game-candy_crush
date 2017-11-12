class Cell {
	public mesh: Mesh;
	public row:number;
	public col:number;
	public colorIndex:number = -1;

	constructor(mesh: Mesh, row:number, col:number) {
		this.mesh = mesh;
		this.row = row;
		this.col = col;
	}

	public get color(): number | null {
		return this.colorIndex >= 0 && this.colorIndex < this.mesh.cellColors.length ? this.mesh.cellColors[this.colorIndex] : null;
	}

	public get index(): number {
		return this.mesh.index(this.row, this.col);
	}

	public get block():boolean {
		return this.mesh.blocks.includes(this.index);
	}
}