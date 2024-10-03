import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash'; // Import lodash for debounce

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Debounce function to prevent too many API calls
    const debouncedFetchResults = _.debounce(async (searchQuery) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://api.github.com/search/users?q=${searchQuery}`);
            setResults(response.data.items); // Parse API response
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data', error);
            setLoading(false);
        }
    }, 500); // 500ms delay before calling API

    // useEffect to trigger API call when query changes
    useEffect(() => {
        if (query.length > 2) {
            debouncedFetchResults(query);
        } else {
            setResults([]); // Clear results when query is too short
        }
    }, [query]);

    // Function to handle selecting a result
    const handleSelectResult = (user) => {
        setQuery(user.login);  // Set the search bar with the selected user's login
        setResults([]);        // Clear the results after selection
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search GitHub Users..."
            />
            {loading && <p>Loading...</p>}
            <ul>
                {results.map((user) => (
                    <li key={user.id} onClick={() => handleSelectResult(user)}>
                        {user.login}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchBar;
