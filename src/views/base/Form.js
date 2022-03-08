import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// import btnSearch from '../../images/btn_search.png';

import { Input, InputNumber, Checkbox, DatePicker, Select, Button, Radio } from 'antd';
//import { CaretDown } from '../../components/SVG';
import moment from 'moment';
import './FormStyle.css';

const { TextArea } = Input;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const { Option } = Select;


// 콤보 /////////////////////////////////////////////////////////////////////////////////////
class GridFormat_comboInput extends Component {

    static propTypes = {
        com_grp_cd: PropTypes.string.isRequired,
        combodata: PropTypes.array.isRequired,
        all_yn: PropTypes.bool,
        value: PropTypes.string,
        data: PropTypes.object.isRequired,
        readOnly: PropTypes.bool,
        field: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            com_grp_cd: this.props.com_grp_cd,
            combodata: this.props.combodata || [],
            value: this.props.data.value || '',
            field: this.props.data[this.props.field] || '',
        }
    }

    componentDidMount = () => {
        // console.log('componentDidMount');
        // console.log(this.state.combodata);
    }

    onChangeEventHandler = (value, event) => {

        const { field } = this.props;
        this.props.onChange(value, event, field);
    }

    render() {
        const { com_grp_cd, combodata, field } = this.state;
        const { readOnly, all_yn } = this.props;

        const cbData = combodata.filter(data => data.com_grp_cd == com_grp_cd);

        let all = {};

        if (all_yn === true) {
            all = { com_cd: '', com_dsp_sq: "0", com_grp_cd: com_grp_cd, com_nm: "전체", com_val: "" };
            cbData.unshift(all);
        }

        let value = field != '' ? field : '';

        const common = cbData.map(item => {
            const { com_cd, com_nm, com_val, expand_val } = item;
            let dab = parseInt(expand_val) !== 0 ? false : true;
            return <Option key={com_val} value={com_cd} disabled={dab}>{com_nm}</Option>;
        });

        return (
            <div>
                <Select
                    defaultValue={value}
                    placeholder="- 선택 -"
                    style={{ width: '100%' }}
                    disabled={readOnly}
                    onChange={(value, event) => this.onChangeEventHandler(value, event)}
                >
                    {common}
                </Select>
            </div>
        );
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

// 문자 ///////////////////////////////////////////////////////////////////////////////////////
class GridFormat_textInput extends Component {

    static propTypes = {
        field: PropTypes.string.isRequired,
        data: PropTypes.object.isRequired,
        maxLength: PropTypes.number,
        readOnly: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        disable: PropTypes.bool,
    };

    state = {
        value: this.props.data[this.props.field] || '',
    }

    onTextInputChangeEventHandler = e => {
        this.setState({ value: e.target.value });
        this.props.onChange(e.target.value, e);
    }

    render() {
        const { maxLength, readOnly, disable } = this.props;
        const { value } = this.state;

        return (
            <div>
                <input type='text'
                    style={{ width: '100%', height: '100%', lineHeight: '100%' }}
                    readOnly={readOnly}
                    onChange={this.onTextInputChangeEventHandler}
                    disabled={disable}
                    value={value}
                    maxLength={maxLength} />
            </div>
        )
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

// 체크박스 ///////////////////////////////////////////////////////////////////////////////////////
class GridFormat_checkInput extends Component {

    static propTypes = {
        field: PropTypes.string.isRequired,
        data: PropTypes.object.isRequired,
        readOnly: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
    };

    state = {
        value: this.props.data[this.props.field] || '',
    }

    onCheckInputChangeEventHandler = e => {
        this.setState({ value: e.target.checked == true ? '1' : '0' }, () => {
            setTimeout(() => this.props.onChange(this.state.value, e), 100);
        });

    }

    render() {
        const { readOnly } = this.props;
        const { value } = this.state;

        return (
            <div>
                <input type='checkbox' style={{ width: '100%' }} readOnly={readOnly}
                    onChange={this.onCheckInputChangeEventHandler}
                    checked={value == '1' ? 'checked' : ''} />
            </div>
        )
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

// 정수 /////////////////////////////////////////////////////////////////////////////////////
class GridFormat_intInput extends Component {

    static propTypes = {
        field: PropTypes.string.isRequired,
        data: PropTypes.object.isRequired,
        maxLength: PropTypes.number,
        readOnly: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        disable: PropTypes.bool,
        onBlur: PropTypes.func,
    };

    state = {
        maxLength: this.props.maxLength,
        value: this.props.data[this.props.field] || '',
    }

    onIntInputChangeEventHandler = e => {
        let { value } = e.target;
        const { maxLength } = this.props;
        value = value.replace(/,/g, '');
        const reg = /^-?(0|[1-9][0-9]*)(\,[0-9]*)?$/;

        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            let num = value !== '' ? parseInt(value).toLocaleString() : '';
            let count = (num.match(/,/g) || []).length;
            this.setState({ value: num, maxLength: maxLength + count }, () => {
                this.props.onChange(value, e);
            });
        }
    };

    // '.' at the end or only '-' in the input box.
    onBlur = () => {
        const { onBlur, onChange } = this.props;
        const { value } = this.state;
        if (value.charAt(value.length - 1) === '.' || value === '-') {
            onChange(value.slice(0, -1));
        }
        if (onBlur) {
            onBlur();
        }
    };

    render() {
        const { readOnly, disable } = this.props;
        const { maxLength, value } = this.state;

        let num = value, count = maxLength;
        if (value.length > 3 && value.indexOf(',') === -1) {
            num = value !== '' ? parseInt(value).toLocaleString() : '';
            count = this.props.maxLength + (num.match(/,/g) || []).length;
        }

        return (
            <div>
                <input type="text" {...this.props}
                    style={{ width: '100%', height: '100%', lineHeight: '100%', textAlign: 'right' }}
                    onChange={this.onIntInputChangeEventHandler}
                    onBlur={this.onBlur}
                    onKeyDown={this.keydownEventHandler}
                    value={num}
                    disabled={disable}
                    maxLength={count} />
            </div>
        );
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

//실수 //////////////////////////////////////////////////////////////////////////////////////
class GridFormat_numInput extends Component {

    static propTypes = {
        value: PropTypes.string.isRequired,
        data: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        onBlur: PropTypes.func,
    };

    state = {
        value: this.props.data.value || ''
    }

    onNumInputChangeEventHandler = e => {

        const { data_decimal_len } = this.props.data;
        const { value } = e.target;

        const reg = /^-?(0|[1-9][0-9]*)(\,\.[0-9]*)?$/;

        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            this.setState({ value: value }, () => {
                this.props.onChange(value, e);
            });
        }
    };

    // '.' at the end or only '-' in the input box.
    onBlur = () => {
        const { onBlur, onChange } = this.props;
        const { value } = this.state;
        if (value.charAt(value.length - 1) === '.' || value === '-') {
            onChange(value.slice(0, -1));
        }
        if (onBlur) {
            onBlur();
        }
    };

    render() {
        const { data_len } = this.props.data;
        const { value } = this.state;

        return (
            <div>
                <input type="text" {...this.props}
                    style={{ width: '100%', height: '100%', lineHeight: '100%', textAlign: 'right' }}
                    onChange={this.onNumInputChangeEventHandler}
                    onBlur={this.onBlur}
                    value={value}
                    maxLength={parseInt(data_len)} />
            </div>
        );
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

// 날짜 /////////////////////////////////////////////////////////////////////////////////////
class GridFormat_dateInput extends Component {

    static propTypes = {
        mode: PropTypes.string,
        range: PropTypes.array,
        field: PropTypes.string.isRequired,
        data: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string,
        readOnly: PropTypes.bool,
    };

    state = {
        mode: this.props.mode || 'date',
        value: this.props.data[this.props.field] || '',
    }

    onDateChangeEventHandler = e => {

        if (e !== null) {
            this.setState({ value: moment(e._d).format('YYYY-MM-DD') }, () => {
                this.props.onChange(moment(e._d).format('YYYY-MM-DD'), e);
            });
        } else {
            this.setState({ value: "" }, () => {
                this.props.onChange("", e);
            });
        }
    }

    disabledDate = (current) => {
        const { range } = this.props;

        return current < range[0] || current > range[1];
    }

    render() {
        const { mode, value } = this.state;
        const { readOnly } = this.props;

        return (
            <div>
                {
                    mode === 'date' && <DatePicker style={{ marginTop: '1px' }}
                        size={'small'}
                        onChange={this.onDateChangeEventHandler}
                        placeholder="select"
                        allowClear={false}
                        suffixIcon
                        defaultValue={moment(value)} />
                }
                {
                    mode === 'range' && <DatePicker style={{ marginTop: '1px' }}
                        size={'small'}
                        onChange={this.onDateChangeEventHandler}
                        placeholder="select"
                        disabled={readOnly}
                        allowClear={false}
                        suffixIcon
                        disabledDate={this.disabledDate}
                        defaultValue={moment(value)} />
                }
            </div>
        );
    }
    /*
    { type == 'Month' && <MonthPicker onChange={this.onDateChangeEventHandler} placeholder="Select month" />}
    { type == 'Week' && <WeekPicker onChange={this.onDateChangeEventHandler} placeholder="Select week" />}
    */
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

// 시간 /////////////////////////////////////////////////////////////////////////////////////
class GridFormat_timeInput extends Component {

    static propTypes = {
        field: PropTypes.string.isRequired,
        data: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string,
    };

    state = {
        value: this.props.data[this.props.field] || '',
    }

    onDateChangeEventHandler = e => {
        if (e !== null) {
            this.setState({ value: moment(e._d).format('YYYY-MM-DD') }, () => {
                this.props.onChange(moment(e._d).format('YYYY-MM-DD'), e);
            });
        } else {
            this.setState({ value: "" }, () => {
                this.props.onChange("", e);
            });
        }
    }

    render() {
        const { value } = this.state;

        return (
            <div>
                <DatePicker
                    onChange={this.onDateChangeEventHandler}
                    placeholder="select"
                    defaultValue={moment(value)}
                    allowClear={false}
                    suffixIcon
                />
            </div>
        );
    }
    /*
    { type == 'Month' && <MonthPicker onChange={this.onDateChangeEventHandler} placeholder="Select month" />}
    { type == 'Range' && <RangePicker onChange={this.onDateChangeEventHandler} />}
    { type == 'Week' && <WeekPicker onChange={this.onDateChangeEventHandler} placeholder="Select week" />}
    */
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

// 우편번호 //////////////////////////////////////////////////////////////////////////////////
class GridFormat_addrInput extends Component {

    static propTypes = {
        value: PropTypes.string.isRequired,
        data: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    state = {
        value: this.props.data.value,
        open: false
    }

    componentDidMount = () => {
        // console.log('addr created');
    }

    openHandler = ($state) => {

        const { onChange } = this.props;
        const { open } = this.state;
        const { add1, add2, add3, add4, post } = $state;

        this.setState({ open: !this.state.open }, e => {
            if (open === true) {
                // console.log($state);
                onChange([add1, add2, add3, add4, post], e);
            }
        });
    }

    render() {
        const { data } = this.props;
        const { value, open } = this.state;

        return (
            <div>
                <Button
                    onClick={this.openHandler}
                >
                    우편번호
                </Button>
                {/* {open && <PostCodeModal data={data} closeModal={this.openHandler} />} */}
            </div>
        );
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

// 라디오그룹 ////////////////////////////////////////////////////////////////////////////////
class GridFormat_radioInput extends Component {

    static propTypes = {
        value: PropTypes.string.isRequired,
        data: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    state = {
        value: this.props.data.value,
    }

    onRadioInputChangeEventHandler = (event) => {
        this.setState({ value: event.target.value }, e => {
            this.props.onChange(this.state.value, e);
        });
    }

    render() {
        const { value } = this.props;
        const { combos } = this.props.data;

        const common = combos.map(item => {
            const { com_cd, com_nm, com_val } = item;
            return <Radio key={com_cd} value={com_val}>{com_nm}</Radio>;
        });

        return (
            <div>
                <Radio.Group onChange={this.onRadioInputChangeEventHandler} value={this.state.value}>
                    {common}
                </Radio.Group>
            </div>
        );
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

// 텍스트에어리어 ////////////////////////////////////////////////////////////////////////////
class GridFormat_textAreaInput extends Component {

    static propTypes = {
        value: PropTypes.string.isRequired,
        data: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    state = {
        value: this.props.data.value
    }

    componentDidMount = () => {
        const { readonly } = this.props.data;
    }

    onTextAreaInputChangeEventHandler = e => {
        this.setState({ value: e.target.value }, e => {
            this.props.onChange(this.state.value, e);
        });
    }

    render() {
        const { data_len } = this.props.data;
        const { value } = this.state;

        return (
            <div>
                <TextArea onChange={this.onTextAreaInputChangeEventHandler} value={value} maxLength={parseInt(data_len)} />
            </div>
        )
    }
}

// 팝업 돋보기 포함 문자 ///////////////////////////////////////////////////////////////////////////////////////
class GridFormat_popupText extends Component {

    static propTypes = {
        field: PropTypes.string.isRequired,
        data: PropTypes.object.isRequired,
        readOnly: PropTypes.bool,
        all_yn: PropTypes.bool,
        onClick: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    state = {
        value: this.props.data[this.props.field] || '',
    }

    onClickEventHandler = () => {
        this.props.onClick();
    }

    onChangeEventHandler = e => {
        this.setState({ value: e.target.value });
        this.props.onChange(e.target.value, e, this.props.field);
    }

    render() {
        const { all_yn } = this.props;
        let { value } = this.state;

        if (all_yn === true && value === '') value = '전체';

        return (
            <span>
                {/* <img alt='pop' src={btnSearch} onClick={this.onClickEventHandler} onChange={this.onChangeEventHandler}/> */}
                <img alt='pop' onClick={this.onClickEventHandler} onChange={this.onChangeEventHandler} />
                {value}
            </span>
        )
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
class Form extends Component {

    static propTypes = {
        mode: PropTypes.string,
        range: PropTypes.array,
        combodata: PropTypes.array,
        param: PropTypes.object.isRequired,
        maxLength: PropTypes.number,
        readOnly: PropTypes.func,
        fn: PropTypes.func,
        onChange: PropTypes.func.isRequired,
        onClick: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            data: this.props.param.data,
            field: this.props.param.colDef.field,
            maxLength: this.props.maxLength,
            readOnly: false,
            c_disabled: false,
            ctype: this.props.param.colDef.ctype,
            value: this.props.param.data.value || '',
            com_grp_cd: this.props.param.colDef.com_grp_cd || '',
            all_yn: this.props.param.colDef.all_yn,
            combodata: this.props.combodata,
        }
        this.onChangeEventHandler = this.onChangeEventHandler.bind(this);
        this.popupClickEventHandler = this.popupClickEventHandler.bind(this);
    }

    componentDidMount = () => {

        const { fn, readOnly } = this.props;
        const { data, field } = this.state;

        if (readOnly) {
            const ro = readOnly(data);
            this.setState({ readOnly: ro });
        }
        if (fn != undefined) {
            this.setState({ c_disabled: fn(data, field) });
        }
    }

    onChangeEventHandler = ($target, $value, $field) => {
        this.setState({ value: $value });
        this.props.onChange($target, $value, $field);
    }

    popupClickEventHandler = () => {
        this.props.onClick();
    }

    renderSelector = () => {

        const { mode, range } = this.props;

        const { data,
            ctype,
            maxLength,
            readOnly,
            field,
            com_grp_cd,
            combodata,
            all_yn,
            c_disabled } = this.state;

        // 답변 유형.
        if (ctype == "text") return (<GridFormat_textInput data={data} readOnly={readOnly} maxLength={maxLength} field={field} disable={c_disabled} onChange={this.onChangeEventHandler}></GridFormat_textInput>);
        if (ctype == "combo") return (<GridFormat_comboInput com_grp_cd={com_grp_cd} combodata={combodata} data={data} readOnly={readOnly} all_yn={all_yn} field={field} onChange={this.onChangeEventHandler}></GridFormat_comboInput>);
        if (ctype == "int") return (<GridFormat_intInput data={data} readOnly={readOnly} maxLength={maxLength} field={field} disable={c_disabled} onChange={this.onChangeEventHandler}></GridFormat_intInput>);
        if (ctype == "checkbox") return (<GridFormat_checkInput data={data} readOnly={readOnly} field={field} onChange={this.onChangeEventHandler}></GridFormat_checkInput>);
        if (ctype == "popup") return (<GridFormat_popupText data={data} field={field} all_yn={all_yn} onClick={this.popupClickEventHandler} onChange={this.onChangeEventHandler}></GridFormat_popupText>);
        if (ctype == "date") return (<GridFormat_dateInput data={data} mode={mode} range={range} field={field} readOnly={readOnly} onChange={this.onChangeEventHandler}></GridFormat_dateInput>);

        // if(answer.ans_tp == '3') return ( <GridFormat_numInput      data={answer} value={value} onChange={this.onChangeEventHandler}></GridFormat_numInput> );
        // if(answer.ans_tp == '4') return ( <GridFormat_dateInput     data={answer} value={value} onChange={this.onChangeEventHandler}></GridFormat_dateInput> );
        // if(answer.ans_tp == '5') return ( <GridFormat_addrInput     data={answer} value={value} onChange={this.onChangeEventHandler}></GridFormat_addrInput> );
        // if(answer.ans_tp == '6') return ( <GridFormat_radioInput    data={answer} value={value} onChange={this.onChangeEventHandler}></GridFormat_radioInput> );
        // if(answer.ans_tp == '7') return ( <GridFormat_textAreaInput data={answer} value={value} onChange={this.onChangeEventHandler}></GridFormat_textAreaInput> );
    }

    render() {
        return (
            <div>
                {this.renderSelector()}
            </div>
        )
    }
}

export default Form;