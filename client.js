$(document).ready(function() {
	require(['mousetrap'], function(m) {
		m.bind('a a 1', function() {
			var tid = ajaxify.variables.get('topic_id');
			if (tid) {
				socket.emit('plugins.demoday.one', tid);
			}
		});

		m.bind('a a 2', function() {
			var pid = $('[data-pid]').last().attr('data-pid');
			if (pid) {
				socket.emit('plugins.demoday.two', pid);
			}
		});

		m.bind('a a 3', function() {
			var tid = ajaxify.variables.get('topic_id');
			if (tid) {
				socket.emit('plugins.demoday.three', tid);
			}
		});

		m.bind('a a 4', function() {
			var tid = ajaxify.variables.get('topic_id');
			if (tid) {
				socket.emit('plugins.demoday.four', tid);
			}
		});

		m.bind('a a 5', function() {
			socket.emit('plugins.demoday.five');
		});

		m.bind('a a 6', function() {
			socket.emit('plugins.demoday.six');
		});
	});
});