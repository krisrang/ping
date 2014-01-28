integration("Integration Tests");

test("root lists first page of posts", function(){
  expect(1);

  visit("/").then(function() {
    equal(find('#ping-index').length, 1, 'Shows index');
  });
});