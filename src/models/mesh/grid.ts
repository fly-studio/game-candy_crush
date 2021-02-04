
class Grid {
    public rows: number = 0;
    public cols: number = 0;
    /**
     * 创建一个Grid
     *
     * @param rows 行总数
     * @param cols 列总数
     */
    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
    }
    /**
     * 长度
     */
    public get size(): number {
        return this.length;
    }
    /**
     * 长度
     */
    public get length(): number {
        return this.cols * this.rows;
    }
    /**
     * 根据 index 返回 row
     * @param index
     */
    public row(index: number): number {
        return ~~(index / this.cols);
    }
    /**
     * 根据 index 返回 col
     * @param index
     */
    public col(index: number): number {
        return index % this.cols;
    }

    /**
     * 根据 row / col 返回 index
     * @param row
     * @param col
     */
    public index(row: number, col: number): number {
        return row * this.cols + col;
    }

    /**
     * 所有索引
     */
    public indices() : number[] {
        return _.range(0, this.size);
    }

    /**
     * 返回 某行 的所有 索引
     *
     * @param row
     */
    public rowIndices(row: number): number[] {
        let indices: number[] = [];
        for (let col of this.colsEntries())
            indices.push(this.index(row, col));
        return indices;
    }

    /**
     * 返回 某列 的所有 索引
     * @param col
     */
    public colIndices(col: number): number[] {
        let indices: number[] = [];

        for (let row of this.rowsEntries())
            indices.push(this.index(row, col));
        return indices;
    }

    /**
     * 返回十字架的所有索引
     * 传递一个参数是 index
     * 传递二个参数是 row/col
     *
     * 参数方式1
     * @param row
     * @param col
     * 参数方式2
     * @param index
     */
    public crossIndices(rowOrIndex: number, col?: number): number[] {
        let row: number = rowOrIndex;
        if (col == null) //没有第二个参数，第一个参数是index
        {
            row = this.row(rowOrIndex);
            col = this.col(rowOrIndex);
        }
        let indices: number[] = (<number[]>[]).concat(this.rowIndices(row), this.colIndices(col));
        return _.uniq(indices);
    }

    /**
     * 返回一个可遍历的Rows
     *
     */
    public *rowsEntries(step: number = 1): IterableIterator<number> {
        yield* step > 0 ? _.range(0, this.rows, Math.abs(step)) : _.rangeRight(0, this.rows, Math.abs(step));
    }

    /**
     * 返回一个可遍历的Cols
     *
     */
    public *colsEntries(step: number = 1): IterableIterator<number>{
        yield* step > 0 ? _.range(0, this.cols, Math.abs(step)) : _.rangeRight(0, this.cols, Math.abs(step));
    }

    /**
     * 返回一个可遍历的Indices
     *
     */
    public *indicesEntries(step: number = 1): IterableIterator<number>{
        yield* step > 0 ? _.range(0, this.size, Math.abs(step)) : _.rangeRight(0, this.size, Math.abs(step));
    }

}