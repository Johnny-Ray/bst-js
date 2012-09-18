/*
Copyright (c) 2012 Johnny Ray Austin <johnny@johnnyray.me>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var async = require('async');
var util = require('util');

/*
-----------------------------------------------------------------------------------------------------------------
Binary search tree node definition
-----------------------------------------------------------------------------------------------------------------
*/
function BSTNode(opts) {
	this.data = opts.data || null;
	this.left = null;
	this.right = null;
	this.parent = null;
	return this;
}

BSTNode.prototype = {

	/*
		Default isGreaterThan node implementation (assumes primitive node data)
	*/
	isGreaterThan : function(otherNode){
		console.error('I don\'t know how to tell if I\'m greater than the other guy! Override this function using extend({functions}, true)');
		return this.data === otherNode.data;
	},

	/*
		Default isEqualTo node implementation (assumes primitive node data)
	*/
	isEqualTo : function(otherNode) {
		console.error('I don\'t know how to tell if I\'m  equal to the other guy! Override this function using extend({functions}, true)');
		return false;
	},

	/*
		Default isLessThan node implementation (assumes primitive node data)
	*/
	isLessThan : function(otherNode) {
		console.error('I don\'t know how to tell if I\'m  less than the other guy! Override this function using extend({functions}, true)');
		return this.data < otherNode.data;
	},

	/*
		Convenience method to add properties and functions to a node. Pass in a flag value of 'true'
		to override existing properties or functions
	*/
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
Binary search tree definition
-----------------------------------------------------------------------------------------------------------------
*/

function BSTree(opts) {

	/* ===================================== Data Members ====================================== */

	this.root = null;
	this.comp = null;

	/* ===================================== Public Functions ====================================== */

	this.append = function(nodes, onComplete) {
		var remaining = [];
		if (nodes) {
			var self = this;
			if (!this.root) {
				var first = nodes;
				if (nodes instanceof Array) {
					first = nodes[0];
				}
				this.root = first;
				this.comp = {
					isGreaterThan : first.isGreaterThan,
					isLessThan : first.isLessThan,
					isEqualTo : first.isEqualTo
				};
				
				if (nodes instanceof Array) {
					nodes.splice(0, 1);
					remaining = nodes;
				} else {
					onComplete.apply(null, []);
				}
			} 

			var q = async.queue(function(task, callback){
				_append(task.node, self.root);
				callback.apply(null,[]);
			},1);

			q.drain = onComplete;

			remaining.forEach(function(node){
				q.push({node : node}, function(err){
					if (err) {
						console.log('An error occured appending ' + node.data);
					}
				});
			});

			// _append(node, this.root);
		} else {
			return false;
		}
	};

	/*
		Find a node with the given data
	*/
	this.findNode = function(data, callback) {
		var self = this;
		var node = new BSTNode({data : data}).extend(this.comp,true);
		_find(node, this.root, callback);
	};

	/*
		Fetch the smallest node in the tree
		Input: Optionally provide the starting node
	*/
	this.smallestNode = function(start, callback) {
		start = start || this.root;
		var smallest = _smallest(start);
		if (smallest) {
			callback.apply(null,[null, smallest]);
		} else {
			callback.apply(null,['An error occured. The tree may be empty!', null]);
		}
	};

	/*
		Find the largest node in the tree
		Input: Optionally provide the starting node
	*/
	this.largestNode = function(start, callback) {
		start = start || this.root;
		var l = _largest(start);
		if (l) {
			callback.apply(null,[null,l]);
		} else {
			callback.apply(null, ['An error occured. The tree may be empty!',null])
		}
		
	};

	/*
		Remove the specified node from the tree
		Input: 
			node - The node to be removed
			callback - Function that fires once the node has been removed
	*/
	this.remove = function(node, callback) {
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
	};

	/*
		Traverse the tree and process each node
		Input:
			order - The order by which to traverse the tree (inOrder, preOrder or postOrder)
			processNode - Processing function for each node
			onComplete - Function that fires once all nodes have been processed
	*/
	this.traverse = function(order, processNode, onComplete) {
		if (this.root) {
			var func;
			switch (order) {
				case 'preOrder':
					func = _preOrderTraverse;
					break;
				case 'inOrder':
					func = _inOrderTraverse;
					break;
				case 'postOrder':
					func = _postOrderTraverse;
					break;
				default:
					onComplete.apply(null,['Invalid order specified!']);
			}
			func.apply(null,[this.root, processNode]);
			onComplete.apply(null, []);
		} else {
			onComplete.apply(null,['Tree is empty!']);
		}
	};

	/* ===================================== Private Functions ====================================== */

	/*
		Preorder traversal implementation
		Input:
			next - The next node to process
			callback - Function which fires once the node is processed
	*/
	var _preOrderTraverse = function(next, callback) {
		if (next) {
			callback.apply(null, [next.data]);
			if (next.left) {
				_preOrderTraverse(next.left, callback);
			} 
			if (next.right) {
				_preOrderTraverse(next.right, callback);
			}
		}
	};

	/*
		Inorder traversal implementation
		Input:
			next - The next node to process
			callback - Function which fires once the node is processed
	*/
	var _inOrderTraverse = function(next, callback) {
		if (next) {
			if (next.left) {
				_inOrderTraverse(next.left, callback);
			}
			callback.apply(null, [next.data]); 
			if (next.right) {
				_inOrderTraverse(next.right, callback);
			}
		}
	};

	/*
		Postorder traversal implementation
		Input:
			next - The next node to process
			callback - Function which fires once the node is processed
	*/
	var _postOrderTraverse = function(next, callback) {
		if (next) {
			if (next.left) {
				_postOrderTraverse(next.left, callback);
			}

			if (next.right) {
				_postOrderTraverse(next.right, callback);
			}
			callback.apply(null, [next.data]); 
		}
	};

	/*
		Helper function for largestNode()
	*/
	var _largest = function(node) {
		if (node.right) {
			return _largest(node.right);
		} else {
			return node;
		}
	};

	/*
		Helper function for smallestNode
	*/
	var _smallest = function(node) {
		if (node.left) {
			return _smallest(node.left);
		} else {
			return node;
		}
	};

	/*
		Helper function for findNode()
	*/
	var _find = function(node, next, callback) {
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
			_find(node, next, callback);
		} else {
			process.nextTick(function(){
				callback.apply(null,[]);
			});
		}
	};

	/*
		Helper function for appendNode
	*/
	var _append = function(node, next) {
		if (next) {
			node.parent = next;
			if (node.isGreaterThan(next)) {
				if (next.right) {
					_append(node, next.right);
				} else {next.right = node;}
			} else if (node.isLessThan(next)) {
				if (next.left) {
					_append(node, next.left);
				} else {next.left = node;}
			} else if (node.isEqualTo(next)) {
				_append(node,null);
			}
		}
	};
};

exports.BSTree = BSTree;
exports.BSTNode = BSTNode;