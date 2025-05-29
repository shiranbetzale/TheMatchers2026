import React, {useState} from 'react';
import CustomHeader from '../../components/CustomHeader/CustomHeader';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import EditSvg from '../../assets/images/edit.svg';
import SaveSvg from '../../assets/images/save.svg';
import detailsFormArray from '../../utils/DetailsFormFields';
import generateField from '../../utils/GenerateField';
import HomeScreen from '../HomeScreen/HomeScreen';
import {styles} from './EditFormScreen.style';

const EditFormScreen = ({navigation}: any) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const handlePressEdit = () => {
    setIsEditable(!isEditable);
  };

  const handlePressSave = () => {};

  const headerBtns = [
    {
      comp: <SaveSvg />,
      onPress: handlePressSave,
    },
    {
      comp: <EditSvg />,
      onPress: handlePressEdit,
    },
  ];

  return (
    <HomeScreen pinChildren={<CustomHeader headerBtns={headerBtns} />}>
      {detailsFormArray.map((item, index) => {
        const newItem =
          item.fieldType === 'input'
            ? {
                ...item,
                isEditable: isEditable,
              }
            : item;

        return (
          <WhiteCard customStyle={styles.whiteCardContainer} key={index}>
            {generateField({...newItem})}
          </WhiteCard>
        );
      })}
    </HomeScreen>
  );
};

export default EditFormScreen;
