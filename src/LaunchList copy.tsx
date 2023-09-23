import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
} from '@mui/material';

// Define an interface for SpaceX launch data
interface SpaceXLaunch {
  id: string;
  name: string;
  details: string | null;
  date_utc: string;
  success: boolean;
  links: {
    patch: {
      small: string;
    };
  };
}

// Function to truncate text to a specified number of characters
function truncateText(text: string | null, maxLength: number) {
  if (!text) {
    return 'Not available';
  }
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
}

// Create a function to fetch SpaceX launches
async function fetchSpaceXLaunches(page: number, pageSize: number) {
  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const body={
        query: {},
        options: { limit: pageSize, offset: (page - 1) * pageSize },
    }

    const response = await fetch(
      `https://api.spacexdata.com/v4/launches/query`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers,
      }
    );
    const data = await response.json();
    return data.docs;
  } catch (error) {
    console.error('Error fetching SpaceX launches', error);
    throw error;
  }
}

function LaunchList() {
  const pageSize = 10; // Number of launches to load per page
  const [launches, setLaunches] = useState<SpaceXLaunch[]>([]);
  const [filterCriteria, setFilterCriteria] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reachedBottom, setReachedBottom] = useState<boolean>(false); // Track if bottom is reached
  const [isLastPage, setIsLastPage] = useState<boolean>(false); // Track if it's the last page

  const bottomOfPageRef = useRef<HTMLDivElement | null>(null);
  const isFirstLoad = useRef(true);

  const loadLaunches = useCallback(async () => {
    if (isLastPage) {
      return; // Don't load more data if it's the last page
    }
    setIsLoading(true);
    try {
      const data = await fetchSpaceXLaunches(page, pageSize);
      if (data.length === 0) {
        setIsLastPage(true); // Mark it as the last page if no more data is available
        return;
      }
      if (page === 1) {
        // If it's the first page or initial load, replace the existing data
        setLaunches(data);
      } else {
        // If it's not the first page, append new data to existing data
        setLaunches((prevLaunches) => [...prevLaunches, ...data]);
      }
    } catch (error) {
      console.error('Error loading SpaceX launches', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLastPage]);

  useEffect(() => {
    console.log('Page changed:', page);
    // Reset page when search or filter criteria change
    setPage(1);
    setIsLastPage(false); // Reset the last page flag
    loadLaunches();
  }, [searchQuery, filterCriteria, loadLaunches]);

  // IntersectionObserver callback function
  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && !isLoading && !reachedBottom && !isLastPage) {
      // When the last element comes into view, set the flag to prevent multiple updates
      setReachedBottom(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    // Create an IntersectionObserver to observe the bottomOfPageRef
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0, // Trigger when the element is fully in view
    });

    if (bottomOfPageRef.current) {
      observer.observe(bottomOfPageRef.current);
    }

    // Clean up the observer when the component unmounts
    return () => {
      if (bottomOfPageRef.current) {
        observer.unobserve(bottomOfPageRef.current);
      }
    };
  }, [isLoading, isLastPage]);

  // Filter launches based on filterCriteria and searchQuery
  const filteredLaunches = launches.filter((launch) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const lowerCaseName = launch.name.toLowerCase();

    // Check if the launch name and details contain the search query
    const matchesQuery =
      lowerCaseName.includes(lowerCaseQuery) ||
      (launch.details &&
        launch.details.toLowerCase().includes(lowerCaseQuery));

    // Filter based on the filterCriteria
    if (filterCriteria === 'all') {
      return matchesQuery;
    } else if (filterCriteria === 'successful') {
      return matchesQuery && launch.success;
    } else if (filterCriteria === 'failed') {
      return matchesQuery && !launch.success;
    }

    return matchesQuery;
  });

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        SpaceX Launches
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        {/* Search input */}
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* Filter dropdown */}
        <FormControl variant="outlined" style={{ minWidth: '200px' }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filterCriteria}
            onChange={(e) => setFilterCriteria(e.target.value as string)}
            label="Filter"
          >
            <MenuItem value="all">All Launches</MenuItem>
            <MenuItem value="successful">Successful Launches</MenuItem>
            <MenuItem value="failed">Failed Launches</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={3}>
        {filteredLaunches.map((launch, index) => (
          <Grid item xs={12} sm={6} md={4} key={`${launch.id}-${index}`}>
            <Card>
              <CardHeader title={launch.name} />
              <CardMedia
                component="img"
                alt={launch.name}
                height="200"
                image={launch.links.patch.small}
                style={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Details: {truncateText(launch.details, 100)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Launch Date: {new Date(launch.date_utc).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Status: {launch.success ? 'Successful' : 'Failed'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {isLoading && (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      )}
      {isLastPage && (
        <Typography variant="body2" color="textSecondary" style={{ textAlign: 'center', margin: '16px 0' }}>
          End of launches
        </Typography>
      )}
      <div ref={bottomOfPageRef} />
    </Container>
  );
}

export default LaunchList;
