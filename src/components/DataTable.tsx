import { Table, Pagination, Button, Form, Input, notification, Select  } from 'antd';
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

const { Option } = Select;

const DataTable: React.FC = () => {
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

    const [form] = Form.useForm();

    const[loading, setLoading] = useState<boolean>(true);
    const[data, setData] = useState<Array<DataType>>([])

    const[page, setPage] = useState<number>(0);
    const[size, setSize] = useState<number>(10);

    const[totalRecords, setTotal] = useState<number>(0);

    const[searchEnabled, setSearch] = useState<boolean>(false);
    const[searchType, setSearchType] = useState<any>(null);
    const[searchKey, setSearchKey] = useState<any>(null);

    useEffect(() => {
        getData(page, size)
    }, [])

    function getData(page: number, size: number): void {
        setLoading(true)
        axios.get("http://localhost:8080/api", {params: {page: page, size: size}}).then(res => {
            setLoading(false)
            console.log(res)
            if(res?.data?.status) {
                setData(res?.data?.response?.content)
                setTotal(res?.data?.response?.totalElements)
            } else {
                notification.error({
                    message: 'Error',
                    description: res?.data?.message,
                    placement: 'top'
                })
            }
            
        }).catch(err => {
            notification.error({
                message: 'Error',
                description: err?.message,
                placement: 'top'
            })
        })
    }

    const onPageChange = (page: any, pageSize: any): void => {
        setPage(page -1)
        setSize(pageSize)

        if(searchEnabled) {
            searchData(searchType, searchKey, page -1, pageSize)
        } else {
            getData(page-1, pageSize)
        }
        
    }

    const onFinish = (values: any) => {
        console.log(values);
        setSearchType(values?.type)
        setSearchKey(values?.keyword)
        searchData(values?.type, values?.keyword, 0, 10)      
    };

    function searchData(type: any, keyword: String, page: number, size: number) {
        const obj: any = {
            "invoiceNumber": null,
            "stockCode": null,
            "description": null,
            "quantity": null,
            "unitPrice": null,
            "customerId": null,
            "country": null
        }

        obj[type] = keyword

        setLoading(true)
        setSearch(true)
        axios.post("http://localhost:8080/api/search", obj, {params: {page: page, size: size}}).then(res => {
            setLoading(false)
            console.log(res)
            if(res?.data?.status) {
                setData(res?.data?.response?.content)
                setTotal(res?.data?.response?.totalElements)
            } else {
                notification.error({
                    message: 'Error',
                    description: res?.data?.message,
                    placement: 'top'
                })
            }
            
        }).catch(err => {
            notification.error({
                message: 'Error',
                description: err?.message,
                placement: 'top'
            })
        })
    }

    return(
        <>
            <Form
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ layout: 'inline' }}
                onFinish={onFinish}
            >
                <Form.Item 
                    label="Type" 
                    name="type"
                    rules={[{ required: true, message: 'Please input your type!' }]}
                >
                    <Select
                        allowClear
                    >
                        <Option value="invoiceNumber">Invoice Number</Option>
                        <Option value="stockCode">Stock Code</Option>
                        <Option value="description">Description</Option>
                        <Option value="quantity">Quantity</Option>
                        <Option value="unitPrice">Unit Price</Option>
                        <Option value="customerId">Customer Id</Option>
                        <Option value="country">Country</Option>
                    </Select>
                </Form.Item>
                <Form.Item 
                    label="Keyword" 
                    name="keyword"
                    rules={[{ required: true, message: 'Please input your keyword!' }]}
                >
                    <Input placeholder="input search keyword" />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">Search</Button>
                </Form.Item>
            </Form>
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
                defaultPageSize={10} 
                pageSize={size}
                onChange={onPageChange}
                style={{marginTop:'20px'}}
            />
        </>
    )
}

export default DataTable;