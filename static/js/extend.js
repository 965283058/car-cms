$.extend($.fn.datagrid.defaults, {
    loader: function (param, gridSuccess, error) {
        param.pageNum = param.page;
        param.pageSize = param.rows;
        delete  param.page;
        delete  param.rows;
        var that = $(this);
        var opts = that.datagrid("options");
        if (!opts.url) {
            return false;
        }
        common.ajax({
            type: opts.method,
            url: opts.url,
            data: param,
            dataType: "json",
            succ: function (data) {
                gridSuccess(data);
            },
            fail: function (res) {
                $.messager.alert('警告', res.message + "\n错误：" + res.status);
                gridSuccess([])
            },
            error: function () {
                $.messager.alert('警告', "请检查网络");
                gridSuccess([])
            }
        });
    },
    loadFilter: function (resText) {
        if(typeof resText=="string"){
            resText=JSON.parse(resText)
        }
        var options = $(this).datagrid("options");
        if (!options.url) {
            if (typeof resText.length == "number" && typeof resText.splice == "function") {
                return {total: resText.length, rows: resText};
            } else {
                return resText;
            }
        }

        if (typeof resText === 'object' && resText.data) {
            var _data = {};
            if (options.pagination) {
                if (resText.data.pageInfo && resText.data.pageInfo.pageNum) {
                    _data.page = resText.data.pageInfo.pageNum;
                }
                if (resText.data.total || resText.data.total === 0) {
                    _data.total = resText.data.total;
                }
                if (!_data.total) {
                    if (resText.data.pageInfo && resText.data.pageInfo.totalElements) {
                        _data.total = resText.data.pageInfo.totalElements;
                    }
                }
            }
            if (typeof resText.data === 'object') {
                _data.rows = resText.data;
                for (var i = 0; i < _data.rows.length; i++) {
                    _data.rows[i].number = i + 1;
                }
            }
            return _data;
        } else {
            if (options.pagination) {
                var total = $(this).datagrid("getPager").pagination("options").total;
                return {"page": options.pageNumber, "total": total, "rows": []}
            }
            return [];
        }
    },
    onLoadSuccess: function (data) {
        var emptyMessage = $(this).datagrid('options').emptyMessage;
        if (emptyMessage) {
            var body = $(this).datagrid("getPanel").find('.datagrid-body');
            body.find('div[dataGridEmpty]').remove();
            if (data.rows.length == 0) {
                var height = Math.max(body.height() - 50, 150);
                body.append('<div dataGridEmpty="true" style="text-align: center;font-size: 14px;color: #a4aeb9;line-height:' + height + 'px">' + emptyMessage + '</div>')
            }
            $(this).datagrid("resize");
        }
        var loadSuccessAfter = $(this).datagrid('options').onLoadSuccessAfter;
        if (typeof loadSuccessAfter == "function") {
            loadSuccessAfter.call(this, data);
        }
    }
})

$.extend($.fn.pagination.defaults, {
    layout: ['first', 'prev', 'sep', 'manual', 'sep', 'next', 'last', 'refresh', 'list'],
    displayMsg: '当前显示从{from}到{to}，共{total}条记录',
})

$.fn.datebox.defaults.buttons = (function () {
    var buttons = $.extend([], $.fn.datebox.defaults.buttons);
    buttons.splice(0, 0, {
        text: '清空',
        handler: function (target) {
            $(target).datebox("clear");
        }
    });
    return buttons;
})()

$.extend($.fn.tabs.methods, {
    setTitleTip: function (jq, params) {
        return jq.each(function () {
            if (typeof params.which == "string") {
                var tabArray = $(this).tabs("tabs");
                for (var i = 0; i < tabArray.length; i++) {
                    if ($(tabArray[i]).panel("options").title == params.which) {
                        params.which = i;
                        break;
                    }
                }
            }
            var parent = $(this).find(".tabs-wrap ul.tabs li a").eq(params.which);
            parent.find(".tabs-tip").remove();
            if (typeof params.number != 'undefined' && params.number != null) {
                params.number = params.number > 99 ? "99+" : params.number;
                var tip = $("<span class='tabs-tip'>" + params.number + "</span>");
                parent.append(tip);
                if (params.number < 100) {
                    tip.width(12).height(12);
                } else {
                    tip.width(15).height(15).css("line-height", "15px");
                }
            }
        });
    }
});


$.extend($.fn.numberbox.methods, {
    focus: function (jq, params) {
        return jq.each(function () {
          console.info(this)


        });
    }
});

$.messager.clear = function (type) {
    switch (type) {
        case"alert":
            return $(".panel.window.messager-window").find("a.l-btn").click();
        case"confirm":
            return $(".panel.window.messager-window").find("a.l-btn").last().click();
        default :
            return $(".panel.window.messager-window").find("a.l-btn").last().click();
    }
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

$.converToCNDate = function (ms, format) {
    if (!ms && ms !== 0) {
        return '';
    }
    var date = new Date();
    date.setTime(ms);
    var year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hh = date.getHours(),
        mm = date.getMinutes(),
        ss = date.getSeconds();

    format = format || "datetime";
    switch (format) {
        case "datetime":
            return year + "-" + padLeft(month) + "-" + padLeft(day) + " " + padLeft(hh) + ":" + padLeft(mm) + ":" + padLeft(ss);
        case "date":
            return year + "-" + padLeft(month) + "-" + padLeft(day);
        case "time":
            return padLeft(hh) + ":" + padLeft(mm) + ":" + padLeft(ss);
        default :
            return "";
    }

    function padLeft(number) {
        if (parseInt(number) < 10) {
            return '0' + number;
        }
        return number;
    }
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
                var defaults = {msg: '', src: ''}
                var params = $.extend({}, defaults, param);
                var w = $(document).width();
                var h = $(document).height();
                var background = '';
                if (params.src) {
                    var background = "#fff url('" + params.src + "') no-repeat 5px center";
                }
                var time = new Date().getTime();

                var $msg = $('<div class="JP-modalWaitPanel-info">' + params.msg + '</div>').
                    css({
                        "display": "inline-block",
                        "line-height": "16px",
                        "padding": "10px 5px 10px 30px",
                        "width": "auto",
                        "border": "2px solid #D4D4D4",
                        "color": "#000",
                        "font-size": "14px",
                        "position": "absolute",
                        "z-index": "100001",
                        "top": $("body").scrollTop() + $(window).height() / 2,
                        "background": background,
                        "font-size": "12px"
                    })
                if (!params.src) {
                    $msg.addClass("hk-modalWait");
                }
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

$.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]);
    return null;
}

//序列化为json
$.fn.serializeJson = function () {
    var serializeObj = {};
    var array = this.serializeArray();
    var str = this.serialize();
    $(array).each(function () {
        if (serializeObj[this.name]) {
            if ($.isArray(serializeObj[this.name])) {
                serializeObj[this.name].push(this.value);
            } else {
                serializeObj[this.name] = [serializeObj[this.name], this.value];
            }
        } else {
            serializeObj[this.name] = this.value;
        }
    });
    return serializeObj;
};