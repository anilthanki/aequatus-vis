function toNewick (s) {
    var ancestors = [];
    var tree = {};
    var tokens = s.split(/\s*(;|\(|\)|,|:|\[|\])\s*/);
    var tag = false;

    for (var i=0; i<tokens.length; i++) {
      var token = tokens[i];
      switch (token) {
        case '(': // new branchset
          var subtree = {};
          tree.children = [subtree];
          ancestors.push(tree);
          tree = subtree;
          break;

        case ',': // another branch

          var subtree = {};
          ancestors[ancestors.length-1].children.push(subtree);
          tree = subtree;
          break;

        case ')': // optional name next
          tree = ancestors.pop();
          break;

        case ':': // optional length next
          break;

        default:
          
          var x = tokens[i-1];
          if (x == ')' || x == '(' || x == ',') {

            tree.name = token;

          } else if (x == '[') {

            tag = true;

          }
          else if (tag == true && x == ':') {
            if(token == "D=N") {

              tree.type = "speciation";

            } else if(token == "D=Y") {

              tree.type = "duplication";

            } else if(token == "DD=Y") {

              tree.type = "dubious";

            }
            tag == false
          }else if (x == ':') {

            tree.length = token;
          }
      }
    }
    return tree;
  }