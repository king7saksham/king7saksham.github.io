$(function () {
    let $park = $("#park");

    $("#map").children().each(function () {
        $(this).click(function () {
            $park.removeClass();
            $park.addClass($(this).get(0).id + "-image");
        });
    });
});