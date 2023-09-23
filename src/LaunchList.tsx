import { useEffect, useState, useCallback, useRef } from 'react';
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

        const body = {
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
    const pageSize = 12; // Number of launches to load per page
    const [launches, setLaunches] = useState<SpaceXLaunch[]>([]);
    const [filterCriteria, setFilterCriteria] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [reachedBottom, setReachedBottom] = useState<boolean>(false); // Track if bottom is reached
    const [isLastPage, setIsLastPage] = useState<boolean>(false); // Track if it's the last page
  
    const bottomOfPageRef = useRef<HTMLDivElement | null>(null);
  
    const loadLaunches = useCallback(async () => {
      setIsLoading(true);
      try {
        const data = await fetchSpaceXLaunches(page, pageSize);
        if (data.length === 0) {
          setIsLastPage(true);
        }
        setLaunches((prevLaunches) => [...prevLaunches, ...data]);
      } catch (error) {
        console.error('Error loading SpaceX launches', error);
      } finally {
        setIsLoading(false);
        setReachedBottom(false);
      }
    }, [page]);
  
    useEffect(() => {
      setPage(1);
      setIsLastPage(false);
      loadLaunches();
    }, [searchQuery, filterCriteria]);
  
    useEffect(() => {
      loadLaunches();
    }, [loadLaunches]);
  
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !isLoading && !reachedBottom && !isLastPage) {
        setReachedBottom(true);
        setPage((prevPage) => prevPage + 1);
      }
    };
  
    useEffect(() => {
      const observer = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      });
  
      if (bottomOfPageRef.current) {
        observer.observe(bottomOfPageRef.current);
      }
  
      return () => {
        if (bottomOfPageRef.current) {
          observer.unobserve(bottomOfPageRef.current);
        }
      };
    }, [isLoading, isLastPage]);
  
    const filteredLaunches = launches.filter((launch) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const lowerCaseName = launch.name.toLowerCase();
  
      const matchesQuery =
        lowerCaseName.includes(lowerCaseQuery) ||
        (launch.details &&
          launch.details.toLowerCase().includes(lowerCaseQuery));
  
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
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input" // Added className for testing
          />
          <FormControl variant="outlined" style={{ minWidth: '200px' }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filterCriteria}
              onChange={(e) => setFilterCriteria(e.target.value as string)}
              label="Filter"
              className="filter-select" 
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
              <Card className="launch-card"> 
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
  
        <div ref={bottomOfPageRef}>
          {isLoading && (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
          )}
          {isLastPage && (
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ textAlign: 'center', margin: '16px 0' }}
            >
              End of launches
            </Typography>
          )}
        </div>
      </Container>
    );
  }
  
  export default LaunchList;
