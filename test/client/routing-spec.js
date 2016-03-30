'use strict';

describe('Routing', function () {
  var $route;
  beforeEach(module('genome'));

  beforeEach(inject(function ($route) {
  }));
  describe('on success,', function() {
  it('Should have /signin route, template, and controller', function () {
    expect($route.routes['/']).to.be.defined;
    expect($route.routes['/'].controller).to.equal('AuthController');
    expect($route.routes['/'].templateUrl).to.equal('/');
  });
  });

  it('Should have /pool route, template, and controller', function () {
    expect($route.routes['/pool']).to.be.defined;
    expect($route.routes['/pool'].controller).to.equal('PoolController');
    expect($route.routes['/pool'].templateUrl).to.equal('/static/app/pool/pool.html');
  });

  it('Should have /self route, template, and controller', function () {
    expect($route.routes['/self']).to.be.defined;
    expect($route.routes['/self'].controller).to.equal('SelfController');
    expect($route.routes['/self'].templateUrl).to.equal('/static/app/self/self.html');
  });
});