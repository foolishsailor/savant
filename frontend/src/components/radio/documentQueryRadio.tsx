import { ChangeEvent } from 'react';
import { Grid, Radio, RadioGroup, FormControlLabel } from '@mui/material';

import { useSelector, useDispatch } from 'react-redux';
import { setDocumentRetrievalType } from 'store/conversationSlice';
import { RootState } from 'store';

type RadioValue = 'simple' | 'refine';

const DocumentQueryRadio = () => {
  const dispatch = useDispatch();

  const documentRetrievalType = useSelector(
    (state: RootState) => state.conversation.documentRetrievalType
  );

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setDocumentRetrievalType(event.target.value as RadioValue));
  };

  return (
    <RadioGroup row value={documentRetrievalType} onChange={handleRadioChange}>
      <FormControlLabel value="simple" control={<Radio />} label="Simple" />
      <FormControlLabel value="refine" control={<Radio />} label="Refine" />
    </RadioGroup>
  );
};

export default DocumentQueryRadio;
