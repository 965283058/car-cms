document.write('<scr' + 'ipt type="text/javascript" src="rsa/pidcrypt.js"></scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="rsa/pidcrypt_util.js"></scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="rsa/asn1.js"></scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="rsa/jsbn.js"></scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="rsa/rng.js"></scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="rsa/prng4.js"></scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="rsa/rsa.js"></scr' + 'ipt>');
function certParser(cert) {
    var lines = cert.split('\n');
    var read = false;
    var b64 = false;
    var end = false;
    var flag = '';
    var retObj = {};
    retObj.info = '';
    retObj.salt = '';
    retObj.iv;
    retObj.b64 = '';
    retObj.aes = false;
    retObj.mode = '';
    retObj.bits = 0;
    for (var i = 0; i < lines.length; i++) {
        flag = lines[i].substr(0, 9);
        if (i == 1 && flag != 'Proc-Type' && flag.indexOf('M') == 0)b64 = true;
        switch (flag) {
            case'-----BEGI':
                read = true;
                break;
            case'Proc-Type':
                if (read)retObj.info = lines[i];
                break;
            case'DEK-Info:':
                if (read) {
                    var tmp = lines[i].split(',');
                    var dek = tmp[0].split(': ');
                    var aes = dek[1].split('-');
                    retObj.aes = (aes[0] == 'AES') ? true : false;
                    retObj.mode = aes[2];
                    retObj.bits = parseInt(aes[1]);
                    retObj.salt = tmp[1].substr(0, 16);
                    retObj.iv = tmp[1]
                }
                ;
                break;
            case'':
                if (read)b64 = true;
                break;
            case'-----END ':
                if (read) {
                    b64 = false;
                    read = false
                }
                ;
                break;
            default:
                if (read && b64)retObj.b64 += pidCryptUtil.stripLineFeeds(lines[i])
        }
    }
    ;
    return retObj
};
function RSAencript(str) {
    var crypted;
    var public_key = public_key_1024;
    var params = {};
    params = certParser(public_key);
    if (params.b64) {
        var key = pidCryptUtil.decodeBase64(params.b64);
        var rsa = new pidCrypt.RSA();
        var asn = pidCrypt.ASN1.decode(pidCryptUtil.toByteArray(key));
        var tree = asn.toHexTree();
        rsa.setPublicKeyFromASN(tree);
        crypted = rsa.encrypt(str);
        return pidCryptUtil.encodeBase64(pidCryptUtil.convertFromHex(crypted))
    } else return "error"
}
