import Radium from "radium";
import React from "react";

@Radium
class UpdateAndReset extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            page: 'Reset'
        }
    }

    onPageClick(e) {
        this.setState({
            page: e.currentTarget.value
        })
    }
    render() {
        var contentPage;
        switch (this.state.page){
            case "Reset":
                contentPage = (<ResetPage />);
                break;
            case "UpdateFW":
                contentPage = (<UpdateFW />);
                break;
            case "UpdateBIOS":
                contentPage = (<UpdateBIOS />);
                break;
            case "UpdateEC":
                contentPage = (<UpdateEC />);
                break;
        }
        return (
            <div style={style.mainPanel} >
                <div style={style.north} >
                    <div style={style.title}>
                        <button style={this.state.page=='Reset' ? style.span1 : style.span2} value="Reset" onClick={this.onPageClick.bind(this)}>Reset</button>
                        <button style={this.state.page=='UpdateFW' ? style.span1 : style.span2} value="UpdateFW" onClick={this.onPageClick.bind(this)}>Update Firmware</button>
                        <button style={this.state.page=='UpdateBIOS' ? style.span1 : style.span2} value="UpdateBIOS" onClick={this.onPageClick.bind(this)}>Update BIOS</button>
                        <button style={this.state.page=='UpdateEC' ? style.span1 : style.span2} value="UpdateEC" onClick={this.onPageClick.bind(this)}>Update EC</button>
                    </div>
                </div>
                {contentPage}
            </div>
        );
    }
};

@Radium
class ResetPage extends React.Component {
    render() {
        return(
            <div style={style.container} >
                <p style={style.infoTitle} >Factory Default  <button style={[style.stdButton,{marginLeft:'14px'}]}>Restore</button></p>
            </div>
        );
    }
}

@Radium
class UpdateFW extends React.Component {
    render() {
        return(
            <div style={style.container} >
                <div style={style.info}>
                    <table style={{fontSize:'12px',fontWeight:'bold'}}>
                        <tbody>
                            <tr><td>Current Version:</td><td style={{paddingLeft:'10px'}}>--------</td></tr>
                            <tr><td>Date:</td><td style={{paddingLeft:'10px'}}>----/--/--</td></tr>
                            <tr><td>System up time:</td><td style={{paddingLeft:'10px'}}>- days(s) - Hour(s) - Minute(s)</td></tr>
                        </tbody>
                    </table>

                    <table style={{fontSize:'12px',marginTop:'15px'}}>
                        <tbody>
                            <tr>
                                <td><CheckBox disabled={false} checked={true} key={Math.random()} /></td>
                                <td style={{paddingLeft:'10px'}}>Preserve all Configuration.</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td style={{paddingLeft:'10px'}}>(This will preserve all the configuration settings during the firmware update)</td>
                            </tr>
                        </tbody>
                    </table>

                    <table style={{fontSize:'12px',marginTop:'15px',color:'#c1272d'}}>
                        <tbody>
                            <tr><td>WARNING:</td></tr>
                            <tr><td>Please note that after entering the update mode, the widgets, other web pages and services will not work.</td></tr>
                            <tr><td>All the open widgets will be automatically closed. If the upgradation is cancelled in the middle of the wizard, the device will be reset.</td></tr>
                        </tbody>
                    </table>

                    <table style={{fontSize:'12px',marginTop:'15px',fontWeight:'bold'}}>
                        <tbody>
                            <tr><td>The protocol information to be used for firmware image transfer during this update is as follows.</td></tr>
                            <tr><td style={{textDecoration: 'underline'}}>Protocol Type: HTTPs</td></tr>
                        </tbody>
                    </table>

                    <table style={{fontSize:'12px',marginTop:'15px'}}>
                        <tbody>
                            <tr><td>Before updating system firmware, please make sure the product model and firmware version are correct.</td></tr>
                            <tr><td>Follow the steps below to update the firmware:</td></tr>
                            <tr><td>1. Download the release notes of the same version as the firmware from QNAP website <a href="http://www.qnap.com/" target="_blank">http://www.qnap.com/</a></td></tr>
                            <tr><td>Read the release notes carefully to make sure you need to update the firmware.</td></tr>
                            <tr><td>2. Before updating system firmware, back up all disk data on the server to avoid any potential data loss during system update</td></tr>
                            <tr><td>3. Click the [Browse...] button to select the correct firmware image for system update.</td></tr>
                            <tr><td>Click the [Update System] button to update the firmware.</td></tr>
                        </tbody>
                    </table>

                    <table style={{fontSize:'12px',marginTop:'15px',color:'#195a87'}}>
                        <tbody>
                            <tr><td>Firmware update may take tens of seconds to several minutes to complete. Please wait patiently.</td></tr>
                            <tr><td>The system will inform you when BIOS update is completed.</td></tr>
                        </tbody>
                    </table>

                    <div style={{marginTop:'15px'}}>
                        <InputFile actionBtText="Update Firmware" />
                    </div>
                </div>
            </div>
        );
    }
}

@Radium
class UpdateBIOS extends React.Component {
    render() {
        return(
            <div style={style.container} >
                <div style={style.info}>
                    <table style={{fontSize:'12px',fontWeight:'bold'}}>
                        <tbody>
                            <tr><td>Current Version:</td><td style={{paddingLeft:'10px'}}>--------</td></tr>
                        </tbody>
                    </table>

                    <table style={{fontSize:'12px',marginTop:'15px'}}>
                        <tbody>
                            <tr>
                                <td>BIOS update may take tens of seconds to several minutes to complete. Please wait patiently</td>
                            </tr>
                            <tr>
                                <td> The system will inform you when BIOS update is completed.</td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={{marginTop:'15px'}}>
                        <InputFile actionBtText="Update BIOS" />
                    </div>
                </div>
            </div>
        );
    }
}

@Radium
class UpdateEC extends React.Component {
    render() {
        return(
            <div style={style.container} >
                <div style={style.info}>
                    <table style={{fontSize:'12px',fontWeight:'bold'}}>
                        <tbody>
                            <tr><td>Current Version:</td><td style={{paddingLeft:'10px'}}>--------</td></tr>
                        </tbody>
                    </table>

                    <table style={{fontSize:'12px',marginTop:'15px'}}>
                        <tbody>
                            <tr>
                                <td>EC update may take tens of seconds to several minutes to complete. Please wait patiently</td>
                            </tr>
                            <tr>
                                <td> The system will inform you when EC update is completed.</td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={{marginTop:'15px'}}>
                        <InputFile actionBtText="Update EC" />
                    </div>
                </div>
            </div>
        );
    }
}

@Radium
class InputFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filePath: ''
        }
    }
    handleFileChange(e) {
        this.setState({
            filePath: e.currentTarget.files[0].name
        })
    }
    handleBrowseClick() {
        this.refs.InputFile.getDOMNode().click();
    }
    render() {
        return(
            <div>
                <input type="text" style={{position:'absolute',width: '246px', height:'22px',left:'0',zIndex:'3',color:'#777',fontSize:'12px'}} value={this.state.filePath} />
                <input type="file" ref="InputFile" style={{position:'absolute',width: '246px', height:'22px',left:'0',zIndex:'3',color:'#777',opacity: '0'}} onChange={this.handleFileChange.bind(this)} />
                <button style={[style.stdButton,{marginLeft: '254px'}]} key="1" onClick={this.handleBrowseClick.bind(this)}>Browse...</button>
                <button style={[style.stdButton,{marginLeft: '8px'}]} key="2">{this.props.actionBtText}</button>
            </div>
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
        position: 'absolute',
        bottom: '0px',
        fontSize: '14px',
        color: '#2f2f2f',
        fontWeight: 'bold'
    },
    container: {
        position: 'relative'
    },
    info: {
        position: 'absolute',
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
    span1: {
        borderBottom: '2px solid #2f2f2f',
        cursor: 'pointer',
        position: 'relative',
        textAlign: 'center',
        display: 'inline-block',
        background: '#ffffff',
        padding: '0 25px 0 25px',
    },
    span2: {
        cursor: 'pointer',
        position: 'relative',
        textAlign: 'center',
        background: '#ffffff',
        padding: '0 25px 0 25px',
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
    }
};

module.exports = Radium(UpdateAndReset);