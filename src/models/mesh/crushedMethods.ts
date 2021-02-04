interface CrushedMethod{
	cellIndex: number,
	postion: POSITION
}

class CrushedMethods {
	public methods: CrushedMethod[];
	protected mesh: Mesh
	constructor(mesh: Mesh) {
		this.methods = new Array<CrushedMethod>();
		this.mesh = mesh;
	}

	/**
	 * 大部分不支持，还是算了
	 */
	[Symbol.iterator]() : IterableIterator<CrushedMethod> {
		return this.methods.values();
	}

	public add(cellIndex: number, postion: POSITION): boolean
	{
		let cell: Cell = this.mesh.getCellByPostion(cellIndex, postion);
		if (!cell) return false;
		this.methods.push({
			cellIndex,
			postion
		});
		return true;
	}

	public get length() : number {
		return this.methods.length;
	}
}