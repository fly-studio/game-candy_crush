class Cell {
	public mesh: Mesh;
	public index:number;
	public colorIndex:number = -1;

	constructor(mesh: Mesh, index:number) {
		this.mesh = mesh;
		this.index = index;
	}

	public get color(): number | null {
		return this.colorIndex >= 0 && this.colorIndex < this.mesh.cellColors.length ? this.mesh.cellColors[this.colorIndex] : null;
	}

	public get row(): number {
		return this.mesh.row(this.index);
	}

	public get col(): number {
		return this.mesh.col(this.index);
	}

	public get block():boolean {
		return this.mesh.blocks.includes(this.index);
	}

	public sameColor(cell: Cell) : boolean {
		return !this.block && !cell.block ? this.colorIndex == cell.colorIndex : false;
	}

	public swap(toCell: Cell) : void {
		this.mesh.cells[toCell.index] = this;
		this.mesh.cells[this.index] = toCell;

		let index: number = this.index;
		this.index = toCell.index;
		toCell.index = index;
	}

	public to(toCell: Cell) : number {
		this.mesh.cells[toCell.index] = this;
		this.mesh.cells[this.index] = null;

		let index: number = this.index;
		this.index = toCell.index;
		return index;
	}

}