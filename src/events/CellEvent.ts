class CellEvent extends egret.Event {

	static CELL_DRAG: string = 'CELL_DRAG';
	static CELL_SELECT: string = 'CELL_SELECT';

	public cell: Cell;
	public position: POSITION = -1;

}
