class Mesh extends MeshBase {

	/**
	 * 随机生成某cell的颜色
	 * 会判断上下左右是否有4个相同项，避免在开局的时候就有3个连续项
	 *
	 * @param {number} rowOrIndex: 如果为-1, 则表示不需要判断上下左右出现3个相同颜色的情况。在补充被消掉cell时下传入-1
	 * @return {number}: -1 表示是障碍物, 其它表示cell的颜色
	 */
	protected randomColorIndex(rowOrIndex: number, col?: number): number {
		const random = (): number => {
			let colorCount:number = this.cellColors.length;
			return ~~(Math.random() * colorCount);
		};
		// 直接出结果
		if (rowOrIndex < 0)
			return random();

		let row: number = rowOrIndex;
		if (col == null) {
			row = this.row(rowOrIndex);
			col = this.col(rowOrIndex);
		}
		if (this.block(row, col)) return -1; // 障碍物

		let colorIndex:number = -1;
		let last2Row = row >= 2 ? this.cell(row - 2, col).colorIndex : -1; // 纵列不能3个相同
		let last2Col = col >= 2 ? this.cell(row, col - 2).colorIndex : -1; // 横列不能3个相同
		do {
			colorIndex = random();
		} while(colorIndex == last2Row || colorIndex == last2Col);

		return colorIndex;
	}

	public makeSpecialCells() {

		while1:
		while (this.specialCells.length < this.maxSpecialCellCount) {
			let i = randNumber(0, this.size - 1);

			let cell = this.cell(i);

			if (cell.block)
				continue;

			for (let _cell of this.specialCells) {
				if (cell.row == _cell.row || cell.col == _cell.col) {
					continue while1;
				}
			}

			cell.action = cellActionRandom()
			this._specialCells.push(cell);
		}
	}

	/**
	 * 移除特殊cells
	 *
	 * @param cells
	 */
	public removeSpecialCells(cells: number[]) {
		if (!cells)
			return;
		for (let i = this.specialCells.length - 1; i >= 0; i--) {
			let cell = this.specialCells[i];
			if (cells.indexOf(cell.index) != -1) {
				this.specialCells.splice(i, 1);
			}
		}
	}

	/**
	 * 在手指滑动消除时，传入起始cell和手指滑动方向，得出期待swap的cell，如果是障碍物，则返回null
	 *
	 * @param fromIndex 起始cell的index
	 * @param position 手指滑动方向
	 */
	public getCellByPosition(fromIndex: number, position: POSITION) : Cell {
		if (this.block(fromIndex))
			throw new Error('Cell must be not block.');

		let cell: Cell = null;
		let row: number = this.row(fromIndex);
		let col: number = this.col(fromIndex);
		switch (position) {
			case POSITION.TOP:
				cell = row <= 0 ? null : this.cell(row - 1, col);
				break;
			case POSITION.RIGHT:
				cell = col >= this.cols - 1 ? null : this.cell(row, col + 1);
				break;
			case POSITION.BOTTOM:
				cell = row >= this.rows - 1 ? null : this.cell(row + 1, col);
				break;
			case POSITION.LEFT:
				cell = col <= 0 ? null : this.cell(row, col - 1);
				break;
		}
		return cell instanceof Cell && !cell.block ? cell : null;
	}

	/**
	 * 获取某一块所有可以消除的方法
	 * （核心方法）
	 *
	 * @param row
	 *            格子的x坐标
	 * @param col
	 *            格子的y坐标
	 * @return
	 */
	public crushedMethods(row: number, col: number): CrushedMethods {
		let results: CrushedMethods = new CrushedMethods(this) ;

		if (this.block(row, col)) return results;

		let lx1: boolean = row - 1 > -1; // 不是第1行
		let lx2: boolean = row - 2 > -1; // 不是第2行
		let lx3: boolean = row - 3 > -1; // 不是第3行
		let bx1: boolean = row + 1 < this.rows; // 不是倒数1行
		let bx2: boolean = row + 2 < this.rows; // 不是倒数2行
		let bx3: boolean = row + 3 < this.rows; // 不是倒数3行
		let ly1: boolean = col - 1 > -1; // 不是第1列
		let ly2: boolean = col - 2 > -1; // 不是第2列
		let ly3: boolean = col - 3 > -1; // 不是第2列
		let by1: boolean = col + 1 < this.cols; // 不是倒数1列
		let by2: boolean = col + 2 < this.cols; // 不是倒数2列
		let by3: boolean = col + 3 < this.cols; // 不是倒数3列

		let colorIndex: number = this.colorIndex(row, col);
		if (bx1) { // 除了尾行
			/**
			 * ♥ ← colorIndex
			 * ♡
			 */
			if (this.colorIndex(row + 1, col) == colorIndex) {
				if (bx3) { // 往下至少2行
					/**
					 * ♥ ← colorIndex
					 * ♡
					 * ♤
					 * ♡ ← 上下交换
					 */
					if (this.colorIndex(row + 3, col) == colorIndex) {
						results.add(this.index(row + 3, col), POSITION.UP);
					}
				}
				if (bx2) { // 往下至少1行
					if (by1) { //右边至少1列
						/**
						 * ♥   ← colorIndex
						 * ♡
						 * ♤ ♡ ← 左右交换
						 */
						if (this.colorIndex(row + 2, col + 1) == colorIndex) {
							results.add(this.index(row + 2, col + 1), POSITION.BACKWARD);
						}
					}
					if (ly1) { //左边至少1列
						/**
						 *   ♥ ← colorIndex
						 *   ♡
						 * ♡ ♤
						 * ↑
						 * 左右交换
						 */
						if (this.colorIndex(row + 2, col - 1) == colorIndex) {
							results.add(this.index(row + 2, col - 1), POSITION.FORWARD);
						}
					}
				}
				if (lx2) { // 上面至少2行
					/**
					 * ♡ ← 上下交换
					 * ♤
					 * ♥ ← colorIndex
					 * ♡
					 */
					if (this.colorIndex(row - 2, col) == colorIndex) {
						results.add(this.index(row - 2, col), POSITION.DOWN);
					}
				}
				if (lx1) { // 上面至少1行
					if (ly1) { // 左边至少1列
						/**
						 * 左右交换
						 * ↓
						 * ♡ ♤
						 *   ♥ ← colorIndex
						 *   ♡
						 */
						if (this.colorIndex(row - 1, col - 1) == colorIndex) {
							results.add(this.index(row - 1, col - 1), POSITION.FORWARD);
						}
					}
					if (by1) { // 右边至少1列
						/**
						 * ♤ ♡ ← 左右交换
						 * ♥ ← colorIndex
						 * ♡
						 */
						if (this.colorIndex(row - 1, col + 1) == colorIndex) {
							results.add(this.index(row - 1, col + 1), POSITION.BACKWARD);
						}
					}
				}
			}
			if (ly1 && by1) { //除了首尾列
				/**
				 *   ♥    ← colorIndex
				 * ♡ ♤ ♡
				 *   ↑
				 * 上下交换
				 */
				if (this.colorIndex(row + 1, col - 1) == colorIndex && this.colorIndex(row + 1, col + 1) == colorIndex) {
					results.add(this.index(row, col), POSITION.DOWN);
				}
			}
		}
		if (lx1) { // 除了 首行
			/**
			 * ♡
			 * ♥ ← colorIndex
			 */
			if (this.colorIndex(row - 1, col) == colorIndex) {
				if (lx3) { // 上面至少3行
					/**
					 * ♡ ← 上下交换
					 * ♤
					 * ♡
					 * ♥ ← colorIndex
					 */
					if (this.colorIndex(row - 3, col) == colorIndex) {
						results.add(this.index(row - 3, col), POSITION.DOWN);
					}
				}
				if (lx2) { // 上面至少2行
					/**
					 * ♤ ♡ ← 左右交换
					 * ♡
					 * ♥   ← colorIndex
					 */
					if (by1) { // 右边至少有1列
						if (this.colorIndex(row - 2, col + 1) == colorIndex) {
							results.add(this.index(row - 2, col + 1), POSITION.BACKWARD);
						}
					}
					/**
					 * ♡ ♤ ← 左右交换
					 *   ♡
					 *   ♥ ← colorIndex
					 */
					if (ly1) { // 左边至少有1列
						if (this.colorIndex(row - 2, col - 1) == colorIndex) {
							results.add(this.index(row - 2, col - 1), POSITION.FORWARD);
						}
					}
				}

				if (bx2) { // 下面至少2行
					/**
					 * ♡
					 * ♥ ← colorIndex
					 * ♤
					 * ♡ ← 上下交换
					 */
					if (this.colorIndex(row + 2, col) == colorIndex) {
						results.add(this.index(row + 2, col), POSITION.UP);
					}
				}
				if (bx1) { // 下面至少1行
					if (ly1) { // 左边至少1列
						/**
						 *   ♡
						 *   ♥ ← colorIndex
						 * ♡ ♤ ← 左右交换
						 */
						if (this.colorIndex(row + 1, col - 1) == colorIndex) {
							results.add(this.index(row + 1, col - 1), POSITION.FORWARD);
						}
					}
					if (by1) { //右边至少1列
						/**
						 *  ♡
						 *  ♥   ← colorIndex
						 *  ♤ ♡ ← 左右交换
						 */
						if (this.colorIndex(row + 1, col + 1) == colorIndex) {
							results.add(this.index(row + 1, col + 1), POSITION.BACKWARD);
						}
					}
				}
			}
			if (ly1 && by1) { // 除了首尾列
				/**
				 * 上下交换
				 *   ↓
				 * ♡ ♤ ♡
				 *   ♥    ← colorIndex
				 */
				if (this.colorIndex(row - 1, col - 1) == colorIndex && this.colorIndex(row - 1, col + 1) == colorIndex) {
					results.add(this.index(row, col), POSITION.UP);
				}
			}
		}
		if (by1) { //除了尾列
			/**
			 * ♥ ♡
			 * ↑
			 * colorIndex
			 */
			if (this.colorIndex(row, col + 1) == colorIndex) {
				if (by3) { // 右边至少3列
					/**
					 *     左右交换
					 *        ↓
					 * ♥ ♡ ♤ ♡
					 * ↑
					 * colorIndex
					 */
					if (this.colorIndex(row, col + 3) == colorIndex) {
						results.add(this.index(row, col + 3), POSITION.BACKWARD);
					}
				}
				if (by2) { // 右边至少2列
					if (lx1) { //上面至少1行
						/**
						 *      ♡ ← 上下交换
						 * ♥ ♡ ♤
						 * ↑
						 * colorIndex
						 */
						if (this.colorIndex(row - 1, col + 2) == colorIndex) {
							results.add(this.index(row - 1, col + 2), POSITION.DOWN);
						}
					}
					if (bx1) { // 下面至少1行
						/**
						 * colorIndex
						 * ↓
						 * ♥ ♡ ♤
						 *     ♡ ← 上下交换
						 */
						if (this.colorIndex(row + 1, col + 2) == colorIndex) {
							results.add(this.index(row + 1, col + 2), POSITION.UP);
						}
					}
				}

				if (ly2) { // 左边至少2列
					/**
					 *     colorIndex
					 *      ↓
					 * ♡ ♤ ♥ ♡
					 * ↑
					 * 左右交换
					 */
					if (this.colorIndex(row, col - 2) == colorIndex) {
						results.add(this.index(row, col - 2), POSITION.FORWARD);
					}
				}
				if (ly1) { // 除了首列
					if (bx1) { // 下面至少1行
						/**
						 *   colorIndex
						 *   ↓
						 * ♤ ♥ ♡
						 * ♡ ← 上下交换
						 */
						if (this.colorIndex(row + 1, col - 1) == colorIndex) {
							results.add(this.index(row + 1, col - 1), POSITION.UP);
						}
					}
					if (lx1) { //上面至少1行
						/**
						 * ♡ ← 上下交换
						 * ♤ ♥ ♡
						 *   ↑
						 *   colorIndex
						 */
						if (this.colorIndex(row - 1, col - 1) == colorIndex) {
							results.add(this.index(row - 1, col - 1), POSITION.DOWN);
						}
					}

				}
			}
			if (lx1 && bx1) { //除了首尾行
				/**
				 * colorIndex
				 *  ↓
				 *  ↓ ♡
				 *  ♥ ♤ ← 左右交换
				 *    ♡
				 */
				if (this.colorIndex(row - 1, col + 1) == colorIndex && this.colorIndex(row + 1, col + 1) == colorIndex) {
					results.add(this.index(row, col), POSITION.FORWARD);
				}
			}
		}
		if (ly1) { // 除了首列
			/**
			 * ♡ ♥ ← colorIndex
			 */
			if (this.colorIndex(row, col - 1) == colorIndex) {
				if (ly3) { // 左边至少3行
					/**
					 * 左右交换
					 * ↓
					 * ♡ ♤ ♡ ♥ ← colorIndex
					 */
					if (this.colorIndex(row, col - 3) == colorIndex) {
						results.add(this.index(row, col - 3), POSITION.FORWARD);
					}
				}
				if (ly2) { // 左边至少2列
					if (lx1) { // 上面至少1行
						/**
						 * 上下交换
						 * ↓
						 * ♡
						 * ♤ ♡ ♥ ← colorIndex
						 */
						if (this.colorIndex(row - 1, col - 2) == colorIndex) {
							results.add(this.index(row - 1, col - 2), POSITION.DOWN);
						}
					}
					if (bx1) { // 下面至少1行
						/**
						 * ♤ ♡ ♥ ← colorIndex
						 * ♡
						 * ↑
						 * 上下交换
						 */
						if (this.colorIndex(row + 1, col - 2) == colorIndex) {
							results.add(this.index(row + 1, col - 2), POSITION.UP);
						}
					}
				}
				if (by2) { //右边至少2列
					/**
					 *   colorIndex
					 *   ↓
					 * ♡ ♥ ♤ ♡ ← 左右交换
					 */
					if (this.colorIndex(row, col + 2) == colorIndex) {
						results.add(this.index(row, col + 2), POSITION.BACKWARD);
					}
				}
				if (by1) { // 右边至少1列
					if (bx1) { //下面至少1行
						/**
						 *   colorIndex
						 *   ↓
						 * ♡ ♥ ♤
						 *     ♡ ← 上下交换
						 */
						if (this.colorIndex(row + 1, col + 1) == colorIndex) {
							results.add(this.index(row + 1, col + 1), POSITION.UP);
						}
					}
					if (lx1) { // 上面至少1行
						/**
						 *     ♡ ← 上下交换
						 * ♡ ♥ ♤
						 *   ↑
						 * colorIndex
						 */
						if (this.colorIndex(row - 1, col + 1) == colorIndex) {
							results.add(this.index(row - 1, col + 1), POSITION.DOWN);
						}
					}
				}
			}
			if (lx1 && bx1) { // 除了首尾行
				/**
				 * ♡
				 * ♤ ♥ ← colorIndex 左右交换
				 * ♡
				 */
				if (this.colorIndex(row - 1, col - 1) == colorIndex && this.colorIndex(row + 1, col - 1) == colorIndex) {
					results.add(this.index(row, col), POSITION.BACKWARD);
				}
			}
		}
		return results;
	}

	/**
	 * 地图是否无解
	 */
	public AllDead(): boolean {
		for (let index of this.indices(true)){
			let row: number = this.row(index);
			let col: number = this.col(index);

			let methods: CrushedMethods = this.crushedMethods(row, col);
			if (methods.length > 0) // 一个格子不是死格子, 就可以解
				return false;
		}
		return true;
	}

	/**
	 * 创建cell对象
	 * @param rowOrIndex
	 * @param col
	 */
	public createCell(rowOrIndex: number, col?: number) : Cell {
		let index: number = rowOrIndex;
		if (!isNaN(col))
			index = this.index(rowOrIndex, col);
		let cell: Cell = new Cell(this, index);
		cell.colorIndex = -1;
		return cell;
	}

	/**
	 * 创建棋盘
	 */
	public createMesh() : void
	{
		do {
			this.cells = [];

			for(let row of this.rowsEntries()) {
				for(let col of this.colsEntries()) {
					let cell: Cell = this.createCell(row, col);
					this.cells.push(cell); //先加入
					cell.colorIndex = this.randomColorIndex(row, col);
				}
			}
		} while (this.AllDead());

		this.makeSpecialCells();
	}

	/**
	 * 从上往下掉补充被消掉的cell
	 * @param fromCell
	 * @param toIndex
	 */
	public replace(fromCell: Cell, toIndex: number) {
		if (fromCell.block)
			throw new Error('Cell must be not a block.');

		fromCell.to(toIndex);
	}

	/**
	 * 交换两个cell
	 * @param fromCell
	 * @param toCell
	 */
	public swap(fromCell: Cell, toCell: Cell) : void {
		if (fromCell.block || toCell.block)
			throw new Error('Cell must be not a block.');

		toCell.swap(fromCell);
	}

	/****************************************/
	/* 下面都是消除函数 */
	/****************************************/

	/**
	 * 简单计算可消除的cells
	 * 此方法是遍历整个棋盘来判断横/列是否有超过3个相同颜色。
	 * 对于swap的，可以减少判断范围，但是因为棋盘没多少格子，所以并没有为此优化
	 * 消除后，补充cell后，也可以缩小判断范围
	 */
	public crushedCells() : CrushedCells {
		let crushes : CrushedCells = new CrushedCells(this);
		let cells: Cell[] = [];

		let dump = function() : void {
			if (cells.length >= 3) //必须3连
				crushes.addCells(cells);
			cells.splice(0); // clear
		};

		let compare = function(cell: Cell) : void {
			if (cell.block) { //障碍物
				dump();
			} else if (cells.length <= 0) {
				cells.push(cell); //加入
			} else if (cells[cells.length - 1].sameColor(cell)) { //和前一个相同颜色
				cells.push(cell); //加入
			} else if (!cells[cells.length - 1].sameColor(cell)) { //不同颜色
				dump();
				cells.push(cell); //Dump之后加入
			}
		};
		//横
		for(let row of this.rowsEntries()) {
			for(let col of this.colsEntries()) {
				let cell:Cell = this.cell(row, col);
				compare(cell);
				if (col == this.cols - 1) { // 到列尾
					dump();
				}
			}
		}
		cells.splice(0); // clear
		//列
		for(let col of this.colsEntries()) {
			for(let row of this.rowsEntries()) {
				let cell:Cell = this.cell(row, col);
				compare(cell);
				if (row == this.rows - 1) { // 到行尾
					dump();
				}
			}
		}
		return crushes;
	}

	/**
	 * 生成需要补充的cells
	 * @param crushedCells 已经被消除的cells
	 */
	public rebuildWithCrush(crushedCells: CrushedCells) : FilledCells {
		if (!crushedCells.hasCrushes)
			throw new Error('crushedCells has no crushes.');

		let colCells: number[][] = crushedCells.colCellIndices(); //按照列倒序 Col DESC
		let filledCells: FilledCells = new FilledCells(this);

		colCells.forEach((crushedIndices, col) => {
			if (crushedIndices.length > 0) { // 需填充
				let list:any[] = [];
				let colIndices: number[] = _.difference(this.colIndices(col), this.blocks).sort((a, b) => b - a); //当前列(去block) desc
				let exists: number[] = _.difference(colIndices, crushedIndices).sort((a, b) => b - a); // 现在剩余的 desc
				//尾部对齐，将上面的替补到下面
				colIndices.forEach((index, i) => {
					if (i < exists.length) { //存在替补
						if (exists[i] !== index) { // 不一样，则需要补充
							let cell: Cell = this.cell(exists[i]);
							filledCells.add(index, this.row(index) - this.row(exists[i])); //添加到结果集
							this.replace(cell, index); //将替补 移动到该位置
						}
					} else { //不存在，则创建一个新的
						filledCells.add(index, crushedIndices.length, true); //新增的往上堆,所以新增的距离是相同的
						let cell: Cell = this.createCell(index);
						this.cells[index] = cell; //设置一个新的cell
						cell.colorIndex = this.randomColorIndex(-1);
					}
				});
			}
		});
		// 填充特殊cells
		this.makeSpecialCells();

		return filledCells;
	}

	/**
	 * 交换2项 并检查是否有可消除的
	 *
	 * @param fromCell
	 * @param toCell
	 * @param fakeSwap 需要作弊时, 传入true。不然是真交换了
	 */
	public swapWithCrush(fromCell: Cell, toCell: Cell, fakeSwap: boolean = false): CrushedCells|null {
		//尝试交换一次
		this.swap(fromCell, toCell);

		let crushedCells: CrushedCells = this.crushedCells();

		// 没有可以消的 交换回来
		if (fakeSwap || !crushedCells.isCellIndicesCrushed(fromCell.index, toCell.index))
			this.swap(fromCell, toCell);

		return crushedCells;
	}

	public trySwapWithCrush(fromCell: Cell, toCell: Cell): CrushedCells|null {
		return this.swapWithCrush(fromCell, toCell, true)
	}

	/**
	 * 查找消除的最优解方法
	 */
	public crushesTopMethod() : CrushedMethod | null {

		let top: {'method': CrushedMethod, 'crushedCellLength': number}[] = new Array();

		for (let index of this.indices(true)){
			let row: number = this.row(index);
			let col: number = this.col(index);

			let methods: CrushedMethods = this.crushedMethods(row, col);
			methods.calcCrushedCells();

			for(let method of methods.methods)
			{
				let crushedCells = method.crushedCells;
				if (crushedCells)
				{
					top.push({
						'crushedCellLength': crushedCells.cellIndices(true).length,
						'method': method,
					});
				}
			}
			// 检查可以消除的cells
		}

		// 按照crushedCellLength desc, cellIndex desc
		// 在得分相同的情况下，消底部的比消顶部的能让补充的更有机会得分
		top.sort((a, b) => {
			let r = b.crushedCellLength - a.crushedCellLength;
			if (r == 0) {
				return b.method.cellIndex - a.method.cellIndex;
			}
			return r;
		});

		//第一项就是最高选项
		return top[0] ? top[0].method: null;
	}

}