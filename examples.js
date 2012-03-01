var bst = require('./lib/nodebst'),
	BSTNode = bst.BSTNode,
	BSTree = bst.BSTree;

/*
	Override the comparator functions so our tree knows how to compare nodes
*/
var comp = {
	isGreaterThan : function(otherNode) {
		return this.info > otherNode.info;
	},
	isEqualTo : function(otherNode) {
		return this.info === otherNode.info;
	},
	isLessThan : function(otherNode) {
		return this.info < otherNode.info;
	}
}

var node0 = new BSTNode({info : -1}).extend(comp,true);
var node1 = new BSTNode({info : 1}).extend(comp,true);
var node2 = new BSTNode({info : 2}).extend(comp,true);
var node3 = new BSTNode({info : 3}).extend(comp,true);
var node4 = new BSTNode({info : 4}).extend(comp,true);
var node5 = new BSTNode({info : 5}).extend(comp,true);
var node7 = new BSTNode({info : 7}).extend(comp,true);

var tree = new BSTree({verbose:true});

tree.appendNode(node3);
tree.appendNode(node1);
tree.appendNode(node2);
tree.appendNode(node5);
tree.appendNode(node4);
tree.appendNode(node0);
tree.appendNode(node7);

// find node with info 7
var found7 = tree.findNode(7);

console.log(found7.info) // 7

// remove this node
tree.remove(node7);

// try to find 7 which was just removed
found7 = tree.findNode(7);

console.log(found7); // undefined

