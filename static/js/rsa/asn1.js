function Stream(a,b){a instanceof Stream?(this.enc=a.enc,this.pos=a.pos):(this.enc=a,this.pos=b)}Stream.prototype.parseStringHex=function(a,b){"undefined"==typeof b&&(b=this.enc.length);for(var c="",d=a;b>d;++d){var e=this.get(d);c+=this.hexDigits.charAt(e>>4)+this.hexDigits.charAt(15&e)}return c},Stream.prototype.get=function(a){if(void 0==a&&(a=this.pos++),a>=this.enc.length)throw"Requesting byte offset "+a+" on a stream of length "+this.enc.length;return this.enc[a]},Stream.prototype.hexDigits="0123456789ABCDEF",Stream.prototype.hexDump=function(a,b){for(var c="",d=a;b>d;++d){var e=this.get(d);c+=this.hexDigits.charAt(e>>4)+this.hexDigits.charAt(15&e),7==(15&d)&&(c+=" "),c+=15==(15&d)?"\n":" "}return c},Stream.prototype.parseStringISO=function(a,b){for(var c="",d=a;b>d;++d)c+=String.fromCharCode(this.get(d));return c},Stream.prototype.parseStringUTF=function(a,b){for(var c="",d=0,e=a;b>e;){var d=this.get(e++);c+=128>d?String.fromCharCode(d):d>191&&224>d?String.fromCharCode((31&d)<<6|63&this.get(e++)):String.fromCharCode((15&d)<<12|(63&this.get(e++))<<6|63&this.get(e++))}return c},Stream.prototype.reTime=/^((?:1[89]|2\d)?\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/,Stream.prototype.parseTime=function(a,b){var c=this.parseStringISO(a,b),d=this.reTime.exec(c);return d?(c=d[1]+"-"+d[2]+"-"+d[3]+" "+d[4],d[5]&&(c+=":"+d[5],d[6]&&(c+=":"+d[6],d[7]&&(c+="."+d[7]))),d[8]&&(c+=" UTC","Z"!=d[8]&&(c+=d[8],d[9]&&(c+=":"+d[9]))),c):"Unrecognized time: "+c},Stream.prototype.parseInteger=function(a,b){if(b-a>4)return void 0;for(var c=0,d=a;b>d;++d)c=c<<8|this.get(d);return c},Stream.prototype.parseOID=function(a,b){for(var c,d=0,e=0,f=a;b>f;++f){var g=this.get(f);d=d<<7|127&g,e+=7,128&g||(void 0==c?c=parseInt(d/40)+"."+d%40:c+="."+(e>=31?"big":d),d=e=0),c+=String.fromCharCode()}return c},"undefined"!=typeof pidCrypt&&(pidCrypt.ASN1=function(a,b,c,d,e){this.stream=a,this.header=b,this.length=c,this.tag=d,this.sub=e},pidCrypt.ASN1.prototype.toHexTree=function(){var a={};if(a.type=this.typeName(),"SEQUENCE"!=a.type&&(a.value=this.stream.parseStringHex(this.posContent(),this.posEnd())),null!=this.sub){a.sub=[];for(var b=0,c=this.sub.length;c>b;++b)a.sub[b]=this.sub[b].toHexTree()}return a},pidCrypt.ASN1.prototype.typeName=function(){if(void 0==this.tag)return"unknown";var a=this.tag>>6;1&this.tag>>5;var c=31&this.tag;switch(a){case 0:switch(c){case 0:return"EOC";case 1:return"BOOLEAN";case 2:return"INTEGER";case 3:return"BIT_STRING";case 4:return"OCTET_STRING";case 5:return"NULL";case 6:return"OBJECT_IDENTIFIER";case 7:return"ObjectDescriptor";case 8:return"EXTERNAL";case 9:return"REAL";case 10:return"ENUMERATED";case 11:return"EMBEDDED_PDV";case 12:return"UTF8String";case 16:return"SEQUENCE";case 17:return"SET";case 18:return"NumericString";case 19:return"PrintableString";case 20:return"TeletexString";case 21:return"VideotexString";case 22:return"IA5String";case 23:return"UTCTime";case 24:return"GeneralizedTime";case 25:return"GraphicString";case 26:return"VisibleString";case 27:return"GeneralString";case 28:return"UniversalString";case 30:return"BMPString";default:return"Universal_"+c.toString(16)}case 1:return"Application_"+c.toString(16);case 2:return"["+c+"]";case 3:return"Private_"+c.toString(16)}},pidCrypt.ASN1.prototype.content=function(){if(void 0==this.tag)return null;var a=this.tag>>6;if(0!=a)return null;var b=31&this.tag,c=this.posContent(),d=Math.abs(this.length);switch(b){case 1:return 0==this.stream.get(c)?"false":"true";case 2:return this.stream.parseInteger(c,c+d);case 6:return this.stream.parseOID(c,c+d);case 12:return this.stream.parseStringUTF(c,c+d);case 18:case 19:case 20:case 21:case 22:case 26:return this.stream.parseStringISO(c,c+d);case 23:case 24:return this.stream.parseTime(c,c+d)}return null},pidCrypt.ASN1.prototype.toString=function(){return this.typeName()+"@"+this.stream.pos+"[header:"+this.header+",length:"+this.length+",sub:"+(null==this.sub?"null":this.sub.length)+"]"},pidCrypt.ASN1.prototype.print=function(a){if(void 0==a&&(a=""),document.writeln(a+this),null!=this.sub){a+="  ";for(var b=0,c=this.sub.length;c>b;++b)this.sub[b].print(a)}},pidCrypt.ASN1.prototype.toPrettyString=function(a){void 0==a&&(a="");var b=a+this.typeName()+" @"+this.stream.pos;if(this.length>=0&&(b+="+"),b+=this.length,32&this.tag?b+=" (constructed)":3!=this.tag&&4!=this.tag||null==this.sub||(b+=" (encapsulates)"),b+="\n",null!=this.sub){a+="  ";for(var c=0,d=this.sub.length;d>c;++c)b+=this.sub[c].toPrettyString(a)}return b},pidCrypt.ASN1.prototype.toDOM=function(){var a=document.createElement("div");a.className="node",a.asn1=this;var b=document.createElement("div");b.className="head";var c=this.typeName();b.innerHTML=c,a.appendChild(b),this.head=b;var d=document.createElement("div");d.className="value",c="Offset: "+this.stream.pos+"<br/>",c+="Length: "+this.header+"+",c+=this.length>=0?this.length:-this.length+" (undefined)",32&this.tag?c+="<br/>(constructed)":3!=this.tag&&4!=this.tag||null==this.sub||(c+="<br/>(encapsulates)");var e=this.content();if(null!=e&&(c+="<br/>Value:<br/><b>"+e+"</b>","object"==typeof oids&&6==this.tag)){var f=oids[e];f&&(f.d&&(c+="<br/>"+f.d),f.c&&(c+="<br/>"+f.c),f.w&&(c+="<br/>(warning!)"))}d.innerHTML=c,a.appendChild(d);var g=document.createElement("div");if(g.className="sub",null!=this.sub)for(var h=0,i=this.sub.length;i>h;++h)g.appendChild(this.sub[h].toDOM());return a.appendChild(g),b.switchNode=a,b.onclick=function(){var a=this.switchNode;a.className="node collapsed"==a.className?"node":"node collapsed"},a},pidCrypt.ASN1.prototype.posStart=function(){return this.stream.pos},pidCrypt.ASN1.prototype.posContent=function(){return this.stream.pos+this.header},pidCrypt.ASN1.prototype.posEnd=function(){return this.stream.pos+this.header+Math.abs(this.length)},pidCrypt.ASN1.prototype.toHexDOM_sub=function(a,b,c,d,e){if(!(d>=e)){var f=document.createElement("span");f.className=b,f.appendChild(document.createTextNode(c.hexDump(d,e))),a.appendChild(f)}},pidCrypt.ASN1.prototype.toHexDOM=function(){var a=document.createElement("span");if(a.className="hex",this.head.hexNode=a,this.head.onmouseover=function(){this.hexNode.className="hexCurrent"},this.head.onmouseout=function(){this.hexNode.className="hex"},this.toHexDOM_sub(a,"tag",this.stream,this.posStart(),this.posStart()+1),this.toHexDOM_sub(a,this.length>=0?"dlen":"ulen",this.stream,this.posStart()+1,this.posContent()),null==this.sub)a.appendChild(document.createTextNode(this.stream.hexDump(this.posContent(),this.posEnd())));else if(this.sub.length>0){var b=this.sub[0],c=this.sub[this.sub.length-1];this.toHexDOM_sub(a,"intro",this.stream,this.posContent(),b.posStart());for(var d=0,e=this.sub.length;e>d;++d)a.appendChild(this.sub[d].toHexDOM());this.toHexDOM_sub(a,"outro",this.stream,c.posEnd(),this.posEnd())}return a},pidCrypt.ASN1.decodeLength=function(a){var b=a.get(),c=127&b;if(c==b)return c;if(c>3)throw"Length over 24 bits not supported at position "+(a.pos-1);if(0==c)return-1;b=0;for(var d=0;c>d;++d)b=b<<8|a.get();return b},pidCrypt.ASN1.hasContent=function(a,b,c){if(32&a)return!0;if(3>a||a>4)return!1;var d=new Stream(c);3==a&&d.get();var e=d.get();if(1&e>>6)return!1;try{var f=pidCrypt.ASN1.decodeLength(d);return d.pos-c.pos+f==b}catch(g){return!1}},pidCrypt.ASN1.decode=function(a){a instanceof Stream||(a=new Stream(a,0));var b=new Stream(a),c=a.get(),d=pidCrypt.ASN1.decodeLength(a),e=a.pos-b.pos,f=null;if(pidCrypt.ASN1.hasContent(c,d,a)){var g=a.pos;if(3==c&&a.get(),f=[],d>=0){for(var h=g+d;a.pos<h;)f[f.length]=pidCrypt.ASN1.decode(a);if(a.pos!=h)throw"Content size is not correct for container starting at offset "+g}else try{for(;;){var i=pidCrypt.ASN1.decode(a);if(0==i.tag)break;f[f.length]=i}d=g-a.pos}catch(j){throw"Exception while decoding undefined length content: "+j}}else a.pos+=d;return new pidCrypt.ASN1(b,e,d,c,f)},pidCrypt.ASN1.test=function(){for(var a=[{value:[39],expected:39},{value:[129,201],expected:201},{value:[131,254,220,186],expected:16702650}],b=0,c=a.length;c>b;++b){var e=new Stream(a[b].value,0),f=pidCrypt.ASN1.decodeLength(e);f!=a[b].expected&&document.write("In test["+b+"] expected "+a[b].expected+" got "+f+"\n")}});