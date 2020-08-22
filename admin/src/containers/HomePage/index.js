
import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';

const HomePage = () => {
  const [newsletters, setNewsletters] = useState([])
  useEffect(() => {
    console.log('componend did mount')
  }, [])
  return (
    <div>
      <h1>{pluginId}&apos;s HomePage</h1>
      <p>Happy coding</p>
      <ul>
        {newsletters.map(newsletter => (
          <li key={newsletter.id}>name</li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage
