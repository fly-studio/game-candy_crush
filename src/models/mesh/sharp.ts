enum POSITION {
	TOP = 0, RIGHT = 1, BOTTOM = 2, LEFT = 3,
	Top = 0, Right = 1, Bottom = 2, Left = 3,
	UP = 0, FORWARD = 1, DOWN = 2, BACKWARD = 3,
	Up = 0, Forward = 1, Down = 2, Backward = 3,
	TOP_LEFT,
	TOP_CENTER,
	TOP_RIGHT,
	LEFT_CENTER,
	CENTER,
	RIGHT_CENTER,
	BOTTOM_LEFT,
	BOTTOM_CENTER,
	BOTTOM_RIGHT,
}

enum DIRECTION {
    N = 0, NE = 1, E = 2, SE = 3, S = 4, SW = 5, W = 6, NW = 7,
    North = 0, Northeast = 1, East = 2, Southeast = 3, South = 4, Southwest = 5, West = 6, Nothwest = 7,
    NORTH = 0, NORTHEAST = 1, EAST = 2, SOUTHEAST = 3, SOUTH = 4, SOUTHWEST = 5, WEST = 6, NOTHWEST = 7
}

/**
 * 计算两点之间的斜率(坐标1的x轴正方向的夹角弧度（顺时针）)
 * http://keisan.casio.com/exec/system/1223508685
 * @param  {Point} p1 点1
 * @param  {Point} p2 点2
 * @return {number}         斜率（弧度）
 */
function slope(p1: egret.Point, p2: egret.Point): number
{
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

/**
 * 计算两点之间的角度
 * 同上，只是将弧度转换到了0~360°
 * @param  {Point} p1 点1
 * @param  {Point} p2 点2
 * @return {number}         斜率（角度）
 */
function slopeDegree(p1: egret.Point, p2: egret.Point): number
{
    let angle: number = slope(p1, p2);
    return (angle > 0 ? angle : (2 * Math.PI + angle)) * 360 / (2 * Math.PI);
}

/**
 * 计算计算p2相对p1的方向，东、南、西、北
 * 如果设置directionsCount为8，则会返回东北、东南、西南、西北
 * @param p1 点1
 * @param p2 点2
 * @param directionsCount 4方向 或 8方向
 */
function direction(p1: egret.Point, p2: egret.Point, directionsCount: number = 4): DIRECTION
{
    if (directionsCount != 4 && directionsCount != 8)
        throw new Error('directCount must be 4 / 8');

    let degree: number = slopeDegree(p1, p2);
    let theta = 360 / directionsCount;
    let d: number = DIRECTION.E; // 0度是 East方向
    let step = 8 / directionsCount; // 四方向跳2 八方向跳1
    for (let i: number = 0, m: number = 0 ;i < 360; i+= theta / 2, m++) { //按照平分角度的一半递增
        if (m % 2) d = (d + step) % 8; //进入新的区块则加方向
        if (degree >= i && degree < i + theta / 2) {
            return d;
        }
    }
    return d;
}

/**
 * 计算p2相对p1的方位，上 右 下 左
 * @param p1 点1
 * @param p2 点2
 */
function position(p1: egret.Point, p2: egret.Point): POSITION
{
    let d: number = direction(p1, p2, 4);
    return d / 2;
}

