describe("Given a new Grid", function() {
	it("with a height of 51 then throw an error", function() {
		expect(function () { new Grid(2, 51)}).toThrow(new Error("Grid size cannot be greater than 50x50"));
	});
	it("with a width of 51 then throw an error", function() {
		expect(function () { new Grid(51, 1)}).toThrow(new Error("Grid size cannot be greater than 50x50"));
	});	
});

describe("Given a Grid of 2x2 and a position", function() {
	var grid = new Grid(2, 2);

	it("when the coordinates are 4,1 then shoud be lost", function() {
		var position = new Position();
		position.x = 4;
		position.y = 1;

		var result = position.isOut(grid);
		expect(result).toBeTruthy();
		expect(position.lost).toBeTruthy();
	});
	it("when the coordinates are 1,2 then shoud be lost", function() {
		var position = new Position();
		position.x = 1;
		position.y = 3;

		var result = position.isOut(grid);
		expect(result).toBeTruthy();
		expect(position.lost).toBeTruthy();
	});
	
	it("when the coordinates are 1,1 then is ok", function() {
		var position = new Position();
		position.x = 1;
		position.y = 1;

		var result = position.isOut(grid);
		expect(result).toBeFalsy();
		expect(position.lost).toBeFalsy();
	});
});

describe("Given a robot and a grid create", function() {
  var grid = new Grid(1,1);
  var robot = new Robot(grid);
  
  it("lands of down left position", function() {
    var position = robot.getPosition();
		expect(position.x).toBe(0);
		expect(position.y).toBe(0);
  });
  it("it can turn rigth to face East", function() {
		robot.turnRight();
		var orientation = robot.getPosition().orientation;
		expect(orientation).toBe("E");
  });
  it("it can move forwards when facing East", function() {
		robot.moveForwards();
		var positionOutput = robot.getPosition().toString();
		expect(positionOutput).toBe("1 0 E");
	});
});