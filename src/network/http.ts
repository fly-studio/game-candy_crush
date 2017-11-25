namespace network {
	export function userQuery(form: layer.ui.Form)
	{
		form.action = 'crush/user-query';
		return form.submit();
	}

	export function todayRemaining() {
		return layer.http.get('crush/today-remaining').then(json => {
			return typeof json.data != 'undefined' ? json.data.todayRemaining : 0;
		});
	}

	export function topQuery() {
		return layer.http.get('crush/top-query');
	}

	export function scoreQuery(score: number) {
		return layer.http.form('crush/score-query', {score});
	}
}
