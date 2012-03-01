var bst = require('../lib/nodebst'),
	BSTNode = bst.BSTNode,
	BSTree = bst.BSTree;

/*
	Override the comparator functions so our tree knows how to compare nodes
*/
var comp = {
	isGreaterThan : function(otherNode) {
		return this.data > otherNode.data;
	},
	isEqualTo : function(otherNode) {
		return this.data === otherNode.data;
	},
	isLessThan : function(otherNode) {
		return this.data < otherNode.data;
	}
}

var node0 = new BSTNode({data : -1}).extend(comp,true);
var node1 = new BSTNode({data : 1}).extend(comp,true);
var node2 = new BSTNode({data : 2}).extend(comp,true);
var node3 = new BSTNode({data : 3}).extend(comp,true);
var node4 = new BSTNode({data : 4}).extend(comp,true);
var node5 = new BSTNode({data : 5}).extend(comp,true);
var node7 = new BSTNode({data : 7}).extend(comp,true);

var tree = new BSTree();

tree.appendNode(node3);
tree.appendNode(node1);
tree.appendNode(node2);
tree.appendNode(node5);
tree.appendNode(node4);
tree.appendNode(node0);
tree.appendNode(node7);

console.log('\nFetching smallest node. Should be -1\n');

// find smallest node
var smallest = tree.smallestNode();

// prints node with -1
console.log(smallest);