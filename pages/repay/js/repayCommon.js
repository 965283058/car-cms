/**
 * Created by rrd on 2015/10/13.
 */
/*------------------------公共操作-------------------------*/
//封装图片操作
function JP_Image(img, url) {
    this._img = img;
    this._url = url;
    this._zoomW = -999;
    var img = $(this._img);
    this.Width = 0;
    this.Height = 0;
    this.ZoomStep = 10;
    (function (self) {
        var myimg = $('<img/>');
        myimg.attr("src", self._url);
        var c = $("<div style='width:0px;height:0px;overflow:hidden'></div>");
        c.appendTo(document.body);
        myimg.appendTo(c);
        myimg.load(function () {
            self.Width = myimg.width();
            self.Height = myimg.height();
            myimg.attr("src", "");
            c.remove();
        });
    })(this);

    img.attr('unselectable', 'on').css({
        width: '100%',
        cursor: 'move',
        '-moz-user-select': '-moz-none',
        '-moz-user-select': 'none',
        '-o-user-select': 'none',
        '-khtml-user-select': 'none',
        '-webkit-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none'
    }).bind('selectstart', function () {
        return false;
    });
}
JP_Image.prototype = {
    DragMoveWithScroll: function () {
        var img = $(this._img);
        img.mousedown(function (e) {
            if (e.which !== 1) return;
            var isMove = true;
            var posImg = img.offset();
            var sX = e.pageX, sY = e.pageY;
            var p = img.parent();
            var sL = p.scrollLeft(), sT = p.scrollTop();
            $(document).bind('mousemove', function (e1) {
                if (isMove == true) {
                    p.scrollLeft(sL + sX - e1.pageX);
                    p.scrollTop(sT + sY - e1.pageY);
                    return false;
                }
            });
            $(document).bind('mouseup', function (e2) {
                $(document).unbind('mousemove');
                $(document).unbind('mouseup');
                isMove = false;
                return false;
            });
            return false;
        });
    },
    DrapMove: function () {
        var img = $(this._img);
        img.attr('unselectable', 'on').css({
            'z-index': '999999',
            'top': '0px',
            'left': '0px',
            'position': 'absolute'
        });

        var img = $(this._img);
        img.mousedown(function (e) {
            if (e.which !== 1) return;
            var isMove = true;
            var posImg = img.offset();
            var sX = e.pageX, sY = e.pageY;
            var sL = img.position().left, sT = p.position().top;
            $(document).bind('mousemove', function (e1) {
                if (isMove === true) {
                    img.css({
                        left: (sL + e1.pageX - sX) + 'px',
                        top: (sT + e1.pageY - sY) + 'px'
                    });
                    return false;
                }

            });
            $(document).bind('mouseup', function (e2) {
                $(document).unbind('mouseup');
                $(document).unbind('mousemove');
                isMove = false;
            });
        });
    },
    ZoomClick: function () {
        var img = $(this._img);
        var self = this;
        img.dblclick(function (e) {
            if (self._zoomW === -999) {
                img.css({
                    width: ''
                });
                self._zoomW = -888;
            }
            else if (self._zoomW === -888) {
                img.css({
                    width: '100%'
                });
                self._zoomW = -999;
            }

        });
    },
    ZoomSize: function (size) {
        var img = $(this._img);
        if (size <= 0) {
            if (size === -888) {
                img.css({
                    width: ''
                });
                self._zoomW = size;
            }
            else if (size === -999) {
                img.css({
                    width: '100%'
                });
                self._zoomW = size;
            }
        } else {
            var width = this.Width * size * 0.01;
            img.css({
                width: width + 'px'
            });
        }
    },
    ZoomInc: function (fnZoomIncCallBack) {
        if (this.Width === 0) {
            //cannot perform this operation
            return;
        }
        var img = $(this._img);
        var cwidth = img.width();
        var w = ((((cwidth * 100 / this.Width) + this.ZoomStep) * 0.01) * this.Width);
        if (w < this.Width) {
            img.css({
                width: w + 'px'
            });
            fnZoomIncCallBack(w, this.Width);
        } else {
            img.css({
                width: ''
            });
            fnZoomIncCallBack(this.Width, this.Width);
        }
    },
    ZoomDec: function (fnZoomDecCallBack) {
        if (this.Width === 0) {
            //cannot perform this operation
            return;
        }
        var img = $(this._img);
        var cwidth = img.width();
        var w = ((((cwidth * 100 / this.Width) - this.ZoomStep) * 0.01) * this.Width);
        if (w / this.Width >= 0.1) {
            img.css({
                width: w + 'px'
            });
            fnZoomDecCallBack(w, this.Width);
        }
    }
};

//图片预览函数
function previewImgage(src, noUrl) {
    var h = $("body").height();
    h = Math.min(h, 500);
    console.info(h)
    if ($('#photo_preview_window').length) {
        $('#photo_preview_window').remove();
    }
    $('body').append('<div id="photo_preview_window" style="overflow:hidden">'
        + '<table id="photo_preview_window_table" border="0">'
        + '<tr><td style="margin:0;padding:0">'
        + '<div id="photo_preview_window_div" style="margin:0;overflow:auto;width:700px;height:' + h + 'px;border:solid 1px #95B8E7;vertical-align:middle;text-align:center">'
        + '<img src=""/><div></td></tr>'
        + '<tr><td style="height:20px;text-align:center">'
        + '<input type="button" id="photo_preview_window_btn_ckdx" value="窗口大小显示"/>&nbsp;&nbsp;'
        + '<input id="photo_preview_window_btn_sjdx" type="button" value="实际大小显示"/>&nbsp;&nbsp;'
        + '<input id="photo_preview_window_btn_fd" type="button" value="放大">&nbsp;&nbsp;'
        + '<input id="photo_preview_window_btn_sx" type="button" value="缩小">'
        + '</td></tr></table></div>');
    $('#photo_preview_window').window({
        title: '预览',
        width: 730,
        height: h,
        minimizable: false,
        collapsible: false,
        modal: true,
        onOpen: function () {
            if ($('#photo_preview_window_contextmenu').length) {
                $('#photo_preview_window_contextmenu').remove();
            }
            $("#photo_preview_window").append("<div id='photo_preview_window_contextmenu'></div>");  // 追加菜单DIV
            $('#photo_preview_window_contextmenu').menu({}); // 生成菜单
            $('#photo_preview_window_contextmenu').menu('appendItem', {   // 添加菜单项
                text: '取消预览',
                iconCls: 'icon-cancel',
                onclick: function () {
                    $('#photo_preview_window').window("destroy");
                    $('#photo_preview_window_contextmenu').menu("destroy");
                    $('#photo_preview_window_contextmenu').remove();
                }
            });

            $('#photo_preview_window_div').bind('contextmenu', function (e) {   //绑定右键菜单
                $('#photo_preview_window_contextmenu').menu('show', {
                    left: e.pageX,
                    top: e.pageY
                });
                return false;
            });
        },
        onClose: function () {
            $('#photo_preview_window img').attr('src', '');
            $('#photo_preview_window').remove();
        },
        onResize: function (w1, h1) {
            $('#photo_preview_window_table').css({
                width: (w1 - 20) + 'px',
                height: (h1 - 74) + 'px'
            });
            var div = $('#photo_preview_window_div');
            div.css({
                width: (w1 - 20) + 'px',
                height: (h1 - 74) + 'px'
            });
        }
    });
    $('#photo_preview_window img').attr('src', src + '&p=100');
    if (noUrl) {
        $('#photo_preview_window img').attr('src', src);
    }
    var img = new JP_Image($('#photo_preview_window img')[0], src);
    img.DragMoveWithScroll();

    $('#photo_preview_window_btn_ckdx').click(function () {
        img.ZoomSize(-999);
    });
    $('#photo_preview_window_btn_sjdx').click(function () {
        img.ZoomSize(-888);
    });
    $('#photo_preview_window_btn_fd').click(function () {
        var self = this;
        img.ZoomInc(function (w, aw) {
            $('#photo_preview_window_btn_sx').val('缩小');
            self.value = '放大 ' + Math.ceil((w / aw) * 100) + '%';
        });
    });
    $('#photo_preview_window_btn_sx').click(function () {
        var self = this;
        img.ZoomDec(function (w, aw) {
            $('#photo_preview_window_btn_fd').val('放大');
            self.value = '缩小 ' + Math.ceil((w / aw) * 100) + '%';
        });
    });
}

//渐缓改变颜色
function changeBGD(selecor) {
    window.clearTimeout(selecor.data("timer"));//清除以前的东西
    window.clearTimeout(selecor.data("timerTow"));
    var oldBorder = selecor.data("oldBorder");
    if (!oldBorder) {
        oldBorder = selecor.css("border");
        selecor.data("oldBorder", oldBorder);
    }
    selecor.css({
        "border": "1.5px solid #ff8080",
        "border-radius": "5px"
    })
    var nodeName = selecor[0].nodeName;
    if (nodeName == 'TEXTAREA' || (nodeName == 'INPUT' && selecor.attr("type") == "text")) {
        selecor.css({
            "box-shadow": "0px 0px 2px 2px #ff8080 inset"
        }).unbind(".validate").bind("keyup.validate", function () {
            if (selecor.val().length > 0) {
                selecor.removeClass('validate').css({"border": oldBorder, "box-shadow": ""}).unbind(".validate");
            }
        })
    }

    selecor.data("timer", setTimeout(function () {
        selecor.addClass('validate').css({"border-color": "transparent", "box-shadow": ""});
        selecor.data("timerTwo", setTimeout(function () {
            selecor.css("border", oldBorder).removeClass('validate');
        }, 2000));
    }, 2000));
}

//获取弹窗距离顶部的位置
var getTop = function () {
    var height = ((document.clientHeight || document.documentElement.clientHeight)) / 2 - 100;
    return $('body').scrollTop() + height;
}

function convertToCNDate(ms, type) {
    function _toDouble(number) {
        if (parseInt(number) < 10) {
            return '0' + number;
        }
        return number;
    }

    if (!ms) {
        return '';
    }
    var oDate = new Date();
    oDate.setTime(ms);
    type = (type || 'datetime').toLowerCase();
    switch (type) {
        case 'datetime':
            var sMonth = oDate.getMonth() + 1;
            return oDate.getFullYear() + '-' + _toDouble(sMonth) + '-' + _toDouble(oDate.getDate())
                + "  " + _toDouble(oDate.getHours()) + ":" + _toDouble(oDate.getMinutes()) + ":" + _toDouble(oDate.getSeconds());
        case 'date':
            var sMonth = oDate.getMonth() + 1;
            return oDate.getFullYear() + '-' + _toDouble(sMonth) + '-' + _toDouble(oDate.getDate());
        case 'time':
            var sMonth = oDate.getMonth() + 1;
            return _toDouble(oDate.getHours()) + ":" + _toDouble(oDate.getMinutes()) + ":" + _toDouble(oDate.getSeconds());
        default:
            return '';
    }
}

function convertToBankNo(bankNo) {
    if (bankNo) {
        var arr = bankNo.split("");
        for (var i = 0; i < arr.length; i += 5) {
            arr.splice(i, 0, " ");
        }
        arr.splice(0, 1);
        return arr.join("");
    }
    return '';
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return decodeURIComponent(r[2]);
    return null;
}

/*创建一个DIV*/
$.createOnlyDiv = function (id, parentId) {
    if ($("#" + id).length > 0) {
        $("#" + id).remove();
    }
    var parent = parentId ? $("#" + parentId) : $("body");
    parent.append('<div id="' + id + '"></div>')
    return $("#" + id);
}


//在页面显示蒙层等待效果
$.modalWait = function (options, param) {
    var modalWaitPanel = $("div.JP-modalWaitPanel");

    if (modalWaitPanel.length == 0) {
        modalWaitPanel = $("<div class='JP-modalWaitPanel' style='display:none'></div>");
        $("body").append(modalWaitPanel);
    }

    if (typeof options == 'string') {
        switch (options) {
            case 'open':
                $("div.JP-modalWaitPanel-info").remove();
                var defaults = {msg: '', src: 'image/loading.gif'}
                var params = $.extend({}, defaults, param);
                var w = $(document).width();
                var h = $(document).height();
                var background = "#fff url('" + params.src + "') no-repeat 5px center";
                var time = new Date().getTime();
                var $msg = $('<div class="JP-modalWaitPanel-info">' + params.msg + '</div>').
                    css({
                        "display": "inline-block",
                        "height": "40px",
                        "line-height": "16px",
                        "padding": "10px 5px 10px 30px",
                        "width": "auto",
                        "border": "2px solid #D4D4D4",
                        "color": "#000",
                        "font-size": "14px",
                        "position": "absolute",
                        "z-index": "100001",
                        "top": h / 2 - 40,
                        "background": background,
                        "font-size": "12px"
                    });
                modalWaitPanel.css('display', 'block').width(w).height(h).css({
                    "background-color": "#ccc",
                    "filter": "alpha(opacity=30)",
                    "-moz-opacity": "0.3",
                    "opacity": "0.3",
                    "position": "absolute",
                    "z-index": "100000",
                    "text-align": "center",
                    "padding-top": "420px",
                    "top": "0px",
                    "left": "0px"
                }).after($msg);
                return $msg.css("left", (w - $msg.outerWidth(true)) / 2);
            case 'close' :
                $("div.JP-modalWaitPanel-info").remove();
                return modalWaitPanel.css('display', 'none');
        }
    }
}


//日期选中框添加清楚按钮
$.fn.datebox.defaults.buttons = (function () {
    var buttons = $.extend([], $.fn.datebox.defaults.buttons);
    buttons.splice(0, 0, {
        text: '清空',
        handler: function (target) {
            $(target).datebox("clear");
        }
    });
    return buttons;
})();






