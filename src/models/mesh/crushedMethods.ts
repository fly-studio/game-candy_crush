interface CrushedMethod{
	cellIndex: number,
	position: POSITION,
	crushedCells?: CrushedCells,
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

	/**
	 * 添加可以消除的cell和方向
	 *
	 * @param cellIndex
	 * @param position
	 */
	public add(cellIndex: number, position: POSITION): boolean
	{
		let cell: Cell = this.mesh.getCellByPosition(cellIndex, position);
		if (!cell) return false;
		this.methods.push({
			cellIndex,
			position
		});
		return true;
	}

	public get length(): number {
		return this.methods.length;
	}

	/**
	 * 计算每一个可以消的方法能够消掉的cells
	 */
	public calcCrushedCells(): void {
		for (let method of this.methods) {
			let swapCell: Cell = this.mesh.getCellByPosition(method.cellIndex, method.position);

			const crushedCells: CrushedCells  = this.mesh.trySwapWithCrush(this.mesh.cell(method.cellIndex), swapCell); //计算可以消失的cells

			method.crushedCells = crushedCells
		}
	}
}