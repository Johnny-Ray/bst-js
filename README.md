# Binary Search Tree for Node

## Because sometimes only a BST will do!

## Install

<pre>
 npm install node-bst
</pre>

## Usage

```javascript

	var bst = require('node-bst'),
	    BSTNode = bst.BSTNode,
	    BSTree = bst.BSTree;

	// create a node
	var node = new BSTNode({data : 1}).extend({
		customMethod : function(){}
	}, true); // pass in true flag to override existing properties or functions

	// OR

	var node = new BSTNode({
		data : {firstname : "johnny", lastname : "appleseed"} // data can be an object as well
	}).extend({
		isEqualTo : function(otherNode) { // be sure to override comparators!
			return this.data.firstname === otherNode.data.firstname &&
				this.data.lastname === otherNode.data.lastname;
		}, // and so forth for isGreaterThan and isLessThan
		
	}, true);

	// OR

	// declare comparators separately
	var comp = {
		isGreaterThan : function(otherNode){
			// do something
		},
		isLessThan : function(otherNode){
			// do something
		},
		isEqualTo : function(otherNode){
			// do something
		}
	};

	var node = new BSTNode({data : 1}).extend(comp, true);

	// Once you have a node, create a tree and append your node
	var tree = new BSTree();
	tree.appendNode(node);


	tree.findNode(1, callback(foundNode){ // find your node
		console.log(foundNode);
	});

```
## Traversing

<pre>
 tree.traverse(order, process, onComplete);
	
 order - specifies the node visitation order ('preOrder' || 'inOrder' || 'postOrder')
 process - callback to process a node's data. Takes the node's data as an argument
 onComplete - callback fires when all nodes have been processed

 Full examples under examples/ directory
</pre>

## Contact
johnny@johnnyray.me