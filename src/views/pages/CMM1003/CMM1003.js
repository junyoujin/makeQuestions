import React from 'react'
import { CForm, CCol, CFormLabel } from '@coreui/react'
import { AgGridReact, AgGridColumn } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { FormControl, FormLabel, TextField, Button, Container, Typography, InputLabel, FormControlLabel, Grid } from '@mui/material';
import { Layout } from 'antd';
import axios from 'axios'
const { Content, Sider, Header } = Layout;

export class CMM1003 extends React.Component {

    state = {
        common: '',
        rowData_0: [],
        rowData_1: [],
        columnDefs_0: [
            { headerName: "Part코드", field: "PART_CD" },
            { headerName: "Part명", field: "PART_NM" },
            { headerName: "사용여부", field: "USE_YN" },
            { headerName: "설명", field: "REMK" },
            // { headerName: "통합코드", field: "COM_CD", width: 150 },
            // { headerName: "통합코드명", field: "COM_NM", width: 250 },
            // { headerName: "사용여부", field: "USE_YN", width: 100 },
            // { headerName: "설명", field: "REMK", width: 200 },
        ],
        columnDefs_1: [
            { headerName: "Chapther코드", field: "CPR_CD", width: 150 },
            { headerName: "Chapther명", field: "CPR_NM", width: 250 },
            { headerName: "표시순번", field: "DSP_SEQ" },
            { headerName: "사용여부", field: "USE_YN", width: 100 },
            { headerName: "설명", field: "REMK", width: 100 },
        ],
        selected_grid_0: -1,
        selected_grid_1: -1,
        grid0Height: 0,
        grid1Height: 0,
        removeRows_0: [],
        removeRows_1: [],
    }

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
        this.setState({
            grid0Height: grid0Height,
        }, () => {
            this.setState({
                grid1Height: grid0Height,
            }
            )
        });
    }

    searchPartMst = () => {
        const _this = this;
        axios.post('/common/part_mst')
            .then(res => {
                this.setState({ rowData_0: res.data }, () => {
                    this.grid_0_api.sizeColumnsToFit();
                    this.grid_0_api.forEachNode(function (node) {
                        if (node.childIndex == 0) {
                            node.setSelected(true, true);
                            _this.onMasterClickEventHandler({ rowIndex: 0 })
                        }
                    })
                })
            })
            .catch()
    }


    searchPartCprMst = (e) => {
        // 초기화.
        this.setState({ selected_grid_1: -1 });
        this.setState({ selected_grid_0: e.rowIndex });

        let selected = this.grid_0_api.getSelectedRows();
        let params = {
            PART_CD: selected[0].PART_CD
        };
        this.grid_1_api.sizeColumnsToFit();
        axios.post('/common/chapther_mst', params)
            .then(res => {
                this.setState({ rowData_1: res.data }, () => {
                    console.log(res.data)
                    this.grid_0_api.sizeColumnsToFit();
                })
            })
            .catch()
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


    // 통합코드 그룹 마스터 그리드 로우 클릭 이벤트.
    onMasterClickEventHandler = (e) => {
        const { selected_grid_0 } = this.state;
        // 같은 로우 클릭 시 재조회 안함.
        if (selected_grid_0 !== -1 && !e.deleted && selected_grid_0 === e.rowIndex) return;

        this.grid_0_api.forEachNode((node, index) => {
            if (e.rowIndex == index) node.setSelected(true, true);
        });

        // 재조회 시 신규/수정/삭제 상태체크하여 여부 확인.
        const saveData = this.getUpdatedDataSet();
        if (saveData[1].length > 0) {
            this.setState({
                title: '통합코드 상세 수정 중 이동',
                contents: '통합코드 상세 그리드 변경내역이 있습니다. 계속 진행하시겠습니까?',
                visible: true,
                target: e,
            });
        } else this.searchPartCprMst(e);
    }

    onDetailClickEventHandler = (e) => {

        this.grid_1_api.forEachNode((node, index) => {
            if (e.rowIndex == index) node.setSelected(true, true);
        });

        this.setState({ selected_grid_1: e.rowIndex });
    }


    getUpdatedDataSet = () => {

        let i = 0, saveData_0 = [], saveData_1 = [];
        const { removeRows_0, removeRows_1 } = this.state;

        // 통합코드 그룹 마스터 헤더 신규/수정.
        this.grid_0_api.forEachNode((node, index) => {
            if (node.data.updated == 'add' || node.data.updated == 'update') saveData_0.push(node.data);
        });

        // 통합코드 그룹 마스터 헤더 삭제.
        for (i = 0; i < removeRows_0.length; ++i) {
            saveData_0.push(removeRows_0[i]);
        }

        // 통합코드 그룹 마스터 상세 신규/수정.
        this.grid_1_api.forEachNode((node, index) => {
            if (node.data.updated == 'add' || node.data.updated == 'update') saveData_1.push(node.data);
        });

        // 통합코드 그룹 마스터 상세 삭제.
        for (i = 0; i < removeRows_1.length; ++i) {
            saveData_1.push(removeRows_1[i]);
        }

        return [saveData_0, saveData_1];
    }


    render() {
        const { rowData_0, rowData_1, columnDefs_0, columnDefs_1, grid0Height, grid1Height } = this.state;

        return (
            <React.Fragment>
                <Layout>
                    <Header style={{ height: '40px' }} >

                        <div style={{ float: 'right' }}>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.searchPartMst()}
                            >
                                조회
                            </Button>
                            <Button
                                style={{ marginLeft: '10px' }}
                                variant="contained"
                                color="primary"
                                onClick={() => this.saveChpMst()}
                            >
                                저장
                            </Button>

                        </div>
                    </Header>
                    <Layout>
                        <Grid container spacing={1}>
                            <Grid container item xs>
                                <div style={{ width: '100%', height: '30px', marginTop: '10px' }}>
                                    <div style={{ float: 'left' }}><h5># Part 목록</h5></div>
                                    <div style={{ float: 'right', marginBottom: '5px' }}>
                                        <Button onClick={() => this.add('0')} >행추가</Button>
                                        {/* <Button style={{ marginLeft: '5px' }} onClick={() => this.delete('0')}>행삭제</Button> */}
                                    </div>
                                </div>
                                <div className="ag-theme-balham"
                                    style={{
                                        marginTop: '15px',
                                        height: grid0Height,
                                        width: '100%'
                                    }}
                                >
                                    <AgGridReact
                                        rowData={rowData_0}
                                        columnDefs={columnDefs_0}
                                        rowSelection={'single'}
                                        animateRows
                                        enableColResize
                                        enableSorting
                                        stopEditingWhenCellsLoseFocus
                                        editable={true}
                                        suppressRowClickSelection={true}
                                        onGridReady={(e) => this.gridReadyEventHandler(e, 'grid_0')}
                                        onGridSizeChanged={this.gridSizeEventHandler}
                                        onRowClicked={this.onMasterClickEventHandler}
                                    >
                                    </AgGridReact>
                                </div>

                            </Grid>
                            <Grid container item xs>
                                <div style={{ width: '100%', height: '30px', marginTop: '10px' }}>
                                    <div style={{ float: 'left' }}><h5># Chapther 목록</h5></div>
                                    <div style={{ float: 'right', marginBottom: '5px' }}>
                                        <Button onClick={() => this.add('1')} >행추가</Button>
                                        {/* <Button style={{ marginLeft: '5px' }} onClick={() => this.delete('1')}>행삭제</Button> */}
                                    </div>
                                </div>
                                <div className="ag-theme-balham"
                                    style={{
                                        marginTop: '15px',
                                        height: grid1Height,
                                        width: '100%'
                                    }}
                                >
                                    <AgGridReact
                                        rowData={rowData_1}
                                        columnDefs={columnDefs_1}
                                        rowSelection={'single'}
                                        animateRows
                                        enableColResize
                                        enableSorting
                                        stopEditingWhenCellsLoseFocus
                                        editable={true}
                                        onGridReady={(e) => this.gridReadyEventHandler(e, 'grid_1')}
                                        onGridSizeChanged={this.gridSizeEventHandler}
                                    >
                                    </AgGridReact>
                                </div>

                            </Grid>
                        </Grid>
                    </Layout>

                </Layout >
            </React.Fragment >
        )
    }
}
export default CMM1003