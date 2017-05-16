var AuthSet = (function (api,common) {
    var params=common.url2json();
    var userId = params.userId;
    var userEmail=params.email;

    /*
     * 渲染列表
     * */

    var renderSmallList=function(obj,bigWrap){
        if (obj.children && obj.children.length) {
            var smallWap = $('<div class="authority_list"></div>');
            $.each(obj.children, function (indexJ, smallItem) {
                var ischecked=(smallItem.checked=="1") ? true : false;
                var labelTemp = '<label class="checkbox-inline">' +
                    '<input type="checkbox" data-id="' + smallItem.id + '" value="option1"> ' + smallItem.displayName +
                    '</label>';
                var smallLabel=$(labelTemp);
                smallWap.append(smallLabel);
                var theCheckbox = smallLabel.children().get(0);
                theCheckbox.checked=ischecked;
                renderSmallList(smallItem,smallWap);
            });
            bigWrap.append(smallWap);
        }
    };
    var renderList = function (authList,selector) {
        $.each(authList, function (index, item) {
            var ischecked=(item.checked=="1") ? true : false;
            var divTemp = '<div class="authority_list"><label class="checkbox-inline">' +
                '<input type="checkbox" data-id="' + item.id + '" value="option1"> ' + item.displayName +
                '</label></div>';
            var bigWrap = $(divTemp);
            var bigLabel = bigWrap.children('label');
            var theCheckbox = bigLabel.children().get(0);
            theCheckbox.checked=ischecked;
            bigLabel.on('click', function () {
                bigWrap.find('div input').each(function () {
                    this.checked = theCheckbox.checked;
                })
            });
            $(selector).append(bigWrap);
            renderSmallList(item,bigWrap);
        })
    };



    /*
     * 获取列表数据并渲染
     * */
    var getAuthList = function (url,selector) {
        $(selector).html("");
        common.ajax({
            url: url,
            type: "get",
            data: {userId: userId},
            succ: function (res) {

                var readList = res.data.rows;
                renderList(readList,selector);
            },
            fail: function (res) {
                console.log(res);
                $.messager.alert('警告',res.message);
            }

        })
    };
    var arrAuthSave=[
        {selector:'#btnSaveRead',inputs:'#read_wrap input:checked',url:'/authority/read/save'},
        {selector:'#btnSaveWrite',inputs:'#write_wrap input:checked',url:'/authority/write/save'},
        {selector:'#btnSaveEncrypt',inputs:'#encrypt_wrap input:checked',url:'/authority/encrypt/save'},
        {selector:'#btnSaveAuthor',inputs:'#author_wrap input:checked',url:'/authority/author/save'}
    ];

    api.bindSaveHandler= function(){
        $.each(arrAuthSave, function (index,item) {
            $(item.selector).on('click', function () {
                var idsArr=[];
                $(item.inputs).each(function(index,input){
                    idsArr.push(input.dataset.id);
                });

                common.ajax({
                    url:item.url,
                    type:"post",
                    data:{"taskIds":idsArr,userId:userId},
                    succ: function (res) {
                        console.log(res);
                        $.messager.alert('警告','权限设置成功');
                    },
                    fail:function(res){
                        console.log(res);
                        $.messager.alert('警告',res.message);
                    }

                })
            });
        })
    };
    api.setTitle=function(){
        var text='为用户 <span>'+userEmail+'</span> 设置权限';
        $('h3').html(text);

    };
    api.renderReadList=function(){
        getAuthList('/authority/read/list','#read_wrap');
    };
    api.renderWriteList=function(){
        getAuthList('/authority/write/list','#write_wrap');
    };
    api.renderEncryptList=function(){
        getAuthList('/authority/encrypt/list','#encrypt_wrap');
    };
    api.renderAuthorList=function(){
        getAuthList('/authority/author/list','#author_wrap');
    };


    return api;
})(AuthSet || (AuthSet = {}),common);