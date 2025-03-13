import { useState, useEffect } from 'react';
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBook from './AddBook';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid } from '@mui/x-data-grid';

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    fetch('https://bookstore-8e168-default-rtdb.europe-west1.firebasedatabase.app/books/.json')
      .then(response => response.json())
      .then(data => {
        if (data) {
          setBooks(Object.entries(data).map(([key, value]) => ({ id: key, ...value })));
        } else {
          setBooks([]);
        }
      })
      .catch(err => console.error(err));
  };

  const addBook = (newBook) => {
    fetch('https://bookstore-8e168-default-rtdb.europe-west1.firebasedatabase.app/books/.json', {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
    .then(() => fetchBooks())
    .catch(err => console.error(err));
  };

  const deleteBook = (id) => {
    fetch(`https://bookstore-8e168-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`, {
      method: 'DELETE',
    })
    .then(() => fetchBooks())
    .catch(err => console.error(err));
  };

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'author', headerName: 'Author', flex: 1 },
    { field: 'year', headerName: 'Year', flex: 1 },
    { field: 'isbn', headerName: 'ISBN', flex: 1 },
    { field: 'price', headerName: 'Price', flex: 1 },
    {
      field: 'actions',
      headerName: '',
      flex: 0.3,
      renderCell: (params) => (
        <Tooltip title="Delete book" placement="bottom">
          <IconButton size="small" color="error" onClick={() => deleteBook(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar> 

      <div style={{ display: "flex", justifyContent: "center" }}>
        <AddBook addBook={addBook} />
      </div>

      <div style={{ height: 400, width: 700, margin: '20px auto' }}>
        <DataGrid rows={books} columns={columns} getRowId={(row) => row.id} pageSize={5} />
      </div>
    </>
  );
}

export default App;
