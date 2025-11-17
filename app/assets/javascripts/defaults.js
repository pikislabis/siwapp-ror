jQuery(document).ready(($) => {
  $(document).on('change', '[data-role="select-default"]', function(e) {
    $(this).closest('form').submit();
  });
});
