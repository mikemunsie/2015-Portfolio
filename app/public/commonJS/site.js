$(function() {

  // Dats right :)
  $(".rightWidgets select").on("change", function() {
    window.location = $(this).val();
  });
  SyntaxHighlighter.highlight();

  $(".rightWidgets select option[value='" + location.pathname + "']").attr("selected", true);

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

  // If there's an image in the content, let's use it and make it the bg!
  var entryImages = $(".entry img.feature-image");
  if (entryImages.length > 0) {
    $(".hero .bg").css("background-image", "url('" + entryImages.first().attr("src") + "')")
  }

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