// Function to change url according to first item in list and page number
const changeUrl = ($item) => {
  const page = $item.data('page');
  const itemid = $item.data('itemid');

  const oldSearch = document.location.search.replace(/^\??/, '?').split('#')[0];

  let newSearch;
  if (oldSearch.match(/page=\d+/)) {
    newSearch = oldSearch.replace(/page=\d+/, `page=${page}`);
  } else {
    newSearch = `${oldSearch}&page=${page}`;
  }

  const newUrl = `${document.location.pathname}${newSearch}#${itemid}`;

  if ($item.data('page-start')) {
    window.history.pushState({}, 'kiko', newUrl);
  } else {
    window.history.replaceState({}, 'kiko', newUrl);
  }
};

// Function to add a Waypoint to change urls when scrolling through that item
const addHistoryMilestone = (item) => {
  const waypoint = new Waypoint({
    element: item,
    offset: "10%",
    handler: (direction) => {
      changeUrl($(item));
    }
  });
};


jQuery(document).ready(($) => {

  // If there's an infinite scrolling pager, configure it:
  if ($('#js-infinite-scrolling').length === 1) {
    const infiniteScroll = new BothInfinite({
      element: $('[data-role="infinite-scroll"]')[0],
      container: $('[data-role="infinite-content"]')[0],
      items: '[data-role="infinite-content"] > tr',
      more: '.pagination a.next_page',
      less: '.pagination a.previous_page',
      onBeforePageLoad: () => {
        $('[data-role="infinite-status"]').removeClass('hide');
      },
      onAfterPageLoad: (items) => {
        $('[data-role="infinite-status"]').addClass('hide');
        // waypoint for changing history
        $(items).filter('tr[data-itemid]').each((counter, item) => {
          addHistoryMilestone(item);
        });
      }
    });
    // waypoints to change history
    $('[data-role="infinite-content"] > tr').each((counter, item) => {
      addHistoryMilestone(item);
    });


    // if there's anchor or page param, jump to the item
    let $firstItem = null;
    if (window.location.href.includes('#')) {
      $firstItem = $(document).find(`[data-role='infinite-content'] >
      tr[data-itemid='${window.location.href.split('#')[1]}']`);
    }
    if (!($firstItem && $firstItem.length) && window.location.search.match(/page=/)) {
      $firstItem = $(document).find("[data-role='infinite-content'] > tr").first();
    }
    if ($firstItem && $firstItem.length) {
      $(window).scrollTop($firstItem.offset().top - $firstItem.outerHeight());
    }
  }


  // Hide buttons when we are in invoices and recurring_invoices listing
  if ($('#js-list-form').length) {
    $('[data-role="action-buttons"]').hide();
  }

  $(document)
    // Existing and future table rows with the data-href attribute will act as links
    .on('click', 'tr[data-href]', function(e) {
      e.preventDefault();
      window.document.location = $(this).data("href");
    })

    // but will let real links do their job
    .on('click', 'tr[data-href] > td > a', (e) => {
      e.stopPropagation();
    })

    // and avoid redirecting when clicking on a row-selection cell
    .on('click', 'tr[data-href] [data-no-href]', (e) => {
      e.stopPropagation();
    })

    // manage row selection
    .on('click', ':checkbox[data-role="select-row"]', function(e) {
      const table = $(this).closest('table');
      const checkboxes = table.find(':checkbox[data-role="select-row"]');
      const checkboxes_checked = checkboxes.filter(':checked');
      table.find(':checkbox[data-role="select-all-rows"]').prop('checked', checkboxes.length === checkboxes_checked.length);
      $('[data-role="action-buttons"]').toggle(checkboxes_checked.length > 0);
    })

    // manage all rows selection
    .on('click', ':checkbox[data-role="select-all-rows"]', function(e) {
      const self = $(this);
      const table = self.closest('table');
      const checked = self.is(':checked');

      table.find(':checkbox[data-role="select-row"]').prop('checked', checked);
      $('[data-role="action-buttons"]').toggle(checked);
    });
});
