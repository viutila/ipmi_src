import Radium from "radium";
import React from "react";
import MainStore from "../stores/MainStore";
import * as MainActions from "../actions/MainActions";

import Frameset from "./Frameset";
import Menu from "./Menu";
import RightPanel from "./RightPanel";


class Login extends React.Component {
    
    constructor(props){
        super(props);
        this.loginErrorFunc = this.loginErrorFunc.bind(this);
        this.state = {
            displayFlag: 'inline',
            loginState: false,
            userName: localStorage.getItem("LSuserName"),
            passWord: localStorage.getItem("LSpassWord"),
            errorMsgFlag: 'hidden',
            rememberMeChecked: localStorage.getItem("LSrememberMe"),
        };
    }

    componentWillMount() {
        MainStore.on("loginError", this.loginErrorFunc);
    }

    componentWillUnmount() {
        MainStore.removeListener("loginError", this.loginErrorFunc);
    }

    loginErrorFunc() {
        setTimeout(()=>{MainActions.setLoadingDIV(0)},1);
        this.setState({
            errorMsgFlag: 'errorMsg',
        });
    }

    rememberMeCheckCB(v) {
        this.setState({
            rememberMeChecked: v,
        })
    }

    changeLoginState(){
        //this.setState({loginState: true});
        this.setState({
            errorMsgFlag: 'loggingMsg',
        });
        localStorage.setItem("LSuserNameC", this.state.userName);
        if (this.state.rememberMeChecked)
        {
            localStorage.setItem("LSuserName", this.state.userName);
            localStorage.setItem("LSpassWord", this.state.passWord);
            localStorage.setItem("LSrememberMe", this.state.rememberMeChecked);
        }
        else
        {
            localStorage.removeItem("LSuserName");
            localStorage.removeItem("LSpassWord");
            localStorage.removeItem("LSrememberMe");
        }
        MainActions.setLoadingDIV(1);
        
        MainActions.loginUpdate(this.state.userName, this.state.passWord);
    }

    onChangeValue (v) {
        //console.log(v);
        this.setState({
            userName: v,
        })
    }

    onChangePassWord (v) {
        //console.log(v);
        this.setState({
            passWord: v,
        })
    }
    
    
    render() {
        return (
            <div style={style.divBack} >
                <div style={style.divLoginPanel}>
                    <div style={style.divTitle}><span style={style.span1}>QNAP</span><span style={style.span2}>IPMI</span></div>
                    <div style={style.formInputField}>
                        <InputFieldUserName onChangeValue={this.onChangeValue.bind(this)} defaultUserName={this.state.userName} />
                        <InputFieldPassWord onChangeValue={this.onChangePassWord.bind(this)} defaultPassWord={this.state.passWord} />
                        <RememberMe checked={this.state.rememberMeChecked} onClick={this.rememberMeCheckCB.bind(this)} />
                        {/*<SecureLogin />*/}
                        <ErrorMessage flag={this.state.errorMsgFlag}/>
                        <button style={style.loginButton} onClick={this.changeLoginState.bind(this)}>Login</button>
                    </div>
                    
                </div>
                
            </div>
        );
    }
}

class ErrorMessage extends React.Component {
    
    render(){
        var text = '';
        var showStyle;
        switch(this.props.flag)
        {
            case "hidden":
                showStyle = style.errorMsg;
                break;
            case "errorMsg":
                text = "Incorrect user name or password.";
                showStyle = style.errorMsg.errorShow;
                break;
            case "loggingMsg":
                text = "Logging in...";
                showStyle = style.errorMsg.loggingShow;
                break;
        }
        return(
            <div style={showStyle}>
            {text}
            </div>
        );
    }
}

class InputFieldUserName extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            inputValue: this.props.defaultUserName,
        };
    }
    handleClick(){
        this.setState({
            inputValue: '',
        },()=>{
            this.props.onChangeValue(this.state.inputValue);
        });
    }
    handleChange(event){
        this.setState({
            inputValue: event.target.value,
        },()=>{
            this.props.onChangeValue(this.state.inputValue);
        })
    }
    render(){
        return(
            <div style={style.divInputField}>
                <input style={style.userNameInput} id="username" autoComplete="off" placeholder="Username" value={this.state.inputValue} onChange={this.handleChange.bind(this)} />
                <div style={style.imgClearAccount} onClick={this.handleClick.bind(this)}></div>
            </div>
        );
    }
}

@Radium
class InputFieldPassWord extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            inputValue: this.props.defaultPassWord,
            inputType: 'password',
        };
    }
    handleClick() {
        this.setState({
            inputType: this.state.inputType=='password' ?　'text' : 'password',
        })
    }
    handleChange(event){
        this.setState({
            inputValue: event.target.value,
        },()=>{
            this.props.onChangeValue(this.state.inputValue);
        })
    }
    render() {
        return(
            <div style={style.divInputFieldPW}>
                <input style={style.userNameInput} type={this.state.inputType} id="password" autoComplete="off" placeholder="Password" value={this.state.inputValue} onChange={this.handleChange.bind(this)} />
                <div style={style.imgShowPassword} onClick={this.handleClick.bind(this)}></div>
            </div>
        );
    }
};


class RememberMe extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            checked: this.props.checked,
            iconStyle: this.props.checked ? style.divRememberMeCB.active :style.divRememberMeCB,
        };
    }
    handleClick(){
        this.setState({
            checked: !this.state.checked,
        },() => {
            this.setState({
                iconStyle: this.state.checked ? style.divRememberMeCB.active :style.divRememberMeCB,
            });
            this.props.onClick(this.state.checked);
        });
    }
    render(){
        return(
            <div style={style.rememberMeCheckbox}>
                <div style={this.state.iconStyle} onClick={this.handleClick.bind(this)}></div>
                <span style={style.spanRememberMe} onClick={this.handleClick.bind(this)}>Remember me</span>
            </div>
        );
    }
};

class SecureLogin extends RememberMe {

    render(){
        return(
            <div style={style.secureLoginCheckbox}>
                <div style={this.state.iconStyle} onClick={this.handleClick.bind(this)}></div>
                <span style={style.spanRememberMe} onClick={this.handleClick.bind(this)}>Secure login</span>
            </div>
        );
    }
};

const style = {
    divBack: {
        position: 'absolute',
        width: '100%',
        height: 'calc(100% - 44px)',
        overflow: 'auto',
        background: 'url(img/BG.jpg) top left / cover no-repeat'
    },
    divLoginPanel: {
        position: 'absolute',
        width: '442px',
        height: '490px',
        opacity: '1',
        zIndex: '1900',
        background: 'rgba(255,255,255,0.5)',
        left: '0',
        right: '0',
        margin: 'auto'
    },
    divTitle: {
        marginTop: '78px',
        marginBottom: '15px',
        textAlign: 'center',
        fontSize: '36px',
        color: '#fff'
    },
    span1: {
        fontWeight: '900'
    },
    span2: {
        fontWeight: '300'
    },
    formInputField: {
        margin: '0',
        boxSizing: 'border-box',
        textRendering: 'optimizeLegibility' 
    },
    divInputField: {
        marginTop: '27px',
        marginLeft: '102px'
    },
    divInputFieldPW: {
        marginTop: '6px',
        marginLeft: '102px'
    },
    userNameInput: {
        width: '240px',
        height: '36px',
        padding: '8px 12px',
        marginBottom: '0',
        border: '1px solid #848484'
    },
    imgClearAccount: {
        backgroundImage: 'url("img/login_page_slice.png")',
        backgroundPosition: '0px 0px',
        width: '14px',
        height: '14px',
        marginLeft: '-26px',
        display: 'inline-block',
        verticalAlign: 'middle',
        cursor: 'pointer'
    },
    imgShowPassword: {
        backgroundImage: 'url("img/login_page_slice.png")',
        backgroundPosition: '0px -1020px',
        width: '22px',
        height: '14px',
        marginLeft: '-30px',
        display: 'inline-block',
        verticalAlign: 'middle',
        cursor: 'pointer',

        ':hover': {backgroundPosition: '-30px -1020px'},
    },
    rememberMeCheckbox: {
        marginTop: '14px',
        marginLeft: '102px',
    },
    secureLoginCheckbox: {
        marginTop: '16px',
        marginLeft: '102px'
    },
    divRememberMeCB: {
        backgroundPosition: '-30px -60px',
        backgroundImage: 'url("img/Share_slice.png")',
        width: '13px',
        height: '12px',
        display: 'inline-block',
        verticalAlign: 'middle',
        cursor: 'pointer',

        active: {
            backgroundPosition: '-60px -60px',
            backgroundImage: 'url("img/Share_slice.png")',
            width: '13px',
            height: '12px',
            display: 'inline-block',
            verticalAlign: 'middle',
            cursor: 'pointer',
        }

    },
    spanRememberMe: {
        marginLeft: '8px',
        cursor: 'pointer'
    },

    errorMsg: {
        marginTop: '14px',
        marginLeft: '102px',
        color: '#ff5a00',
        visibility: 'hidden',
        lineHeight: '20px',
        height: '20px',
        display: 'block',
        errorShow: {
            marginTop: '14px',
            marginLeft: '102px',
            color: '#ff5a00',
            lineHeight: '20px',
            height: '20px',
            display: 'block',
            visibility: 'visible',
        },
        loggingShow: {
            marginTop: '14px',
            marginLeft: '102px',
            lineHeight: '20px',
            height: '20px',
            display: 'block',
            visibility: 'visible',
        }
    },

    loginButton: {
        marginTop: '52px',
        marginLeft: '102px',
        width: '254px',
        height: '47px',
        color: '#fff',
        fontSize: '20px',
        background: 'linear-gradient(to bottom, #4982eb, #3275ef)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05)',
        borderColor: 'rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25)',
        ':hover': {background: 'linear-gradient(to bottom, #6a9af3, #417eef)'},
        ':active': {background: 'linear-gradient(to bottom, #3571de, #1759d1)'},
    },
    divLayout: {
		height: '100%',
		width: '100%',
		border: 'none'
    }
};
//module.exports = Radium(InputFieldPassWord);
module.exports = Radium(Login);
