/**
 * 返回min~max之间的随机整数
 *
 * @param  {Int} min 最小随机范围
 * @param  {Int} max 最大随机范围
 * @return {Int}
 */
function randNumber(min: number, max: number): number {
	let argc = arguments.length;
	if (argc === 0) {
	    min = 0;
	    max = 2147483647;
	} else if (argc === 1) {
	    throw new Error('Warning: rand() expects exactly 2 parameters, 1 given');
    }

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 此函数主要是为了计算概率，用于出奖
 * probabilityRand({'iPhone': 1, 'iPad': 0, '代金券': 100, '无奖': 1000});
 * iPhone的概率为 1 / (1 + 0 + 100 + 1000); 基本很难中奖 :P
 * 按照概率返回Key
 *
 * @param  {Object} arr 概率表，参考上例
 * @return {String}     返回Key
 */
function probabilityRand(arr: Object): string|null {
	let result: string|null = null;
	//概率数组的总概率精度
	let sum = 0;
    for (let k in arr)
        sum += parseFloat(arr[k]);
	//arsort($arr);
	//概率数组循环
	for (let k in arr) {
		let randNum = randNumber(1, sum);
		let v = parseFloat(arr[k]);
		if (randNum <= v) {
			result = k;
			break;
		} else {
			sum -= v;
		}
    }

	return result;
}