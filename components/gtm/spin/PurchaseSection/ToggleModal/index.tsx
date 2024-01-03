import Card from '@components/componentLibrary/Card';
import ToggleButton from '@components/componentLibrary/ToggleButton';
import { useState } from 'react';
import PurchaseSpins from './PurchaseSpins';
import MyRewards from './MyRewards';
import { Typography } from '@mui/material';

const toggleStates = [0, 1];
const toggleStatesText = ['Buy more Spins', 'My Rewards'];

function ToggleModal() {
  const [toggleState, setToggleState] = useState(0);

  return (
    <Card>
      <ToggleButton
        values={toggleStates}
        value={toggleState}
        setValue={setToggleState}
        isSelected={(val, currentVal) => val === currentVal}
        renderedOption={(value: number) => (
          <Typography variant="body-moderate-medium" textTransform="none">
            {toggleStatesText[value]}
          </Typography>
        )}
      />
      {toggleState === 0 ? <PurchaseSpins /> : <MyRewards />}
    </Card>
  );
}

export default ToggleModal;
