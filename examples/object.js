var bst = require('../lib/index'),
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

tree.append([node1, node4, node3, node2, node0], function(){
	console.log('\nFetching largest node (longest string in data). Should be "blahblahblahblahblahblah"\n');

	// find largest node
	tree.largestNode(null, function(err, theLargest){
		// prints node with data:{string:"blahblahblahblahblahblah"}
		console.log(theLargest);
	});
});


