/**
 * Created by liucc on 2015/6/17.
 */

var Auth = (function (api,common) {
    api.PAGENUMBER = 1;
    api.PAGESIZE = 50;
    /*
     * 删除用户
     * @param userId {number}
     *
     * */
    var deleteUser = function (userId) {

        jQuery.messager.confirm('提示:', '确定要删除此用户吗?', function (event) {
            if (event) {
                console.log('你点击的是' + event);
                common.ajax({
                    url: "/authority/usr/delete",
                    type: "post",
                    data: {userId: userId},
                    succ: function () {
                        $.messager.alert('警告','删除成功');
                        loadMasterList();
                    },
                    fail: function (res) {
                        console.log(res);
                        $.messager.alert('警告',res.message);
                    }
                })
            } else {
                console.log("你点击的是false");
            }
        });
    };


    /*
     * 设置活取消管理员
     * @param userId {number} 用户id
     * @param perm {string} YES 或者 NO; 设置或取消
     *
     * */
    var setadmin = function (userId, perm) {
        common.ajax({
            url: "/authority/usr/setadmin",
            type: "post",
            data: {userId: userId, perm: perm},
            succ: function (res) {
                if (perm.toLowerCase() === "yes") {
                    $.messager.alert('警告',"设置管理员成功");
                } else {
                    $.messager.alert('警告',"取消管理员成功");
                }
                loadMasterList();
            },
            fail: function (res) {
                $.messager.alert('警告',res.message);
            }
        })
    };
    /*
     * 弹出添加用户的框框
     * */
    var showAddUser = function () {
        $("#realName").val("");
        $("#userEmail").val("");
        $('#dd-addUser').dialog('open');
    };

    /*
     * 添加用按钮按下后处理
     *
     * */
    var addUserDone = function () {
        var email = $("#userEmail").val();
        var realName=$("#realName").val();
        if(!email || !realName){
            $.messager.$.messager.alert('警告','警告','请输入完整信息');
            return;
        }

        common.ajax({
            url: "/authority/usr/add",
            type: "post",
            data: {email: email, realName: realName},
            succ: function (res) {
                console.log(res);
                var password = res.data.passwd;
                var content = "<p class='addUserDone'>" +
                    "添加账户 " + email + " 成功 <br>" +
                    "密码：" + password +
                    "</p>";
                $("#dd-addUserDone").html(content);
                $("#userEmail").val("");
                $("#realName").val("");
                $("#dd-addUserDone").dialog("open");
                $('#dd-addUser').dialog('close');
                loadMasterList()

            },
            fail: function (res) {
                $.messager.alert('警告',res.message)
            }
        });
    };
    /*
     * 初始化页面
     *
     * */
    var initMalsterList = function () {
        $('#dd-addUser').dialog('close');
        $("#dd-addUserDone").dialog("close");
        var userData=common.getUserData();

        var isPowerful= userData.isAdmin || userData.isSupperAdmin ;
        if(isPowerful){
            $('#btn-adduser').show();
        }else{
            $('#btn-adduser').hide();
        }
        $('#btn-adduser').click(showAddUser);
        $("#addUserDoneBtn").click(addUserDone);
        $('#master_list').datagrid({
            title: '管理员列表',
            striped: true,//是否显示斑马线效果。
            singleSelect: true,
            showFooter: false,//是否显示行脚。
            width: 'auto',
            method: 'get',
            rownumbers: true,
            pageSize: api.PAGESIZE,//设置分页属性的时候初始化页面大小。
            pagination: true,
            filterBtnIconCls: 'icon-filter',
            remoteSort: false,//定义从服务器对数据进行排序。
            columns: [[
                {field: 'email', title: '邮箱', align: 'center', width: "25%"},
                {
                    field: 'createTime',
                    title: '添加时间',
                    align: 'center',
                    width: '15%',
                    formatter: function (value, row, index) {
                        return common.formatTime(value);
                    }
                },
                {field: 'loginTimes', title: '登录次数', align: 'center', width: '15%'},
                {
                    field: 'lastLoginTime',
                    title: '最后一次登录时间',
                    align: 'center',
                    width: "15%",
                    formatter: function (value, row, index) {
                        return common.formatTime(value);
                    }
                },
                {
                    field: 'action', title: '操作', align: 'right', width: "29%",
                    formatter: function (value, row, index) {

                        var col1;
                        var col2;
                        var col3;
                        var setadminStr = row.isAdmin ? "取消管理员" : "设为管理员";

                        if(row.isAdmin){
                            col1="";
                        }else{
                            col1 = '<a  href="authority_set.html?userId=' + row.id + '&email=' + row.email + '" class="easyui-linkbutton newButtonUi action">权限管理</a>';
                        }
                        col2 = '<a href="javascript:;" data-userid="' + row.id + '" class="easyui-linkbutton newButtonUi action doDelete"> 删除</a>';
                        var userData=common.getUserData();
                        if(userData.isSupperAdmin){
                            col3 = '<a href="javascript:;" data-userid="' + row.id + '" data-isadmin="' + row.isAdmin + '" class="easyui-linkbutton newButtonUi action doSetadmin">' + setadminStr + '</a>';
                        }else{
                            col3="";
                        }


                        return col1 + col2 + col3;
                    }
                }
            ]],
            onLoadSuccess: function () {

                $('#master_list').datagrid('loaded');
				/*
				 *删除用户
				 *
				 * */
                $('.doDelete').click(function () {
                    var userId = $(this).data('userid');
                    deleteUser(userId);
                });
                /*

                 * 点击设置管理员
                 * */
                $('.doSetadmin').click(function () {
                    var userId = $(this).data('userid');
                    var isAdmin = $(this).data('isadmin');
                    isAdmin = parseInt(isAdmin);
                    var perm = isAdmin ? "No" : "YES";
                    var confirmText = isAdmin ? "确定将此用户取消管理员吗？" : "确定将此用户设为管理员吗？";


                    jQuery.messager.confirm('提示:',confirmText, function (event) {
                        if (event) {
                            console.log('你点击的是' + event);
                            setadmin(userId, perm);
                        } else {
                            console.log("");
                        }
                    });
                });

                /*
                 *分页
                 *
                 * */

                $('#master_list').datagrid('getPager').pagination({
                    displayMsg: '当前显示从{from}到{to}共{total}记录',
                    pageList: [10, 20, 50, 100, 200],//可以设置每页记录条数的列表
                    onSelectPage: function (pageNumber, pageSize) {
                        api.PAGENUMBER = pageNumber.toString();
                        api.PAGESIZE = pageSize.toString();
                        loadMasterList(api.PAGENUMBER,api.PAGESIZE);
                    }
                });

            }
        });
    };
    /*
     *
     * 加载用户列表数据并渲染页面
     * */
    var loadMasterList = function (pageNum,pageSize,email) {
        var pageNum=pageNum || api.PAGENUMBER;
        var pageSize=pageSize || api.PAGESIZE;
        var email=email ;

        common.ajax({
            url: "/authority/usr/list",
            type: "get",
            data:{pageNum:pageNum,pageSize:pageSize,email:email},
            succ: function (res) {
                if (res.data.total < 1) {
                    $.messager.alert('提示','暂无数据');
                    return;
                }else{
                    $('#master_list').datagrid('loadData', res.data);
                }
            }
        });
    };
    api.loadMasterList=loadMasterList;
    api.initMalsterList=initMalsterList;


    return api;
})(Auth || (Auth={}),common);