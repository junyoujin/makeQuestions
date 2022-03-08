
import _ from 'lodash';

/**
 *      iris global functions.
 */

export const COMMON_H_PROC = '';
export const COMMON_D_PROC = '';


/**
 * 
 * @param {필수값 체크 할 저장데이터}} $data 
 * @param {필수체크할 키/언어 배열} $reqs 
 * 
 * ex) chk_valid(
 *                      saveData_0,
 *                      [['com_grp_cd', '통합코드', 4], ['com_grp_nm', '통합코드명']],
 *                    )
 * 
 */
export function chk_valid($data, $reqs) {

    let i = 0, j = 0;

    // 필수값/길이 체크.
    for (i = 0; i < $data.length; ++i) {
        for (j = 0; j < $reqs.length; ++j) {

            // 필수입력.
            if ($data[i][$reqs[j][0]].toString().trim() == '' && $data[i].updated != 'delete') {
                return {
                    title: '필수 체크',
                    contents: $reqs[j][1] + '은(는) 필수입력입니다.',
                    chkvalid: true,
                    visible: true,
                }
            }

            // 길이값.
            if ($reqs[j][2] && $data[i][$reqs[j][0]].toString().trim().length != $reqs[j][2] && $data[i].updated != 'delete') {
                return {
                    title: '길이값 체크',
                    contents: $reqs[j][1] + '은(는) ' + $reqs[j][2] + '자리로 입력해야 합니다.',
                    chkvalid: true,
                    visible: true,
                }
            }
        }
    }

    return '';
};

export function setReadonly($data) {
    if ($data.updated && $data.updated == 'add') return false;
    else return true;
};

export function dupchkInview($data, $chkKeys) {
    let i = 0, j = 0;

    let chktargets = [];
    for (i = 0; i < $data.length; ++i) {
        let chks = {};
        for (j = 0; j < $chkKeys.length; ++j) {
            chks[$chkKeys[j]] = $data[i][$chkKeys[j]];
        }
        chktargets.push(chks);
    }

    let dups = _.uniqWith(chktargets, _.isEqual);
    console.log(chktargets);
    console.log(dups);

    if ($data.length != dups.length) return true;

    return false;
};