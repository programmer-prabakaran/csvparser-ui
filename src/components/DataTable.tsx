import { Table, Pagination, message  } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

import {useEffect, useState} from 'react'

interface DataType {
    id: number,
    invoiceNumber: String,
    stockCode: String,
    description: String,
    quantity: number,
    invoiceDate: String,
    unitPrice: number,
    customerId: String,
    country: String
}

function DataTable() {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Invoice Number',
            dataIndex: 'invoiceNumber',
            key: 'invoiceNumber'
        },
        {
            title: 'Stock Code',
            dataIndex: 'stockCode',
            key: 'stockCode'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'Invoice Date',
            dataIndex: 'invoiceDate',
            key: 'invoiceDate'
        },
        {
            title: 'Unit Price',
            dataIndex: 'unitPrice',
            key: 'unitPrice'
        },
        {
            title: 'Customer Id',
            dataIndex: 'customerId',
            key: 'customerId'
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country'
        }
    ]

    //const data: Array<DataType> = []

    const[loading, setLoading] = useState(true);
    const[data, setData] = useState([])

    const[from, setFrom] = useState(1);
    const[to, setTo] = useState(100);

    const[totalRecords, setTotal] = useState(0);

    const[currentPage, setCurrentpage] = useState(1);

    useEffect(() => {
        getData(from, to)
    }, [])

    function getData(from: number, to: number) {
        setLoading(true)
        axios.get("http://localhost:8080/api", {params: {from: from, to: to}}).then(res => {
            setLoading(false)
            console.log(res)
            if(res?.data?.status) {
                setData(res?.data?.response?.data)
                setTotal(res?.data?.response?.totalRecords)
                setFrom(res?.data?.response?.from)
                setTo(res?.data?.response?.to)
            } else {
                message.error(res?.data?.message)
            }
            
        }).catch(err => message.error(err))
    }

    const onPageChange = (page: any, pageSize: any) => {
        console.log(page, pageSize)
        if(currentPage !== page) {
            if(page > currentPage) {
                const increment = page - currentPage
                const f = from+(increment*100)
                const t = f + 100
                setFrom(f)
                setTo(t)
                setCurrentpage(page)
                getData(f, t)
            } else {
                const decrement = page - currentPage
                const f = from - (Math.abs(decrement)*100)
                const t = f + 100
                setFrom(f)
                setTo(t)
                setCurrentpage(page)
                getData(f, t)
            }
        }        
    }

    return(
        <>
            <Table 
                columns={columns} 
                dataSource={data}
                bordered={true}
                loading={loading}
                pagination={false}
            />
            <Pagination 
                defaultCurrent={1} 
                total={totalRecords} 
                defaultPageSize={500} 
                pageSize={500}
                onChange={onPageChange}
                style={{marginTop:'20px'}}
            />
        </>
    )
}

export default DataTable;