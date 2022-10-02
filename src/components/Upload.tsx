import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Upload, message, Progress  } from 'antd';

import axios from 'axios';

import {useState} from 'react'

function FileUpload() {

    const[file, setFile] = useState<any>(null);
    const[percent, setPercent] = useState(0);
    const[progressStatus, status] = useState('active')

    const props: UploadProps = {
        name: 'file',
        action: 'http://localhost:8080/api/upload',
        headers: {
            "Content-type": "multipart/form-data; boundary=AaB03x--AaB03x",
            "Access-Control-Allow-Origin": '*',
            "Accept": "text/csv",
            "Content-Disposition": "file"
        },
        onChange(info: any) {
          console.log("file details",info)
          setFile(info?.file)
          setPercent(50)
          uploadFile(info?.file)
        },
        accept: 'text/csv,.csv',
        multiple: false,
        maxCount: 1,
        onRemove() {
            setPercent(0)
        }
    };

    const uploadFile = (file: any) => {
        const formData = new FormData();
        formData.append('file',file)

        axios.post("http://localhost:8080/api/upload",formData, {headers: {
            'content-type': 'multipart/form-data'
        }}).then(res => {
            console.log(res)
            if(res?.data?.status) {
                message.success(res?.data?.message)
                setPercent(100)
            } else {
                message.error(res?.data?.message)
            }
        }).catch(err => {
            message.error(err)
        })
    }

    return (
        <section className='upload-cntr'>
            <Upload {...props} beforeUpload={(file) => {
                if(file.type !== 'text/csv') {
                    message.error("File type not supported")
                }
                return false
            }} multiple={false}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            <Progress style={{marginTop: '30px'}} type="circle" percent={percent} />
        </section>
    )
}

export default FileUpload;