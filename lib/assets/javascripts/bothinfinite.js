class BothInfinite extends Waypoint.Infinite {
  constructor(options) {
    super(options);
    this.$less = jQuery(this.options.less);
    if (this.$less.length) {
      this.lessOptions = jQuery.extend({}, this.options, {offset: 0});
      this.setupLessHandler();
      this.lessWaypoint = new Waypoint(this.lessOptions);
      this.$window = jQuery(this.lessWaypoint.context.element);
    }
  }

  setupLessHandler() {
    this.lessOptions.handler = jQuery.proxy(
      function(direction) {
        this.$container.addClass(this.lessOptions.loadingClass);
        if (direction === 'down') {
          return;
        }
        if (this.lessWaypoint) {
          this.lessWaypoint.destroy();
        }
        const $oldFirstItem = jQuery(document).find(this.lessOptions.items).first();
        const itemHeight = $oldFirstItem.outerHeight();

        jQuery.get(this.$less.attr('href'), jQuery.proxy(
          function(data) {
            const $data = jQuery(jQuery.parseHTML(data));
            let $newLess = $data.find(this.lessOptions.less);
            let $items = $data.find(this.lessOptions.items);
            if (!$items.length) {
              $items = $data.filter(this.lessOptions.items);
            }
            this.$container.prepend($items);
            this.$window.scrollTop(itemHeight * $items.length + this.$window.scrollTop());

            if (!$newLess.length) {
              $newLess = $data.filter(this.lessOptions.less);
            }
            if ($newLess.length) {
              this.$less.replaceWith($newLess);
              this.$less = $newLess;
              this.lessWaypoint = new Waypoint(this.lessOptions);
            } else {
              this.$less.remove();
            }

            this.lessOptions.onAfterPageLoad($items);
          },
          this
        ));
      },
      this
    );
  }
}

window.BothInfinite = BothInfinite;
