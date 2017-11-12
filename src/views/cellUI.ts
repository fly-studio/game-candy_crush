class CellUI extends egret.Sprite {
	public cell:Cell;
	public _selected:boolean;
	private selectedSharp: egret.Shape;
	private touchPoint: egret.Point;

	constructor(cell: Cell) {
		super();
		this.cell = cell;
		this.touchPoint = new egret.Point();

		this.touchEnabled = true;
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
	}

	public set selected(value: boolean) {
		if (this.cell.block) return;
		this.selectedSharp.visible = value;
	}

	public render() : void {
		if (this.width <= 0 || this.height <= 0)
			throw new Error('Set width/height first.');
		if (this.cell.block)
			return;

		this.removeChildren();

		this.graphics.clear();
		this.graphics.beginFill(this.cell.color);
		this.graphics.drawRoundRect(0, 0, this.width, this.height, 5);
		this.graphics.endFill();

		this.selectedSharp = new egret.Shape;
		this.selectedSharp.graphics.lineStyle(4, 0x00ffff);
		this.selectedSharp.graphics.drawRoundRect(0, 0, this.width, this.height, 5);
		this.selectedSharp.graphics.endFill();
		this.selectedSharp.visible = false;
		this.addChild(this.selectedSharp);
	}

	private onAddedToStage(event: egret.Event) {
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd, this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
	}

	public onTouchBegin(event: egret.TouchEvent) {
		console.log('touch-begin:', this.cell.index);

		this.touchPoint.x = event.stageX;
		this.touchPoint.y = event.stageY;
	}

	public onTouchMove(event: egret.TouchEvent) {

	}

	public onTouchEnd(event: egret.TouchEvent) {
		console.log('touch-drag:', this.cell.index);

		let position:layer.math.POSITION = layer.math.position(this.touchPoint, new egret.Point(event.stageX, event.stageY));
		console.log('direction:', position);
	}

	public onTouchTap(event: egret.TouchEvent) {
		this.selected = true;
		console.log('touch-tap:', this.cell.index);
	}
}