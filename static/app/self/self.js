angular.module('genome.self', [])

.controller('SelfController', [ '$scope', '$cookies', '$location', 'SelfFactory', 'd3Service', '$rootScope', function ($scope, $cookies, $location, SelfFactory, d3Service, $rootScope) {

  $scope.outcomes = $scope.outcomes || [];
  $scope.current = {};

  $scope.whichView = whichView;

  var whichView = function() {
    $rootScope.view = $location.$$path;
  };

  whichView();

  $rootScope.removeHelix = function () {
    d3.select("svg#helix").remove();
  };

  $rootScope.$watch(function () {
      return location.hash;
  }, function (value) {
     if($location.$$path === '/self'){
       $('svg.datamap').remove();
     } else if($location.$$path === '/tree'){
       d3.select("svg#helix").remove();
     }
  });

  $scope.fills = fills;

    /* The 'FILLS' block will determine the availability of colors, balls and lines
     * and what quantity and other attributes the d3 plot should contain */
  var fills = ['#E74C3C', '#3498DB', '#2ECC71'],
    h = window.innerHeight - 100;
    w = window.innerWidth / 9;
    numX = 0,
    numY = 0,
    speed = 0.01,
    torsion = 0.3,
    x = d3.scale.linear().range([20, w - 20]),
    y = d3.scale.linear().range([h - 100, 20]),
    z = d3.scale.linear().range([18, 5]);
      /**
        * This block will append the built svg elements to the "body" of the HTML
      **/
  var svg = d3.select(".BodyContainer")
      .append("svg")
      .attr("id", "helix")
      .attr("width", w)
      .attr("height", h);

  /** Appends the inner SVG to a larger SVG container **/
  svg.append("DNAHelix")
      .attr("width", w)
      .attr("height", h)
      .attr("fill", "white");
  var container = svg.append("g");
  var counter = 0;

  $scope.generateData = generateData;

  function generateData() {
    counter++;
    // Creating a range of numX (set to outcomes length) and then map
    var data = d3.range(numX).map(function (d, i) {
        var t = d * torsion - speed * counter;
          return [{ x: Math.cos(t),
                    y: d,
                    z: Math.sin(t),
                    title: $scope.outcomes[d].title,
                    rsid: $scope.outcomes[d].rsid,
                    pair: $scope.outcomes[d].pair,
                    outcome: $scope.outcomes[d].outcome,
                    video: $scope.outcomes[d].video
                  },
                  { x: Math.cos(t - Math.PI),
                    y: d,
                    z: Math.sin(t - Math.PI),
                    title: $scope.outcomes[d].title,
                    rsid: $scope.outcomes[d].rsid,
                    pair: $scope.outcomes[d].pair,
                    outcome: $scope.outcomes[d].outcome,
                    video: $scope.outcomes[d].video
                  }];
        });
      var flat = _.flatten(data);
      x.domain(d3.extent(flat, function(d){ return d.x; }));
      y.domain(d3.extent(flat, function(d){ return d.y; }));
      z.domain(d3.extent(flat, function(d){ return d.z; }));
      return data;
  }
  var exit = false;

  $scope.draw = draw;

  function draw () {
    if(exit) {
      return;
    }
    var cont = container.selectAll("g").data(generateData());
    cont.exit().remove();
    var enter = cont.enter()
      .append("g")
      .on('mouseenter', function(d, i){
        var children = d3.selectAll(this.children);
        d3.select(this).transition().duration(400).attr('r', 20);
        children.transition().duration(400).attr('r', 20);
      })
      .on('click', function (d, i) {

        var info = d3.select(d)[0][0][0];
        $('iframe').remove();
        $('div.youtubevidbox').append(info.video);
        // Using $scope.$apply to force angular to rerender once the scope has been updated with the current snp
        $scope.$apply($scope.current = { title: info.title, rsid: info.rsid, pair: info.pair, outcome: info.outcome, video: info.video });
      })
      .each(function (d, index) {
          d3.select(this)
            .selectAll("circle")
            .data(d)
            .enter()
            .append("circle");

          d3.select(this).append('line')
              .attr("stroke", function (d, i) {
                return fills[index%3];
              })
              .attr("stroke-width", 2);
      });

    cont.each(function (d, index) {
      var inverted = (d[0].y < d[1].x) ? 1 : -1;
      d3.select(this)
        .selectAll("circle")
        .data(d)
        .attr("cx", function (d) { return x(d.x); })
        .attr("cy", function (d) { return y(d.y); })
        .attr("r",  function (d) { return z(d.z); })
        .attr("fill-opacity", function (d) { return z(d.z) / 10;})
        .attr("fill", function (d, i) { return fills[index%3]; })
        .attr("title", function (d){ return d.title; })
        .attr("rsid", function(d){ return d.rsid; })
        .attr("pair", function(d){ return d.pair; })
        .attr("outcome", function(d){ return d.outcome; })
        .attr("video", function(d) { return d.video; })

      d3.select(this)
          .select('line')
          .attr("x2", x(d[0].x) + inverted * z(d[0].z))
          .attr("x1", x(d[1].x) - inverted * z(d[1].z))
          .attr("y2", y(d[0].y))
          .attr("y1", y(d[0].y));
    });
  }
  SelfFactory.getSnps($cookies.user_profile_id).then(function (outcomes) {
    $scope.allOutcomes = outcomes; //for testing purposes only

    for (var key in outcomes) {
      $scope.outcomes.push(outcomes[key]);
    }

    $scope.current = {
      title: 'Example',
      rsid: 'rs12345',
      pair: 'AA',
      outcome: 'A very interesting fact'
    };

    $('div.youtubevidbox').append('<iframe width="420" height="315" src="https://www.youtube.com/embed/zwibgNGe4aY" frameborder="0" allowfullscreen></iframe>');

    numX = $scope.outcomes.length;

    setInterval(draw, 25);
  });


  $rootScope.IntroOptions = {
      steps:[{
          intro: "Welcome to your personal double helix. You can hover your mouse over the spinning double helix bubbles for information about your DNA."
        },
        {
          element: document.querySelector('#helix-path-2'),
          intro: "This box will display information about your DNA.",
          position: 'left'
        },
        {
          element: document.querySelector('#helix-path-3'),
          intro: "This ID represents the specific location on your genome. You can click on the link to find scientific articles about this information.",
          position: 'left'
        },
        {
          element: document.querySelector('#helix-path-4'),
          intro: "These letters represent the specific nucleotide base pair you have at this location.",
          position: 'left'
        },
        {
          element: document.querySelector('#helix-path-5'),
          intro: "Here is a commonly reported outcome of having the specific base pair at this specific location.",
          position: 'left'
        },
        {
          element: document.querySelector('#helix-path-6'),
          intro: "You can use these buttons to navigate between this page and your relative tree.",
          position: 'bottom'
        },
        {
          element: document.querySelector('#helix-path-7'),
          intro: "Use these buttons if you want to use this walkthrough or sign out.",
          position: 'bottom'
        }
      ],
      showStepNumbers: false,
      exitOnOverlayClick: true,
      exitOnEsc:true,
      nextLabel: '<strong><span style="color:green">Next</span></strong>',
      prevLabel: 'Previous',
      skipLabel: '<span style="color:red">Exit</span>',
      doneLabel: 'Thanks'
  };
  //This function collapses the helix for a visual transition into the Pool Page.
  //This function gets called by the transitionToPool function
  var remove = function() {
    $('div.dna-info').remove();
    d3.select("svg#helix")
      .attr("width", 3000);

    d3.selectAll("line")
      .transition()
      .duration(500)
      .attr('y1', 200)
      .attr('y2', 200);


    d3.selectAll("circle")
      .transition()
      .duration(2000)
      .attr("r", 5)
      .attr("cx", function(d){return 120000 * d.x;})
      .attr("cy", 100);

    d3.selectAll("line")
      .transition()
      .delay(400)
      .attr("x1", 3000)
      .attr("x2", 5000);

   };
   //Calls the remove function, and sets a timeout to transition the user to the pool
   //page after the helix has collapsed and been removed from the page.
  $rootScope.transitionToPool = function(){
    exit = true;
    remove();
    setTimeout(function(){
      $scope.$apply($location.path('/tree'));
      $rootScope.removeHelix();}, 500);
  };
}])
.factory('SelfFactory', function ($http) {
/**
  * Used to retrieve information about SNPs pertaining to currently logged in user
**/
  var getSnps = function (userId) {
    return $http({
      method: 'POST',
      url: '/user/snpinfo/',
      data: userId
    }).then(function (snps) {
      return snps.data.outcomes;
    }).catch(function (err) {
      console.error('An error occured retreiving your SNPs ', err);
    });
  };

  return {
    getSnps: getSnps
  };
});
