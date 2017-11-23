namespace network {
	export function userQuery(form: layer.ui.Form)
	{
		form.action = 'crush/user-query';
		return form.submit();
	}

	export function todayCount() {
		return layer.http.get('crush/today-count');
	}

	export function topQuery() {
		return layer.http.get('crush/top-query');
	}

	export function scoreQuery(score) {
		return layer.http.post('crush/score-query', {score});
	}
}
