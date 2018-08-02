import Radium from "radium";
import React from "react";
import $ from "jquery";
//import datepicker from "jquery-ui";
//import 'jquery-ui/themes/base/datepicker.css';
import '../lib/datepicker';
import '../../../datepicker.css';
//require("../../../datepicker.css");



class DateAndTime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ntpRadio: "ntpEnable"
        }
    }
    componentDidMount() {

        $('.datepicker').datepicker({
            dateFormat: 'yy-mm-dd',
            //inline: true,
            showOtherMonths: true,
            dayNamesMin: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
            monthNames: [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12" ],
            firstDay: 1,
            hideIfNoPrevNext: true,
            prevText: "Earlier",
            nextText: "Earlier",
            showMonthAfterYear:true,
            showOn: "both",
            showButtonPanel: true,
            defaultDate: "0",
            buttonText: "",
        }).datepicker("setDate", new Date());

        $.datepicker._gotoToday = function(id) { 
            $(id).datepicker('setDate', new Date()).datepicker('hide').blur(); 
        };

    }
     radioClickFunc(v) {
        this.setState({
            ntpRadio: v
        })
    }
    padLeft(str, len) {
        str = '' + str;
        if (str.length >= len) {
            return str;
        } else {
            return this.padLeft("0" + str, len);
        }
    }
    render() {
        var tmpOption = [];
        for(var i=-720; i<=840; i=i+30){
            var str;
            var x = i / 60;
            var plusSign = i>=0 ? "+" : "";
            if (Number.isInteger(x))
            {
                str = "UTC" + plusSign + this.padLeft(x.toString(),2) + ":" + "00";
            }
            else
            {
                str = "UTC" + plusSign + this.padLeft(x.toString().split(".")[0],2) + ":" + "30";
            }
            tmpOption.push(<option value={i} key={i}>{str}</option>);
        }
        var timeZoneSelect =(
            <select value={0} style={{width:'200px',height:'23px',fontSize:'12px'}}>
                {tmpOption}
            </select>
        );
        return (
            <div style={style.mainPanel} >
                <div style={style.north} >
                    <p style={style.title} >Date and Time</p>
                </div>
                <div style={style.info}>
                    <table>
                        <tbody>
                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777',width:'168px'}}>Time Zone:</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}>{timeZoneSelect}</td>
                            </tr>

                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777'}}>NTP Enable:</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}>
                                    <RadioButton name="ntpEnable" clickFunc={this.radioClickFunc.bind(this)} currentName={this.state.ntpRadio} disabled={false} key={Math.random()}/> <span style={{position:'inline-block',paddingRight:'15px'}}>NTP Enable</span>
                                    <RadioButton name="ntpDisable" clickFunc={this.radioClickFunc.bind(this)} currentName={this.state.ntpRadio} disabled={false} key={Math.random()}/> NTP Disable
                                </td>
                            </tr>

                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777'}}>Primary NTP Server:</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}><input style={[style.textInput,{background:'#dbdbdb'}]} type="text" autoComplete="off" placeholder="" disabled={true} value="pool.ntp.org" /></td>
                            </tr>

                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777'}}>Secondary NTP Server:</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}><input style={[style.textInput,{background:'#dbdbdb'}]} type="text" autoComplete="off" placeholder="" disabled={true} value="secondary:time.nist.gov" /></td>
                            </tr>

                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777'}}>Date:</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}><input type="text" className="datepicker" style={{lineHeight: '20px',width: '200px'}} /></td>
                            </tr>

                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777'}}>Time:(hh:mm:ss)</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}>
                                    <input style={[style.textInput,{width:'42px'}]} type="text" autoComplete="off" placeholder="" disabled={false} value="" />:
                                    <input style={[style.textInput,{width:'42px'}]} type="text" autoComplete="off" placeholder="" disabled={false} value="" />:
                                    <input style={[style.textInput,{width:'42px'}]} type="text" autoComplete="off" placeholder="" disabled={false} value="" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p style={{color:'#2f2f2f',fontSize:'12px',marginTop:'15px'}}><CheckBox disabled={false} checked={false} clickFunc={null} /> DaylightSaving Time</p>
                    <button style={[style.stdButton,{marginTop:'20px'}]}>Apply</button>
                    
                </div>
            </div>
        );
    }
};

class RadioButton extends React.Component {
    constructor(props) {
        super(props);
        var tmpImgSrc;
        switch (this.props.disabled)
        {
            case true:
                this.state = {
                    imgSrc: "img/btn_radio_disable.png"
                }
                break;
            case false:
                this.state = {
                    imgSrc: this.props.name == this.props.currentName ? "img/btn_radio_pressed.png" : "img/btn_radio.png"
                }
                break;
        }
        
    }
    handleClick() {
        /*switch (this.state.imgSrc)
        {
            case "img/btn_radio.png":
            case "img/btn_radio_over.png":
                this.setState({
                    imgSrc: "img/btn_radio_pressed.png"
                })
                break;
        }*/
        
        /*this.setState({
            imgSrc: this.props.name == this.props.currentName ? "img/btn_radio_pressed.png" : "img/btn_radio.png"
        });*/
        switch (this.props.disabled)
        {
            case true:
                break;
            case false:
                this.props.clickFunc(this.props.name);
                break;
        }
    }
    handleMouseOver() {
        switch (this.state.imgSrc)
        {
            case "img/btn_radio.png":
                this.setState({
                    imgSrc: "img/btn_radio_over.png"
                })
                break;
            case "img/btn_radio_pressed.png":
                this.setState({
                    imgSrc: "img/btn_radio_pressedover.png"
                })
                break;
        }
    }
    handleMouseOut() {
        switch (this.state.imgSrc)
        {
            case "img/btn_radio.png":
            case "img/btn_radio_over.png":
                this.setState({
                    imgSrc: "img/btn_radio.png"
                })
                break;
            case "img/btn_radio_pressed.png":
            case "img/btn_radio_pressedover.png":
                this.setState({
                    imgSrc: "img/btn_radio_pressed.png"
                })
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
    }
    handleMouseOver() {
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
    }
    handleMouseOut() {
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
    info: {
        position: 'relative',
        top: '30px',
        left: '36px',
        width: 'calc(100% - 72px)',
        border: 'none',
        paddingBottom: '30px',
    },
    tr: {
        lineHeight:'30px'
    },
    textInput: {
        width: '200px',
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

module.exports = Radium(DateAndTime);