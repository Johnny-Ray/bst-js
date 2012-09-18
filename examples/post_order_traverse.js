var bst = require('../lib/index'),
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
};

var node0 = new BSTNode({data : -1}).extend(comp,true);
var node1 = new BSTNode({data : 1}).extend(comp,true);
var node2 = new BSTNode({data : 2}).extend(comp,true);
var node3 = new BSTNode({data : 3}).extend(comp,true);
var node4 = new BSTNode({data : 4}).extend(comp,true);
var node5 = new BSTNode({data : 5}).extend(comp,true);
var node7 = new BSTNode({data : 7}).extend(comp,true);

var tree = new BSTree();

tree.append([node3, node1, node2, node5, node4, node0, node7], function(){
	console.log('\nTraversing the tree post-order.');

	tree.traverse('postOrder', function(node_data){ // first callback fires for every node
		console.log('Processing ' + node_data);
	}, function(err){ // second callback fires when all nodes have been traversed
		console.log('\nAll done!')
	});
});