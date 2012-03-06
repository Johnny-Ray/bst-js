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
	this.root = null;
	this.comp = null;
}

BSTree.prototype = {
	/* 
		Append a new node to the tree 
	*/
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

	/*
		Helper function for appendNode
	*/
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

	/*
		Find a node with the given data
	*/
	findNode : function(data, callback) {
		var self = this;
		var node = new BSTNode({data : data}).extend(this.comp,true);
		this._find(node, this.root, callback);
	},

	/*
		Helper function for findNode()
	*/
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

	/*
		Fetch the smallest node in the tree
		Input: Optionally provide the starting node
	*/
	smallestNode : function(start) {
		start = start || this.root;
		return this._smallest(start);
	},

	/*
		Helper function for smallestNode
	*/
	_smallest : function(node) {
		if (node.left) {
			return this._smallest(node.left);
		} else {
			return node;
		}
	},

	/*
		Find the largest node in the tree
		Input: Optionally provide the starting node
	*/
	largestNode : function(start) {
		start = start || this.root;
		return this._largest(start);
	},

	/*
		Helper function for largestNode()
	*/
	_largest : function(node) {
		if (node.right) {
			return this._largest(node.right);
		} else {
			return node;
		}
	},

	/*
		Remove the specified node from the tree
		Input: 
			node - The node to be removed
			callback - Function that fires once the node has been removed
	*/
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

	/*
		Traverse the tree and process each node
		Input:
			order - The order by which to traverse the tree (inOrder, preOrder or postOrder)
			processNode - Processing function for each node
			onComplete - Function that fires once all nodes have been processed
	*/
	traverse : function(order, processNode, onComplete) {
		if (this.root) {
			this['_' + order + 'Traverse'](this.root, processNode);
			process.nextTick(function(){
				onComplete.apply(null,[]);
			});
		} else {
			process.nextTick(function(){
				onComplete.apply(null,['Tree is empty!']);
			});
		}
	},

	/*
		Preorder traversal implementation
		Input:
			next - The next node to process
			callback - Function which fires once the node is processed
	*/
	_preOrderTraverse : function(next, callback) {
		if (next) {
			process.nextTick(function(){
				callback.apply(null, [next.data]);
			});
			if (next.left) {
				this._preOrderTraverse(next.left, callback);
			} 
			if (next.right) {
				this._preOrderTraverse(next.right, callback);
			}
		}
	},

	/*
		Inorder traversal implementation
		Input:
			next - The next node to process
			callback - Function which fires once the node is processed
	*/
	_inOrderTraverse : function(next, callback) {
		if (next) {
			if (next.left) {
				this._inOrderTraverse(next.left, callback);
			}
			process.nextTick(function(){
				callback.apply(null, [next.data]); 
			});
			if (next.right) {
				this._inOrderTraverse(next.right, callback);
			}
		}
	},

	/*
		Postorder traversal implementation
		Input:
			next - The next node to process
			callback - Function which fires once the node is processed
	*/
	_postOrderTraverse : function(next, callback) {
		if (next) {
			if (next.left) {
				this._postOrderTraverse(next.left, callback);
			}

			if (next.right) {
				this._postOrderTraverse(next.right, callback);
			}
			process.nextTick(function(){
				callback.apply(null, [next.data]); 
			});
		}
	}

};

exports.BSTree = BSTree;
exports.BSTNode = BSTNode;