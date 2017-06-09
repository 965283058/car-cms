var treeData = [
    {
        code: "auth_manager",
        text: "用户管理",
        iconCls: "navTree_usr_search",
        href: "user/list.html"
    },
    {
        code: "message_manager",
        text: "信息管理",
        iconCls: "navTree_message_manager",
        href: "message/list.html"
    },
    {
        code: "auth_manager",
        text: "客户端管理",
        iconCls: "navTree_charge_client_manager",
        href: "client/list.html"
    },
    {
        code: "auth_manager",
        text: "后台管理权限",
        iconCls: "navTree_auth_manager",
        href: "authority/master_list.html"
    },
  /*  {
        code: "charge_repayment",
        text: "充值还款管理",
        iconCls: "navTree_charge_repayment",
        state: 'closed',
        children: [{
            code: "charge_repayment_tryCalc",
            text: "还款试算",
            href: "repay/repayCompute.html",
        } ]
    },*/

];

function resetTree() {
    var arrCode = [];
    var userData = common.getUserData();
    var isAdmin = userData.isAdmin;
    var isSupperAdmin = userData.isSupperAdmin;
    if (isAdmin || isSupperAdmin) {
        return;
    }
    var authList = userData.auth;
    for (var i = 0; i < authList.length; i++) {
        arrCode.push(authList[i].code);
    }
    for (var i = 0; i < treeData.length; i++) {
        var code = treeData[i].code;
        if (arrCode.indexOf(code) == -1) {
            treeData.splice(i, 1);
            i--;
        } else {
            if (treeData[i].children && treeData[i].children.length) {
                for (var j = 0; j < treeData[i].children.length; j++) {
                    if (arrCode.indexOf(treeData[i].children[j].code) == -1) {
                        treeData[i].children.splice(j, 1);
                        if (treeData[i].children && treeData[i].children.length == 0) {
                            delete treeData[i].children;
                            break;
                        }
                        j--;
                    }
                }
            }
        }
    }
}

$(function () {
  //  resetTree();
    $('#navTree').tree({
        data: treeData,
        animate: true,
        onClick: function (node) {
            if (node.target.childNodes[0].className.indexOf('tree-expanded') > -1) {
                $('#navTree').tree('collapse', node.target);
            } else {
                $('#navTree').tree('expand', node.target);
            }
            var tt = $('#main-center');
            if (tt.tabs('exists', node.text)) {
                tt.tabs('select', node.text);
                return;
            }
            var url = node.href;
            if (url) {
                var iHeight = (tt.height() - 40) + 'px';
                var content = '<iframe scrolling="auto" frameborder="0"  src="' + url + '" style="width:100%;height:' + iHeight + ';" ></iframe>';
            } else {
                return;
            }
            tt.tabs('add', {
                title: node.text,
                closable: true,
                content: content
            });


        },
        onLoadSuccess: function (node, data) {
            var rootsData = $(this).tree("getRoots");
            for (var k in rootsData) {
                $(rootsData[k].target).addClass(rootsData[k].iconCls);
            }
        }
    });
});

$(window).resize(function () {
    var tt = $('#main-center');
    var iHeight = (tt.height() - 30) + 'px';
    $('.panel-body>iframe').css("height",iHeight)
})





