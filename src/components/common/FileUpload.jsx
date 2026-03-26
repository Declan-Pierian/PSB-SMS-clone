import React, { useRef, useState } from 'react';
import { Box, Button, Typography, List, ListItem, ListItemText, IconButton, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export default function FileUpload({ onFilesChange, accept, multiple = false, maxSize = 5, label = 'Upload Files' }) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files);
    setError('');
    const tooBig = selected.filter((f) => f.size > maxSize * 1024 * 1024);
    if (tooBig.length) {
      setError(`Files must be under ${maxSize}MB`);
      return;
    }
    const newFiles = multiple ? [...files, ...selected] : selected;
    setFiles(newFiles);
    if (onFilesChange) onFilesChange(newFiles);
    e.target.value = '';
  };

  const handleRemove = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    if (onFilesChange) onFilesChange(updated);
  };

  return (
    <Box>
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} hidden onChange={handleSelect} />
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          textAlign: 'center',
          borderStyle: 'dashed',
          borderColor: '#ccc',
          cursor: 'pointer',
          '&:hover': { borderColor: '#b30537', backgroundColor: 'rgba(179,5,55,0.02)' },
        }}
        onClick={() => inputRef.current?.click()}
      >
        <CloudUploadIcon sx={{ fontSize: 40, color: '#999', mb: 1 }} />
        <Typography variant="body2" color="textSecondary">{label}</Typography>
        <Typography variant="caption" color="textSecondary">Max {maxSize}MB per file</Typography>
      </Paper>
      {error && <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>{error}</Typography>}
      {files.length > 0 && (
        <List dense sx={{ mt: 1 }}>
          {files.map((file, i) => (
            <ListItem key={i} secondaryAction={<IconButton edge="end" size="small" onClick={() => handleRemove(i)}><DeleteIcon fontSize="small" /></IconButton>}>
              <InsertDriveFileIcon sx={{ mr: 1, color: '#666', fontSize: 20 }} />
              <ListItemText primary={file.name} secondary={`${(file.size / 1024).toFixed(1)} KB`} primaryTypographyProps={{ fontSize: '0.85rem' }} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
