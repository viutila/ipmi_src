import Radium from "radium";
import React from "react";

class Alert extends React.Component {
    render() {
        return (
            <div style={style.mainPanel} >
                <div style={style.north} >
                    <p style={style.title} >Alert</p>
                </div>
            </div>
        );
    }
};

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
    }
};

module.exports = Radium(Alert);