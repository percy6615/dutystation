const accessControl = require('express-ip-access-control');
const JFile = require('jfile');
//IP List => http://www.ipdeny.com/ipblocks/
const china_ip_list = new JFile("./middleware/cn_20190310_8348.txt").lines;
const custom_ip_list = [];	 //自訂
const opt = {
	mode: 'deny', // deny : allow
    denys: china_ip_list.concat(custom_ip_list),
    //allows: ['118.163.40.55'],
    forceConnectionAddress: false,
    log: function(clientIp, access) {
		//access || console.log(`未授權來源: ${clientIp}`);
		//access ? '' : console.log(clientIp + (access ? ' accessed.' : ' denied.'));
        //console.log(clientIp + (access ? ' accessed.' : ' denied.'));
    },
    statusCode: 401,
    redirectTo: '',
    message: 'Unauthorized'
};

module.exports = accessControl(opt)