import React from 'react'
import { AgGridReact, AgGridColumn } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { CForm, CCol, CFormLabel } from '@coreui/react'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import { Select, MenuItem, Grid, FormControl, Button, Box, FormLabel, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import { Layout, Modal } from 'antd';
const { Content } = Layout;

export class QMS1001Modal extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            common_cd: '',
            lcate_mst: [],
            mcate_mst: [],
            yn: "1",
            grid0Height: 0,
            rowData_0: [
            ],
            date: new Date(),
            age: 1,
            open: false,
            question: '',
        }

        // this.handleClose = this.handleClose.bind(this);
        // this.handleClickOpen = this.handleClickOpen.bind(this);
    }

    columnDefs_0 = [
        { headerName: "대분류", field: "LCATE_CD" },
        { headerName: "중분류", field: "MCATE_CD" },
        { headerName: "문제", field: "QUESTION" },
        { headerName: "장딥", field: "ANSWER" },
    ];

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {

        let grid0Height = window.innerHeight - 280;

        // 그리드 높이값 조절
        this.setState({ grid0Height: grid0Height });
    }

    // 그리드 element 세팅.
    gridReadyEventHandler = (e, $name) => {
        this[$name + '_api'] = e.api;
        this[$name + '_column_api'] = e.columnApi;

        e.api.sizeColumnsToFit();
    }

    gridSizeEventHandler = (e) => {
        e.api.sizeColumnsToFit();
    }


    handleClickOpen() {
        this.setState({
            popupOpen: true
        });
    }



    handleClose() {
        this.setState({
            popupOpen: false
        })
    }


    popupConfirmHandler = () => {
        // const { onConfirm } = this.props;
        this.setState({ name: '', noticelog: [] });
        // onConfirm();
    }

    popupCancelHandler = () => {
        // const { onCancel } = this.props;
        this.setState({ name: '', noticelog: [] });
        // onCancel();
    }


    render() {
        const { open, rowData_0, grid0Height } = this.state;



        return (
            <Modal
                centered
                visible={open}
                title="공지사항 로그 팝업"
                width="700px"
                onOk={this.popupConfirmHandler}
                onCancel={this.popupCancelHandler}
                cancelButtonProps={{ style: { display: 'none' } }}
            // okButtonProps={{ style: { display: 'none' } }}
            >
                <React.Fragment>
                    <Layout style={{ background: 'none' }}>
                        <Content>
                            {/* <Controllers
                                name={name}
                                loading={loading}
                                onChange={this.onChangeShopContoller}
                                onSearchClick={this.search}
                                onInputKeyDown={this.onInputKeyDown}
                            /> */}
                        </Content>
                        <Content>
                            <Layout>
                                <Content style={{ marginTop: '10px' }}>
                                    <div style={{ width: '100%' }}>
                                        <div style={{ float: 'left' }}><h2 style={{ marginBottom: '0em' }}># 공지사항 로그 조회</h2></div>
                                    </div>
                                    <div
                                        className="ag-theme-balham"
                                        style={{
                                            marginTop: '37px',
                                            height: grid0Height,
                                            width: '100%'
                                        }}
                                    >
                                        <AgGridReact
                                            columnDefs={this.columnDefs_0}
                                            rowData={rowData_0}
                                            rowSelection={'single'}
                                            animateRows
                                            stopEditingWhenGridLosesFocus
                                            onGridReady={(e) => this.gridReadyEventHandler(e, 'grid_0')}
                                            onGridSizeChanged={this.gridSizeEventHandler}
                                        >
                                        </AgGridReact>
                                    </div>
                                </Content>
                            </Layout>
                        </Content>
                    </Layout>
                </React.Fragment>
            </Modal>

        )
    }
}
export default QMS1001Modal