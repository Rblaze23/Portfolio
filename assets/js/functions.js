// Adapted JavaScript for the interactive webpage
$(document).ready(function () {
  let canScroll = true;
  let scrollController = null;

  $(document).on("wheel DOMMouseScroll", function (e) {
    if (!$(".outer-nav").hasClass("is-vis")) {
      e.preventDefault();
      const delta = e.originalEvent.deltaY || e.originalEvent.detail * 20;

      if (delta > 50 && canScroll) {
        scrollHandler(1);
      } else if (delta < -50 && canScroll) {
        scrollHandler(-1);
      }
    }
  });

  $(".side-nav li, .outer-nav li").click(function () {
    if (!$(this).hasClass("is-active")) {
      const curPos = $(this).siblings(".is-active").index();
      const nextPos = $(this).index();
      updateNavs(nextPos);
      updateContent(curPos, nextPos);
    }
  });

  $(".cta").click(function () {
    const curPos = $(".side-nav .is-active").index();
    const lastItem = $(".side-nav li").length - 1;
    updateNavs(lastItem);
    updateContent(curPos, lastItem);
  });

  const mc = new Hammer(document.getElementById("viewport"));
  mc.get("swipe").set({ direction: Hammer.DIRECTION_VERTICAL });
  mc.on("swipeup swipedown", function (e) {
    const direction = e.type === "swipeup" ? 1 : -1;
    scrollHandler(direction);
  });

  $(document).keyup(function (e) {
    if (!$(".outer-nav").hasClass("is-vis")) {
      const keyCode = e.which;
      if (keyCode === 40 || keyCode === 38) {
        scrollHandler(keyCode === 40 ? 1 : -1);
      }
    }
  });

  function scrollHandler(direction) {
    if (canScroll) {
      canScroll = false;
      const curPos = $(".side-nav .is-active").index();
      const lastItem = $(".side-nav li").length - 1; // Dynamically calculates the last item
      const nextPos =
        direction > 0
          ? (curPos + 1) % (lastItem + 1)
          : (curPos - 1 + (lastItem + 1)) % (lastItem + 1);
      updateNavs(nextPos);
      updateContent(curPos, nextPos);
      scrollController = setTimeout(() => {
        canScroll = true;
      }, 800);
    }
  }

  function updateNavs(nextPos) {
    $(".side-nav, .outer-nav").children().removeClass("is-active");
    $(".side-nav").children().eq(nextPos).addClass("is-active");
    $(".outer-nav").children().eq(nextPos).addClass("is-active");
  }

  function updateContent(curPos, nextPos) {
    $(".main-content > .section").removeClass(
      "section--is-active section--next section--prev"
    );
    $(".main-content > .section").eq(nextPos).addClass("section--is-active");

    if (curPos < nextPos) {
      $(".main-content > .section").eq(curPos).addClass("section--next");
    } else if (curPos > nextPos) {
      $(".main-content > .section").eq(curPos).addClass("section--prev");
    }
  }

  function outerNav() {
    $(".header--nav-toggle").click(function () {
      $(".perspective").addClass("perspective--modalview");
      setTimeout(
        () => $(".perspective").addClass("effect-rotate-left--animate"),
        25
      );
      $(".outer-nav, .outer-nav li, .outer-nav--return").addClass("is-vis");
    });

    $(".outer-nav--return, .outer-nav li").click(function () {
      $(".perspective").removeClass("effect-rotate-left--animate");
      setTimeout(
        () => $(".perspective").removeClass("perspective--modalview"),
        400
      );
      $(".outer-nav, .outer-nav li, .outer-nav--return").removeClass("is-vis");
    });
  }

  function workSlider() {
    $(".slider--prev, .slider--next").click(function () {
      const isNext = $(this).hasClass("slider--next");
      const items = $(".slider > .slider--item");
      const totalItems = items.length;
      const positions = ["left", "center", "right"];
      const indices = positions.map((pos) =>
        items.index($(`.slider--item-${pos}`))
      );

      $(".slider").animate({ opacity: 0 }, 400, function () {
        indices.forEach((index, i) => {
          items.eq(index).removeClass(`slider--item-${positions[i]}`);
          const newIndex =
            (index + (isNext ? 1 : -1) + totalItems) % totalItems;
          items.eq(newIndex).addClass(`slider--item-${positions[i]}`);
        });
        $(".slider").animate({ opacity: 1 }, 400);
      });
    });
  }

  function transitionLabels() {
    $(".work-request--information input").on("focusout", function () {
      $(this).toggleClass("has-value", !!$(this).val());
      window.scrollTo(0, 0);
    });
  }

  // Initialize functions
  outerNav();
  workSlider();
  transitionLabels();
});
