
function FimageTools(parent, searchChangedCallback, previousCallback, nextCallback) {
  var mode;
  var toolsEl;
  var clearEl;
  var searchEl;
  var previousEl;
  var nextEl;
  var latestSearchValue;
  var settledSearchValue;
  var lastProcessedSearch = '';
  var searches = [];

  var render = function (initialOpacity) {
    var html = '';
    html+= '<div class="fimage-tools fimage-tool--no-user-select" style="opacity: 0.0">';
    html+= '<div class="fimage-tools__clear-search fimage-tools__tool"></div>';
    html+= '<input type="text" placeholder=" find image" list="searchList" value="' + lastProcessedSearch + '"/>';
    html+= '<div class="fimage-tools__next fimage-tools__tool"></div>';  // reverse order for floating
    html+= '<div class="fimage-tools__previous fimage-tools__tool"></div>';
    html+= '</div>';
    html+= renderSearchList();
    return html;
  };

  // Render HTML for data-list entry aid on browsers that support it (if the browser doesn't support it,
  // gracefully degrades to just a regular text input)
  var renderSearchList = function(optionsOnly) {
    if (!optionsOnly) {
      html = '<datalist id="searchList">';
    }
    for (var i in searches) {
      html += '<option value="' + searches[i] + '">';
    }
    if (!optionsOnly) {
      html += '</dataList>';
    }
    return html;
  };

  var show = function(initialOpacity) {
    parent.innerHTML = render('0.0' /* initialOpacity */);
    toolsEl = parent.querySelector('.fimage-tools');
    clearEl = parent.querySelector(' .fimage-tools__clear-search');
    searchEl = parent.querySelector('.fimage-tools input');
    previousEl = parent.querySelector(' .fimage-tools__previous');
    nextEl = parent.querySelector(' .fimage-tools__next');

    updateNavTools();
    updateSearchTools();

    searchEl.focus();
    toolsEl.style.opacity = initialOpacity;

    // Add a queue delay to let tools area settle in the desired initial opacity before transitioning to 100%
    setTimeout(function () {
      toolsEl.classList.add('fimage--trans-opacity');
      toolsEl.style.opacity = '1.0';
    });

    searchEl.addEventListener('keyup', inputListener);
    searchEl.addEventListener('input', inputListener);
    clearEl.addEventListener('mousedown', clearSearch);
    clearEl.addEventListener('touchstart', clearSearch);
    nextEl.addEventListener('mousedown', next);
    nextEl.addEventListener('touchstart', next);
    previousEl.addEventListener('mousedown', previous);
    previousEl.addEventListener('touchstart', previous);
  };

  var clearSearch = function() {

    // Clear the search field & search, re-render to include new search data-list,
    // set the focus back for new input
    searchEl.value = '';
    settledSearchValue = latestSearchValue = '';
    searchSettled();
    setTimeout(function() {
      searchEl.focus();
    });
    updateSearchList();
  };

  var updateSearchList = function() {

    // Remove the old search data list & replace with current info
    var searchList = document.getElementById('searchList');
    if (searchList) {
      searchList.remove();
    }
    searchList = document.createElement('datalist');
    searchList.id = 'searchList';
    searchList.innerHTML = renderSearchList();
    toolsEl.appendChild(searchList);
  };

  var next = function() {
    if (!nextCallback) {
      return;

    }
    nextCallback();
  };

  var previous = function() {
    if (!previousCallback) {
      return;

    }
    previousCallback();
  };

  var updateSearchTools = function() {
    var showClearSearch = lastProcessedSearch;
    setVisibility(clearEl, showClearSearch);
  };
  var updateNavTools = function(numImages, curImage) {
    var showPrevious = false;
    var showNext = false;
    if (curImage > 0) {
      showPrevious = true;
    }
    if (curImage < numImages - 1) {
      showNext = true;
    }
    setVisibility(previousEl, showPrevious);
    setVisibility(nextEl, showNext);
  };

  var setVisibility = function(el, visible) {
    el.style.visibility = visible ? 'visible' : 'hidden';
  };

  var inputListener = function(ev) {
    if (!searchChangedCallback) {
      return;

    }

    // Show searches in lower case only, so user can see it's not case sensitive.
    var value = ev.target.value;
    ev.target.value = value.toLowerCase();
    if (ev.keyCode == 13 /* RETURN */ || !value) {

      // If user hits RETURN, or clears the search,
      // force immediate processing of search string
      // without debouncing
      settledSearchValue = latestSearchValue = value;
      searchSettled();

      // Accept input (blur), knock down any datalist options window that's up.
      // Note we don't do this just based on a time-out from typing in case the
      // user's not done typing or is reaching for the mouse to select something
      // from the datalist.
      if (value) {
        searchEl.blur();
      }
    } else {

      // Debounce user's typing, call the search callback once settled.
      debounceSearch(value);
    }
    return false;
  };

  var search = function() {
    searchChangedCallback(settledSearchValue);
    lastProcessedSearch = settledSearchValue;
    addToSearchList(settledSearchValue);
    updateSearchTools();
  };
  var searchSettled = function() {
    if (settledSearchValue !== lastProcessedSearch) {
      search();
    }
  };
  var debounceSearch = function(value) {
    latestSearchValue = value;
    setTimeout(function() {
      if (latestSearchValue === settledSearchValue) {
        searchSettled();
      } else {
        settledSearchValue = value;
        debounceSearch(latestSearchValue);
      }
    }, value.length >= 3 ? 700 : 3000); // wait longer for short strings, user might be choosing from list
  };

  // Add a search string to the list of searches performed, for datalist entry aid of presenting
  // searches the user might like to do again
  var addToSearchList = function(search) {
    if (!search || search.length < 3) {
      return;

    }
    for (var i in searches) {
      if (searches[i] === search) {
        return;

      }
    }
    searches.push(search);
  };

  var api = {
    show: function(modeToSet) {
      mode = modeToSet;
      show('0.0' /* initialOpacity */);
    },
    updateNavTools: function(numImages, curImage) {
      updateNavTools(numImages, curImage);
    }
  };

  return api;
}
