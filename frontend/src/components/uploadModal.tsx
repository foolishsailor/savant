import {
  Modal,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress
} from '@mui/material';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { useTheme } from '@mui/system';
import UploadList from './uploadList';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  onClose: () => void;
  onUploadDocuments: (document: string[]) => void;
}

const UploadModal = ({ open, onClose, onUploadDocuments }: Props) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop
  } as DropzoneOptions);

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('documents', file);
    });
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/addDocuments', {
        method: 'POST',
        body: formData
      });

      setIsLoading(false);

      if (response.ok) {
        console.log('Files uploaded successfully');
        const documents = await response.json();
        onUploadDocuments(documents);
        setFiles([]);
        toast.success('Files uploaded successfully');
        onClose();
      } else {
        console.error('Error uploading files');
        toast.error('Failed to upload files');
      }
    } catch (error) {
      console.error('Error uploading files', error);
      toast.error(`Failed to upload files:${error}`);
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow: 5,
          padding: theme.spacing(2, 4, 3),
          width: 400,
          borderRadius: 4
        }}
      >
        <Typography variant="h6">Upload Files</Typography>
        <UploadList files={files} />
        <Grid
          {...getRootProps()}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: '10px',
            cursor: 'pointer',
            height: '150px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
            mb: 2,
            mt: 1
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography>Drop the files here ...</Typography>
          ) : (
            <Typography sx={{ textAlign: 'center' }}>
              Drag and drop your files here
              <br />
              <strong>or</strong>
              <br />
              click to select files
            </Typography>
          )}
        </Grid>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={files.length === 0 || isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Upload'
          )}
        </Button>
      </Paper>
    </Modal>
  );
};

export default UploadModal;