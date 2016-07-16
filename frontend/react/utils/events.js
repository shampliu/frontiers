function generate_request(method, url, load_callback) {
  let token = 'AJBA7T2DE2ZVMXHCVE4R';//localStorage.get('access_token');
  let http = new XMLHttpRequest();
  let route = url + '?token='+token;

  console.log(route);
  http.open('GET', route, true);
  http.setRequestHeader('Accept', 'application/json');
  http.setRequestHeader('Content-Type', 'application/json');

  http.addEventListener("load", load_callback);
  return http;
}


export function genCategoryFilter(categories) {
  let newList = [];
  for (var i = 0; i < categories.length; i++) {
    newList.push(categories[i].id);
  }
  return newList.join(',');
}

function getFilter(key, filters, qfield) {
  if (key in filters)
    return qfield + '=' + filters[key];
  else return '';
}

function validatePaidFilter(option) {
  return option == '' || option == 'free' || option == 'paid';
}

function validateSortByFilter(sort_by) {
  return sort_by == '' || sort_by == 'date' || sort_by == 'distance' || sort_by == 'best';
}

function validateRadiusFilter(radius) {
  if (radius == '') return true;
  let value = radius.substr(0, radius.length - 2);
  let units = radius.substr(-2);
  return !isNaN(value) && (units == 'mi' || units == 'km');
}

function getFilterQuery(filters) {
  let category = getFilter('category', filters, 'categories');
  let paid = getFilter('paid', filters, 'price');
  let date_after = getFilter('date_after', filters, 'start_date.range_start');
  let date_before = getFilter('date_before', filters, 'start_date.range_end');
  let sort_by = getFilter('sort_by', filters, 'sort_by');
  let radius = getFilter('radius', filters, 'location.within');
  let page = getFilter('page', filters, 'page');

  if (validatePaidFilter(paid) &&
      validateSortByFilter(sort_by) &&
      validateRadiusFilter(radius)) {
    return [category, paid, date_after, date_before, sort_by, radius, page]
            .filter(function(x) { return x !== '' }).join('&');
  } else {
    return '';
  }
}

/*
 * Supported Filters
 *    categories
 *    paid      :: (Free Only, Paid only, Any)
 *    date_after
 *    date_before
 *    sort_by   :: (date, distance, best)
 *    radius    :: # (mi, km)
 *    page
 */
export function getEvents(latitude, longitude, filters, load_callback) {
  let token = 'AJBA7T2DE2ZVMXHCVE4R';//localStorage.get('access_token');
  let http = new XMLHttpRequest();
  let route = 'https://www.eventbriteapi.com/v3/events/search';
  let query = 'token=' + token + '&location.latitude=' + latitude + '&location.longitude=' + longitude;
  let filterQ = getFilterQuery(filters);
  if (filterQ !== '') {
    alert(filterQ);
    query = query + '&' + filterQ;
  }
  route = route + '/?' + query;

  http.open('GET', route, true);
  http.setRequestHeader('Accept', 'application/json');
  http.setRequestHeader('Content-Type', 'application/json');

  http.addEventListener("load", load_callback);
  http.send();
};

export function getEvent(id, load_callback) {
  let http = generate_request('GET', 'https://www.eventbriteapi.com/v3/events/' + id + '/', load_callback);
  http.send();
}

export function getCategories(load_callback) {
  let http = generate_request('GET', 'https://www.eventbriteapi.com/v3/categories/', load_callback);
  http.send();
}