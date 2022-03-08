import React from 'react'
import { AgGridReact, AgGridColumn } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { CForm, CCol, CFormLabel } from '@coreui/react'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import { Modal, Select, MenuItem, Grid, FormControl, Button, Box, FormLabel, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import QMS1001Modal from '../QMS1001/QMS1001Modal';
import { Layout } from 'antd';
const { Content } = Layout;

export class QMS1001 extends React.Component {

    state = {
        common_cd: '',
        lcate_mst: [],
        mcate_mst: [],
        yn: "1",
        grid0Height: 0,
        rowData_0: [
        ],
        date: new Date(),
        age: 1,
        popupOpen: false,
    }

    columnDefs_0 = [
        { headerName: "대분류", field: "LCATE_CD" },
        { headerName: "중분류", field: "MCATE_CD" },
        { headerName: "문제", field: "QUESTION" },
        { headerName: "장딥", field: "ANSWER" },
        { headerName: "번호", field: "NUMBER", width: 150 },
        { headerName: "보기수", field: "EXAMPLE_QTY", width: 250 },
        { headerName: "난이도", field: "LEVEL", width: 100 },
        { headerName: "유형", field: "TYPE", width: 200 },
        { headerName: "파트", field: "PART", width: 200 },
        { headerName: "쳅터", field: "CHAPTHER", width: 200 },
        { headerName: "연도", field: "YEAR", width: 200 },
        { headerName: "기출", field: "PREV_YN", width: 200 },
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

    search = async () => {
        const _this = this;
        this.setState({ selected_grid_0: -1, }) // 초기화
        this.grid_0_api.setRowData([]);
        let params = {
            // LCATE_CD: this.state.lcate_mst,
            // MCATE_CD: this.state.mcate_mst,
            // YEAR: this.state.date,
            // PREV_YN: this.state.yn
            LCATE_CD: '',
            MCATE_CD: '',
            YEAR: '',
            PREV_YN: '',

        };

        await axios.post('/question/search', params)
            .then(res => {
                this.setState({ rowData_0: res.data }, () => {
                    this.grid_0_api.sizeColumnsToFit();
                })
            })
    }


    // 그리드 로우 더블 클릭 이벤트. => 팝업 오픈
    onMasterDoubleClickEventHandler = (e) => {

        const { insert_grid_0, selected_grid_0, insert_grid_1 } = this.state;
        this.grid_0_api.stopEditing();

        this.setState({ popupOpen: true, QMS1001Modal: true, selected_grid_0: e.rowIndex });

    }


    getUpdatedDataSet = () => {

        let i = 0, saveData_0 = [];
        const { removeRows_0 } = this.state;

        // 통합코드 그룹 마스터 헤더 신규/수정.
        this.grid_0_api.forEachNode((node, index) => {
            if (node.data.updated == 'add' || node.data.updated == 'update') saveData_0.push(node.data);
        });

        // 통합코드 그룹 마스터 헤더 삭제.
        for (i = 0; i < removeRows_0.length; ++i) {
            saveData_0.push(removeRows_0[i]);
        }

        return [saveData_0];
    }

    setDate(newData) {
        console.log(newData);
        this.setState({ date: newData })
    }

    handleChange = (e) => {
        console.log(e)
        this.setState({ age: e.target.value })
    }

    handleYnChange = (e) => {
        console.log(e)
        this.setState({ yn: e.target.value })
    }

    handleClose = () => {
        this.setState({ popupOpen: false })
    }

    handleOpen = () => {
        this.setState({ popupOpen: true })
    }

    onCloseModal = () => {
        // this.setState({ [type]: false });
    }

    // 상세 데이터  이벤트 등록.
    onPopupConfirmHandler = ($data) => {
        this.setState({ popupOpen: false }, () => {
            //   this.search();
        });
    }

    onPopupCancelHandler = () => {
        this.setState({ popupOpen: false, question: JSON.stringify('') });
    }

    render() {
        const { date, age, rowData, yn, lcate_mst, mcate_mst, rowData_0, grid0Height, popupOpen, question } = this.state;



        return (
            <React.Fragment>
                <Layout>
                    <Content style={{ height: '100px' }} >
                        <div style={{ float: 'left' }}>
                            <Grid container spacing={1}>
                                <Grid container item xs={5}>
                                    <div style={{ display: 'inline' }}>
                                        <FormControlLabel
                                            label="시험분류"
                                            labelPlacement="start"
                                            control={<Select
                                                id="demo-simple-select"
                                                value={age}
                                                label="Age"
                                                onChange={this.handleChange}
                                                style={{ display: 'inline' }}
                                                size='small'

                                            >
                                                {lcate_mst.map((item, index) => (
                                                    <MenuItem key={item.CATE_CD} value={item.CATE_CD}>{item.CATE_NM}</MenuItem>
                                                ))}
                                            </Select>}
                                        >
                                        </FormControlLabel>

                                        <FormControl fullWidth>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={age}
                                                label="Age"
                                                size='small'
                                                onChange={this.handleChange}
                                            >
                                                {mcate_mst.map((item, index) => (
                                                    <MenuItem key={item.CATE_CD} value={item.CATE_CD}>{item.CATE_NM}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </Grid>

                                <Grid container item xs={3}>
                                    <FormControlLabel
                                        label="출제년도"
                                        labelPlacement="start"
                                        control={<LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                views={['year']}
                                                value={date}
                                                size='small'
                                                onChange={(newData) => {
                                                    this.setDate(newData);
                                                }}
                                                renderInput={(newData) => <TextField {...newData} helperText={null} />}
                                            />
                                        </LocalizationProvider>}
                                    >
                                    </FormControlLabel>
                                </Grid>
                                <Grid container item xs>
                                    <FormControlLabel
                                        label="기출여부"
                                        labelPlacement="start"
                                        control={<FormControl component="fieldset">
                                            <RadioGroup
                                                row aria-label="yn"
                                                name="row-radio-buttons-group"
                                                value={yn}
                                                size='small'
                                                onChange={this.handleYnChange}
                                            >
                                                <FormControlLabel value="1" control={<Radio />} label="Y" />
                                                <FormControlLabel value="0" control={<Radio />} label="N" />
                                            </RadioGroup>
                                        </FormControl>}
                                    >
                                    </FormControlLabel>
                                </Grid>
                            </Grid>

                        </div>
                        <div style={{ float: 'right' }}>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.search()}
                            >
                                조회
                            </Button>
                            <Button
                                style={{ marginLeft: '10px' }}
                                variant="contained"
                                color="primary"
                                onClick={this.handleOpen}
                            >
                                신규
                            </Button>

                        </div>
                    </Content>
                </Layout>


                <Layout>
                    <Content style={{ marginTop: '30px', width: '100%' }}>
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
                                rowSelection={'single'}
                                animateRows
                                enableColResize
                                enableSorting
                                stopEditingWhenCellsLoseFocus
                                onGridReady={(e) => this.gridReadyEventHandler(e, 'grid_0')}
                                onGridSizeChanged={this.gridSizeEventHandler}
                                // onCellMouseDown={this.onMasterClickEventHandler}
                                onRowDoubleClicked={this.onMasterDoubleClickEventHandler}
                                editable={true}
                            >
                            </AgGridReact>

                        </div>
                    </Content>
                    <QMS1001Modal
                        open={popupOpen}
                        question={question}
                        // onChange={this.onChangeControllers}
                        onConfirm={this.onPopupConfirmHandler}
                        onCancel={this.onPopupCancelHandler}
                    // onClose={() => this.onCloseModal('QMS1001Modal')}
                    >
                    </QMS1001Modal>

                </Layout>
            </React.Fragment >

        )
    }
}
export default QMS1001