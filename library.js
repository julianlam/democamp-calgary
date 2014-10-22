"use strict";

/*
	Require:
	  - GitHub Embed
	  - Youtube
	  - Two accounts
*/

var SocketPlugins = module.parent.require('./socket.io/plugins'),
	Posts = module.parent.require('./posts'),
	PostTools = module.parent.require('./postTools'),
	Topics = module.parent.require('./topics'),
	Notifications = module.parent.require('./notifications'),
	Messaging = module.parent.require('./messaging'),
	meta = module.parent.require('./meta'),
	lipsum = require('lorem-ipsum'),
	websockets = module.parent.require('./socket.io'),
	plugin = {};

plugin.init = function(app, middleware, controllers, callback) {
	SocketPlugins.demoday = {};

	SocketPlugins.demoday.one = function(socket, tid, callback) {
		// Post Creation
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
		// Post Editing
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

	SocketPlugins.demoday.three = function(socket, tid, callback) {
		// Youtube Video Embed
		Topics.reply({
			uid: socket.uid,
			tid: tid,
			content: '## Here\'s a youtube video!\n\nhttps://www.youtube.com/watch?v=lGar7KC6Wiw'
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

	SocketPlugins.demoday.four = function(socket, tid, callback) {
		// GitHub Embed Demo
		Topics.reply({
			uid: socket.uid,
			tid: tid,
			content: '## GitHub Embedding\n\nThis sounds like a bug, let me file it now.\n\n**Edit**: You can now track it by following nodebb/nodebb#1714'
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

	SocketPlugins.demoday.five = function(socket, nothing, callback) {
		// New Notification
		Notifications.create({
			nid: 'demoday-notif',
			title: 'This is a notification!',
			bodyShort: 'Hey there, this is a new notification! You can see that it is highlighted so that it is new.',
			bodyLong: '',
			from: 2,
			pid: 1
		}, function(err, notification) {
			console.log(arguments);
			Notifications.push(notification, [1]);
		});
	};

	SocketPlugins.demoday.six = function(socket, nothing, callback) {
		// New Chat message
		Messaging.addMessage(2, 1, lipsum(), function(err, message) {
			Messaging.notifyUser(2, 1, message);
			websockets.in('uid_' + 1).emit('event:unread.updateChatCount', null, 1);
			websockets.in('uid_' + 1).emit('event:chats.receive', {
				withUid: 2,
				message: message,
				self: 0
			});
		});
	};

	callback();
};

module.exports = plugin;