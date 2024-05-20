import { useEffect, useState } from 'react';
import { handleCardClick, extractUrl } from './utils/helpers';
import './App.css';

interface Job {
  id: number;
  by: string;
  title: string;
  url?: string | null;
  time: number;
}

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsID, setJobsID] = useState<number[]>([]);
  const [jobsLoaded, setJobsLoaded] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const initialJobs = 9;
  const jobsPerLoad = 6;

  const fetchJobsIds = async (): Promise<number[]> => {
    try {
      const response = await fetch(
        'https://hacker-news.firebaseio.com/v0/jobstories.json'
      );
      const data = await response.json();
      setJobsID(data);
      return data;
    } catch (error) {
      console.log('Error fetching IDs', error);
      return jobsID;
    }
  };

  const fetchJobsData = async (ids: number[]): Promise<void> => {
    try {
      const data: Job[] = await Promise.all(
        ids.map(async (id) => {
          const res = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`
          );
          return await res.json();
        })
      );
      console.log('data', data);
      setJobs((oldJobs) => [...oldJobs, ...data]);
    } catch (error) {
      console.log('Error fetching jobs data', error);
    }
  };

  const fetchInitialJobs = async (): Promise<void> => {
    setLoading(true);
    const ids = await fetchJobsIds();
    if (ids && ids.length > 0) {
      await fetchJobsData(ids.slice(0, initialJobs));
      setJobsLoaded(initialJobs);
    }
    setLoading(false);
  };

  const fetchMoreJobs = async (): Promise<void> => {
    const nextIdsToFetch = jobsID.slice(jobsLoaded, jobsLoaded + jobsPerLoad);
    setLoading(true);
    await fetchJobsData(nextIdsToFetch);
    setJobsLoaded((prevCount) => prevCount + jobsPerLoad);
    setLoading(false);
  };

  useEffect(() => {
    // Could be used React Query
    fetchInitialJobs();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h1>HN Jobs</h1>
        <div className="wrapper">
          <div className="cards">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="card"
                onClick={() =>
                  handleCardClick(
                    job.url
                      ? extractUrl(job.url)
                      : `https://news.ycombinator.com/item?id=${job.id}`
                  )
                }
              >
                <h2>{job.by}</h2>
                <p>{job.title}</p>
                <span>
                  {new Date(job.time * 1000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <button className="btn" onClick={fetchMoreJobs}>
            Load more
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
