import Radium from "radium";
import React from "react";

class Log extends React.Component {
    render() {
        return (
            <div style={style.mainPanel} >
                <div style={style.north} >
                    <p style={style.title} >Log</p>
                </div>
                <div style={style.container} >
                    <p style={style.infoTitle} >System Event Log (SEL) </p>
                    <div style={style.info} >
                        <table style={style.table}>
                            <thead style={style.thead} >
                                <tr>
                                    <th style={style.th1} >Serverity</th>
                                    <th style={style.th2} >Date/Time</th>
                                    <th style={style.th3} >Description</th>
                                </tr>
                            </thead>
                            <tbody style={style.tbody} >
                                <tr>
                                    <td style={style.td1e} ><img src="img/ok_s.png" /></td>
                                    <td style={style.td2e} >Tue Mar 03 2016 12: 16: 32</td>
                                    <td style={style.td3e} >C: boot completed</td>
                                </tr>
                                <tr>
                                    <td style={style.td1o} ><img src="img/ok_s.png" /></td>
                                    <td style={style.td2o} >Tue Mar 03 2016 12: 16: 32</td>
                                    <td style={style.td3o} >C: boot completed</td>
                                </tr>
                                <tr>
                                    <td style={style.td1e} ><img src="img/error_s.png" /></td>
                                    <td style={style.td2e} >Tue Mar 03 2016 12: 25: 40</td>
                                    <td style={style.td3e} >The power input for power supply 1 is lost</td>
                                </tr>
                                <tr>
                                    <td style={style.td1o} ><img src="img/ok_s.png" /></td>
                                    <td style={style.td2o} >Tue Mar 03 2016 12: 16: 32</td>
                                    <td style={style.td3o} >C: boot completed</td>
                                </tr>
                                <tr>
                                    <td style={style.td1e} ><img src="img/ok_s.png" /></td>
                                    <td style={style.td2e} >Tue Mar 03 2016 12: 16: 32</td>
                                    <td style={style.td3e} >C: boot completed</td>
                                </tr>
                                <tr>
                                    <td style={style.td1o} ><img src="img/warning_s.png" /></td>
                                    <td style={style.td2o} >Tue Mar 03 2016 12: 25: 40</td>
                                    <td style={style.td3o} >Server power restored</td>
                                </tr>
                                <tr>
                                    <td style={style.td1e} ><img src="img/ok_s.png" /></td>
                                    <td style={style.td2e} >Tue Mar 03 2016 12: 16: 32</td>
                                    <td style={style.td3e} >C: boot completed</td>
                                </tr>
                                <tr>
                                    <td style={style.td1o} ><img src="img/ok_s.png" /></td>
                                    <td style={style.td2o} >Tue Mar 03 2016 12: 16: 32</td>
                                    <td style={style.td3o} >C: boot completed</td>
                                </tr>
                                <tr>
                                    <td style={style.td1e} ></td>
                                    <td style={style.td2e} ></td>
                                    <td style={style.td3e} ></td>
                                </tr>
                                <tr>
                                    <td style={style.td1o} ></td>
                                    <td style={style.td2o} ></td>
                                    <td style={style.td3o} ></td>
                                </tr>
                                <tr>
                                    <td style={style.td1e} ></td>
                                    <td style={style.td2e} ></td>
                                    <td style={style.td3e} ></td>
                                </tr>
                                <tr>
                                    <td style={style.td1o} ></td>
                                    <td style={style.td2o} ></td>
                                    <td style={style.td3o} ></td>
                                </tr>
                                <tr>
                                    <td style={style.td1e} ></td>
                                    <td style={style.td2e} ></td>
                                    <td style={style.td3e} ></td>
                                </tr>
                                <tr>
                                    <td style={style.td1o} ></td>
                                    <td style={style.td2o} ></td>
                                    <td style={style.td3o} ></td>
                                </tr>
                                <tr>
                                    <td style={style.td1e} ></td>
                                    <td style={style.td2e} ></td>
                                    <td style={style.td3e} ></td>
                                </tr>
                                <tr>
                                    <td style={style.td1o} ></td>
                                    <td style={style.td2o} ></td>
                                    <td style={style.td3o} ></td>
                                </tr>
                            </tbody>
                        </table>
                        <div style={style.pageController} >
                            <button style={style.goFirstBtn} />
                            <button style={style.goLastBtn} />
                            <button style={style.refreshBtn} />
                        </div>
                    </div>
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
        fontWeight: '900'
    },
    container: {
        position: 'relative'
    },
    infoTitle: {
        position: 'absolute',
        top: '30px',
        left: '36px',
        fontSize: '12px',
        color: '#2f2f2f'
    },
    info: {
        position: 'absolute',
        top: '52px',
        left: '36px',
        width: 'calc(100% - 72px)',
        border: 'none'
    },
    table: {
        border: '1px solid #c8c8c8',
        width: '100%'
    },
    thead: {
        fontSize: '12px',
        color: '#ffffff',
        padding: '0 0 0 5px',
        background: '#808898'
    },
    th1: {
        width: '10%',
        padding: '0 0 0 10px',
        height: '28px',
        borderRight: '1px solid #a1a9bb'
    },
    th2: {
        width: '40%',
        padding: '0 0 0 10px',
        height: '28px',
        borderRight: '1px solid #a1a9bb'
    },
    th3: {
        width: '50%',
        padding: '0 0 0 10px',
        height: '28px',
    },
    tbody: {
        fontSize: '12px',
        color: '#2f2f2f',
        padding: '0 0 0 10px'
    },
    td1e: {
        width: '10%',
        height: '28px',
        borderRight: '1px solid #c8c8c8',
        background: '#ffffff',
        textAlign: 'center'
    },
    td2e: {
        width: '40%',
        padding: '0 0 0 10px',
        height: '28px',
        borderRight: '1px solid #c8c8c8',
        background: '#ffffff'
    },
    td3e: {
        width: '50%',
        padding: '0 0 0 10px',
        height: '28px',
        background: '#ffffff'
    },
    td1o: {
        width: '10%',
        height: '28px',
        borderRight: '1px solid #c8c8c8',
        background: '#f4f4f4',
        textAlign: 'center'
    },
    td2o: {
        width: '40%',
        padding: '0 0 0 10px',
        height: '28px',
        borderRight: '1px solid #c8c8c8',
        background: '#f4f4f4'
    },
    td3o: {
        width: '50%',
        padding: '0 0 0 10px',
        height: '28px',
        background: '#f4f4f4'
    },
    pageController: {
        width: '100%',
        height: '25px',
        border: '1px solid #e4e4e4',
        fontSize: '12px',
        color: '#2f2f2f',
        verticalAlign: 'middle',
    },
    goFirstBtn: {
        width: '16px',
        height: '15px',
        background: 'url(img/first_n.png) top left / contain no-repeat',
        verticalAlign: 'middle',
        margin: '0 10px 0 10px'
    },
    goLastBtn: {
        width: '16px',
        height: '15px',
        background: 'url(img/last_n.png) top left / contain no-repeat',
        verticalAlign: 'middle',
        margin: '0 10px 0 10px'
    },
    refreshBtn: {
        width: '16px',
        height: '15px',
        background: 'url(img/refresh.png) top left / contain no-repeat',
        verticalAlign: 'middle',
        margin: '0 0 0 10px'
    },
    text: {
        verticalAlign: 'middle',
        //margin: '0 10px 0 10px',
        //marginTop: '6px',
        marginLeft: '10px',
        //display: 'inline-block'
    }
};

module.exports = Radium(Log);