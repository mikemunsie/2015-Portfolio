$(function() {

  // Dats right :)
  $(".rightWidgets select").on("change", function() {
    window.location = $(this).val();
  });
  SyntaxHighlighter.highlight();

  // Quick next page functionality with right and left arrow key
  $(window).on("keydown", function(e) {
    if (e.keyCode === 39) {
      window.location = $(".nextPost .button").attr("href");
    }
    if (e.keyCode === 37) {
      if ($(".rightWidgets select option[selected]").prev("option").attr("value")) {
        window.location = $(".rightWidgets select option[selected]").prev("option").attr("value");
      }
    }
  });

  // Right widgets should stay in place as the browser moves
  $(window).on("scroll resize", function(e) {
    var t1, t2, top, width;
    var rightWidgetsXPos;
    width = $(window).width();
    t1 = $("html").scrollTop();
    t2 = $("body").scrollTop();
    if (t1 > t2) {
      top = t1;
    } else {
      top = t2;
    }
    if (top > 80 && width >= 840) {
      rightWidgetsXPos = $(".rightWidgets").offset().left;
      $(".rightWidgets").addClass("fixed");
      $(".rightWidgets").css({
        left: rightWidgetsXPos
      });

    } else {
      $(".rightWidgets").removeClass("fixed");
      $(".rightWidgets").css({
        left: "auto"
      });
    }
  });

});