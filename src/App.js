import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [jobsID, setJobsID] = useState([]);
  const [jobsLoaded, setJobsLoaded] = useState(0);
  const [loading, setLoading] = useState(false);

  const initialJobs = 9;
  const jobsPerLoad = 6;

  const fetchJobsIds = async () => {
    try {
      const response = await fetch(
        'https://hacker-news.firebaseio.com/v0/jobstories.json'
      );
      const data = await response.json();
      console.log('IDs', data);
      setJobsID(data);
      return data;
    } catch (error) {
      console.log('Error fetching IDs', error);
      return jobsID;
    }
  };

  const fetchJobsData = async (ids) => {
    try {
      const jobs = await Promise.all(
        ids.map(async (id) => {
          const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          const data = await res.json();
          console.log("data",data);
          return data;
        })
      );
      setJobs((oldJobs) => [...oldJobs, jobs]);
    } catch (error) {
      console.log('Error fetching jobs data', error);
    }
  };

  const fetchInitialJobs = async () => {
    setLoading(true);
    const ids = await fetchJobsIds();
    if (ids && ids.length > 0) {
      const jobsWithData = await fetchJobsData(ids.slice(0, initialJobs));
      console.log('jobsWithData', jobsWithData);
      setJobs(jobsWithData);
    }
    setLoading(false);
  };

  useEffect(() => {  //Posible to use React.Query
    fetchInitialJobs();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h1>HN Jobs</h1>
        <div className="cards"></div>
        <button>Load more</button>
      </div>
    </div>
  );
}

export default App;
