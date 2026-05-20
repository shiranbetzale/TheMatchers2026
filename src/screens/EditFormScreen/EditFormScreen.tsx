import React, { useState } from 'react';
import CustomHeader from '../../components/CustomHeader/CustomHeader';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import EditSvg from '../../assets/images/edit.svg';
import SaveSvg from '../../assets/images/save.svg';
import detailsFormArray from '../../utils/DetailsFormFields';
import generateField from '../../utils/GenerateField';
import HomeScreen from '../HomeScreen/HomeScreen';
import { styles } from './EditFormScreen.style';

const EditFormScreen = () => {
  const [isEditable, setIsEditable] = useState(false);

  const toggleEdit = () => setIsEditable(prev => !prev);

  const handleSave = () => {
    // כאן תוכלי להוסיף שמירת הנתונים לשרת או local state
    console.log('Save clicked');
  };

  const headerBtns = [
    { comp: <SaveSvg />, onPress: handleSave },
    { comp: <EditSvg />, onPress: toggleEdit },
  ];

  return (
    <HomeScreen pinChildren={<CustomHeader headerBtns={headerBtns} />}>
      {detailsFormArray.map((item, index) => {
        const fieldProps =
          item.fieldType === 'input'
            ? { ...item, isEditable }
            : item;

        return (
          <WhiteCard key={index} customStyle={styles.whiteCardContainer}>
            {generateField(fieldProps)}
          </WhiteCard>
        );
      })}
    </HomeScreen>
  );
};

export default EditFormScreen;
