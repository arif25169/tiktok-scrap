import './App.css'
import { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Table } from "antd";

function TableView() {
    let [data, setData] = useState([])

    useEffect(() => {
        fetch("http://localhost:5000/api")
            .then(response => response.json())
            .then(data => setData(data))
    }, [])

    const columns = [
        {
          title: 'User Name',
          dataIndex: 'username',
          key: 'username',
        },
        {
          title: 'Follower Count',
          dataIndex: 'followerCount',
          key: 'followerCount',
        },
        {
          title: 'Like Count',
          dataIndex: 'likeCount',
          key: 'likeCount',
        },
      ];

    return (
        <>
            <h3>
                <Link to={'/'} unstable_viewTransition>
                    Chart  View
                </Link>
            </h3>
            <Table dataSource={data} columns={columns} />;
        </>
    )
}

export default TableView
