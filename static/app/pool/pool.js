angular.module('genome.pool', [])
.controller('PoolController', function($scope, d3Service, Relatives, $rootScope, $window) {
  $scope.relatives = [];
  $rootScope.rels = [];
  $scope.myData = [10,10,10,20];
  $scope.circles = [];
  var boardHeight = $window.innerHeight;
  var boardWidth = $window.innerWidth;
  $scope.popModal = {
    name: '',
    similarity: '',
    image: '../../assets/hipDNA.png'
};
/////FORCE TEST

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
},
width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var padding = 2;
var radius = d3.scale.sqrt().range([0, 12]);

/////END FORCE TEST
  //pop up message displaying relative data when user clicks on a bubble
  var showRelative = function(bubble) {
    $scope.popModal.name = bubble.relative.first_name + ' ' + bubble.relative.last_name;
    $scope.popModal.similarity = bubble.relative.first_name + ' shares ' + bubble.relative.similarity + '% of your DNA.'
    $scope.popModal.image = '../../assets/hipDNA.png'
  }

  //Grab the pool as a canvas for our bubbles
  var svg = d3.select('.pool').append("svg")
      .attr("width", boardWidth + margin.left + margin.right)
      .attr("height", boardHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Create bubbles
  var createBubbles = function(circleData) {

    nodes = $scope.circles

    var force = d3.layout.force()
        .nodes(nodes)
        .size([width, height])
        .gravity(0)
        .charge(0)
        .on("tick", tick)
        .start();

        var circle = svg.selectAll("circle")
          .data(nodes)
          .enter().append("circle")
          .on('mouseover', function(){
            d3.select(this).transition().attr('r', function(d) {return d.radius * 2;})
          })
          .on('mouseout', function(){
            d3.select(this).transition().attr('r', function(d){return d.radius})
          })
          .on('click', function(bubble) {
            $scope.$apply(
            showRelative(bubble)
            );
          })
          .attr("data-target", "#myModal")
          .attr("data-toggle", "modal")
          .attr("r", function (d) {
            return d.radius;
          })
          .style('fill', function(d) {
             return d.color;
           })
          .call(force.drag);


          function tick(e) {
              circle.each(gravity(0.8 * e.alpha))
              .each(collide(0.5))
              .attr("cx", function (d) {
                return d.x;
              })
              .attr("cy", function (d) {
                return d.y;
              });
            }

          // Move nodes toward cluster focus.
          function gravity(alpha) {
              return function (d) {
                  d.y += (d.cy - d.y) * alpha;
                  d.x += (d.cx - d.x) * alpha;
              };
          }

            // Resolve collisions between nodes.
            function collide(alpha) {
                var quadtree = d3.geom.quadtree(nodes);
                return function (d) {
                    var r = d.radius + radius.domain()[1] + padding,
                        nx1 = d.x - r,
                        nx2 = d.x + r,
                        ny1 = d.y - r,
                        ny2 = d.y + r;
                    quadtree.visit(function (quad, x1, y1, x2, y2) {
                        if (quad.point && (quad.point !== d)) {
                            var x = d.x - quad.point.x,
                                y = d.y - quad.point.y,
                                l = Math.sqrt(x * x + y * y),
                                r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
                            if (l < r) {
                                l = (l - r) / l * alpha;
                                d.x -= x *= l;
                                d.y -= y *= l;
                                quad.point.x += x;
                                quad.point.y += y;
                            }
                        }
                        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                    });
                };
            }



/////Good below

    // bubbles = svg.selectAll('circle')
    //              .data(circleData)
    //              .enter()
    //              .append('circle')
    //              .on('mouseover', function(){
    //               d3.select(this).transition().attr('r', function(d) {return d.r * 2;})
    //              })
    //              .on('mouseout', function(){
    //               d3.select(this).transition().attr('r', function(d){return d.r})
    //              })
    //              .on('click', function(bubble) { showRelative(bubble);})
    //              .attr('class', 'enter')
    //              .attr('cx', function(d){return d.cx + Math.random() * 1000;})
    //              .attr('cy', function(d) {return d.cy + Math.random() * 1000;})
    //              .attr('r', function(d) {return d.r;})
    //              .style('fill', function() {
    //                return 'rgb(' + parseInt(Math.random() * 255) + ','
    //                  + parseInt(Math.random() * 255) + ','
    //                  + parseInt(Math.random() * 255) + ')';
    //              })
    //              .transition().duration(1500)
    //              .attr('cx', function(d) {
    //                return d.cx;
    //              }).attr('cy', function(d) {
    //                return d.cy;
    //              }).attr('r', function(d) {
    //                return d.r;
    //              })
  };

  //After grabbing relatives from the DB, create a bubbles array based on length of relatives array
  var initialize = function(){
    for (var i = 0; i <= $scope.relatives.length || 0; i++) {
      $scope.circles.push({
        cx: boardWidth/2,
        cy: boardHeight/2,
        color: 'rgb(' + parseInt(Math.random() * 255) + ','
               + parseInt(Math.random() * 255) + ','
               + parseInt(Math.random() * 255) + ')',
        radius: Math.random() * 100,
        relative: $scope.relatives[i]
      });
    }
    createBubbles($scope.circles);
  };

 //Grab relatives from the database, then initialize bubbles
  $scope.getRelatives = function (){
    Relatives.getRelatives()
    //Can refactor to return the promise values within the relatives factory if so desired
    .then(function(relatives) {
      //Refactor? potentially redundant addition of relatives to $scope and $rootScope.
      $scope.relatives = relatives.data.relativeList;
      //Add relatives to rootScope to allow access within other controllers
      $rootScope.rels = relatives.data.relativeList;
      initialize();
    }, function(err) {
      console.error('Error retrieving relatives: ', err)
    })
  }
});

