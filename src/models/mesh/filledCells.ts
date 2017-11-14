interface FilledGroup {
	creating: boolean;
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

	public add(toIndex: number, delta: number, creating: boolean = false)
	{
		let group: FilledGroup = {
			creating,
			toIndex,
			delta
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