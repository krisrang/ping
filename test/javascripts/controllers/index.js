integration("Integration Tests");

test("root shows header", function(){
  expect(1);

  visit("/").then(function() {
    equal(find('.navbar').length, 1, 'Shows header');
  });
});