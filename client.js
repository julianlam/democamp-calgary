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
	});
});