namespace network {
	export function userQuery(form: layer.ui.Form)
	{
		form.action = 'crush/user-query';
		return form.submit();
	}

	export function todayRemaining() {
		return layer.http.get('crush/today-remaining').then(json => {
			return typeof json.data != 'undefined' ? json.data.todayRemaining : 0;
		})/*.catch(() => {
			return window.location.hash == '#automation' ? Infinity : 0;
		})*/;
	}

	export function topQuery() {
		return layer.http.get('crush/top-query').then(json => {

			if (typeof json.data == 'undefined') return [];

			let data: any = [];
			for(let v of json.data)
			{
				data.push({
					avatar_url: layer.http.baseURI + '/attachment/' + v.wechat_user.avatar_aid + '/55x55.jpg',
					rank: v.rank,
					nickname: v.nickname,
					score: v.max_score
				})
			}

			if (typeof data[0] != 'undefined') data[0].rank = 'f';
			if (typeof data[1] != 'undefined') data[1].rank = 's';
			if (typeof data[2] != 'undefined') data[2].rank = 't';

			return data;
		});
	}

	export function scoreQuery(score: number, times: number) {
		return layer.http.form('crush/score-query', {score, times}, false);
	}
}
