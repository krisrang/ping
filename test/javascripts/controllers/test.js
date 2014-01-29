integration("Integration Tests");

test("root shows index", function(){
  expect(1);

  visit("/").then(function() {
    equal(find('#ping-index').length, 1, 'Shows index');
  });
});