import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { notification, message, Progress, List } from 'antd';

import axios from 'axios';

import {useState, useRef} from 'react'

function FileUpload() {

    const ref = useRef<any>(null)

    const[percent, setPercent] = useState(0);

    const uploadFile = (file: any) => {
        message.info("File processing....")
        const formData = new FormData();
        formData.append('file',file)

        axios.post("http://localhost:8080/api/upload",formData, {headers: {
            'content-type': 'multipart/form-data'
        }}).then(res => {
            console.log(res)
            if(res?.data?.status) {
                message.success(res?.data?.message+" "+res?.data?.response?.totalRecords+" records added in DB.")
                setPercent(100)
            } else {
                notification.error({
                    message: 'Error',
                    description: res?.data?.message,
                    placement: 'top'
                })
                setPercent(0)
            }
        }).catch(err => {
            notification.error({
                message: 'Error',
                description: err?.message,
                placement: 'top'
            })
            setPercent(0)
        })
    }

    const fileUpload = (e: any) => {
        const file = e?.target?.files[0];

        if(file?.type === "text/csv") {
            setPercent(50)
            message.info("File Uploading.....")
            uploadFile(file)
        } else {
            message.error("File format is not valid");
        }
    }

    return (
        <section className='upload-cntr'>
            <List
                bordered
                dataSource={[
                    'Max File Size is 50 MB',
                    'File Format should be .csv',
                    'File contains with headers like InvoiceNo, StockCode, Description, Quantity, InvoiceDate, UnitPrice, CustomerID and Country'
                ]}
                renderItem={item => (
                    <List.Item>
                        {item}
                    </List.Item>
                )}
            />
            <input ref={ref} type='file' name='file' id='file-upload' accept='.csv' onChange={fileUpload}/>
            
            <Progress style={{marginTop: '30px'}} type="circle" percent={percent} />
        </section>
    )
}

export default FileUpload;