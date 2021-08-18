import _uuid from "../tools/uuid";
class user{
    constructor(ACCOUNTNAME,PASSWORD,FULLNAME,GROUPNAME,GROUPCHARACTER,PHONE,CITY,ISAMIN,CREATETIME,ISCHECK) {
        
        this.ACCOUNTID = _uuid;
        this.ACCOUNTNAME = ACCOUNTNAME;
        this.PASSWORD = PASSWORD;
        this.FULLNAME = FULLNAME;
        this.GROUPNAME = GROUPNAME;
        this.GROUPCHARACTER = GROUPCHARACTER;
        this.PHONE = PHONE;
        this.CITY = CITY;
        this.ISAMIN = ISAMIN;
        this.CREATETIME = CREATETIME;
        this.ISCHECK = ISCHECK;
      }
      
}

export default user;