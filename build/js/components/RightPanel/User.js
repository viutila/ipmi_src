import Radium from "radium";
import React from "react";
import MainStore from "../../stores/MainStore";
import * as MainActions from "../../actions/MainActions";
import moment from 'moment-timezone';

class User extends React.Component {
    constructor(props) {
        super(props);
        this.getUserData = this.getUserData.bind(this);
        this.refreshUserData = this.refreshUserData.bind(this);

        this.state = {
            //user
            user: '',
            sortType: {key: "status", order: "asc"},
            checkArray: [],
            newUserState: style.displayNone,
            newUserSelectValue: 0,
            editUserState: style.displayNone,
        };

        this.checkArrayLength = 0;
    }

    componentWillMount() {
        MainStore.on("getUserCgiSuccess", this.getUserData);
        MainStore.on("patchUserCgiSuccess", this.refreshUserData);
        MainStore.on("deleteUserCgiSuccess", this.refreshUserData);
        
        
        
        this.token = localStorage.getItem("LStoken");
        this.userData = '';

        MainActions.getUserCgi(this.token);
        setTimeout(()=>{MainActions.setLoadingDIV(1)},1);
        //console.log("count", MainStore.listenerCount("getInfoCgiSuccess"));
    }

    componentWillUnmount() {
        MainStore.removeListener("getUserCgiSuccess", this.getUserData);
    }

    refreshUserData() {
        MainActions.getUserCgi(this.token);
    }

    getUserData() {
        this.userData = MainStore.getUserData();
        console.log(this.userData);
        var tmpArray = [];
        this.checkArrayLength = this.userData.length
        for (var i=0; i<this.userData.length; i++)
            tmpArray[i] = false;
        this.setState({
            user: this.userData,
            checkArray: tmpArray,
        })
        setTimeout(()=>{MainActions.setLoadingDIV(0)},1);
    }

    setCheckArray(i,v) {
        var tmpArray = this.state.checkArray;
        tmpArray[i] = v;
        this.setState({
            checkArray: tmpArray
        })
    }

    handleHeaderCBClick(v) {
        var tmpArray = this.state.checkArray;
        for(var i=0; i<tmpArray.length; i++)
        {
            if (i==0 || i==1)
            {
                tmpArray[i] = false;
            }
            else
            {
                tmpArray[i] = v;
            }
        }
        
        this.setState({
            checkArray: tmpArray
        })
    }

    handleNewClick() {
        this.setState({
            newUserState: this.state.newUserState == style.displayNone ? style.displayInline : style.displayNone 
        },)
    }

    handleEditClick() {
        this.setState({
            editUserState: this.state.editUserState == style.displayNone ? style.displayInline : style.displayNone
        })
    }

    chooseEditUser() {
        var tmpArray = this.state.checkArray;
        var id = -1;
        var userData;
        for (var i=0; i<tmpArray.length; i++){
            if (tmpArray[i])
            {
                id = i;
                break;
            }
        }
        if (id!=-1){
            userData = this.state.user[i];
        }
        return userData;
    }

    handleDeleteClick() {
        var ary = this.state.checkArray;
        var dataAry = [];
        for (var i=0; i<ary.length; i++)
        {
            if (ary[i])
                dataAry.push(i+1);
        }
        console.log(dataAry);
        MainActions.deleteUserCgi(this.token,dataAry);
        //MainActions.getUserCgi(this.token);
    }


    render() {
        var userArray = [];
        var rows = [];

        for (var i = 0; i < Object.keys(this.state.user).length; i++)
        {
            var x = this.state.user[Object.keys(this.state.user)[i]];
            //for (var j = 0; j < x.length; j++)
            //{
                //x[j].status = Math.abs(x[j].status);
            userArray.push(x);
            //}
        }

        //var tmpSortType = this.state.sortType.key;
        //var tmpSortOrder = this.state.sortType.order;

        //userArray = _.orderBy(userArray, function(o){ return o[tmpSortType]}, tmpSortOrder);

        var userPrivilegeData = [[0, "Reserved"], [1, "Callback"], [2, "User"], [3, "Operator"], [4, "Administrator"], [15, "No Access"]];

        var tmpArray = this.state.checkArray;
        var checkedCount = 0;
        var tmpClickFunc = this.setCheckArray.bind(this);
        var tmpFunc = (a)=>{
            if (a[0] == this)
            {
                console.log("a",a);
                console.log("this",this);
                return a[1];
            }
                
        }
        function tmpFunc2(a){
            if (a[0] == this)
            {
                console.log("a",a);
                console.log("this",this);
                return a[1];
            }
        }
        userArray.forEach(function(user,i) {
            //console.log("fan",fan);
            if(user.name)
            {
                var disabledFlag = false;
                if (user.id==1 || user.id==2)
                    disabledFlag = true;

                var privilegeStr = userPrivilegeData.find(tmpFunc2,user.privilege);
                rows.push(<TR userName={user.name} privilege={privilegeStr[1]} valid={user.valid} key={i} checked={tmpArray[i]} clickFunc2={tmpClickFunc} index={i} disabledFlag={disabledFlag} />);
                (tmpArray[i]==true) ? checkedCount++ : false;
            }
           
        });

        var newButton = true;
        var editButton = (checkedCount==1) ? true : false;
        var deleteButton = (checkedCount>0) ? true : false;


        var optionData = [[2, "User"], [3, "Operator"], [4, "Administrator"], [15, "No Access"]];
        var option = [];
        /*for (var i=0; i<this.optionData.length; i++){
            option.push(<option key={i} value={i}>{i}</option>);
        }*/
        optionData.forEach(function(data,i) {
            option.push(<option key={i} value={data[0]}>{data[1]}</option>);
        })
        var accountTypeSelect =(
            <select value={this.state.newUserSelectValue} style={style.styleSelect} >
                {option}
            </select>
        );

        return (
            <div style={style.mainPanel} >
                <div style={style.north} >
                    <p style={style.title} >User</p>
                </div>
                <div style={style.container} >
                    <p style={style.infoTitle} >Present Reading</p>
                    <div style={style.info} >
                        <div style={{width: '100%', height: '36px',border: '1px solid #d9d9d9',textAlign: "right",display:'table'}}>
                            <div>
                                <button style={newButton ? style.editBtn.active : style.editBtn.inactive} onClick={this.handleNewClick.bind(this)} >New</button>
                                <button style={editButton ? style.editBtn.active : style.editBtn.inactive} onClick={this.handleEditClick.bind(this)} >Edit</button>
                                <button style={deleteButton ? style.editBtn.active : style.editBtn.inactive} onClick={this.handleDeleteClick.bind(this)} >Delete</button>
                            </div>
                            {/*<div style={[this.state.newUserState,{marginTop:'10px'}]}>
                                <p>User Name: <input style={style.textInput} type="text" autoComplete="off" placeholder="" maxLength="16" /></p>
                                <p>Password: <input style={style.textInput} type="text" autoComplete="off" placeholder="" maxLength="20" /></p>
                                <p>Confirm Password: <input style={style.textInput} type="text" autoComplete="off" placeholder="" maxLength="20" /></p>
                                <p>Account Type: {accountTypeSelect}</p>
                                <button style={[style.stdButton,{marginTop:'20px'}]} key={1}>Apply</button>
                            </div>*/}
                            <NewUserPanel displayState={this.state.newUserState} user={this.state.user} />

                            {/*<div style={[this.state.editUserState,{marginTop:'10px'}]}>
                                <p>User Name: <input style={style.textInput} type="text" autoComplete="off" placeholder="" maxLength="16" /></p>
                                <p>Password: <input style={style.textInput} type="text" autoComplete="off" placeholder="" maxLength="20" /></p>
                                <p>Confirm Password: <input style={style.textInput} type="text" autoComplete="off" placeholder="" maxLength="20" /></p>
                                <p>Account Type: {accountTypeSelect}</p>
                                <button style={[style.stdButton,{marginTop:'20px'}]} key={2}>Apply</button>
                            </div>*/}
                            {
                                (this.state.editUserState == style.displayNone) ?
                                    false
                                :
                                    <EditUserPanel displayState={this.state.editUserState} user={this.chooseEditUser.bind(this)} />
                            }
                            
                        </div>

                        <div>
                            <table id="stripedTable">
                                <thead>
                                    <tr>
                                        <th style={{width: '2%',textAlign:'center',padding: '0',cursor:'context-menu'}}><CheckBox disabled={false} checked={false} clickFunc={this.handleHeaderCBClick.bind(this)} /></th>
                                        <th style={{width: '20%',cursor:'context-menu'}} >User Name</th>
                                        <th style={{width: '20%',cursor:'context-menu'}} >Account Type</th>
                                        <th style={{width: '14%',cursor:'context-menu'}} >Remote Console</th>
                                        <th style={{width: '15%',cursor:'context-menu'}} >Virtual Power/Reset</th>
                                        <th style={{width: '14%',cursor:'context-menu'}} >Virtual Media</th>
                                        <th style={{width: '15%',cursor:'context-menu'}} >Configure IPMI Settings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows}
                                </tbody>
                            </table>
                        </div>

                        
                    </div>
                </div> 
            </div>
        );
    }
};

@Radium
class NewUserPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            passWord: '',
            cfPassWord: '',
            accountType: 2,
        }
    }

    getEmptyUser() {
        var userArray = this.props.user;
        var rst = -1;
        var length = userArray.length;
        for (var i=0; i<length; i++)
        {
            if (!userArray[i].valid)
            {
                rst = userArray[i].id;
                console.log("getEmptyUser", userArray[i]);
                break;
            }
        }
        return rst;
    }

    accountTypeOnChange(event) {
        var index = event.target.value;
        this.setState({
            accountType: parseInt(index),
        });
    }

    userNameOnChange(event) {
        var index = event.target.value;
        this.setState({
            userName: index
        })
    }

    passWordOnChange(event) {
        var index = event.target.value;
        this.setState({
            passWord: index
        })
    }

    cfPassWordOnChange(event) {
        var index = event.target.value;
        this.setState({
            cfPassWord: index
        })
    }

    applyClick() {
        var token = localStorage.getItem("LStoken");
        var id = this.getEmptyUser();
        if (id==-1)
            return false;

        var patchData = [{
            "id": id,
            "name": this.state.userName,
            "password": this.state.passWord,
            "privilege": this.state.accountType,
            "valid": true,
        }];
        MainActions.patchUserCgi(token,patchData);
    }

    render() {
        var optionData = [[2, "User"], [3, "Operator"], [4, "Administrator"], [15, "No Access"]];
        var option = [];
        /*for (var i=0; i<this.optionData.length; i++){
            option.push(<option key={i} value={i}>{i}</option>);
        }*/
        optionData.forEach(function(data,i) {
            option.push(<option key={i} value={data[0]}>{data[1]}</option>);
        })
        var accountTypeSelect =(
            <select style={style.styleSelect} value={this.state.accountType} onChange={this.accountTypeOnChange.bind(this)}>
                {option}
            </select>
        );
        return(
            <div style={[this.props.displayState,{marginTop:'10px'}]}>
                <p>User Name: <input style={style.textInput} type="text" autoComplete="off" placeholder="" maxLength="16" onChange={this.userNameOnChange.bind(this)} /></p>
                <p>Password: <input style={style.textInput} type="text" autoComplete="off" placeholder="" maxLength="20" onChange={this.passWordOnChange.bind(this)} /></p>
                <p>Confirm Password: <input style={style.textInput} type="text" autoComplete="off" placeholder="" maxLength="20" /></p>
                <p>Account Type: {accountTypeSelect}</p>
                <button style={[style.stdButton,{marginTop:'20px'}]} key={1} onClick={this.applyClick.bind(this)}>Apply</button>
            </div>
        );
    }
}

@Radium
class EditUserPanel extends NewUserPanel {
    constructor(props) {
        super(props);
        var userData = this.props.user();
        this.state = {
            id: userData.id,
            userName: userData.name,
            passWord: '',
            cfPassWord: '',
            accountType: userData.privilege,
            changePW: false
        }
    }
    applyClick() {
        var token = localStorage.getItem("LStoken");
        //var id = this.getEmptyUser();
        //if (id==-1)
        //    return false;
        var patchData;
        switch(this.state.changePW)
        {
            case true:
                patchData = [{
                    "id": this.state.id,
                    "name": this.state.userName,
                    "password": this.state.passWord,
                    "privilege": this.state.accountType,
                    "valid": true,
                }];
                break;
            case false:
                patchData = [{
                    "id": this.state.id,
                    "name": this.state.userName,
                    "privilege": this.state.accountType,
                    "valid": true,
                }];
                break;
        }
        MainActions.patchUserCgi(token,patchData);
    }
    handleCBClick() {
        this.setState({
            changePW: !this.state.changePW,
        },()=>{
            if (!this.state.changePW)
            {
                this.setState({
                    passWord: '',
                    cfPassWord: ''
                })
            }
        })
    }
    render() {
        var userData = this.props.user();
        if (userData == null){
            return false;
        }
        var optionData = [[2, "User"], [3, "Operator"], [4, "Administrator"], [15, "No Access"]];
        var option = [];
        /*for (var i=0; i<this.optionData.length; i++){
            option.push(<option key={i} value={i}>{i}</option>);
        }*/
        optionData.forEach(function(data,i) {
            option.push(<option key={i} value={data[0]}>{data[1]}</option>);
        })
        var accountTypeSelect =(
            <select style={style.styleSelect} value={this.state.accountType} onChange={this.accountTypeOnChange.bind(this)}>
                {option}
            </select>
        );
        return(
            <div style={[this.props.displayState,{marginTop:'10px'}]}>
                <p>User Name: <input style={style.textInput} type="text" autoComplete="off" placeholder="" maxLength="16" onChange={this.userNameOnChange.bind(this)} value={this.state.userName} /></p>
                <p>Change Password: <CheckBox disabled={false} checked={false} clickFunc={this.handleCBClick.bind(this)} /></p>
                <p>Password: <input style={style.textInput} type="text" autoComplete="off" placeholder="" maxLength="20" onChange={this.passWordOnChange.bind(this)} value={this.state.passWord} disabled={!this.state.changePW} /></p>
                <p>Confirm Password: <input style={style.textInput} type="text" autoComplete="off" placeholder="" onChange={this.cfPassWordOnChange.bind(this)} maxLength="20" value={this.state.cfPassWord} disabled={!this.state.changePW} /></p>
                <p>Account Type: {accountTypeSelect}</p>
                <button style={[style.stdButton,{marginTop:'20px'}]} key={1} onClick={this.applyClick.bind(this)}>Apply</button>
            </div>
        );
    }
}

class TR extends React.Component {
    render() {
        var imgSrc = () => {
            switch (Math.abs(this.props.status))
            {
                case 0:
                    return "img/ok_s.png";
                case 1:
                    return "img/warning_s.png";
                case 2:
                    return "img/error_s.png";
                default:
                    return "img/error_s.png";
            }
        }
        return (
            <tr>
                <td style={{textAlign: 'center',padding: '0'}}><CheckBox disabled={this.props.disabledFlag} checked={this.props.checked} key={Math.random()} index={this.props.index} clickFunc2={this.props.clickFunc2}/></td>
                <td>{this.props.userName}</td>
                <td>{this.props.privilege}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        );
    }
}


class CheckBox extends React.Component {
    constructor(props) {
        super(props);
        var tmpImgSrc;
        switch (this.props.disabled)
        {
            case true:
                switch (this.props.checked)
                {
                    case true:
                        this.state = {
                            checked: this.props.checked,
                            imgSrc: "img/btn_checkbox_presseddisable_wbg.png"
                        }
                        break;
                    case false:
                        this.state = {
                            checked: this.props.checked,
                            imgSrc: "img/btn_checkbox_disable_wbg.png"
                        }
                        break;
                }
                break;
            case false:
                switch (this.props.checked)
                {
                    case true:
                        this.state = {
                            checked: this.props.checked,
                            imgSrc: "img/btn_checkbox_pressed_wbg.png"
                        }
                        break;
                    case false:
                        this.state = {
                            checked: this.props.checked,
                            imgSrc: "img/btn_checkbox_wbg.png"
                        }
                        break;
                }
                break;
        }
        
    }
    handleClick() {
        switch (this.props.disabled)
        {
            case true:
                break;
            case false:

                switch (this.state.checked)
                {
                    case true:
                        this.setState({
                            checked: false,
                            imgSrc: "img/btn_checkbox_wbg.png"
                        })
                        break;
                    case false:
                        this.setState({
                            checked: true,
                            imgSrc: "img/btn_checkbox_pressed_wbg.png"
                        })
                        break;
                }
                var flag = this.state.checked;
                if (this.props.clickFunc != null)
                    this.props.clickFunc(!flag);

                if (this.props.clickFunc2 != null)
                    this.props.clickFunc2(this.props.index,!flag);
                break;
        }
    }
    handleMouseOver() {
        switch (this.props.disabled)
        {
            case true:
                break;
            case false:
                switch (this.state.checked)
                {
                    case false:
                        this.setState({
                            imgSrc: "img/btn_checkbox_over_wbg.png"
                        })
                        break;
                    case true:
                        this.setState({
                            imgSrc: "img/btn_checkbox_pressedover_wbg.png"
                        })
                        break;
                }
                break;
        }
        
    }
    handleMouseOut() {
        switch (this.props.disabled)
        {
            case true:
                break;
            case false:
                switch (this.state.checked)
                {
                    case false:
                        this.setState({
                            imgSrc: "img/btn_checkbox_wbg.png"
                        })
                        break;
                    case true:
                        this.setState({
                            imgSrc: "img/btn_checkbox_pressed_wbg.png"
                        })
                        break;
                }
                break;
        }
    }
    render() {
        //var tmpSrc = this.props.name == this.props.currentName ? "img/btn_radio_pressed.png" : "img/btn_radio.png";
        return(
            <img src={this.state.imgSrc} onClick={this.handleClick.bind(this)} onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)} />
        );
    }
}

const style = {
    mainPanel: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    north: {
        position: 'relative',
        height: '40px',
        borderTop: '1px solid #ffffff',
        borderBottom: '1px solid #d9d9d9',
        padding: '0 0 0 36px'
    },
    title: {
        margin: '10px 0 0 0',
        fontSize: '14px',
        color: '#2f2f2f',
        fontWeight: 'bold'
    },
    container: {
        position: 'relative',
        width: '100%',
        height: 'calc(100% - 40px)',
    },
    infoTitle: {
        position: 'absolute',
        top: '30px',
        left: '36px',
        fontSize: '12px',
        color: '#2f2f2f'
    },
    /*info: {
        position: 'absolute',
        top: '52px',
        left: '36px',
        width: 'calc(100% - 72px)',
        border: 'none'
    },*/
    info: {
        position: 'absolute',
        top: '52px',
        left: '36px',
        width: 'calc(100% - 72px)',
        height: 'calc(100% - 82px)',
        //border: '1px solid #d9d9d9',
        border: 'none',
        minWidth: '989px',
    },
    editBtn: {
        active: {
            fontSize: '12px',
            background: 'rgba(0, 0, 0, 0)',
            height: '22px',
            borderColor: '#707070',
            borderStyle: 'solid',
            borderRadius: '8px',
            borderWidth: '1px',
            color: '#2f2f2f',
            //margin: '0 8px 15px 0',
            padding: '0 22px 0 22px',
            marginRight: '12px',
        },
        inactive: {
            fontSize: '12px',
            background: 'rgba(0, 0, 0, 0)',
            height: '22px',
            borderColor: '#aeaeae',
            borderStyle: 'solid',
            borderRadius: '8px',
            borderWidth: '1px',
            color: '#aeaeae',
            //margin: '0 8px 15px 0',
            padding: '0 22px 0 22px',
            marginRight: '12px',
        }
        
    },
    displayInline: {
        display: "inline-block"
    },
    displayNone: {
        display: "none"
    },
    styleSelect: {
        width: '120px',
        height: '23px',
        fontSize: '12px',
    },
    textInput: {
        width: '120px',
        height: '24px',
        fontSize: '12px',
        paddingLeft: '10px',
        marginBottom: '0',
        border: '1px solid #848484'
    },
    stdButton: {
        minWidth:'80px',
        height:'24px',
        padding: '0 22px 0 22px',
        background:'#ffffff',
        borderWidth: '1px',
        borderColor: '#707070',
        borderStyle: 'solid',
        fontSize:'14px',
        fontWeight: 'bold',
        color: '#2f2f2f',
        outline:'1px',
        ':hover': {borderColor: '#707070', color: '#707070',},
        ':active': {borderColor: '#2f2f2f', color: '#2f2f2f',},
    },
};

module.exports = Radium(User);