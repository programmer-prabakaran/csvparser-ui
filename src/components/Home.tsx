import { Tabs } from 'antd';
import DataTable from './DataTable';
import FileUpload from './Upload';

function Home() {

    const items = [
        { label: 'Upload File', key: '1', children: <FileUpload /> }, // remember to pass the key prop
        { label: 'Details', key: '2', children: <DataTable /> },
      ];

    return(
        <section className='home-container'>
            <Tabs defaultActiveKey="1" items={items}>
            </Tabs>
        </section>
    )
}

export default Home;