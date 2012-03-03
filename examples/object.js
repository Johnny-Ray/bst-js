var bst = require('../lib/nodebst'),
	BSTNode = bst.BSTNode,
	BSTree = bst.BSTree;

/*
	Override the comparator functions so our tree knows how to compare nodes
*/
var comp = {
	isGreaterThan : function(otherNode) {
		return this.data.string.length > otherNode.data.string.length;
	},
	isEqualTo : function(otherNode) {
		return this.data.string.length === otherNode.data.string.length;
	},
	isLessThan : function(otherNode) {
		return this.data.string.length < otherNode.data.string.length;
	}
};

var node0 = new BSTNode({data : 
	{
		string : "blahblahblah"
	}
}).extend(comp,true);
var node1 = new BSTNode({data : 
	{
		string : "blah"
	}
}).extend(comp,true);
var node2 = new BSTNode({data : 
	{
		string : "blahblah"
	}
}).extend(comp,true);
var node3 = new BSTNode({data : 
	{
		string : "blahblahblahblahblahblah"
	}
}).extend(comp,true);
var node4 = new BSTNode({data : 
	{
		string : "l"
	}
}).extend(comp,true);

var tree = new BSTree();

tree.appendNode(node1);
tree.appendNode(node2);
tree.appendNode(node3);
tree.appendNode(node4);
tree.appendNode(node0);

console.log('\nFetching largest node. Should be "blahblahblahblahblahblah"\n');

// find largest node
var largest = tree.largestNode();

// prints node with data:{string:"blahblahblahblahblahblah"}
console.log(largest);

