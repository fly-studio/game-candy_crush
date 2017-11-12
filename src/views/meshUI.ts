class meshUI extends egret.Sprite {
	public mesh: Mesh;
	public cellColPadding: number = 7.5;
	public cellRowPadding: number = 5;

	private gameSprite: egret.Sprite;

	constructor() {
		super();

		this.mesh = new Mesh(9, 9);
		this.mesh.cellColors = [
			0xff0000,
			0x00ff00,
			0x0000ff,
			0xff00ff,
			0x00ffff
		];
	}

	public start() {
		this.mesh.create();
		this.render();
	}

	public render() {
		if (this.width <=0 || this.height <= 0)
			throw new Error('Set width/height first');

		this.removeChildren();

		this.gameSprite = new egret.Sprite();

		let cellWidth:number = (this.width - this.cellColPadding * this.mesh.cols * 2) / this.mesh.cols;
		let cellHeight:number = (this.height - this.cellRowPadding * this.mesh.rows * 2) / this.mesh.rows;

		for(let row: number = 0; row < this.mesh.rows; ++row) {
			for(let col:number = 0; col < this.mesh.cols; col++) {
				let cell: CellUI = new CellUI(this.mesh.cell(row, col));
				cell.width = cellWidth;
				cell.height = cellHeight;
				cell.x = this.cellColPadding * col * 2 + cellWidth * col + this.cellColPadding;
				cell.y = this.cellRowPadding * row * 2 + cellHeight * row + this.cellRowPadding;
				this.gameSprite.addChild(cell);

				cell.render();
			}
		}

		this.addChild(this.gameSprite);

	}
}