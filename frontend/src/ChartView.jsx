import './App.css'
import { useState, useEffect } from 'react'
import { Column } from '@ant-design/plots';
import { Link } from "react-router-dom";


function ChartView() {
  let [value, setValue] = useState([])

  useEffect(() => {
    fetch("http://localhost:5000/api")
      .then(response => response.json())
      .then(value => setValue(value))
  }, [])



  const data = value.flatMap(item => [
    {
      username: item.username,
      count: item.followerCount,
      type: 'Follower Count'
    },
    {
      username: item.username,
      count: item.likeCount,
      type: 'Like Count'
    }
  ]);

  const config = {
    data,
    xField: 'username',
    yField: 'count',
    seriesField: 'type',
    isStack: false,
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      count: {
        alias: 'Count',
      },
      username: {
        alias: 'Username',
      },
    },
  };



  return (
    <>
      <span>
        List of Data: <br />
        - Have at least 100k followers. <br />
        - Have received over 1 million like 
      </span>

      <h3>
        <Link to={'/table'} unstable_viewTransition>
          Table  View
        </Link>
      </h3>
      <div style={{ width: '100%', height: '500px', overflowX: 'auto' }}>
        <Column
          {...config}
          width={1000}
          height={500}
        />
      </div>

    </>
  )
}

export default ChartView
