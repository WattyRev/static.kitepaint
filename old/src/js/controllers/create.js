app.controller("CreateController", [
  "$scope",
  "$rootScope",
  "$state",
  function(scope, root, state) {
    //VARIABLES
    scope.manufacturers = {}; //raw manufacturers data
    scope.products = []; //raw products data
    scope.display_products = []; //products data displayed
    scope.filtered_products = []; //filtered products
    scope.loading = false; //display loading text
    scope.query = ""; //search query
    scope.search = "name"; //search parameter
    scope.num_display = 20; //number of products to display
    scope.sort = {
      //sorting setting
      metric: "name",
      ascending: true
    };
    scope.staticDomain = app.staticDomain;

    //FUNCTIONS
    scope.get_products = function() {
      scope.loading = true;
      $.ajax({
        type: "GET",
        url: app.apiDomain + "products.php",
        data: {
          filter: {
            status: "2"
          }
        },
        dataType: "json",
        success: function(data) {
          $.each(data, function(i, product) {
            product.colors = JSON.parse(product.colors);
            product.variations = JSON.parse(product.variations);
          });
          scope.products = data;
          scope.filtered_products = data;
          scope.loading = false;
          scope.sort_products();
          root.done(2);
          scope.$apply();
        },
        error: function(data) {
          console.log("error", data);
          alert("Could not get products");
          root.done(2);
          scope.$apply();
        }
      });
    };
    scope.get_products();

    scope.get_manufacturers = function() {
      $.ajax({
        type: "GET",
        url: app.apiDomain + "manufacturers.php?activated=1",
        dataType: "json",
        success: function(data) {
          scope.manufacturers = {};
          $.each(data, function(i, manufacturer) {
            scope.manufacturers[manufacturer.id] = manufacturer;
          });
          root.done(2);
          scope.$apply();
        },
        error: function(data) {
          console.log("error", data);
          alert("Could not get manufacturers");
          root.done(2);
          scope.$apply();
        }
      });
    };
    scope.get_manufacturers();

    //Filter products based on search using query
    scope.filter = function() {
      scope.filtered_products = [];
      $.each(scope.products, function(i, product) {
        if (product[scope.search].indexOf(scope.query) > -1) {
          scope.filtered_products.push(product);
        }
      });
      scope.sort_products();
    };

    //sort array of products
    scope.sort_products = function() {
      scope.filtered_products.sort(function(a, b) {
        var metric = scope.sort.metric;
        var a_ = a[metric],
          b_ = b[metric];
        if (scope.sort.ascending) {
          if (a_ < b_) return -1;
          if (a_ > b_) return 1;
          return 0;
        } else {
          if (a_ < b_) return 1;
          if (a_ > b_) return -1;
          return 0;
        }
      });
      scope.update_products();
    };

    //Put the first X num of products into the displayed table
    scope.update_products = function() {
      scope.display_products = [];
      for (
        var i = 0;
        i < scope.num_display && i < scope.filtered_products.length;
        i++
      ) {
        scope.display_products.push(scope.filtered_products[i]);
      }
    };

    //set sorting parameters
    scope.sort_by = function(metric) {
      if (scope.sort.metric === metric) {
        scope.sort.ascending = !scope.sort.ascending;
      } else {
        scope.sort.metric = metric;
        scope.sort.ascending = true;
      }
      scope.sort_products();
    };

    //show more rows of products
    scope.show_more = function() {
      scope.num_display += 20;
      scope.sort_products();
    };

    scope.create = function(id) {
      //ui-sref="edit({type: 'new', id: product.id})"
      var params = { type: "new", id: id };
      state.go("edit", params);
    };
  }
]);
