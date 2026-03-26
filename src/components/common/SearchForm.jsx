import React, { useState } from 'react';
import { Box, TextField, Button, MenuItem, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export default function SearchForm({ fields = [], onSearch, onReset, defaultValues = {} }) {
  const getInitialValues = () => {
    const vals = {};
    fields.forEach((f) => {
      vals[f.name] = defaultValues[f.name] || '';
    });
    return vals;
  };

  const [values, setValues] = useState(getInitialValues);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(values);
  };

  const handleReset = () => {
    const empty = getInitialValues();
    Object.keys(empty).forEach((k) => { empty[k] = ''; });
    setValues(empty);
    if (onReset) onReset();
  };

  return (
    <Paper sx={{ p: 2.5, mb: 2.5 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="flex-end">
          {fields.map((field) => (
            <Grid size={{ xs: 12, sm: 6, md: field.gridSize || 3 }} key={field.name}>
              {field.type === 'select' ? (
                <TextField
                  select
                  fullWidth
                  label={field.label}
                  value={values[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  size="small"
                >
                  <MenuItem value="">All</MenuItem>
                  {(field.options || []).map((opt) => (
                    <MenuItem key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                      {typeof opt === 'string' ? opt : opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              ) : field.type === 'date' ? (
                <TextField
                  fullWidth
                  type="date"
                  label={field.label}
                  value={values[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              ) : (
                <TextField
                  fullWidth
                  label={field.label}
                  value={values[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  size="small"
                  type={field.type || 'text'}
                />
              )}
            </Grid>
          ))}
          <Grid size={{ xs: 12, sm: 6, md: 'auto' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button type="submit" variant="contained" startIcon={<SearchIcon />} sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>
                Search
              </Button>
              <Button variant="outlined" startIcon={<ClearIcon />} onClick={handleReset} color="inherit">
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
