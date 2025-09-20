import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material';
import { Add, Delete, Edit, Business } from '@mui/icons-material';

interface Sponsor {
    name: string;
    logo?: string;
}

interface SponsorsManagerProps {
    sponsors: (string | Sponsor)[];
    onChange: (sponsors: (string | Sponsor)[]) => void;
}

const SponsorsManager: React.FC<SponsorsManagerProps> = ({ sponsors, onChange }) => {
    const [open, setOpen] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [sponsorName, setSponsorName] = useState('');
    const [logoPreview, setLogoPreview] = useState<string>('');

    const handleOpen = (index?: number) => {
        if (index !== undefined) {
            const sponsor = sponsors[index];
            if (typeof sponsor === 'string') {
                setSponsorName(sponsor);
                setLogoPreview('');
            } else {
                setSponsorName(sponsor.name);
                setLogoPreview(sponsor.logo || '');
            }
            setEditIndex(index);
        } else {
            setSponsorName('');
            setLogoPreview('');
            setEditIndex(null);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSponsorName('');
        setLogoPreview('');
        setEditIndex(null);
    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!sponsorName.trim()) return;

        const newSponsor: Sponsor = {
            name: sponsorName.trim(),
            logo: logoPreview || undefined
        };

        const updatedSponsors = [...sponsors];
        
        if (editIndex !== null) {
            updatedSponsors[editIndex] = newSponsor;
        } else {
            updatedSponsors.push(newSponsor);
        }

        onChange(updatedSponsors);
        handleClose();
    };

    const handleDelete = (index: number) => {
        const updatedSponsors = sponsors.filter((_, i) => i !== index);
        onChange(updatedSponsors);
    };

    const getSponsorDisplay = (sponsor: string | Sponsor) => {
        if (typeof sponsor === 'string') {
            return { name: sponsor, logo: undefined };
        }
        return sponsor;
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Event Sponsors</Typography>
                <Button
                    startIcon={<Add />}
                    variant="outlined"
                    onClick={() => handleOpen()}
                    size="small"
                >
                    Add Sponsor
                </Button>
            </Box>

            {sponsors.length === 0 ? (
                <Paper sx={{ p: 2, textAlign: 'center', color: 'gray' }}>
                    No sponsors added yet
                </Paper>
            ) : (
                <List>
                    {sponsors.map((sponsor, index) => {
                        const display = getSponsorDisplay(sponsor);
                        return (
                            <ListItem key={index} divider>
                                <ListItemAvatar>
                                    <Avatar src={display.logo} sx={{ bgcolor: 'primary.light' }}>
                                        <Business />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={display.name}
                                    secondary={display.logo ? 'Has logo' : 'Text only'}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        aria-label="edit"
                                        onClick={() => handleOpen(index)}
                                        sx={{ mr: 1 }}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleDelete(index)}
                                        color="error"
                                    >
                                        <Delete />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editIndex !== null ? 'Edit Sponsor' : 'Add Sponsor'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <TextField
                            fullWidth
                            label="Sponsor Name"
                            value={sponsorName}
                            onChange={(e) => setSponsorName(e.target.value)}
                            margin="normal"
                            required
                        />
                        
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" gutterBottom>
                                Sponsor Logo (Optional)
                            </Typography>
                            <Button
                                variant="outlined"
                                component="label"
                                sx={{ mb: 2 }}
                            >
                                Choose Logo
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                />
                            </Button>
                            
                            {logoPreview && (
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" gutterBottom>
                                        Preview:
                                    </Typography>
                                    <Avatar
                                        src={logoPreview}
                                        sx={{ width: 60, height: 60 }}
                                    >
                                        <Business />
                                    </Avatar>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={!sponsorName.trim()}
                    >
                        {editIndex !== null ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SponsorsManager;
