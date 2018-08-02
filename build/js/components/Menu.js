import Radium from "radium";
import React from "react";
import MainStore from "../stores/MainStore";
import * as MainActions from "../actions/MainActions";

/*
class Level2 extends React.Component {
    setPage(v) {
        MainActions.setPage(v);
        //console.log(v);
    }

    render() {
        return (
            <button style={this.props.bstyle} onClick={this.setPage.bind(this, this.props.title) }>
                <p style={this.props.pstyle} >{this.props.title}</p>
            </button>
        );
    }
}

class Level2DIV extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            displayStyle: this.props.display
        };
    }
    setState(){
        this.setState({displayStyle: "none"});
    }
    render() {
        return (
            <div style={{display: this.state.displayStyle}}>
                {this.props.children}
            </div>
        );
    }
}

class Level1 extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            displayStyle: 'inline'
        };
    }
    
    handleClick(v,e){
        var parent = this.props.parent;
        //console.log(this.props.children);
        //this.props.children.props.style = "display: inline";
        //this.props.children.setProps({style: "inline"});
        //this.props.children.setState;
        if (e.target.getAttribute("src") == "img/arrow_up.png")
        {
            e.target.setAttribute("src", "img/arrow_down.png");
            switch (v) {
                case "div_System":
                    parent.refs.div_System.style.display = "none";
                    break;
                case "div_SvrHealth":
                    parent.refs.div_SvrHealth.style.display = "none";
                    break;
                case "div_Config":
                    parent.refs.div_Config.style.display = "none";
                    break;
            }
        }
        else
        {
            e.target.setAttribute("src", "img/arrow_up.png");
            switch (v) {
                case "div_System":
                    parent.refs.div_System.style.display = "inline";
                    break;
                case "div_SvrHealth":
                    parent.refs.div_SvrHealth.style.display = "inline";
                    break;
                case "div_Config":
                    parent.refs.div_Config.style.display = "inline";
                    break;
            }
        }
    }

    render() {
        var initIconSrc = this.props.initState ? "img/arrow_up.png" : "img/arrow_down.png"
        return (
            <div>
                <div style={style.level1} >
                    <img src={this.props.imageSrc} style={style.titleIcon} />
                    <p style={style.titleLv1} >{this.props.title}</p>
                    <img src={initIconSrc} style={style.toogleIcon} onClick={this.handleClick.bind(this,this.props.bindDiv)} />
                </div>
                {this.props.children}
            </div>
        );
    }
}
*/
@Radium
class TLevel1 extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            displayStyle: this.props.initState ? 'inline' :　'none',
            toogleIconSrc: this.props.initState ? "img/arrow_up.png" : "img/arrow_down.png",
        };
    }

    handleClick(){
        //console.log(this.props.children.props.display);
        //this.props.children.setState();
        this.setState({
            displayStyle: this.state.displayStyle == 'none' ? 'inline' :　'none',
            toogleIconSrc: this.state.toogleIconSrc == "img/arrow_up.png" ? "img/arrow_down.png" : "img/arrow_up.png",
        });
    }

    render(){
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                display: this.state.displayStyle
            })
        );
        return (
            <div>
                <div style={style.level1} onClick={this.handleClick.bind(this)} >
                    <img src={this.props.imageSrc} style={style.titleIcon} />
                    <p style={style.titleLv1} >{this.props.title}</p>
                    <img src={this.state.toogleIconSrc} style={style.toogleIcon} />
                </div>
                {childrenWithProps}
            </div>
        );
    }
}

@Radium
class TLevel2 extends React.Component {
    render() {
        return (
            <div style={{display: this.props.display}}>
                {this.props.children}
            </div>
        );
    }
}

@Radium
class TLevel3 extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            displayStyle: 'inline'
        };
    }

    setPage(v) {
        this.props.clickFunc(v);
        MainActions.setPage(v);
        //console.log(v);
    }

    render() {
        var bStyle = this.props.bStyleFunc!=null ? this.props.bStyleFunc(this.props.title) : style.level2Working;
        return (
            <button style={bStyle} onClick={this.setPage.bind(this, this.props.title)}>
                {this.props.title}
            </button>
        );
    }
}

@Radium
class Menu extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            displayFlag: 'none',
            currentPage: 'Summary',
        };
    }

    handleTLevel3Click(v)
    {
        this.setState({
            currentPage: v
        })
    }

    handleBstyle(v)
    {
        var rStyle = this.state.currentPage==v ? style.level2Active :  style.level2;
        return rStyle;
    };

    render() {
        return (
            <div style={style.divMenu} >
                <TLevel1 title="System" imageSrc="img/System.png" initState={true}>
                    <TLevel2>
                        <TLevel3 title="Summary" bStyleFunc={this.handleBstyle.bind(this)} clickFunc={this.handleTLevel3Click.bind(this)} />
                        <TLevel3 title="FRU" bStyleFunc={this.handleBstyle.bind(this)} clickFunc={this.handleTLevel3Click.bind(this)} />
                        <TLevel3 title="Log" bStyleFunc={null} clickFunc={this.handleTLevel3Click.bind(this)} />
                        <TLevel3 title="Alert" bStyleFunc={null} clickFunc={this.handleTLevel3Click.bind(this)} />
                        <TLevel3 title="Hardware Topology" bStyleFunc={this.handleBstyle.bind(this)} clickFunc={this.handleTLevel3Click.bind(this)} />
                    </TLevel2>
                </TLevel1>

                <TLevel1 title="Server Health" imageSrc="img/Server Health.png" initState={false}>
                    <TLevel2>
                        <TLevel3 title="Health Summary" bStyleFunc={this.handleBstyle.bind(this)} clickFunc={this.handleTLevel3Click.bind(this)}/>
                        <TLevel3 title="Power" bStyleFunc={this.handleBstyle.bind(this)} clickFunc={this.handleTLevel3Click.bind(this)} />
                        <TLevel3 title="Thermal" bStyleFunc={this.handleBstyle.bind(this)} clickFunc={this.handleTLevel3Click.bind(this)}/>
                        <TLevel3 title="Fan" bStyleFunc={this.handleBstyle.bind(this)} clickFunc={this.handleTLevel3Click.bind(this)}/>
                        <TLevel3 title="Voltage" bStyleFunc={this.handleBstyle.bind(this)} clickFunc={this.handleTLevel3Click.bind(this)}/>
                    </TLevel2>
                </TLevel1>

                <TLevel1 title="Configuration" imageSrc="img/Configuration.png" initState={false}>
                    <TLevel2>
                        <TLevel3 title="Date And Time" bStyleFunc={this.handleBstyle.bind(this)} clickFunc={this.handleTLevel3Click.bind(this)} />
                        <TLevel3 title="User" bStyleFunc={this.handleBstyle.bind(this)} clickFunc={this.handleTLevel3Click.bind(this)} />
                        <TLevel3 title="Network" bStyleFunc={this.handleBstyle.bind(this)} clickFunc={this.handleTLevel3Click.bind(this)} />
                        <TLevel3 title="Update And Reset" bStyleFunc={this.handleBstyle.bind(this)} clickFunc={this.handleTLevel3Click.bind(this)} />
                    </TLevel2>
                </TLevel1>
            </div>
        );
    }
};

const style = {
    divChildMenu: {
        display: 'none'
    },
    divMenu: {
        position: 'relative',
        height: 'calc(100% - 44px)',
        width: '220px',
        borderRight: '1px solid #d9d9d9',
        background: '#f7f7f7',
        padding: '2px 0 0 0',
        lineHeight: '0'
    },
    titleIcon: {
        position: 'absolute',
        height: '24px',
        width: '24px',
        top: '4px',
        left: '10px'
    },
    level1: {
        position: 'relative',
        height: '32px',
        width: '100%',
        margin: '8px 0 0 0',
        background: 'rgba(0, 0, 0, 0)',
        cursor: 'pointer',
        ':hover': {background: '#e9e9e9'},
    },
    level2: {
        position: 'relative',
        height: '32px',
        width: '100%',
        background: 'rgba(0, 0, 0, 0)',
        borderLeft: '2px solid #f7f7f7',
        fontSize: '12px',
        color: '#2f2f2f',
        textAlign: 'left',
        paddingLeft: '50px',
        ':hover': {background: '#e9e9e9', borderLeft: '2px solid #e9e9e9'},
    },
    level2Active: {
        position: 'relative',
        height: '32px',
        width: '100%',
        background: '#dfdfdf',
        borderLeft: '2px solid #2f2f2f',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#2f2f2f',
        textAlign: 'left',
        paddingLeft: '50px',
        ':hover': {background: '#dfdfdf', borderLeft: '2px solid #2f2f2f'}, //:hover property 
    },
    level2Working: {
        position: 'relative',
        height: '32px',
        width: '100%',
        background: 'rgba(0, 0, 0, 0)',
        borderLeft: '2px solid #f7f7f7',
        fontSize: '12px',
        color: '#cccccc',
        textAlign: 'left',
        paddingLeft: '50px',
        ':hover': {background: '#e9e9e9', borderLeft: '2px solid #e9e9e9'},
    },
    titleLv1: {
        position: 'absolute',
        left: '44px',
        top: '16px',
        fontSize: '13px',
        color: '#2f2f2f',
        cursor: 'pointer',
    },
    titleLv2: {
        position: 'absolute',
        left: '50px',
        top: '16px',
        fontSize: '12px',
        color: '#2f2f2f'
    },
    titleLv2Working: {
        position: 'absolute',
        left: '50px',
        top: '16px',
        fontSize: '12px',
        color: '#cccccc'
    },
    toogleIcon: {
        position: 'absolute',
        right: '14px',
        top: '12px',
        height: '7px',
        width: '12px',
    },
};

module.exports = Radium(Menu);