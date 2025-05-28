
import React, { useEffect, useState } from 'react';
import { styles } from './Step2Screen.style';
import matchFormArray from '../../utils/MatchFormFields';
import CustomCollapse from '../../components/CustomCollapse/CustomCollapse';
import { groupBy } from '../../utils/generalFunction';
import { CollapseSingleType } from '../../components/CustomCollapse/CustomCollapse.type';
import { Option } from '../../utils/FormFields.type';

const Step2Screen = () => {
  const [matchFormArrayFiltered, setMatchFormArrayFiltered] = useState<CollapseSingleType[]>([]);
  const matchFormArrayBeforeFiltered = groupBy(matchFormArray, "collapseTitle")

  useEffect(() => {
    setMatchFormArrayFiltered(groupBy(matchFormArray, "collapseTitle"));
  }, [])

  const handlePress = (option?: Option) => {
    let newArray: any = [];

    matchFormArrayBeforeFiltered.filter((item: CollapseSingleType) => {
      const filteredData = item?.data?.filter((itemDataField) => {
        if (itemDataField?.condition?.length) {
          return itemDataField?.condition?.find((itemCondition: any) => {
            return itemCondition.fieldId === option?.name && itemCondition.value === option?.id.toString();
          });
        } else {
          return itemDataField;
        }
      });
      item.data = filteredData
      newArray.push(item)
    });

    setMatchFormArrayFiltered(newArray);
  }

  return (
    <CustomCollapse
      sections={matchFormArrayFiltered}
      handlePress={() => { }}
    />
  );
};

export default Step2Screen;
