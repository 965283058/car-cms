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
                $.messager.alert("警告", "请检查网络");
                gridSuccess([])
            }
        });
    },
    loadFilter: function (resText) {
        var options = $(this).datagrid("options");
        if (!options.url) {
            if (typeof resText.length == "number" && typeof resText.splice == "function") {
                return {total: resText.length, rows: resText};
            } else {
                return resText;
            }
        }
        if (typeof resText === 'object' && resText.data && resText.status === 0) {
            var _data = {};
            if (options.pagination) {
                if (resText.data.pageInfo && resText.data.pageInfo.pageNum) {
                    _data.page = resText.data.pageInfo.pageNum;
                }
                if (resText.data.total || resText.data.total === 0) {
                    _data.total = resText.data.total;
                }
            }
            if (typeof resText.data.rows === 'object') {
                _data.rows = resText.data.rows;
                for (var i = 0; i < _data.rows.length; i++) {
                    _data.rows[i].number = i + 1;
                }
            }
            return _data;
        } else {
            if (options.pagination) {
               // var total = $(this).datagrid("getPager").pagination("options").total;
                return {"page": options.pageNumber, "total": 0, "rows": []}
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
    }
})

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