integration("Application Controller");

test("root renders components", function(){
  expect(4);

  visit("/").then(function() {
    equal(find('#sidebar').length, 1, 'Shows sidebar');
    equal(find('#userbar').length, 1, 'Shows userbar');
    equal(find('#main').length, 1, 'Shows main outlet');
    equal(find('#users').length, 1, 'Shows users list');
  });
});