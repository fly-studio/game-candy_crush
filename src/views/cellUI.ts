namespace ui {
	export class CellUI extends layer.ui.Sprite {
		public cell:Cell;
		public _selected:boolean;
		private selectedSharp: egret.Shape;
		private touchPoint: sharp.Point;

		constructor(cell: Cell) {
			super();
			this.cell = cell;
			this.touchPoint = new sharp.Point();
		}

		public set selected(value: boolean) {
			if (this.cell.block) return;
			this.selectedSharp.visible = value;
		}

		public set text(value: string) {
			let text: egret.TextField = this.getChildByName('index') as egret.TextField;
			text.text = value;
			if (value == 'DEBUG')
				text.text = DEBUG ? this.cell.index.toString() + "\n" + this.cell.row.toString() + "/" + this.cell.col.toString() : '';
		}

		private render() : void {
			if (this.width <= 0 || this.height <= 0)
				throw new Error('CellUI Set width/height first.');
			if (this.cell.block)
				return;

			this.removeChildren();
			this.graphics.clear();

			if (!isNaN(this.cell.color)) { //色块
				this.graphics.beginFill(this.cell.color);
				this.graphics.drawRoundRect(0, 0, this.width, this.height, 5);
				this.graphics.endFill();
			} else {
				let bitmap:layer.ui.BitmapUI = new layer.ui.BitmapUI(this.cell.color);
				bitmap.x = 8;
				bitmap.y = 8;
				bitmap.width = this.width - 16;
				bitmap.height = this.height - 16;
				this.addChild(bitmap);
			}

			let text:egret.TextField = new egret.TextField;
			text.y = 10;
			text.name = 'index';
			text.textColor = 0x0;
			text.width = this.width;
			text.wordWrap = true;
			text.textAlign = egret.HorizontalAlign.CENTER;
			this.addChild(text);
			this.text = 'DEBUG';

			this.selectedSharp = new egret.Shape;
			this.selectedSharp.graphics.lineStyle(4, 0x00ffff);
			this.selectedSharp.graphics.drawRoundRect(0, 0, this.width, this.height, 5);
			this.selectedSharp.graphics.endFill();
			this.selectedSharp.visible = false;
			this.addChild(this.selectedSharp);
		}

		public onAddedToStage(event: egret.Event) : void {

			this.render();
		}

		public onRemovedFromStage(event: egret.Event): void {
			this.removeAllEventListeners();
			this.cell = null; //避免内存泄露
		}

		public removeAllEventListeners(): void {

		}

		public moveTo(duration:number, ...args: egret.Point[]) : Promise<any> {
			//let dfd : DeferredPromise = new DeferredPromise;
			return new Promise<any>((resolve, reject) => {
				let tween: egret.Tween = egret.Tween.get(this);
				args.forEach(p => tween = tween.to({x: p.x, y: p.y}, duration));
				tween.call(() => {
					this.text = 'DEBUG';
					resolve();
				}, this)
			});
		}

		public fadeOut(duration: number) : Promise<any> {
			this.removeChildren();
			this.graphics.clear();
			let factory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(RES.getRes('disappear_json'), RES.getRes('disappear_png'));
			let data: egret.MovieClipData = factory.generateMovieClipData('crushing');
			// duration / frameCount = 1000 / frameRate == 每帧时间
			data.frameRate = data.frames.length * 1000 / duration; // 重新计算帧率
			let mc: egret.MovieClip = new egret.MovieClip(data);
			mc.x = this.width / 2;
			mc.y = this.height / 2;
			mc.width = this.width;
			mc.height = this.height;
			this.addChild(mc);
			return new Promise<any>(resolve => {
				mc.once(egret.Event.COMPLETE, () => {
					resolve();
				}, this);
				mc.gotoAndPlay('disappear', 1);
			});
		}

		public onTouchBegin(event: egret.TouchEvent) {
			if (!this.cell || this.cell.block) return;
			//console.log('touch-begin:', this.cell.index);

			this.touchPoint.x = event.stageX;
			this.touchPoint.y = event.stageY;
		}

		public onTouchEnd(event: egret.TouchEvent) {
			if (!this.cell || this.cell.block) return;

			let position:sharp.POSITION = sharp.position(this.touchPoint, new sharp.Point(event.stageX, event.stageY));
			console.log('touch-drag:', this.cell.index, 'direction:', position);

			let cellEvent = new CellEvent(CellEvent.CELL_DRAG, true);
			cellEvent.cell = this.cell;
			cellEvent.position = position;
			this.parent.dispatchEvent(cellEvent);
		}

		public onTouchTap(event: egret.TouchEvent) {
			if (!this.cell || this.cell.block) return;

			console.log('touch-tap:', this.cell.index);

			let cellEvent = new CellEvent(CellEvent.CELL_SELECT, true);
			cellEvent.cell = this.cell;
			this.parent.dispatchEvent(cellEvent);
		}
	}
}
