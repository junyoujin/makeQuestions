import axios from "axios";
import { getHeaders, getUrl } from "../../utils/handleAxios";

export function searchCommonHeader(param) {
    let data;
    try {
        const request = axios({
            url: getUrl('/common/comgrp_mst'),
            method: 'post',
            headers: getHeaders(),
            // params,
        })


        request.then(res => {
            data = res.data
        })

        return data
    } catch (err) {
        console.log(err)
    }

}
