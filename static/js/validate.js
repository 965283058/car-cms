$.extend($.fn.validatebox.defaults.rules, {
    cnName: {// 验证中文
        validator: function (value, param) {
            var result = /.*[\u4e00-\u9fa5]+.*$/.test(value);
            if (result) {
                var len = value.length;
                if (len >= param[0] && len <= param[1]) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        message: '请输入{0}-{1}个汉字'
    },
    idcard: {// 验证身份证 
        validator: function (value) {
            return /^\d{17}[xX0-9]$/i.test(value);
        },
        message: '请输入18位身份证号'
    },
    mobile: {// 验证手机号码
        validator: function (value) {
            return /^(13|15|17|18)\d{9}$/i.test(value);
        },
        message: '请输入11位数字'
    },
    maxLength: {
        validator: function (value, param) {
            return value.length <= param[0];
        },
        message: '输入长度请控制在{0}字以内'
    },
    minLength: {
        validator: function (value, param) {
            return value.length >= param[0];
        },
        message: '请输入至少（2）个字符.'
    },
    length: {
        validator: function (value, param) {
            var len = $.trim(value).length;
            return len >= param[0] && len <= param[1];
        },
        message: "输入内容长度必须介于{0}和{1}之间."
    },
    phone: {// 验证电话号码 
        validator: function (value) {
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message: '格式不正确,请使用下面格式:020-88888888'
    },
    number: {//
        validator: function (value, param) {
            var reg = new RegExp("^\\d{" + param[0] + "}$");
            return reg.test(value);
        },
        message: '请输入{0}位数字'
    },

    channelReason: {// 验证整数或小数
        validator: function (value) {
            return /^[A-Z]\d{3}\S{0,26}$/.test(value);
        },
        message: '第1位必须为大写字母，2-4位必须为纯数字'
    },

    intOrFloat: {// 验证整数或小数 
        validator: function (value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message: '请输入数字，并确保格式正确'
    },
    currency: {// 验证货币 
        validator: function (value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message: '货币格式不正确'
    },
    qq: {// 验证QQ,从10000开始 
        validator: function (value) {
            return /^[1-9]\d{4,9}$/i.test(value);
        },
        message: 'QQ号码格式不正确'
    },
    integer: {// 验证整数 
        validator: function (value) {
            return /^[+]?[1-9]+\d*$/i.test(value);
        },
        message: '请输入整数'
    },
    age: {// 验证年龄
        validator: function (value) {
            return /^(?:[1-9][0-9]?|1[01][0-9]|120)$/i.test(value);
        },
        message: '年龄必须是0到120之间的整数'
    },

    chinese: {// 验证中文 
        validator: function (value) {
            return /^[\Α-\￥]+$/i.test(value);
        },
        message: '请输入中文'
    },
    english: {// 验证英语 
        validator: function (value) {
            return /^[A-Za-z]+$/i.test(value);
        },
        message: '请输入英文'
    },
    unnormal: {// 验证是否包含空格和非法字符 
        validator: function (value) {
            return /.+/i.test(value);
        },
        message: '输入值不能为空和包含其他非法字符'
    },
    username: {// 验证用户名 
        validator: function (value) {
            return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value);
        },
        message: '用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'
    },
    faxno: {// 验证传真 
        validator: function (value) {
            //            return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/i.test(value); 
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message: '传真号码不正确'
    },
    zip: {// 验证邮政编码 
        validator: function (value) {
            return /^[1-9]\d{5}$/i.test(value);
        },
        message: '邮政编码格式不正确'
    },
    ip: {// 验证IP地址 
        validator: function (value) {
            return /d+.d+.d+.d+/i.test(value);
        },
        message: 'IP地址格式不正确'
    },
    name: {// 验证姓名，可以是中文或英文 
        validator: function (value) {
            return /^[\Α-\￥]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
        },
        message: '请输入姓名'
    },
    date: {// 验证姓名，可以是中文或英文 
        validator: function (value) {
            //格式yyyy-MM-dd或yyyy-M-d
            return /^(?:(?!0000)[0-9]{4}([-]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-]?)0?2\2(?:29))$/i.test(value);
        },
        message: '清输入合适的日期格式'
    },
    msn: {
        validator: function (value) {
            return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
        },
        message: '请输入有效的msn账号(例：abc@hotnail(msn/live).com)'
    },
    same: {
        validator: function (value, param) {
            return value == $(param[0]).val();
        },
        message: '两次输入的密码不一致！'
    }
    ,
    wx: {
        validator: function (value) {
            return /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/i.test(value);
        },
        message: '微信号码格式不正确！'
    },
    equlse: {
        validator: function (value, param) {
            return $(param[0]).val() == value
        },
        message: '两次密码输入不一致！'
    },
    pwd: {
        validator: function (value) {
            return /^\w{6,18}$/.test(value)
        },
        message: '密码格式错误，请输入6-18个字符！'
    },
});