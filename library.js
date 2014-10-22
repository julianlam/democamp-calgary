"use strict";

var SocketPlugins = module.parent.require('./socket.io/plugins'),
	Posts = module.parent.require('./posts'),
	PostTools = module.parent.require('./postTools'),
	Topics = module.parent.require('./topics'),
	meta = module.parent.require('./meta'),
	lipsum = require('lorem-ipsum'),
	websockets = module.parent.require('./socket.io'),
	plugin = {};

plugin.init = function(app, middleware, controllers, callback) {
	SocketPlugins.demoday = {};
	SocketPlugins.demoday.one = function(socket, tid, callback) {
		Topics.reply({
			uid: socket.uid,
			tid: tid,
			content: lipsum({
				units: 'paragraphs'
			})
		}, function(err, postData) {
			var result = {
					posts: [postData],
					privileges: {
						'topics:reply': true
					},
					'reputation:disabled': parseInt(meta.config['reputation:disabled'], 10) === 1,
					'downvote:disabled': parseInt(meta.config['downvote:disabled'], 10) === 1,
				};
			
			socket.emit('event:new_post', result);
		});
	};

	SocketPlugins.demoday.two = function(socket, pid, callback) {
		PostTools.edit(socket.uid, pid, lipsum(), lipsum({
			units: 'paragraphs'
		}), {topic_thumb: undefined, tags: undefined}, function(err, results) {
			websockets.server.sockets.in('topic_' + results.topic.tid).emit('event:post_edited', {
				pid: pid,
				title: results.topic.title,
				isMainPost: results.topic.isMainPost,
				tags: results.topic.tags,
				content: results.content
			});
		});
	};

	callback();
};

module.exports = plugin;