import Radium from "radium";
import React from "react";

class Network extends React.Component {
    render() {
        /*var option = [];
        for (var i=0; i<this.fruData.length; i++){
            option.push(<option key={i} value={i}>{i}</option>);
        }*/
        var lanSelect =(
            <select value={0} style={{width:'auto',height:'23px',fontSize:'12px'}}>
                <option value="0">eth0</option>
            </select>
        );
        return (
            <div style={style.mainPanel} >
                <div style={style.north} >
                    <p style={style.title} >Network</p>
                </div>
                <div style={style.info}>
                    <table>
                        <thead>
                            <tr>
                                <td style={style.theadTD}>Manage network settings of the device</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777',paddingLeft:'10px'}}>LAN Interface</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}>{lanSelect}</td>
                            </tr>

                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777',paddingLeft:'10px'}}>LAN Settings</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}><CheckBox disabled={false} checked={false} clickFunc={null} /> <span style={style.span1}>---.---.---.---</span></td>
                            </tr>

                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777',paddingLeft:'10px'}}>MAC Address</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}><input style={style.textInput} type="text" autoComplete="off" placeholder="" value="00:00:00:00:00:00" /></td>
                            </tr>
                        </tbody>
                    </table>

                    <table style={{marginTop:'20px'}}>
                        <thead>
                            <tr>
                                <td style={style.theadTD}>IPv4 Configuration</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777',paddingLeft:'10px'}}>Obtain an IP address automatically</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}><CheckBox disabled={false} checked={false} clickFunc={null} /> <span style={style.span1}>Use DHCP</span></td>
                            </tr>

                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777',paddingLeft:'10px'}}>IPv4 Address</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}><input style={style.textInput} type="text" autoComplete="off" placeholder="" value="0.0.0.0" /></td>
                            </tr>

                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777',paddingLeft:'10px'}}>Subnet Mask</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}><input style={style.textInput} type="text" autoComplete="off" placeholder="" value="0.0.0.0" /></td>
                            </tr>
                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777',paddingLeft:'10px'}}>Default Gateway</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}><input style={style.textInput} type="text" autoComplete="off" placeholder="" value="0.0.0.0" /></td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <table style={{marginTop:'20px'}}>
                        <thead>
                            <tr>
                                <td style={style.theadTD}>IPv6 Configuration</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777',paddingLeft:'10px'}}>IPv6 Settings</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}><CheckBox disabled={false} checked={false} clickFunc={null} /> <span style={style.span1}>Enable</span></td>
                            </tr>

                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777',paddingLeft:'10px'}}>Obtain an IP address automatically</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}><CheckBox disabled={false} checked={false} clickFunc={null} /> <span style={style.span1}>Use DHCP</span></td>
                            </tr>

                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777',paddingLeft:'10px'}}>IPv6 Address</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}><input style={style.textInput} type="text" autoComplete="off" placeholder="" value="::" /></td>
                            </tr>
                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777',paddingLeft:'10px'}}>Subnet Prefix Length</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}><input style={style.textInput} type="text" autoComplete="off" placeholder="" value="0" /></td>
                            </tr>
                            <tr style={style.tr}>
                                <td style={{fontSize:'12px',color:'#777777',paddingLeft:'10px'}}>Default Gateway</td>
                                <td style={{fontSize:'12px',color:'#2f2f2f',paddingLeft:'10px'}}><input style={style.textInput} type="text" autoComplete="off" placeholder="" value="::" /></td>
                            </tr>
                        </tbody>
                    </table>
                    <button style={[style.stdButton,{marginTop:'20px'}]}>Apply</button>
                </div>
            </div>
        );
    }
};

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
    title: {
        margin: '10px 0 0 0',
        fontSize: '14px',
        color: '#2f2f2f',
        fontWeight: 'bold'
    },
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
    container: {
        position: 'relative'
    },
    info: {
        position: 'relative',
        top: '30px',
        left: '36px',
        width: 'calc(100% - 72px)',
        border: 'none',
        paddingBottom: '30px',
    },
    infoTitle: {
        position: 'absolute',
        top: '30px',
        left: '36px',
        fontSize: '12px',
        color: '#2f2f2f',
        fontWeight: 'bold'
    },
    textInput: {
        width: '120px',
        height: '24px',
        fontSize: '12px',
        paddingLeft: '10px',
        marginBottom: '0',
        border: '1px solid #848484'
    },
    tr: {
        lineHeight:'26px'
    },
    span1: {
        verticalAlign: 'middle'
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
    theadTD: {
        width:'250px',
        fontSize:'12px',
        fontWeight:'bold',
        color:'#2f2f2f',
        paddingBottom:'10px',
    }
};

module.exports = Radium(Network);