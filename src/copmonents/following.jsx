import React, { useEffect, useState } from 'react'
import NoFollowing from './no-following';

const Following = () => {
    const [repo, setRepo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = process.env.REACT_APP_GITHUB_TOKEN;
    useEffect(() => {
        const fetchRepo = async () => {
          try {
            const response = await fetch("https://api.github.com/users/jennykut12/following{/other_user}", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (response.status === 404) {
              throw new Error(``);
            }
            if (!response.ok) {
              throw new Error('Failed to fetch repository details');
            }
            const data = await response.json();
            setRepo(data);
            setLoading(false);
          } catch (error) {
            setError(error.message);
            setLoading(false);
          }
        };
    
        fetchRepo();
      }, []);
    
      if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return (
          <div>
            <h2>Error</h2>
            <p>{error}</p>
          </div>
        );
      }
    
      if (!repo) {
        return (
          <NoFollowing/>
        );
      }
      if (repo) {
        return (
          <NoFollowing/>
        );
      }

  return (
    <div>
        <h1>{repo.name}</h1>
      <p>{repo.description}</p>
    </div>
  )
}

export default Following