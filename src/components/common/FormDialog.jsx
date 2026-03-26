import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';

export default function FormDialog({ open, onClose, onSubmit, title = 'Form', fields = [], initialValues = {}, maxWidth = 'sm', submitLabel = 'Save' }) {
  const [values, setValues] = useState({});
  const fieldsRef = useRef(fields);
  const initialValuesRef = useRef(initialValues);
  fieldsRef.current = fields;
  initialValuesRef.current = initialValues;

  useEffect(() => {
    if (open) {
      const vals = {};
      fieldsRef.current.forEach((f) => {
        vals[f.name] = initialValuesRef.current[f.name] !== undefined ? initialValuesRef.current[f.name] : (f.defaultValue || '');
      });
      setValues(vals);
    }
  }, [open]);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(values);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title}
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {fields.map((field) => (
              <Grid size={{ xs: 12, sm: field.fullWidth ? 12 : 6 }} key={field.name}>
                {field.type === 'select' ? (
                  <TextField
                    select
                    fullWidth
                    label={field.label}
                    value={values[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                    size="small"
                  >
                    {(field.options || []).map((opt) => (
                      <MenuItem key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                        {typeof opt === 'string' ? opt : opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : field.type === 'textarea' ? (
                  <TextField
                    fullWidth
                    label={field.label}
                    value={values[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                    multiline
                    rows={field.rows || 3}
                    size="small"
                  />
                ) : field.type === 'date' ? (
                  <TextField
                    fullWidth
                    type="date"
                    label={field.label}
                    value={values[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required={field.required}
                    size="small"
                  />
                ) : (
                  <TextField
                    fullWidth
                    type={field.type || 'text'}
                    label={field.label}
                    value={values[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                    disabled={field.disabled}
                    size="small"
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
