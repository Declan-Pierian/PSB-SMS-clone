import React, { useState } from 'react';
import {
  Box, Paper, TextField, Button, Typography, Alert, InputAdornment, IconButton,
  Accordion, AccordionSummary, AccordionDetails, Chip, Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import { DEMO_USERS, ROLE_LABELS } from '../../data/roles';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(username, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 500);
  };

  const handleQuickLogin = (user) => {
    setUsername(user.username);
    setPassword(user.password);
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(user.username, user.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 400);
  };

  const roleColors = {
    root: '#b30537',
    student: '#2e7d32',
    sales_cm: '#1565c0',
    sales_pe: '#1976d2',
    sales_planner: '#42a5f5',
    admission: '#7b1fa2',
    admission_acads: '#9c27b0',
    exam: '#e65100',
    finance: '#00695c',
    admin_it: '#455a64',
    admin_user: '#607d8b',
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #b30537 0%, #800025 50%, #2B4D83 100%)',
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 460 }}>
        <Paper
          elevation={8}
          sx={{
            p: 5,
            width: '100%',
            borderRadius: 3,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '12px',
                backgroundColor: '#b30537',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <LockOutlinedIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#b30537' }}>
              PSB Academy
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
              Student Management System
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2.5 }}
              required
              autoFocus
              size="medium"
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              required
              size="medium"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                backgroundColor: '#b30537',
                '&:hover': { backgroundColor: '#800025' },
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 3, color: '#999' }}>
            Powered by ConceptWaves &copy; {new Date().getFullYear()}
          </Typography>
        </Paper>

        {/* Quick Login Buttons for Demo */}
        <Accordion
          sx={{
            mt: 2,
            borderRadius: '12px !important',
            overflow: 'hidden',
            '&:before': { display: 'none' },
            backgroundColor: 'rgba(255,255,255,0.95)',
          }}
          elevation={4}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon sx={{ color: '#b30537', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                Quick Login (Demo Accounts)
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {DEMO_USERS.map((u) => (
                <Tooltip
                  key={u.username}
                  title={`${u.name} — ${u.username} / ${u.password}`}
                  arrow
                >
                  <Chip
                    label={ROLE_LABELS[u.role] || u.role}
                    size="small"
                    onClick={() => handleQuickLogin(u)}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      backgroundColor: roleColors[u.role] || '#666',
                      color: '#fff',
                      '&:hover': {
                        opacity: 0.85,
                        backgroundColor: roleColors[u.role] || '#666',
                      },
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
            <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: '#888' }}>
              Click a role chip to instantly log in as that user. Hover for credentials.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}