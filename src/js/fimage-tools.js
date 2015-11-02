//////////////////////////////////////////////////////////////////////////
//
// FimageTools
//
// Presents & operates the standard Fimage Tools, with callbacks for
// actions of note.
//
// Includes all the search behaviors such as debouncing searches, clearing
// searches and presenting previous searches (this session) as tips.
//
//////////////////////////////////////////////////////////////////////////

function FimageTools(
    parent,
    placeholder,
    searchChangedCallback,
    previousCallback,
    nextCallback
) {

  // The data list "suggestions" for search area.  I'm not liking
  // this at the moment, it seems more annoying & sometimes confusing than
  // is actually helpful, so turning it off, to see if it's even missed.
  var ENABLE_DATA_LIST = false;
  var mode;        // View mode
  var toolsEl;     // Our tools wrapper
  var clearEl;     // Tool Elements
  var searchInputEl;
  var previousEl;
  var nextEl;

  // Search debounce vars
  var latestSearchValue;
  var settledSearchValue;
  var lastProcessedSearch = '';

  var searches = [];  // Searches performed
  var timeout;        // most recent timeout timer

  var render = function(initialOpacity) {

    var toolClasses = 'fimage-tools__tool';
    if ('onmousedown' in window && window.innerWidth >= 480) {

      // Don't bother with hover on phones (no way in CSS to do this
      // unfortunately), to prevent hover from getting "stuck" on phones
      toolClasses += ' fimage-tools__tool--hover';
    }
    var html = '';
    html += '<div class="fimage-tools fimage-tool--no-user-select" ' +
            'style="opacity: 0.0">';
    html += '<div class="fimage-tools__clear-search ' + toolClasses + '"></div>';
    html += '<div class="fimage-tools__search">';
    html += '<input type="text" placeholder=" ' + placeholder +
            '" list="searchList" value="' + lastProcessedSearch + '"/>';
    html += '</div>';

    // reverse right-side tool order to adjust for float effect
    html += '<div class="fimage-tools__next ' + toolClasses + '"></div>';
    html += '<div class="fimage-tools__previous ' + toolClasses + '"></div>';
    html += '</div>';
    html += renderSearchList();
    return html;
  };

  // Render HTML for data-list entry aid on browsers that support it (if the
  // browser doesn't support it, gracefully degrades to just a regular text
  // input)
  var renderSearchList = function(optionsOnly) {
    if (!ENABLE_DATA_LIST) {
      return "";

    }
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
    searchInputEl = parent.querySelector('.fimage-tools input');
    previousEl = parent.querySelector(' .fimage-tools__previous');
    nextEl = parent.querySelector(' .fimage-tools__next');

    updateNavTools();
    updateSearchTools();

    searchInputEl.focus();
    toolsEl.style.opacity = initialOpacity;

    // Add a queue delay to let tools area settle in the desired initial
    // opacity before transitioning to 100%
    setTimeout(function() {
      toolsEl.classList.add('fimage--trans-opacity');
      toolsEl.style.opacity = '1.0';
    });

    searchInputEl.addEventListener('keyup', inputListener);
    searchInputEl.addEventListener('input', inputListener);

    // Add event listeners for next & previous buttons, firing on the mouse
    // or touch down, to gain a few hundred milliseconds in response time.
    if ('onmousedown' in window) {
      clearEl.addEventListener('mousedown', clearSearch);
      nextEl.addEventListener('mousedown', next);
      previousEl.addEventListener('mousedown', previous);
    } else if ('ontouchstart' in window) {
      clearEl.addEventListener('touchstart', clearSearch);
      nextEl.addEventListener('touchstart', next);
      previousEl.addEventListener('touchstart', previous);
    }
  };

  var clearSearch = function(ev) {

    // Clear the search field & search, re-render to include new search
    // data-list, set the focus back for new input
    searchInputEl.value = '';
    settledSearchValue = latestSearchValue = '';
    searchSettled();
    setTimeout(function() {
      searchInputEl.focus();
    });
    updateSearchList();
    ev.preventDefault();
    ev.stopPropagation();
    return false;
  };

  var updateSearchList = function() {
    if (!ENABLE_DATA_LIST) {
      return;

    }

    // Remove the old search data list & replace with current info
    var searchList = document.getElementById('searchList');
    if (searchList) {
      searchList.remove();
    }
    searchList = document.createElement('datalist');
    searchList.id = 'searchList';
    searchList.innerHTML = renderSearchList(true /* optionsOnly */);
    toolsEl.appendChild(searchList);
  };

  var next = function(ev) {
    if (!nextCallback) {
      return;

    }
    nextCallback();
    ev.preventDefault();
    ev.stopPropagation();
    return false;
  };

  var previous = function(ev) {
    if (!previousCallback) {
      return;

    }
    previousCallback();
    ev.preventDefault();
    ev.stopPropagation();
    return false;
  };

  var updateSearchTools = function() {
    var showClearSearch = lastProcessedSearch;
    setVisibility(clearEl, showClearSearch);
  };
  var updateSearchString = function(searchString) {
    searchInputEl.value = searchString;
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

    var value = ev.target.value;
    if (ev.keyCode == 13 /* RETURN */ || !value) {

      // If user hits RETURN, or clears the search,
      // force immediate processing of search string
      // without debouncing
      settledSearchValue = latestSearchValue = value;
      searchSettled();

      // Accept input - knock down any datalist options window that's up,
      // rebuild it to have new list, and remove focus (blur). Note we
      // don't do this just based on a time-out from typing in case the user's
      // not done typing or is reaching for the mouse to select something
      // from the datalist.
      if (value) {
        show();
        searchInputEl.blur();
      }
    } else {

      // Debounce user's typing, call the search callback once settled.
      debounceSearch(value);
    }
    ev.preventDefault();
    return false;
  };

  var search = function() {

    // Show searches in lower case only, so user can see it's not
    // case sensitive.
    settledSearchValue = settledSearchValue.toLowerCase();
    updateSearchString(settledSearchValue);
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
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(function() {
      if (latestSearchValue === settledSearchValue) {
        searchSettled();
      } else {
        settledSearchValue = value;
        debounceSearch(latestSearchValue);
      }
    },

    // wait longer for short strings, user might be choosing from list
    value.length >= 3 ? 700 : 3000);
  };

  // Add a search string to the list of searches performed, for datalist
  // entry aid of presenting searches the user might like to do again
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
    },
    updateSearchString: function(searchString) {
      updateSearchString(searchString);
    }
  };

  return api;
}
