class CellEvent extends egret.Event {

	static CELL_DRAG: string = 'CELL_DRAG';
	static CELL_TAP: string = 'CELL_TAP';
	static CELL_SELECT: string = 'CELL_SELECT';
	static CELL_UNSELECT: string = 'CELL_UNSELECT';
	static CELL_CHANGE: string = 'CELL_CHANGE';

	public cell: Cell;
	public position: POSITION = -1;

}
