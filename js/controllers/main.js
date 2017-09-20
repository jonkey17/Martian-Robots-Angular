//main.js
angular
.module('app')
.controller('robotCtrl', robotCtrl)

function Grid(length, height) {
  var forbidden = [];
  if (length > 50 || height > 50)
    throw new Error("Grid size cannot be greater than 50x50");
  else if (length < 0 || height < 0)
    throw new Error("Grid size cannot be smaller than 1x1");

  this.length = (length === undefined ? 0 : length);
  this.height = (height === undefined ? 0 : height);

  this.addForbidden = function (position) {
    forbidden.push(position);
  };

  this.hasForbidden = function (position) {
    return forbidden.indexOf(position) > -1;
  };
}

function Position() {
  this.x = 0;
  this.y = 0;
  this.orientation = "N";
  this.lost = false;

  this.toString = function () {
    return this.x + " " + this.y + " " + this.orientation + (this.lost ? " LOST" : "");
  };

  this.isOut = function (grid) {
    if (this.x > grid.length || this.y > grid.height
      || this.y < 0 || this.x < 0) {

      if (this.orientation == "N")
        this.y = grid.height;
      if (this.orientation == "E")
        this.x = grid.length;
      if (this.orientation == "S")
        this.y = 0;
      if (this.orientation == "W")
        this.x = 0;

      this.lost = true;
      return this.lost;
    }
    return false;
  };
}

function Robot(grid) {
  var position = new Position();
  var right = { "N":"E", "E":"S", "S":"W", "W":"N" };
  var left = { "N":"W", "W":"S", "S":"E", "E":"N" };

  this.setInitialPosition = function (x, y, orientation) {
    position.x = x;
    position.y = y;
    position.orientation = orientation;
  };

  this.getPosition = function () {
    return position;
  };

  this.move = function (instructions) {
    for (var i = 0; i < instructions.length; i++) {
      if (this.isLost()) break;

      var instruction = instructions.charAt(i);

      if (isLeftTurn(instruction)) 
        this.turnLeft();
      if (isRightTurn(instruction)) 
        this.turnRight();
      if (isForwardMovement(instruction)) 
        this.moveForwards();
    }
    return position.toString();
  };

  this.moveForwards = function () {
    var startingPosition = position.toString();

    if (this.isLost() || grid.hasForbidden(startingPosition))
      return;

    if (position.orientation == "N")
      position.y++; 
    if (position.orientation == "E")
      position.x++;
    if (position.orientation == "S")
      position.y--;
    if (position.orientation == "W")
      position.x--;
    
    if (position.isOut(grid))
      grid.addForbidden(startingPosition);
  };

  this.turnLeft = function() {
    position.orientation = left[position.orientation];
  };

  this.turnRight = function () {
    position.orientation = right[position.orientation];
  };

  isLeftTurn = function (instruction) {
    return instruction == "L";
  };

  isRightTurn = function (instruction) {
    return instruction == "R";
  };

  isForwardMovement = function (instruction) {
    return instruction == "F";
  };

  this.isLost = function () {
    return position.lost;
  };
}

robotCtrl.$inject = ['$scope'];
function robotCtrl($scope) {
  $scope.robots = [];
  
  $scope.start = start;
  $scope.getNumber = getNumber;
  $scope.amountRobotsChange = amountRobotsChange;
  $scope.loadExample = loadExample;

  function start() {
    $scope.result = execute($scope.gridX, $scope.gridY, $scope.robots);
  }

  function getNumber(num) {
    return new Array(parseInt(num));   
  }

  function amountRobotsChange(){
    $scope.robots = [];
    for(var i = 0; i<$scope.robotAmount; i++) {
      $scope.robots.push({initPositionX:'', initPositionY:'', initOrientation:'', instructions:''})
    }
  }

  function execute(gridX, gridY, robots) {
    var result = []
    var grid = new Grid(gridX, gridY);
    var robot;

    for(var i = 0; i < robots.length; i++){
      robot = new Robot(grid);
      robot.setInitialPosition(robots[i].initPositionX, robots[i].initPositionY, robots[i].initOrientation);
      result.push(robot.move(robots[i].instructions));
    }
    return result;
  }
  
  function loadExample() {
      $scope.gridX = 5;
      $scope.gridY = 3;
      $scope.robotAmount = '3';
      $scope.robots = [{initPositionX:1, initPositionY:1, initOrientation:'E', instructions:'RFRFRFRF'},
                        {initPositionX:3, initPositionY:2, initOrientation:'N', instructions:'FRRFLLFFRRFLL'},
                      {initPositionX:0, initPositionY:3, initOrientation:'W', instructions:'LLFFFLFLFL'}];
  }
  
  
}