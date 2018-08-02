import Radium from "radium";
import {StyleRoot} from 'radium';
import React from "react";

import Frameset from "./Frameset";
import Menu from "./Menu";
import RightPanel from "./RightPanel";
import Login from "./Login"
import MainStore from "../stores/MainStore";
import * as MainActions from "../actions/MainActions";

class Layout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loginState: (localStorage.getItem("LSloginState") === "true"),
			loadingDisplay: 'none',
		};
	}

	componentWillMount() {
        MainStore.on("loguot", () => {
            this.setState({
                loginState: false,
            });


			localStorage.setItem("LSloginState", "false");
			localStorage.removeItem("LStoken");
        });

		MainStore.on("loginUpdate", () => {
			localStorage.setItem("LSloginState", "true");
			let loginData = MainStore.getLoginData();
			localStorage.setItem("LStoken", loginData.token);

			setTimeout(()=>{MainActions.setLoadingDIV(0)},1);
			
            this.setState({
                loginState: !this.state.loginState,
            });
			
        });

		MainStore.on("setLoadingDIV", () => {
			var flag = MainStore.getLoadingDIV();
            this.setState({
                loadingDisplay: flag ? 'inline-block' : 'none',
            });
        });
    }

	render() {
		var lddiv = (
			<div style={[style.divLoading,{display: this.state.loadingDisplay}]}>
				<StyleRoot>
					<div style={[style.imgQNAPLoading, style.spriteImg,style.divFloatLeft]}></div>
					<div style={[style.divLoadingText,style.divFloatLeft]}>Loading...</div>
				</StyleRoot>
			</div>
		);
		var content = (this.state.loginState == true) ?
		(
			<div style={style.divLayout}>
				<Frameset loginState={this.state.loginState} />
				<Menu />
				<RightPanel />
				<LoadingDiv loadingDisplay={this.state.loadingDisplay} />
			</div>
		)
		:
		(
			<div style={style.divLayout}>
				<Frameset loginState={this.state.loginState} />
				<Login />
				<LoadingDiv loadingDisplay={this.state.loadingDisplay} />
			</div>
		);
		return content;
	}
};

@Radium
class LoadingDiv extends React.Component {

	render() {
		return(
			<div style={[style.divLoading,{display: this.props.loadingDisplay}]}>
				<StyleRoot>
					<div style={[style.imgQNAPLoading, style.spriteImg,style.divFloatLeft]}></div>
					<div style={[style.divLoadingText,style.divFloatLeft]}>Loading...</div>
				</StyleRoot>
			</div>
		);
	}
}

var loading = Radium.keyframes({
    '0%': {backgroundPosition: '0px 0px'},
    '12.5%': {backgroundPosition: '0px -30px'},
    '25%': {backgroundPosition: '0px -60px'},
    '37.5%': {backgroundPosition: '0px -90px'},
    '50%': {backgroundPosition: '0px -120px'},
    '62.5%': {backgroundPosition: '0px -150px'},
    '75%': {backgroundPosition: '0px -180px'},
    '87.5%': {backgroundPosition: '0px -210px'},
    '100%': {backgroundPosition: '0px 0px'}
})

const style = {
    divLayout: {
		height: '100%',
		width: '100%',
		border: 'none'
    },
	imgQNAPLoading: {
        backgroundImage: 'url("img/4-1.Loading_slice.png?4.2.1.20160217")',
        width: '21px',
        height: '21px',
        //-moz-animation: loading 1s steps(1) infinite;
        //-webkit-animation: loading 1s steps(1) infinite;
        animation: 'loading 1s steps(1) infinite',
        animationName: loading,
    },
    spriteImg: {
        display: 'inline-block',
        verticalAlign: 'middle',
    },
	divLoading: {
		position: 'absolute',
		padding: '24px',
		maxWidth: '300px',
		overflow: 'hidden',
		color: 'rgb(255, 255, 255)',
		zIndex: '10000000',
		border: '1px solid rgb(255, 255, 255)',
		top: 'calc((100% - 78px) / 2)',
		left: 'calc((100% - 178px) / 2)',
		backgroundColor: 'rgba(0, 124, 239, 0.85098)',
		fontSize: '16px',
		display: 'none',
	},
	divFloatLeft:{
		float: 'left',
	},
	divLoadingText: {
		paddingLeft: '16px',
	}
};

module.exports = Radium(Layout);

