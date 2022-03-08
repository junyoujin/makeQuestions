import React from 'react'
import { CForm, CCol, CFormLabel } from '@coreui/react'
import { AgGridReact, AgGridColumn } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { FormControl, FormLabel, TextField, Button, Container, Typography, InputLabel, FormControlLabel } from '@mui/material';
import { Layout } from 'antd';
import axios from 'axios'
import * as CMM1001Axios from './CMM1001Axios';
import PropTypes from 'prop-types';
import Form from '../../base/Form';
import * as mqn from '../../utils/mqn';

const { Content } = Layout;

export class CMM1001 extends React.Component {

    state = {
        common: '',
        rowData_0: [],
        rowData_1: [],
        selected_grid_0: -1,
        selected_grid_1: -1,
        grid0Height: 0,
        grid1Height: 0,
        removeRows_0: [],
        removeRows_1: [],
    }

    columnDefs_0 = [
        {
            headerName: "통합코드", field: "COM_CD", suppressMenu: true, width: 70, ctype: "text", cellRendererFramework: (data) => {
                return <Form param={data}
                    maxLength={4}
                    readOnly={mqn.setReadonly}
                    onChange={(v) => this.onCellValueChangedHandler('COM_CD', v, 'grid_0', data.data.COM_CD)}>
                </Form>
            }
        },
        {
            headerName: "통합코드명", field: "COM_NM", suppressMenu: true, width: 100, ctype: "text", cellRendererFramework: (data) => {
                return <Form param={data} maxLength={40} onChange={(v) => this.onCellValueChangedHandler('COM_NM', v, 'grid_0', data.data.COM_CD)}></Form>
            }
        },
        {
            headerName: "사용여부", field: "USE_YN", suppressMenu: true, width: 80, ctype: "checkbox", cellRendererFramework: (data) => {
                return <Form param={data} onChange={(v) => this.onCellValueChangedHandler('USE_YN', v, 'grid_0', data.data.USE_YN)}></Form>
            }
        },
        {
            headerName: "설명", field: "REMK", suppressMenu: true, width: 100, ctype: "text", cellRendererFramework: (data) => {
                return <Form param={data} maxLength={400} onChange={(v) => this.onCellValueChangedHandler('REMK', v, 'grid_0', data.data.COM_CD)}></Form>
            }
        },

    ];

    columnDefs_1 = [
        { headerName: "통합코드", field: "COM_CD", suppressMenu: true, width: 70 },
        { headerName: "통합코드명", field: "COM_NM", width: 250, editable: true },
        { headerName: "사용여부", field: "USE_YN", width: 100, editable: true },
        { headerName: "표시순번", field: "DSP_SEQ", width: 100, editable: true },
        { headerName: "설명", field: "REMK", width: 100, editable: true },
    ];

    componentDidMount(e) {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        // this.searchCommonCd();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    componentDidUpdate() {
    }

    handleResize = () => {

        let grid0Height = window.innerHeight - 380;

        // 그리드 높이값 조절
        this.setState({
            grid0Height: grid0Height - (grid0Height * 0.5),
        }, () => {
            this.setState({
                grid1Height: grid0Height - (grid0Height * 0.5),
            }
            )
        });
    }

    onChangeControllers = (type, value) => {
        this.setState({ [type]: value });
    }

    onInputKeyDown = e => {
        const { key } = e;
        if (key === 'Enter') {
            this.searchCommonCd();
        }
    };

    onCellValueChangedHandler = ($id, $value, $grid) => {
        this[$grid + '_api'].forEachNode((node, index) => {
            if (index == this.state['selected_grid_' + $grid.substr(-1)]) {
                node.data[$id] = $value;
                if (node.data.updated != 'add') node.data.updated = 'update';
            }
        });
    }

    searchCommonCd = async () => {
        const _this = this;
        const { common } = this.state;
        this.setState({ selected_grid_0: -1, selected_grid_1: -1, removeRows_0: [], removeRows_1: [] }) // 초기화
        this.grid_1_api.setRowData([]);
        let params = {
            COMMON: common
        };

        await axios.post('/common/comgrp_mst', params)
            .then(res => {
                this.setState({ rowData_0: res.data }, () => {
                    this.grid_0_api.sizeColumnsToFit();
                    console.log(1)
                    this.grid_0_api.forEachNode(function (node) {
                        console.log(2)
                        if (node.childIndex == 0) {
                            node.setSelected(true);
                            _this.onMasterClickEventHandler({ rowIndex: 0 });
                        }
                    })
                })
            })
    }

    onReady = () => {
        let _this = this;
        this.grid_0_api.sizeColumnsToFit();
        console.log(this.grid_0_api)
        // this.grid_0_api.setSelectedRows([0]);
        console.log(1)
        this.grid_0_api.forEachNode(function (node) {
            if (node.childIndex == 0) _this.onMasterClickEventHandler({ rowIndex: 0 });
        })

    }


    searchCommonD = (e) => {

        // 초기화.
        this.setState({ selected_grid_1: -1 });
        this.setState({ selected_grid_0: e.rowIndex });

        let selected = this.grid_0_api.getSelectedRows();
        let params = {
            COM_CD: selected[0].COM_CD
        };
        this.grid_1_api.sizeColumnsToFit();

        axios.get('/common/comgrp_dtl', params)
            .then(res => {
                console.log(res)
                this.setState({ rowData_1: res.data }, () => {

                    this.grid_1_api.setColumnDefs(
                        [
                            {
                                headerName: "코드", field: "COM_CD", suppressMenu: true, ctype: "text", cellRendererFramework: (data) => {
                                    return <Form param={data}
                                        maxLength={4}
                                        readOnly={mqn.setReadonly}
                                        onChange={(v) => this.onCellValueChangedHandler('COM_CD', v, 'grid_1', data.data.COM_CD)}>
                                    </Form>
                                }
                            },
                            {
                                headerName: "코드명", field: "COM_NM", suppressMenu: true, ctype: "text", cellRendererFramework: (data) => {
                                    return <Form param={data} maxLength={80} onChange={(v) => this.onCellValueChangedHandler('COM_NM', v, 'grid_1', data.data.COM_CD)}></Form>
                                }
                            },
                            {
                                headerName: "사용여부", field: "USE_YN", suppressMenu: true, ctype: "checkbox", cellRendererFramework: (data) => {
                                    return <Form param={data} onChange={(v) => this.onCellValueChangedHandler('USE_YN', v, 'grid_1', data.data.USE_YN)}></Form>
                                }
                            },
                            {
                                headerName: "설명", field: "REMK", suppressMenu: true, ctype: "text", cellRendererFramework: (data) => {
                                    return <Form param={data} maxLength={400} onChange={(v) => this.onCellValueChangedHandler('REMK', v, 'grid_1', data.data.COM_CD)}></Form>
                                }
                            },
                        ]
                    );
                });


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
        } else this.searchCommonD(e);
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


    // 행추가.
    add = ($no) => {

        const _this = this;
        let tempData = [];
        let selected = this.grid_0_api.getSelectedRows();


        if ($no === '1' && selected[0].updated && selected[0].updated === 'add') {
            this.setState({
                title: '통합코드 그룹 저장',
                contents: '통합코드 그룹의 신규데이터를 먼저 저장해주세요.',
                visible: true,
                target: { rowIndex: this.state.selected_grid_0 }
            });
            return;
        }

        if ($no === '0') tempData.push({ com_grp_cd: '', com_grp_nm: '', com_mng_cd: '', com_len: '', dscrt: '', updated: 'add' });
        if ($no === '1') tempData.push({ com_grp_cd: selected[0].com_grp_cd, com_cd: '', com_nm: '', com_val: '', com_dsp_sq: '', use_yn: '1', dscrt: '', updated: 'add' });

        let res = this['grid_' + $no + '_api'].updateRowData({ add: tempData });

        // 행추가 Row에 포커스 이동.
        this['grid_' + $no + '_api'].forEachNode(function (node) {
            if (node.lastChild) {
                node.setSelected(true);

                // 포커스 이동이나 기능이 없어 스크롤 기능 사용.
                _this['grid_' + $no + '_api'].ensureIndexVisible(node.rowIndex, 'bottom');
                if ($no === '0') _this.onMasterClickEventHandler({ rowIndex: node.childIndex });
            }
            else node.setSelected(false);
        });
    };

    // 행삭제.
    delete = ($no) => {

        const _this = this;
        // const { dispatch } = this.props;
        const saveData = this.getUpdatedDataSet();

        if ($no == '0' && saveData[1].length > 0) {
            this.setState({
                title: '통합코드 상세 수정 중 행삭제',
                contents: '통합코드 상세 그리드 변경내역이 있습니다. 계속 진행하시겠습니까?',
                visible: true,
            });
            return;
        }

        let selectedData = this['grid_' + $no + '_api'].getSelectedRows();
        let res = this['grid_' + $no + '_api'].updateRowData({ remove: selectedData });

        let removed = this.state['removeRows_' + $no];
        if (res.remove[0].data.com_grp_cd != '') removed.push({ ...res.remove[0].data, updated: 'delete' });
        this.setState({ ['removeRows_' + $no]: removed });

        // 행삭제 상단 Row에 포커스 이동.(없을경우 continue)
        this['grid_' + $no + '_api'].forEachNode(function (node) {
            if (node.lastChild) {
                node.setSelected(true);

                if ($no === '0') _this.onMasterClickEventHandler({ rowIndex: node.childIndex, deleted: true });
            }
            else node.setSelected(false);
        });

        let selected = this['grid_' + $no + '_api'].getSelectedRows();

        // 하나도 없을 경우 그리드 초기화.
        // if ($no == '0' && selected.length < 1) dispatch(actions.resetSecond());
    }

    render() {
        const { common, rowData_0, rowData_1, grid0Height, grid1Height } = this.state;

        return (
            <React.Fragment>
                <Layout>
                    <Content style={{ height: '40px' }} >
                        <div style={{ float: 'left' }}>
                            <FormControlLabel
                                label="통합코드/명 "
                                labelPlacement="start"
                                control={<TextField
                                    id="outlined-secondary"
                                    variant="outlined"
                                    size='small'
                                    value={common}
                                    onChange={e => this.onChangeControllers('common', e.target.value)}
                                    onKeyDown={this.onInputKeyDown}
                                />}

                            >
                            </FormControlLabel>
                        </div>
                        <div style={{ float: 'right' }}>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.searchCommonCd()}
                            >
                                조회
                            </Button>
                            <Button
                                style={{ marginLeft: '10px' }}
                                variant="contained"
                                color="primary"
                                onClick={() => this.saveCommonCd()}
                            >
                                저장
                            </Button>

                        </div>
                    </Content>
                    <Content>
                        <Layout>
                            <Content style={{ marginTop: '30px', width: '100%' }}>
                                <div style={{ width: '100%', height: '30px' }}>
                                    <div style={{ float: 'left' }}><h5># 통합코드 그룹</h5></div>
                                    <div style={{ float: 'right', marginBottom: '5px' }}>
                                        <Button variant="outlined" onClick={() => this.add('0')} >행추가</Button>
                                        <Button variant="outlined" style={{ marginLeft: '5px' }} onClick={() => this.delete('0')}>행삭제</Button>
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
                                        columnDefs={this.columnDefs_0}
                                        rowSelection='single'
                                        animateRows
                                        enableColResize
                                        enableSorting
                                        stopEditingWhenCellsLoseFocus
                                        onGridReady={(e) => this.gridReadyEventHandler(e, 'grid_0')}
                                        onGridSizeChanged={this.gridSizeEventHandler}
                                        onRowClicked={this.onMasterClickEventHandler}
                                        editable={true}
                                        suppressRowClickSelection={true}
                                    >
                                    </AgGridReact>
                                </div>
                            </Content>

                            <Layout>
                                <Content style={{ marginTop: '30px' }}>
                                    <div style={{ width: '100%', height: '30px' }}>
                                        <div style={{ float: 'left' }}><h5># 통합코드 상세</h5></div>
                                        <div style={{ float: 'right', marginBottom: '5px' }}>
                                            <Button onClick={() => this.add('1')} variant="outlined">행추가</Button>
                                            <Button variant="outlined" style={{ marginLeft: '5px' }} onClick={() => this.delete('1')}>행삭제</Button>
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
                                            columnDefs={this.columnDefs_1}
                                            rowSelection={'single'}
                                            animateRows
                                            enableColResize
                                            enableSorting
                                            stopEditingWhenCellsLoseFocus
                                            onGridReady={(e) => this.gridReadyEventHandler(e, 'grid_1')}
                                            onGridSizeChanged={this.gridSizeEventHandler}
                                        >
                                        </AgGridReact>
                                    </div>
                                </Content>
                            </Layout>
                        </Layout>
                    </Content>
                </Layout >
            </React.Fragment >
        )
    }
}
export default CMM1001