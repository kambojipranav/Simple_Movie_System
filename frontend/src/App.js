import axios from 'axios';
import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [movies, setMovies] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  const fetchMovies = async () => {
    const res = await axios.get('http://localhost:5000/movie');
    setMovies(res.data);
    setFilteredMovies(res.data);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const onSubmit = async (data) => {
    const payload = {
      movieName: data.movieName,
      movieBudget: Number(data.movieBudget),
      movieRD: data.movieRD,
    };

    if (editId) {
      await axios.put(`http://localhost:5000/movie/${editId}`, payload);
      setEditId(null);
    } else {
      await axios.post('http://localhost:5000/movie', payload);
    }

    reset();
    fetchMovies();
  };

  const onEdit = (movie) => {
    setEditId(movie._id);
    setValue('movieName', movie.movieName);
    setValue('movieBudget', movie.movieBudget);
    setValue('movieRD', movie.movieRD ? movie.movieRD.substring(0, 10) : '');
  };

  const onDelete = async (id) => {
    await axios.delete(`http://localhost:5000/movie/${id}`);
    fetchMovies();
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query);

    const exactMatches = movies.filter(
      (m) => m.movieName.toLowerCase() === query.toLowerCase()
    );
    setFilteredMovies(exactMatches);
  };

  return (
    <div className="container mt-4">
      <h2>{editId ? 'Edit Movie' : 'Add Movie'}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="row g-3 align-items-center">
          <div className="col">
            <input
              type="text"
              placeholder="Enter Movie Name"
              {...register('movieName', { required: true })}
              className="form-control"
            />
            {errors.movieName && <p>Movie name is required</p>}
          </div>
          <div className="col">
            <input
              type="number"
              placeholder="Enter Budget"
              {...register('movieBudget', { required: true })}
              className="form-control"
            />
            {errors.movieBudget && <p>Budget is required</p>}
          </div>
          <div className="col">
            <input
              type="date"
              {...register('movieRD', { required: true })}
              className="form-control"
            />
            {errors.movieRD && <p>Release date is required</p>}
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">
              {editId ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </form>

      <h2>Search Movie</h2>
      <div className="row g-3 align-items-center mb-3">
        <div className="col-4">
          <input
            type="text"
            placeholder="Enter movie name"
            className="form-control"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      <h2>Movie List</h2>
      {filteredMovies.length === 0 ? (
        <p>No Movies Found</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Movie Name</th>
              <th>Budget</th>
              <th>Release Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovies.map((movie, index) => (
              <tr key={movie._id}>
                <td>{index + 1}</td>
                <td>{movie.movieName}</td>
                <td>{movie.movieBudget}</td>
                <td>{movie.movieRD?.substring(0, 10)}</td>
                <td>
                  <button
                    className="btn btn-warning  me-2"
                    onClick={() => onEdit(movie)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger "
                    onClick={() => onDelete(movie._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
