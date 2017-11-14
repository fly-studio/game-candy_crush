interface FilledGroup {
	fromIndex: number;
	toIndex: number;
	delta: number;
}

class FilledCells {
	private mesh: MeshBase;
	private _fills: FilledGroup[];

	constructor(mesh: MeshBase) 
	{
		this.mesh = mesh;
		this._fills = [];
	}

	public add(fromIndex: number, toIndex: number)
	{
		let group: FilledGroup = {
			fromIndex: fromIndex,
			toIndex: toIndex,
			delta: Math.abs(this.mesh.row(toIndex) - this.mesh.row(fromIndex)) + Math.abs(this.mesh.col(toIndex) - this.mesh.col(fromIndex))
		};
		this._fills.push(group);
	}

	public get hasFills() : boolean {
		return this._fills.length > 0;
	}

	public get fills (): FilledGroup[] {
		return this._fills;
	}
}