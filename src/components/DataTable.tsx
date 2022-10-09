import { Table, Pagination, Button, Form, Input, notification, Select, InputNumber, DatePicker, Collapse  } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

import {useEffect, useState} from 'react'
import moment from 'moment';

const { Panel } = Collapse;

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
    const[searchFieldsData, setSearchFieldsData] = useState<any>(null);

    useEffect(() => {
        getData(page, size)

        form.setFieldsValue({
            invoiceNumber: null,
            stockCode: null,
            description: null,
            quantity: null,
            unitPrice: null,
            customerId: null,
            country: null,
            invoiceDate: null,
            quantityType: '=',
            unitPriceType: '=',
            invoiceDateType: '='
        });
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
            searchData(searchFieldsData, page -1, pageSize)
        } else {
            getData(page-1, pageSize)
        }
        
    }

    const onFinish = (values: any) => {
        console.log(values);
        const d = {...values}

        if(d?.invoiceDate != null) {
            d['invoiceDate'] = moment(d?.invoiceDate?._d).format("yyyy-MM-DDTHH:MM:ss")
        }
        console.log(d);
        setSearchFieldsData(d)
        searchData(d, 0, 10)
    };

    const onReset = () => {
        form.resetFields();
        getData(0, 10)
    }

    function searchData(obj: any, page: number, size: number) {
        setLoading(true)
        setSearch(true)
        axios.post("http://localhost:8080/api/search/criteria", obj, {params: {page: page, size: size}}).then(res => {
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
            <Collapse>
                <Panel header="Search Fields" key="1">
                    <Form
                        form={form}
                        onFinish={onFinish}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Form.Item 
                            label="Invoice Number" 
                            name="invoiceNumber"
                        >
                            <Input placeholder="input search keyword" />
                        </Form.Item>
                        <Form.Item 
                            label="Stock Code" 
                            name="stockCode"
                        >
                            <Input placeholder="input search keyword" />
                        </Form.Item>
                        <Form.Item 
                            label="Description" 
                            name="description"
                        >
                            <Input placeholder="input search keyword" />
                        </Form.Item>
                        <Form.Item 
                            label="Quantity search type" 
                            name="quantityType"
                        >
                            <Select
                                allowClear
                            >
                                <Option value="=">Equals</Option>
                                <Option value=">=">GreaterThanOrEqual</Option>
                                <Option value="<=>">LessThanOrEqual</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item 
                            label="Quantity" 
                            name="quantity"
                        >
                            <InputNumber min={0} placeholder="input search keyword" />
                        </Form.Item>
                        <Form.Item 
                            label="Unit price search type" 
                            name="unitPriceType"
                        >
                            <Select
                                allowClear
                            >
                                <Option value="=">Equals</Option>
                                <Option value=">=">GreaterThanOrEqual</Option>
                                <Option value="<=>">LessThanOrEqual</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item 
                            label="Unit Price" 
                            name="unitPrice"
                        >
                            <InputNumber min={0} placeholder="input search keyword" />
                        </Form.Item>
                        <Form.Item 
                            label="Customer Id" 
                            name="customerId"
                        >
                            <Input placeholder="input search keyword" />
                        </Form.Item>
                        <Form.Item 
                            label="Country" 
                            name="country"
                        >
                            <Input placeholder="input search keyword" />
                        </Form.Item>
                        <Form.Item 
                            label="Invoice Date search type" 
                            name="invoiceDateType"
                        >
                            <Select
                                allowClear
                            >
                                <Option value="=">Equals</Option>
                                <Option value=">=">GreaterThanOrEqual</Option>
                                <Option value="<=>">LessThanOrEqual</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item 
                            label="Invoice Date" 
                            name="invoiceDate"
                        >
                            <DatePicker format={"yyyy-MM-DD HH:MM:ss"}/>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">Search</Button>
                            <Button htmlType="button" onClick={onReset}>
                                Reset
                            </Button>
                        </Form.Item>
                        
                    </Form>            
                </Panel>
            </Collapse>
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