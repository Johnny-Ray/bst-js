var util = require('util');

function BSTNode(opts) {
	this.data = opts.data || null;
	this.left = null;
	this.right = null;
	this.parent = null;
	return this;
}

BSTNode.prototype = {

	isGreaterThan : function(otherNode){
		console.error('I don\'t know how to tell if I\'m greater than the other guy! Override this function using extend(function, true)');
		return this.data === otherNode.data;
	},

	isEqualTo : function(otherNode) {
		console.error('I don\'t know how to tell if I\'m  equal to the other guy! Override this function using extend(function, true)');
		return false;
	},

	isLessThan : function(otherNode) {
		console.error('I don\'t know how to tell if I\'m  less than the other guy! Override this function using extend(function, true)');
		return this.data < otherNode.data;
	},

	extend : function(obj, flag) {
		for (prop in obj) {
			if (!this[prop]) {
				this[prop] = obj[prop];
			} else if (flag && flag === true) {
				if (prop !== 'data' && prop !== 'extend') {
					this[prop] = obj[prop];
				}
			}
		}
		return this;
	}
};

/*
-----------------------------------------------------------------------------------------------------------------
*/

function BSTree(opts) {
	this.root = null;
	this.comp = null;
	this.verbose = opts.verbose || false;
}

BSTree.prototype = {
	appendNode : function(node) {
		if (node && node.data) {
			var self = this;
			if (!this.root) {
				this.root = node;
				this.comp = {
					isGreaterThan : node.isGreaterThan,
					isLessThan : node.isLessThan,
					isEqualTo : node.isEqualTo
				};
				return true;
			} else {
				this._append(node, this.root);
				return true;
			}
		} else {
			return false;
		}
	},

	_append : function(node, next) {
		if (next) {
			node.parent = next;
			if (node.isGreaterThan(next)) {
				if (next.right) {
					this._append(node, next.right);
				} else {next.right = node;}
			} else if (node.isLessThan(next)) {
				if (next.left) {
					this._append(node, next.left);
				} else {next.left = node;}
			} else if (node.isEqualTo(next)) {
				this._append(node,null);
			}
		}
	},

	findNode : function(data, callback) {
		if (this.root) {
			var self = this;
			var node = new BSTNode({data : data}).extend(this.comp,true);
			this._find(node, this.root, callback);
		}
	},

	_find : function(node, next, callback) {
		if (next) {
			if (node.isEqualTo(next)) {
				process.nextTick(function(){
					callback.apply(null, [next]);
				});
				return;
			} else if (node.isGreaterThan(next)) {
				next = next.right || null;
			} else if (node.isLessThan(next)) {
				next = next.left || null;
			}
			this._find(node, next, callback);
		} else {
			process.nextTick(function(){
				callback.apply(null,[]);
			});
		}
	},

	smallestNode : function() {
		return this._smallest(this.root);
	},

	_smallest : function(node) {
		if (node.left) {
			return this._smallest(node.left);
		} else {
			return node;
		}
	},

	remove : function(node, callback) {
		this.findNode(node.data, function(target){
			if (target) {
				if (!target.left && !target.right) {	   // has no children
					if (target.parent.left.isEqualTo(target)) {
						target.parent.left = null;
					} else {
						target.parent.right = null;
					}
				} else if (target.left && !target.right) { // has just left child
					target.left.parent = target.parent;
					if (target.parent.right.isEqualTo(target)) {
						target.parent.right = target.left;
					} else {
						target.parent.left = target.left;
					}
				} else if (target.right && !target.left) { // has just right child
					target.right.parent = target.parent;
					if (target.parent.right.isEqualTo(target)) {
						target.parent.right = target.left;
					} else {
						target.parent.left = target.left;
					}
				} else { 								   // has left and right child
					var smallestRight = this._smallest(target.right);
					smallestRight.parent = target.parent;
					smallestRight.left = target.left;
					if (smallestRight.parent.left.isEqualTo(target)) {
						smallestRight.parent.left = smallestRight;
					} else {
						smallestRight.parent.right = smallestRight;
					}
				}
				process.nextTick(function(){
					callback.apply(null,[]);
				});
			} else {
				process.nextTick(function(){
					callback.apply(null,['Node not found'])
				});
			}
		});
	},

};

exports.BSTree = BSTree;
exports.BSTNode = BSTNode;