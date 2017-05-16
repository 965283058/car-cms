var playMoneyTpl = '<div class="moneyWarp">' +
    '<span class="caption">申请还款总额：</span><span class="money">${repayAmount}</span>' +
    '<span class="caption">当前应还总额：</span><span class="money">${repayAmountNow}</span></div>' +
    '<div class="dgWarp" id="palyMoneyWarp"><div class="dgTitle">打款信息</div><div class="playMoney">' +
    '<ul class="grid">' +
    '<li class="caption">昵称：</li>' +
    '<li><input type="text" class="disabledText" readonly="readonly" value="${nickName}"/></li>' +
    '<li class="caption">身份证号码：</li>' +
    '<li><input type="text" class="disabledText" readonly="readonly" value="${idcardNo}"/></li>' +
    '<li class="caption">手机号码：</li>' +
    '<li><input type="text" class="disabledText" readonly="readonly" value="${mobile}"/></li>' +
    '</ul>' +
    '<ul class="grid">' +
    '<li class="caption">银行卡号：</li>' +
    '<li><input type="text" class="disabledText" readonly="readonly" value="${chargeCardNum}"/></li>' +
    '<li class="caption">打款金额：</li>' +
    '<li><input type="text" class="disabledText" readonly="readonly" value="${chargeAmount}" style="text-align: right"/></li>' +
    '<li class="caption">打款人姓名：</li>' +
    '<li><input type="text" class="disabledText" readonly="readonly" value="${chargerName}"/></li>' +
    '</ul>' +
    '<ul class="grid">' +
    '<li class="caption">打款日期：</li>' +
    '<li><input type="text" class="disabledText" readonly="readonly"  value="${chargeTime}"/></li>' +
    '<li class="caption">凭证：</li>' +
    '<li><a class="easyui-linkbutton" data-options="iconCls:\'icon-see\',disabled:${!materialUrl}" id="btnPreview" url="${materialUrl}">预览凭证</a></li>' +
    '</ul>' +
    '<table>' +
    '<tr>' +
    '<td class="caption" style="width: 80px;text-align: right;vertical-align: bottom;padding-bottom: 5px;">交易摘要：</td>' +
    '<td><textarea rows="2"  class="disabledText" readonly="readonly">${comment}</textarea></td>' +
    '</tr>' +
    '</table>' +
    '</div></div>';

function billLog(selector, data) {
    $(selector).datagrid({
        rownumbers: false,
        data: data,
        columns: [[
            {
                field: 'billType',
                title: '账单类型',
                width: '25%',
                align: 'center'
            },
            {
                field: 'billMonth',
                title: '账单月份',
                width: '25%',
                align: 'center'
            },
            {
                field: 'dueDate',
                title: '到期还款日',
                width: '25%',
                align: 'center',
                formatter: function (value, row, index) {
                    return convertToCNDate(value, "date");
                }
            },
            {
                field: 'billAmount',
                title: '应还总额',
                width: '26%',
                halign: 'center',
                align: 'right',
                formatter: function (value, row, index) {
                    return (parseFloat(value) || 0).toFixed(2);
                }
            },
        ]],
    })
}

function installment(selector, data) {
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].instalment.length; j++) {
            data[i].instalment[j].number = j + 1;
        }
    }
    $(selector).datagrid({
        rownumbers: false,
        columns: [[
            {
                field: 'loanId',
                title: '借款编号',
                width: '24%',
                align: 'center'
            },
            {
                field: 'loanCreateTime',
                title: '借款时间',
                width: '25%',
                align: 'center',
                formatter: function (value, row, index) {
                    return convertToCNDate(value, "date");
                }
            },
            {
                field: 'repayCnt',
                title: '还款笔数',
                width: '25%',
                align: 'center',
            },
            {
                field: 'billNeedAmount',
                title: '当前应还总额',
                width: '25%',
                halign: 'center',
                align: 'right',
                formatter: function (value, row, index) {
                    return (parseFloat(value) || 0).toFixed(2);
                }
            },

        ]],
        view: detailview,
        data: data,
        detailFormatter: function (rowIndex, rowData) {
            return '<div style="padding: 15px 30px"><div id="installmentDetail_' + rowIndex + '"></div></div>';
        },
        onExpandRow: function (index, row) {
            var selector = $("#installmentDetail_" + index);
            if (selector.css("dispaly") != 'none') {
                selector.datagrid({
                    rownumbers: false,
                    data: row.instalment,
                    width: 522,
                    columns: [[
                        {
                            field: 'number',
                            title: '序号',
                            width: '40',
                            align: 'center'
                        },
                        {
                            field: 'installmentKey',
                            title: '分期key',
                            hidden: true
                        },
                        {
                            field: 'instalmentDueDate',
                            title: '还款日',
                            width: '160',
                            align: 'center',
                            formatter: function (value, row, index) {
                                return convertToCNDate(value, "date");
                            }
                        },
                        {
                            field: 'inatalmentAmount',
                            title: '当前应还金额',
                            width: '160',
                            halign: 'center',
                            align: 'right',
                            formatter: function (value, row, index) {
                                return (parseFloat(value) || 0).toFixed(2);
                            }
                        },
                        {
                            field: 'instalmentStatus',
                            title: '状态',
                            width: '160',
                            align: 'center'
                        },
                    ]],
                });
                $(this).datagrid("fixDetailRowHeight", index);
            }
        },
        onLoadSuccess: function (data) {
            for (var key in data.rows) {
                $(this).datagrid("expandRow", key);
            }
            $(this).datagrid("resize");
        },
    })
}


function VerifyLog(selector, key) {
    $(selector).datagrid({
            rownumbers: false,
            nowrap: false,
            columns: [[
                {
                    field: 'number',
                    title: '序号',
                    width: '4%',
                    align: 'center'
                },
                {
                    field: 'taskName',
                    title: '任务名称',
                    width: '15%',
                    align: 'center'
                },
                {
                    field: 'verifyer',
                    title: '处理人',
                    width: '15%',
                    align: 'center'
                },
                {
                    field: 'dealTime',
                    title: '处理时间',
                    width: '15%',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return convertToCNDate(value);
                    }
                },
                {
                    field: 'result',
                    title: '审批结果',
                    width: '15%',
                    align: 'center'
                },
                {
                    field: 'rejectReason',
                    title: '驳回原因',
                    width: '37%',
                    halign: 'center',
                    align: 'left'
                },
            ]],
        }
    )
    common.ajax({
        url: "/chargeRepayment/getLog",
        type: "post",
        data: {"businessKey": key},
        succ: function (res) {
            if (res.data.rows && res.data.rows.length > 0) {
                for (var i = 0; i < res.data.rows.length; i++) {
                    res.data.rows[i].number = i + 1;
                }
                $(selector).datagrid("loadData", res.data.rows)
            }
        }
    })

}

//获取驳回原因
function getRejectReason(type) {
    type = type || 1;
    common.ajax({
        url: '/chargeRepayment/getRejectReason?type=' + type,
        type: "get",
        succ: function (res) {
            var sel = $("form.performOperation select[name=reason]")[0];
            sel.options.length = 0;
            sel.options.add(new Option("请选择", ""));
            for (var i = 0; i < res.data.rows.length; i++) {
                var opt = new Option(res.data.rows[i].rejectReason, res.data.rows[i].rejectReasonCode);
                opt.setAttribute("isNeedRemark", res.data.rows[i].isNeedRemark);
                sel.options.add(opt);
            }
        }
    });
}

$(function () {
    $("form.performOperation li:gt(2)").hide();
    $("form.performOperation input[type=radio]").click(function () {
        if ($(this).attr("index") == "1") {
            if ($("form.performOperation li:hidden").length > 0) {
                $("form.performOperation li:gt(2)").show();
                $("form.performOperation select").val('');
            }
        } else {
            $("form.performOperation li:gt(2)").hide();
            $("form.performOperation ul:eq(1)").hide().find("textarea").val("");
        }
    })
    $("form.performOperation ul:eq(1)").hide();
    $("form.performOperation select[name=reason]").change(function () {
        if (this.options[this.selectedIndex].getAttribute("isNeedRemark") == "1") {
            $("form.performOperation ul:eq(1)").show();
        } else {
            $("form.performOperation ul:eq(1)").hide().find("textarea").val("");
        }
    })

    $("body").on("click", "#btnPreview", function () {
        var url = $(this).attr("url");
        if (url) {
            previewImgage("/chargeRepayment/viewMaterial?path=" + url);
        }
    })
})