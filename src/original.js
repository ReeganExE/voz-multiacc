/*
	Replace \ -> \\
	Replace " -> \"
	Use: con = "xxx"
*/
// https://www.freeformatter.com/javascript-escape.html

Xem.url = (function() {
	var a = /(\/(new|vote|hot|old|unread))\/?\d*/, m = location.pathname.match(a);
	if (m) {
		return location.origin + m[1] + '/';
	}
	return "https://xem.vn/new/";
})();
Xem.ListPhoto = Xem.ListPhoto || {};


Xem.ListPhoto.loadMore = function () {
    if ($(window).scrollTop() + $(window).height() >= $(document).height() - 300) {
        if (Xem.ListPhoto.isLoading)
            return;


        if (Xem.ListPhoto.hasNoMore) {
			$(".photoListItem.old").remove();
            history.pushState({}, document.title, Xem.url + (Xem.ListPhoto.page + 1));
            Xem.ListPhoto.hasNoMore = false;
            Xem.ListPhoto.initPage = Xem.ListPhoto.page;
		}

        Xem.ListPhoto.isLoading = true;
        $(".loading").first().show();
        $.ajax({
            url: Xem.ListPhoto.sort == "vote" ||  Xem.ListPhoto.sort == "uncensored" ? "/photos/listvotemore?page=" + (Xem.ListPhoto.page + 1) + "&sort=" + Xem.ListPhoto.voteSort
                : "/photos/more?sort=" + Xem.ListPhoto.sort + "&page=" + (Xem.ListPhoto.page + 1),
            dataType: "html",
            success: function (data) {
                if (data == "Unauthenticated") {
                    $(".notLogin").show();
                }
                else if (data == "No more") {
                    Xem.ListPhoto.hasNoMore = true;
				}
                else {
                    var ads = "";

                    var dataJ = $("<div>" + data + "</div>");
                    $(".photoListItem", dataJ).each(function () {
                        if ($(this).data("ads") == true) {
                            console.log($(this));
                            return;
                        }
                        if ($(".photoListItem[data-id=" + $(this).attr("data-id") + "]").size() > 0) {
                            console.log("removed");
                            $(this).remove();
                        } else if (Xem.ListPhoto.sort != "vote") {
                            var src = $(".thumbnail img.thumbImg", $(this)).attr("data-src");
                            if (src) {
                                if ($(this).data("nsfw") != "True")
                                    src = src.replace(/\!/g, '9').replace(/\@/g, '1').replace(/\#/g, '6');
                                $(".thumbnail img.thumbImg", $(this)).attr("src", src);
                            }
                        }
                    });
                    $('.photoListItem').addClass('old');
                    $("#listEnd").before(ads + dataJ.html());

                    $(".dfpUnitNew").each(function () {
                        var id = $(this).attr("id");
                        $(this).removeClass("dfpUnitNew");
                        googletag.cmd.push(function () {
                            googletag.pubads().enableAsyncRendering();
                            googletag.enableServices();
                            googletag.display(id);
                        });
                    });

                    try {
                        FB.XFBML.parse();
                    } catch (e) { }

                    Xem.ListPhoto.page++;
                    if (Xem.ListPhoto.page - Xem.ListPhoto.initPage == 2) {
                        Xem.ListPhoto.hasNoMore = true;
                        // $(".nextListPage").show();
                    }
                }
            },
            error: function () {
            },
            complete: function () {
                Xem.ListPhoto.isLoading = false;
                $(".loading").hide();
            }
        });
    }
};


// Xem.ListPhoto.loadMore = function() {
//     if ($(window).scrollTop() + $(window).height() >= $(document).height() - 300) {
//         if (Xem.ListPhoto.isLoading)
//             return;
//         Xem.ListPhoto.isLoading = true;
// 		if (Xem.ListPhoto.hasNoMore) {
// 			$(".photoListItem.old").remove();
// 			history.pushState({}, document.title, Xem.url + (Xem.ListPhoto.page + 1));
// 		}
//         $(".loading").show();
//         $.ajax({url: Xem.ListPhoto.sort == "vote" ? "/photos/listvotemore?page=" + (Xem.ListPhoto.page + 1) + "&sort=" + Xem.ListPhoto.voteSort : "/photos/more?sort=" + Xem.ListPhoto.sort + "&page=" + (Xem.ListPhoto.page + 1),dataType: "html",
//         success: function(data) {
//                 if (1 === 2)
//                     Xem.ListPhoto.hasNoMore = true;
//                 else {
//                     var ads = "";
//                     var dataJ = $("<div>" + data + "</div>");
//                     $(".photoListItem", dataJ).each(function () {
//                         if ($(this).data("ads") == true) {
//                             console.log($(this));
//                             return;
//                         }
//                         if ($(".photoListItem[data-id=" + $(this).attr("data-id") + "]").size() > 0) {
//                             console.log("removed");
//                             $(this).remove();
//                         } else if (Xem.ListPhoto.sort != "vote") {
//                             var src = $(".thumbnail img.thumbImg", $(this)).attr("data-src");
//                             if (src) {
//                                 if ($(this).data("nsfw") != "True")
//                                     src = src.replace(/\!/g, '9').replace(/\@/g, '1').replace(/\#/g, '6');
//                                 $(".thumbnail img.thumbImg", $(this)).attr("src", src);
//                             }
//                         }
//                     });
// 					// addFavoriteBtn(c);
//                     Xem.ListPhoto.page++;
// 					if (Xem.ListPhoto.hasNoMore = (Xem.ListPhoto.page - Xem.ListPhoto.initPage) == 2) {
// 						Xem.ListPhoto.initPage = Xem.ListPhoto.page;
// 					}
// 					$(".photoListItem").addClass("old");
//                     $("#listEnd").before(dataJ.html());

// 					// scrollTo(0, $(".photoListItem:first").offset().top - 60);
//                     $(".dfpUnitNew").each(function () {
//                         var id = $(this).attr("id");
//                         $(this).removeClass("dfpUnitNew");
//                         googletag.cmd.push(function () {
//                         googletag.pubads().enableAsyncRendering();
//                         googletag.enableServices();
//                         googletag.display(id);
//                         });
//                     });

//                     try {
//                         FB.XFBML.parse()
//                     } catch (e) {
//                     }
//                 }
//             },error: function() {
//             },complete: function() {
//                 Xem.ListPhoto.isLoading = false;
//                 $(".loading").hide()
//             }})
//     }
// };


Xem.Unread.loadSinglePage = function() {
    Xem.Unread.isLoading = true;
    $(".loading").show();
	$(".photoListItem.old").remove();
    $.ajax({url: "/photos/listunreadajax",dataType: "html",type: "POST",data: {excludePhotoIds: Xem.Unread.getJustReadPhotoIds()},success: function(a) {
            if (a == "No more") {
                Xem.Unread.hasNoMore = true;
                $(".noUnread").show();
            } else {
				$(".photoListItem").addClass('old');
                var b = $("<div>" + a + "</div>");
                $(".photoListItem", b).each(function() {
                    if ($(".photoListItem[data-id=" + $(this).attr("data-id") + "]").size() > 0) {
                        $(this).remove();
                    }
                });
				addFavoriteBtn(b);
                $("#listEnd").before(b.html());
                Xem.Unread.page++;
            }
        },error: function() {
        },complete: function() {
            Xem.Unread.isLoading = false;
            $(".loading").hide()
        }})
};

$('.photoList').bind('click', function (e) {
	var a = $(e.target);
	var d = a.is('span') && a.hasClass('fav');
	if (a.is('a') && a.hasClass('favorite') || d) {
		if (d) {
			a = a.parent();
		}
		var b = a.find('.fav');
		var c = b.hasClass('active');
		var id = a.parent().closest('.photoListItem').attr('data-id');
		$.post('/photos/favor', {
			photoId : id,
			remove : c
		});
		b.toggleClass('active')
	}
});

function addFavoriteBtn(target) {
	var fav = '<a title="Yêu cmn thích" class="favorite" data-action="favor" style="margin-left: 8px; "><span class="fav"></span></a>';
	$('.likesWrapper', target).append(fav);
}

addFavoriteBtn(document);
